import type { ComponentProps } from 'react';
import { cx } from '../../utils/cx';
import { Icon } from '../../utils/Icon';
import { useDialog } from '../../utils/useDialog';
import { IconButton } from '../IconButton';

export interface DialogProps
  extends Omit<ComponentProps<'dialog'>, 'title' | 'onClose' | 'onCancel'> {
  open: boolean;
  title: string;
  onClose: () => void;
  closeLabel?: string;
  size?: 'md' | 'wide';
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
  const { titleId, dialogProps } = useDialog({ open, onClose, ref, onClick, onPointerDown });

  return (
    <dialog
      aria-labelledby={titleId}
      {...props}
      {...dialogProps}
      className={cx('motiv-dialog', size === 'wide' && 'motiv-dialog--wide', className)}
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
