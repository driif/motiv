import type { IconButtonGroupProps, IconButtonProps } from '../../components/IconButton';
import { cx } from '../../utils/cx';

export function IconButton({
  icon,
  label,
  size = 'md',
  shape = 'square',
  className,
  ...props
}: IconButtonProps) {
  return (
    <button
      type="button"
      {...props}
      aria-label={label}
      title={label}
      className={cx(
        'motiv-matrix-icon-button',
        size !== 'md' && `motiv-matrix-icon-button--${size}`,
        shape === 'round' && 'motiv-matrix-icon-button--round',
        className,
      )}
    >
      <span className="motiv-matrix-icon-button__icon" aria-hidden="true">
        {icon}
      </span>
    </button>
  );
}

export function IconButtonGroup({ label, size = 'md', className, ...props }: IconButtonGroupProps) {
  return (
    <div
      {...props}
      role="group"
      aria-label={label}
      className={cx(
        'motiv-matrix-icon-button-group',
        size === 'sm' && 'motiv-matrix-icon-button-group--sm',
        className,
      )}
    />
  );
}
