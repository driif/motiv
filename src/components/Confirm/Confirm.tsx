import type { ComponentProps } from 'react';
import { cx } from '../../utils/cx';
import { useConfirm } from '../../utils/useConfirm';
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
  'aria-labelledby': labelledBy,
  ...props
}: ConfirmProps) {
  const { titleId, cancelRef, blocked, slugProps, dialogProps } = useConfirm({
    open,
    slug,
    pending,
    onCancel,
    onClose,
    ref,
    'aria-labelledby': labelledBy,
  });

  return (
    <dialog {...props} {...dialogProps} className={cx('motiv-confirm', className)}>
      <div className="motiv-confirm__content">
        <h2 id={titleId} className="motiv-confirm__title">
          {title}
        </h2>
        {children}
        {slug !== undefined && (
          <TextField
            {...slugProps}
            label={slugLabel}
            hint={slug}
            disabled={pending}
            autoComplete="off"
            spellCheck={false}
          />
        )}
        <div className="motiv-confirm__actions">
          <Button ref={cancelRef} variant="outline" disabled={pending} onClick={onCancel}>
            {cancelLabel}
          </Button>
          <Button variant={confirmVariant} loading={pending} disabled={blocked} onClick={onConfirm}>
            {confirmLabel}
          </Button>
        </div>
      </div>
    </dialog>
  );
}
