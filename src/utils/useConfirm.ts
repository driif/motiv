import {
  type ChangeEvent,
  type ComponentProps,
  type SyntheticEvent,
  useEffect,
  useId,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import type { ConfirmProps } from '../components/Confirm';

/**
 * Keeps a modal `<dialog>` in step with the controlled `open`, blocks native close requests and
 * cancellation while `pending`, and tracks the typed slug. Focus goes to the slug field, else Cancel.
 */
export function useConfirm({
  open,
  slug,
  pending,
  onCancel,
  onClose,
  ref,
  'aria-labelledby': labelledBy,
}: Pick<ConfirmProps, 'open' | 'slug' | 'onCancel' | 'onClose' | 'ref' | 'aria-labelledby'> & {
  pending: boolean;
}) {
  const titleId = useId();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const cancelRef = useRef<HTMLButtonElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [typed, setTyped] = useState('');

  useImperativeHandle(ref, () => dialogRef.current as HTMLDialogElement, []);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open) dialog.showModal();
    return () => {
      if (dialog.open) dialog.close();
    };
  }, [open]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: reopening or a new slug clears the field.
  useEffect(() => {
    setTyped('');
  }, [open, slug]);

  // pending disables the focused control; put focus back once it ends
  useEffect(() => {
    if (open && !pending) (slug !== undefined ? inputRef.current : cancelRef.current)?.focus();
  }, [open, slug, pending]);

  return {
    titleId,
    cancelRef,
    blocked: slug !== undefined && typed !== slug,
    slugProps: {
      ref: inputRef,
      value: typed,
      onChange: (event: ChangeEvent<HTMLInputElement>) => setTyped(event.target.value),
    },
    dialogProps: {
      ref: dialogRef,
      'aria-labelledby': labelledBy ?? titleId,
      'aria-busy': pending || undefined,
      onCancel: (event: SyntheticEvent<HTMLDialogElement>) => {
        event.preventDefault();
        if (!pending) onCancel();
      },
      onClose: (event: SyntheticEvent<HTMLDialogElement>) => {
        // Native close requests must not override the caller's controlled state.
        if (open && !event.currentTarget.open) event.currentTarget.showModal();
        onClose?.(event);
      },
    } satisfies ComponentProps<'dialog'>,
  };
}
