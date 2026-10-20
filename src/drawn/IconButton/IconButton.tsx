import type { ComponentProps, ReactNode } from 'react';
import { cx } from '../../utils/cx';

export interface IconButtonProps extends Omit<ComponentProps<'button'>, 'children'> {
  icon: ReactNode;
  label: string;
}

export function IconButton({ icon, label, className, ...props }: IconButtonProps) {
  return (
    <button
      type="button"
      {...props}
      aria-label={label}
      title={label}
      className={cx('motiv-icon-button', className)}
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

export interface IconButtonGroupProps extends ComponentProps<'div'> {
  label: string;
}

export function IconButtonGroup({ label, className, ...props }: IconButtonGroupProps) {
  return (
    <div
      {...props}
      role="group"
      aria-label={label}
      className={cx('motiv-icon-button-group', className)}
    />
  );
}
