import type { ComponentProps, ReactNode } from 'react';
import { cx } from '../../utils/cx';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonClassNameOptions {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
}

export function buttonClassName({
  variant = 'primary',
  size = 'md',
  className,
}: ButtonClassNameOptions = {}): string {
  return cx('motiv-btn', `motiv-btn--${variant}`, `motiv-btn--${size}`, className);
}

export interface ButtonProps extends ComponentProps<'button'> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
  loading?: boolean;
}

export function Button({
  variant,
  size,
  iconLeft,
  iconRight,
  loading = false,
  disabled,
  type = 'button',
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={buttonClassName({ variant, size, className })}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...props}
    >
      {loading ? (
        <span className="motiv-btn__spinner" aria-hidden="true" />
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
