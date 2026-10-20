import type { RadioGroupProps, RadioProps } from '../../drawn/Radio';
import { cx } from '../../utils/cx';

export function Radio({ label, className, ...props }: RadioProps) {
  return (
    <label className={cx('motiv-matrix-radio', className)}>
      <input {...props} type="radio" className="motiv-matrix-radio__input motiv-visually-hidden" />
      <span className="motiv-matrix-radio__dot" aria-hidden="true" />
      <span className="motiv-matrix-radio__label">{label}</span>
    </label>
  );
}

export function RadioGroup({
  name,
  legend,
  options,
  value,
  onChange,
  className,
  ...props
}: RadioGroupProps) {
  return (
    <fieldset className={cx('motiv-matrix-radio-group', className)} {...props}>
      <legend className="motiv-matrix-radio-group__legend">{legend}</legend>
      {options.map((option) => (
        <Radio
          key={option.value}
          name={name}
          value={option.value}
          checked={value === option.value}
          onChange={() => onChange(option.value)}
          label={option.label}
        />
      ))}
    </fieldset>
  );
}
