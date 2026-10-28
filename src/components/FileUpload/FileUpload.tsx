import { type ComponentProps, useEffect, useId, useRef, useState } from 'react';
import { cx } from '../../utils/cx';
import { Button, buttonClassName } from '../Button';
import { Progress } from '../Progress';

export interface FileUploadAttachment {
  id: string;
  name: string;
  size?: number;
  onRemove: () => void;
  onDownload?: () => void;
}

export interface FileUploadProps
  extends Omit<
    ComponentProps<'input'>,
    'type' | 'value' | 'defaultValue' | 'children' | 'required'
  > {
  upload: (
    file: File,
    options: { signal: AbortSignal; onProgress: (percent: number) => void },
  ) => Promise<void>;
  onUploaded?: (file: File) => void;
  onRemove?: (file: File) => void;
  onDiscard?: (file: File) => void;
  attachedFiles?: readonly FileUploadAttachment[];
  downloadLabel?: string;
  label?: string;
  uploadingLabel?: string;
  uploadedLabel?: string;
  errorLabel?: string;
  errorMessage?: string;
  retryLabel?: string;
  removeLabel?: string;
  cancelLabel?: string;
  formatSize?: (bytes: number) => string;
  formatDownloadLabel?: (name: string) => string;
  formatRemoveLabel?: (name: string) => string;
  formatUploadedMessage?: (name: string) => string;
  formatErrorMessage?: (name: string) => string;
}

interface Entry {
  id: number;
  file: File;
  attempt: number;
  controller: AbortController;
  status: 'uploading' | 'done' | 'error';
  progress: number;
  error?: string;
}

export function FileUpload({
  upload,
  onUploaded,
  onRemove,
  onDiscard,
  attachedFiles,
  downloadLabel = 'Download',
  label = 'Choose files',
  uploadingLabel = 'Uploading',
  uploadedLabel = 'Uploaded',
  errorLabel = 'Error',
  errorMessage = 'Upload failed',
  retryLabel = 'Retry',
  removeLabel = 'Remove',
  cancelLabel = 'Cancel',
  formatSize = (bytes) =>
    bytes < 1024
      ? `${bytes} B`
      : bytes < 1024 ** 2
        ? `${(bytes / 1024).toFixed(1)} KB`
        : `${(bytes / 1024 ** 2).toFixed(1)} MB`,
  formatDownloadLabel,
  formatRemoveLabel,
  formatUploadedMessage = (name) => `${name} uploaded`,
  formatErrorMessage = (name) => `${name} upload failed`,
  id,
  ref,
  multiple,
  disabled,
  onChange,
  className,
  style,
  ...props
}: FileUploadProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
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

  return (
    <div className={cx('motiv-file-upload', className)} style={style}>
      <input
        {...props}
        id={inputId}
        ref={(node) => {
          input.current = node;
          if (typeof ref === 'function') return ref(node);
          if (ref) ref.current = node;
        }}
        type="file"
        className="motiv-file-upload__input motiv-visually-hidden"
        multiple={multiple}
        disabled={disabled}
        onChange={(event) => {
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
        }}
      />
      <label
        htmlFor={inputId}
        className={buttonClassName({ variant: 'outline', className: 'motiv-file-upload__picker' })}
        aria-disabled={disabled || undefined}
      >
        {label}
      </label>
      {(entries.length > 0 || (attachedFiles?.length ?? 0) > 0) && (
        <ul className="motiv-file-upload__list">
          {attachedFiles?.map((file) => (
            <li key={file.id} className="motiv-file-upload__row" aria-label={file.name}>
              <span>{file.name}</span>
              {file.size !== undefined && (
                <div className="motiv-file-upload__details">{formatSize(file.size)}</div>
              )}
              <div className="motiv-file-upload__actions">
                {file.onDownload && (
                  <Button
                    variant="ghost"
                    size="sm"
                    disabled={disabled}
                    aria-label={formatDownloadLabel?.(file.name) ?? `${downloadLabel} ${file.name}`}
                    onClick={file.onDownload}
                  >
                    {downloadLabel}
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  disabled={disabled}
                  aria-label={formatRemoveLabel?.(file.name) ?? `${removeLabel} ${file.name}`}
                  onClick={() => {
                    file.onRemove();
                    input.current?.focus();
                  }}
                >
                  {removeLabel}
                </Button>
              </div>
            </li>
          ))}
          {entries.map((entry) => {
            const actionLabel =
              entry.status === 'uploading'
                ? cancelLabel
                : entry.status === 'error'
                  ? retryLabel
                  : removeLabel;
            const errorId = `${generatedId}-${entry.id}-error`;
            return (
              <li
                key={entry.id}
                className="motiv-file-upload__row"
                aria-label={entry.file.name}
                aria-describedby={entry.status === 'error' ? errorId : undefined}
              >
                <Progress
                  className="motiv-file-upload__progress"
                  label={entry.file.name}
                  value={entry.progress}
                  showValue={false}
                />
                <div className="motiv-file-upload__details">
                  <span>{formatSize(entry.file.size)}</span>
                  <span>
                    {entry.status === 'uploading'
                      ? uploadingLabel
                      : entry.status === 'done'
                        ? uploadedLabel
                        : errorLabel}
                  </span>
                </div>
                {entry.status === 'error' && (
                  <p id={errorId} className="motiv-file-upload__error">
                    {entry.error}
                  </p>
                )}
                <div className="motiv-file-upload__actions">
                  <Button
                    ref={(node) => {
                      if (node) actions.current.set(entry.id, node);
                      return () => {
                        actions.current.delete(entry.id);
                      };
                    }}
                    variant="ghost"
                    size="sm"
                    disabled={disabled}
                    aria-label={`${actionLabel}: ${entry.file.name}`}
                    onClick={() =>
                      entry.status === 'error' ? void start(entry.file, entry.id) : remove(entry.id)
                    }
                  >
                    {actionLabel}
                  </Button>
                  {entry.status === 'error' && (
                    <Button
                      variant="ghost"
                      size="sm"
                      disabled={disabled}
                      aria-label={`${removeLabel}: ${entry.file.name}`}
                      onClick={() => remove(entry.id)}
                    >
                      {removeLabel}
                    </Button>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}
      <div className="motiv-visually-hidden" aria-live="polite" aria-relevant="additions">
        {announcements.map((message) => (
          <div key={message.id}>{message.text}</div>
        ))}
      </div>
    </div>
  );
}
