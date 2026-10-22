import type { StepperProps } from '../../components/Stepper';
import { cx } from '../../utils/cx';
import { useStepper } from '../../utils/useStepper';

export function Stepper({
  value,
  onChange,
  label,
  min = 0,
  max = 99,
  step = 1,
  decreaseLabel = `Decrease ${label}`,
  increaseLabel = `Increase ${label}`,
  className,
  ...props
}: StepperProps) {
  const { decimals, bump, onKeyDown } = useStepper({ value, onChange, min, max, step });
  const digits = String(Math.trunc(Math.max(Math.abs(min), Math.abs(max)))).length;
  const [int, fraction] = Math.abs(value).toFixed(decimals).split('.');
  const readout = `${value < 0 ? '-' : ''}${int.padStart(digits, '0')}${fraction ? `.${fraction}` : ''}`;

  return (
    <div {...props} className={cx('motiv-matrix-stepper', className)}>
      <button
        type="button"
        className="motiv-matrix-stepper__button"
        aria-label={decreaseLabel}
        onClick={() => bump(-step)}
      >
        <span aria-hidden="true">[-]</span>
      </button>
      <div
        role="spinbutton"
        tabIndex={0}
        aria-label={label}
        aria-valuenow={value}
        aria-valuemin={min}
        aria-valuemax={max}
        className="motiv-matrix-stepper__value"
        onKeyDown={onKeyDown}
      >
        {readout}
      </div>
      <button
        type="button"
        className="motiv-matrix-stepper__button"
        aria-label={increaseLabel}
        onClick={() => bump(step)}
      >
        <span aria-hidden="true">[+]</span>
      </button>
    </div>
  );
}
