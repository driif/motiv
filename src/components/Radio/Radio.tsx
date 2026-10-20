import type { ComponentProps, ReactNode } from 'react';
import type { MotivOption } from '../../types';
import { cx } from '../../utils/cx';

export interface RadioProps extends Omit<ComponentProps<'input'>, 'type'> {
  label: ReactNode;
}

export function Radio({ label, className, ...props }: RadioProps) {
  return (
    <label className={cx('motiv-radio', className)}>
      <input {...props} type="radio" className="motiv-radio__input motiv-visually-hidden" />
      <span className="motiv-radio__dot" aria-hidden="true" />
      <span className="motiv-radio__label">{label}</span>
    </label>
  );
}

export interface RadioGroupProps extends Omit<ComponentProps<'fieldset'>, 'onChange'> {
  name: string;
  legend: ReactNode;
  options: MotivOption[];
  value: string;
  onChange: (value: string) => void;
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
    <fieldset className={cx('motiv-radio-group', className)} {...props}>
      <legend className="motiv-radio-group__legend">{legend}</legend>
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
