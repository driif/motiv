import {
  type ComponentProps,
  type MouseEvent,
  useEffect,
  useId,
  useImperativeHandle,
  useRef,
} from 'react';
import { cx } from '../../utils/cx';
import { Icon } from '../../utils/Icon';
import { IconButton } from '../IconButton';

export interface DialogProps
  extends Omit<ComponentProps<'dialog'>, 'title' | 'onClose' | 'onCancel'> {
  open: boolean;
  title: string;
  onClose: () => void;
  closeLabel?: string;
  size?: 'md' | 'wide';
}

function onBackdrop(event: MouseEvent<HTMLDialogElement>) {
  const dialog = event.currentTarget;
  if (event.target !== dialog) return false;
  const { left, right, top, bottom } = dialog.getBoundingClientRect();
  const { clientX: x, clientY: y } = event;
  return x < left || x > right || y < top || y > bottom;
}

export function Dialog({
  open,
  title,
  onClose,
  closeLabel = 'Close',
  size = 'md',
  children,
  className,
  ref,
  onClick,
  onPointerDown,
  ...props
}: DialogProps) {
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

  return (
    <dialog
      aria-labelledby={titleId}
      {...props}
      ref={dialogRef}
      className={cx('motiv-dialog', size === 'wide' && 'motiv-dialog--wide', className)}
      onCancel={(event) => {
        // React dispatches a nested dialog's cancel and close to ancestor dialogs too.
        if (event.target !== event.currentTarget) return;
        event.preventDefault();
        // An uncancelable cancel (no user activation) is followed by a close we already reported.
        reportedRef.current = !event.cancelable;
        onClose();
      }}
      onClose={(event) => {
        if (event.target !== event.currentTarget) return;
        const reported = reportedRef.current;
        reportedRef.current = false;
        // Our own close() (prop change, unmount, Strict Mode replay) is not a dismissal request.
        if (event.currentTarget.open || !openRef.current) return;
        event.currentTarget.showModal();
        if (!reported) onClose();
      }}
      onPointerDown={(event) => {
        pressedBackdropRef.current = onBackdrop(event);
        onPointerDown?.(event);
      }}
      onClick={(event) => {
        onClick?.(event);
        if (pressedBackdropRef.current && onBackdrop(event)) onClose();
        pressedBackdropRef.current = false;
      }}
    >
      <div className="motiv-dialog__header">
        <h2 id={titleId} className="motiv-dialog__title">
          {title}
        </h2>
        <IconButton
          label={closeLabel}
          icon={
            <Icon>
              <path d="M6 6l12 12M18 6 6 18" />
            </Icon>
          }
          onClick={onClose}
        />
      </div>
      <div className="motiv-dialog__body">{children}</div>
    </dialog>
  );
}
