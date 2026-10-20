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
