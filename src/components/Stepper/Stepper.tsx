import { type ComponentProps, useRef } from 'react';
import { cx } from '../../utils/cx';
import { Icon } from '../../utils/Icon';
import { playOnce, SHAKE } from '../../utils/motion';
import { useStepper } from '../../utils/useStepper';
import { Odometer } from '../Odometer/Odometer';

export interface StepperProps extends Omit<ComponentProps<'div'>, 'onChange'> {
  value: number;
  onChange: (value: number) => void;
  label: string;
  min?: number;
  max?: number;
  step?: number;
  decreaseLabel?: string;
  increaseLabel?: string;
}

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
  const valueRef = useRef<HTMLDivElement>(null);
  const digits = String(Math.trunc(Math.max(Math.abs(min), Math.abs(max)))).length;
  const { decimals, bump, onKeyDown } = useStepper({
    value,
    onChange,
    min,
    max,
    step,
    onOutOfRange: () => playOnce(valueRef.current, SHAKE, { duration: 400 }),
  });

  return (
    <div {...props} className={cx('motiv-stepper', className)}>
      <button
        type="button"
        className="motiv-stepper__button"
        aria-label={decreaseLabel}
        onClick={() => bump(-step)}
      >
        <Icon>
          <path d="M5 12h14" />
        </Icon>
      </button>
      <div
        ref={valueRef}
        role="spinbutton"
        tabIndex={0}
        aria-label={label}
        aria-valuenow={value}
        aria-valuemin={min}
        aria-valuemax={max}
        className="motiv-stepper__value"
        onKeyDown={onKeyDown}
      >
        <Odometer value={value} minDigits={digits} decimals={decimals} dimLeadingZeros />
      </div>
      <button
        type="button"
        className="motiv-stepper__button"
        aria-label={increaseLabel}
        onClick={() => bump(step)}
      >
        <Icon>
          <path d="M12 5v14M5 12h14" />
        </Icon>
      </button>
    </div>
  );
}
