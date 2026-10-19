import type { ComponentProps, ReactNode } from 'react';
import { cx } from '../../utils/cx';

export interface CheckboxProps extends Omit<ComponentProps<'input'>, 'type'> {
  label: ReactNode;
}

export function Checkbox({ label, className, ...props }: CheckboxProps) {
  return (
    <label className={cx('motiv-checkbox', className)}>
      <input {...props} type="checkbox" className="motiv-checkbox__input motiv-visually-hidden" />
      <span className="motiv-checkbox__box" aria-hidden="true">
        <svg viewBox="0 0 36 36" aria-hidden="true">
          <path pathLength={1} d="M5 19C8 21 10 24 12 27C16 18 23 9 34 3" />
        </svg>
      </span>
      <span className="motiv-checkbox__label">{label}</span>
    </label>
  );
}
