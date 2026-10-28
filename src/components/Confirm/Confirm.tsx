import {
  type ComponentProps,
  useEffect,
  useId,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { cx } from '../../utils/cx';
import { Button } from '../Button';
import { TextField } from '../TextField';

export interface ConfirmProps extends Omit<ComponentProps<'dialog'>, 'onCancel'> {
  open: boolean;
  title: string;
  onConfirm: () => void;
  onCancel: () => void;
  slug?: string;
  pending?: boolean;
  confirmLabel?: string;
  confirmVariant?: 'primary' | 'danger';
  cancelLabel?: string;
  slugLabel?: string;
}

export function Confirm({
  open,
  title,
  onConfirm,
  onCancel,
  slug,
  pending = false,
  confirmLabel = 'Delete',
  confirmVariant = 'danger',
  cancelLabel = 'Cancel',
  slugLabel = 'Type the slug to confirm',
  children,
  className,
  ref,
  onClose,
  ...props
}: ConfirmProps) {
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

  return (
    <dialog
      {...props}
      ref={dialogRef}
      className={cx('motiv-confirm', className)}
      aria-labelledby={props['aria-labelledby'] ?? titleId}
      aria-busy={pending || undefined}
      onCancel={(event) => {
        event.preventDefault();
        if (!pending) onCancel();
      }}
      onClose={(event) => {
        // Native close requests must not override the caller's controlled state.
        if (open && !event.currentTarget.open) event.currentTarget.showModal();
        onClose?.(event);
      }}
    >
      <div className="motiv-confirm__content">
        <h2 id={titleId} className="motiv-confirm__title">
          {title}
        </h2>
        {children}
        {slug !== undefined && (
          <TextField
            ref={inputRef}
            label={slugLabel}
            hint={slug}
            value={typed}
            onChange={(event) => setTyped(event.target.value)}
            disabled={pending}
            autoComplete="off"
            spellCheck={false}
          />
        )}
        <div className="motiv-confirm__actions">
          <Button ref={cancelRef} variant="outline" disabled={pending} onClick={onCancel}>
            {cancelLabel}
          </Button>
          <Button
            variant={confirmVariant}
            loading={pending}
            disabled={slug !== undefined && typed !== slug}
            onClick={onConfirm}
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </dialog>
  );
}
