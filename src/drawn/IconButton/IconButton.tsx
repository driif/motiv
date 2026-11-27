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
        'motiv-icon-button',
        size !== 'md' && `motiv-icon-button--${size}`,
        shape === 'round' && 'motiv-icon-button--round',
        className,
      )}
    >
      <svg className="motiv-icon-button__ring" viewBox="0 0 52 52" aria-hidden="true">
        <path
          pathLength={1}
          d="M27 4C41 4 48 14 48 26C48 39 39 48 26 48C13 48 4 39 4 26C4 14 13 5 29 5"
        />
      </svg>
      <span className="motiv-icon-button__icon" aria-hidden="true">
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
        'motiv-icon-button-group',
        size === 'sm' && 'motiv-icon-button-group--sm',
        className,
      )}
    />
  );
}
