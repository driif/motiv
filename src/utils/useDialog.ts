import {
  type ComponentProps,
  type MouseEvent,
  type PointerEvent,
  type SyntheticEvent,
  useEffect,
  useId,
  useImperativeHandle,
  useRef,
} from 'react';
import type { DialogProps } from '../components/Dialog';

function onBackdrop(event: MouseEvent<HTMLDialogElement>) {
  const dialog = event.currentTarget;
  if (event.target !== dialog) return false;
  const { left, right, top, bottom } = dialog.getBoundingClientRect();
  const { clientX: x, clientY: y } = event;
  return x < left || x > right || y < top || y > bottom;
}

/**
 * Keeps a modal `<dialog>` in step with the controlled `open`: Escape, native close and a backdrop
 * click report `onClose` once, the dialog stays open until the prop turns false, focus returns to the opener.
 */
export function useDialog({
  open,
  onClose,
  ref,
  onClick,
  onPointerDown,
}: Pick<DialogProps, 'open' | 'onClose' | 'ref' | 'onClick' | 'onPointerDown'>) {
  const titleId = useId();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const openRef = useRef(false);
  const reportedRef = useRef(false);
  const pressedBackdropRef = useRef(false);

  useImperativeHandle(ref, () => dialogRef.current as HTMLDialogElement, []);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog || !open) return;
    const opener = document.activeElement as HTMLElement | null;
    openRef.current = true;
    dialog.showModal();
    return () => {
      openRef.current = false;
      dialog.close();
      opener?.focus();
    };
  }, [open]);

  return {
    titleId,
    dialogProps: {
      ref: dialogRef,
      onCancel: (event: SyntheticEvent<HTMLDialogElement>) => {
        // React dispatches a nested dialog's cancel and close to ancestor dialogs too.
        if (event.target !== event.currentTarget) return;
        event.preventDefault();
        // An uncancelable cancel (no user activation) is followed by a close we already reported.
        reportedRef.current = !event.cancelable;
        onClose();
      },
      onClose: (event: SyntheticEvent<HTMLDialogElement>) => {
        if (event.target !== event.currentTarget) return;
        const reported = reportedRef.current;
        reportedRef.current = false;
        // Our own close() (prop change, unmount, Strict Mode replay) is not a dismissal request.
        if (event.currentTarget.open || !openRef.current) return;
        event.currentTarget.showModal();
        if (!reported) onClose();
      },
      onPointerDown: (event: PointerEvent<HTMLDialogElement>) => {
        pressedBackdropRef.current = onBackdrop(event);
        onPointerDown?.(event);
      },
      onClick: (event: MouseEvent<HTMLDialogElement>) => {
        onClick?.(event);
        if (pressedBackdropRef.current && onBackdrop(event)) onClose();
        pressedBackdropRef.current = false;
      },
    } satisfies ComponentProps<'dialog'>,
  };
}
