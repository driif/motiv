import type { DialogProps } from '../../components/Dialog';
import { cx } from '../../utils/cx';
import { Icon } from '../../utils/Icon';
import { useDialog } from '../../utils/useDialog';
import { IconButton } from '../IconButton';

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
      className={cx(
        'motiv-sketch-dialog',
        size === 'wide' && 'motiv-sketch-dialog--wide',
        className,
      )}
    >
      <div className="motiv-sketch-dialog__header">
        <h2 id={titleId} className="motiv-sketch-dialog__title">
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
      <div className="motiv-sketch-dialog__body">{children}</div>
    </dialog>
  );
}
