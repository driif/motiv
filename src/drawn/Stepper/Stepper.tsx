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

  return (
    <div {...props} className={cx('motiv-sketch-stepper', className)}>
      <button
        type="button"
        className="motiv-sketch-stepper__button"
        aria-label={decreaseLabel}
        onClick={() => bump(-step)}
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M5.5 12.4c4.3-.5 8.6-.7 13-.3" />
        </svg>
      </button>
      <div
        role="spinbutton"
        tabIndex={0}
        aria-label={label}
        aria-valuenow={value}
        aria-valuemin={min}
        aria-valuemax={max}
        className="motiv-sketch-stepper__value"
        onKeyDown={onKeyDown}
      >
        {value.toFixed(decimals)}
      </div>
      <button
        type="button"
        className="motiv-sketch-stepper__button"
        aria-label={increaseLabel}
        onClick={() => bump(step)}
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M5.5 12.4c4.3-.5 8.6-.7 13-.3M12.2 5.4c-.4 4.4-.3 8.8.2 13.2" />
        </svg>
      </button>
    </div>
  );
}
