import type { CheckboxProps } from '../../drawn/Checkbox';
import { cx } from '../../utils/cx';

export function Checkbox({ label, className, ...props }: CheckboxProps) {
  return (
    <label className={cx('motiv-matrix-checkbox', className)}>
      <input
        {...props}
        type="checkbox"
        className="motiv-matrix-checkbox__input motiv-visually-hidden"
      />
      <span className="motiv-matrix-checkbox__box" aria-hidden="true" />
      <span className="motiv-matrix-checkbox__label">{label}</span>
    </label>
  );
}
