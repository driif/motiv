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
            d="M12.5 2.6C18.6 2.4 21.6 6.8 21.4 12.2C21.2 17.9 17.4 21.5 11.8 21.3C6.2 21.1 2.5 17.2 2.7 11.6C2.9 6.4 6.7 3.1 13.8 3.4"
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
