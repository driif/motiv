import type { IconButtonGroupProps, IconButtonProps } from '../../drawn/IconButton';
import { cx } from '../../utils/cx';

export function IconButton({ icon, label, className, ...props }: IconButtonProps) {
  return (
    <button
      type="button"
      {...props}
      aria-label={label}
      title={label}
      className={cx('motiv-matrix-icon-button', className)}
    >
      <span className="motiv-matrix-icon-button__icon" aria-hidden="true">
        {icon}
      </span>
    </button>
  );
}

export function IconButtonGroup({ label, className, ...props }: IconButtonGroupProps) {
  return (
    <div
      {...props}
      role="group"
      aria-label={label}
      className={cx('motiv-matrix-icon-button-group', className)}
    />
  );
}
