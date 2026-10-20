import type { ButtonClassNameOptions, ButtonProps } from '../../components/Button';
import { cx } from '../../utils/cx';

export function buttonClassName({
  variant = 'primary',
  size = 'md',
  className,
}: ButtonClassNameOptions = {}): string {
  return cx('motiv-btn', `motiv-btn--${variant}`, `motiv-btn--${size}`, className);
}

export function Button({
  variant,
  size,
  iconLeft,
  iconRight,
  loading = false,
  disabled,
  className,
  children,
  type = 'button',
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      type={type}
      disabled={disabled || loading}
      aria-busy={loading || props['aria-busy'] || undefined}
      className={buttonClassName({ variant, size, className })}
    >
      {loading ? (
        <svg
          className={cx('motiv-btn__spinner', !iconLeft && 'motiv-btn__spinner--overlay')}
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            pathLength={1}
            d="M13 3C18 3 21 7 21 12C21 17 17 21 12 21C7 21 3 17 3 12C3 7 7 4 14 4"
          />
        </svg>
      ) : (
        iconLeft && (
          <span className="motiv-btn__icon" aria-hidden="true">
            {iconLeft}
          </span>
        )
      )}
      <span className="motiv-btn__label">{children}</span>
      {iconRight && (
        <span className="motiv-btn__icon" aria-hidden="true">
          {iconRight}
        </span>
      )}
    </button>
  );
}
