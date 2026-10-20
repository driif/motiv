import type { ButtonClassNameOptions, ButtonProps } from '../../components/Button';
import { cx } from '../../utils/cx';

export function buttonClassName({
  variant = 'primary',
  size = 'md',
  className,
}: ButtonClassNameOptions = {}): string {
  return cx(
    'motiv-matrix-btn',
    `motiv-matrix-btn--${variant}`,
    `motiv-matrix-btn--${size}`,
    className,
  );
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
        <span
          className={cx(
            'motiv-matrix-btn__spinner',
            !iconLeft && 'motiv-matrix-btn__spinner--overlay',
          )}
          aria-hidden="true"
        />
      ) : (
        iconLeft && (
          <span className="motiv-matrix-btn__icon" aria-hidden="true">
            {iconLeft}
          </span>
        )
      )}
      <span className="motiv-matrix-btn__label">{children}</span>
      {iconRight && (
        <span className="motiv-matrix-btn__icon" aria-hidden="true">
          {iconRight}
        </span>
      )}
    </button>
  );
}
