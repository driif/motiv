import type { SpringCheckboxProps } from '../../components/SpringCheckbox';
import { cx } from '../../utils/cx';

export type CheckboxProps = SpringCheckboxProps;

export function Checkbox({ label, className, style, ...props }: CheckboxProps) {
  return (
    <label className={cx('motiv-checkbox', className)} style={style}>
      <input {...props} type="checkbox" className="motiv-checkbox__input motiv-visually-hidden" />
      <span className="motiv-checkbox__box" aria-hidden="true">
        <svg viewBox="0 0 36 36" aria-hidden="true">
          <path
            className="motiv-checkbox__tick"
            pathLength={1}
            d="M5 19C8 21 10 24 12 27C16 18 23 9 34 3"
          />
          <path
            className="motiv-checkbox__dash"
            pathLength={1}
            d="M7 25.5C12 24.6 18 24.8 23 25.2"
          />
        </svg>
      </span>
      <span className="motiv-checkbox__label">{label}</span>
    </label>
  );
}
