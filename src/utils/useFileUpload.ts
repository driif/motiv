import { type ChangeEvent, type RefCallback, useEffect, useRef, useState } from 'react';
import type { FileUploadProps } from '../components/FileUpload';

interface Entry {
  id: number;
  file: File;
  attempt: number;
  controller: AbortController;
  status: 'uploading' | 'done' | 'error';
  progress: number;
  error?: string;
}

export const formatBytes = (bytes: number) =>
  bytes < 1024
    ? `${bytes} B`
    : bytes < 1024 ** 2
      ? `${(bytes / 1024).toFixed(1)} KB`
      : `${(bytes / 1024 ** 2).toFixed(1)} MB`;

/** Upload queue: start, progress, retry, cancel and remove, with focus handoff and announcements. */
export function useFileUpload({
  upload,
  onUploaded,
  onRemove,
  onDiscard,
  attachedFiles,
  errorMessage = 'Upload failed',
  formatUploadedMessage = (name) => `${name} uploaded`,
  formatErrorMessage = (name) => `${name} upload failed`,
  multiple,
  disabled,
  onChange,
  ref,
}: Pick<
  FileUploadProps,
  | 'upload'
  | 'onUploaded'
  | 'onRemove'
  | 'onDiscard'
  | 'attachedFiles'
  | 'multiple'
  | 'disabled'
  | 'onChange'
  | 'ref'
  | 'errorMessage'
  | 'formatUploadedMessage'
  | 'formatErrorMessage'
>) {
  const input = useRef<HTMLInputElement>(null);
  const actions = useRef(new Map<number, HTMLButtonElement>());
  const sequence = useRef(0);
  const controlled = useRef(attachedFiles !== undefined);
  controlled.current = attachedFiles !== undefined;
  const current = useRef<Entry[]>([]);
  const [entries, setEntries] = useState<Entry[]>([]);
  const [announcements, setAnnouncements] = useState<{ id: number; text: string }[]>([]);

  useEffect(
    () => () => {
      const previous = current.current;
      current.current = previous.filter((entry) => entry.status !== 'uploading');
      setEntries(current.current);
      for (const entry of previous) {
        if (entry.status === 'uploading') entry.controller.abort();
      }
    },
    [],
  );

  function update(next: Entry[]) {
    current.current = next;
    setEntries(next);
  }

  async function start(file: File, rowId = sequence.current++) {
    const attempt = sequence.current++;
    const controller = new AbortController();
    const entry: Entry = { id: rowId, file, attempt, controller, status: 'uploading', progress: 0 };
    const previous = current.current.find((row) => row.id === rowId);
    update(
      previous
        ? current.current.map((row) => (row.id === rowId ? entry : row))
        : [...current.current, entry],
    );
    const isCurrent = () =>
      current.current.some(
        (row) => row.id === rowId && row.attempt === attempt && row.status === 'uploading',
      );
    const change = (patch: Partial<Entry>) =>
      update(current.current.map((row) => (row.id === rowId ? { ...row, ...patch } : row)));

    try {
      await upload(file, {
        signal: controller.signal,
        onProgress: (progress) => {
          if (isCurrent()) change({ progress });
        },
      });
    } catch (error) {
      if (!isCurrent()) return;
      const message =
        error &&
        typeof error === 'object' &&
        'message' in error &&
        typeof error.message === 'string'
          ? error.message
          : '';
      change({ status: 'error', error: message || errorMessage });
      setAnnouncements((messages) => [
        ...messages,
        { id: attempt, text: formatErrorMessage(file.name) },
      ]);
      return;
    }
    if (!isCurrent()) return;
    if (controlled.current) {
      const action = actions.current.get(rowId);
      if (action && action.ownerDocument.activeElement === action) input.current?.focus();
      update(current.current.filter((row) => row.id !== rowId));
    } else change({ status: 'done', progress: 100 });
    setAnnouncements((messages) => [
      ...messages,
      { id: attempt, text: formatUploadedMessage(file.name) },
    ]);
    onUploaded?.(file);
  }

  function remove(id: number) {
    const index = current.current.findIndex((row) => row.id === id);
    const entry = current.current[index];
    if (!entry) return;
    const neighbor = current.current[index + 1] ?? current.current[index - 1];
    update(current.current.filter((row) => row.id !== id));
    if (entry.status === 'uploading') entry.controller.abort();
    (neighbor ? actions.current.get(neighbor.id) : input.current)?.focus();
    if (entry.status === 'done') onRemove?.(entry.file);
    else onDiscard?.(entry.file);
  }

  const inputRef: RefCallback<HTMLInputElement> = (node) => {
    input.current = node;
    if (typeof ref === 'function') return ref(node);
    if (ref) ref.current = node;
  };

  return {
    entries,
    announcements,
    inputProps: {
      ref: inputRef,
      type: 'file',
      multiple,
      disabled,
      onChange: (event: ChangeEvent<HTMLInputElement>) => {
        if (disabled) return;
        const files = Array.from(event.currentTarget.files ?? []);
        onChange?.(event);
        event.currentTarget.value = '';
        if (!files.length) return;
        if (!multiple) {
          const previous = current.current;
          update([]);
          for (const entry of previous) {
            if (entry.status === 'uploading') entry.controller.abort();
            if (entry.status === 'done') onRemove?.(entry.file);
            else onDiscard?.(entry.file);
          }
        }
        for (const file of multiple ? files : files.slice(0, 1)) void start(file);
      },
    },
    /** Ref for an upload row's first action, the focus target when a neighbor row goes away. */
    actionRef: (id: number) => (node: HTMLButtonElement | null) => {
      if (node) actions.current.set(id, node);
      return () => {
        actions.current.delete(id);
      };
    },
    retryOrRemove(entry: Entry) {
      if (entry.status === 'error') void start(entry.file, entry.id);
      else remove(entry.id);
    },
    remove,
    removeAttachment(onRemoveAttachment: () => void) {
      onRemoveAttachment();
      input.current?.focus();
    },
  };
}
