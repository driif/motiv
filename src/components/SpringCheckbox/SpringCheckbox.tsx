import type { ComponentProps, ReactNode } from 'react';
import { cx } from '../../utils/cx';
import { Icon } from '../../utils/Icon';

export interface SpringCheckboxProps extends Omit<ComponentProps<'input'>, 'type'> {
  label: ReactNode;
}

export function SpringCheckbox({ label, className, style, ...props }: SpringCheckboxProps) {
  return (
    <label className={cx('motiv-check', className)} style={style}>
      <input {...props} type="checkbox" className="motiv-check__input motiv-visually-hidden" />
      <span className="motiv-check__box" aria-hidden="true">
        <Icon className="motiv-check__tick">
          <path d="M5 12.5l4.5 4.5L19 7.5" />
        </Icon>
      </span>
      <span className="motiv-check__label">{label}</span>
    </label>
  );
}
