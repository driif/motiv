import { type ComponentProps, useEffect, useRef } from 'react';
import { cx } from '../../utils/cx';
import { playOnce, SHAKE, SPRING } from '../../utils/motion';
import { useOtp } from '../../utils/useOtp';

const WAVE: Keyframe[] = [
  { translate: '0 0' },
  { translate: '0 -8px', offset: 0.4 },
  { translate: '0 0' },
];

export interface OtpInputProps extends Omit<ComponentProps<'fieldset'>, 'onChange'> {
  value: string;
  onChange: (value: string) => void;
  label: string;
  length?: number;
  onComplete?: (value: string) => void;
  /** Set after you verify the code: 'success' waves, 'error' shakes */
  status?: 'idle' | 'success' | 'error';
  disabled?: boolean;
  digitLabel?: (index: number, length: number) => string;
}

export function OtpInput({
  value,
  onChange,
  label,
  length = 6,
  onComplete,
  status = 'idle',
  disabled,
  digitLabel = (i, n) => `Digit ${i + 1} of ${n}`,
  className,
  ...props
}: OtpInputProps) {
  const groupRef = useRef<HTMLDivElement>(null);
  const { refs, inputProps } = useOtp({
    value,
    onChange,
    length,
    onComplete,
    disabled,
    digitLabel,
  });

  useEffect(() => {
    if (status === 'success') {
      refs.current.forEach((el, i) => {
        playOnce(el, WAVE, { duration: 550, delay: i * 50, easing: SPRING });
      });
    } else if (status === 'error') {
      playOnce(groupRef.current, SHAKE, { duration: 420 });
    }
  }, [status, refs]);

  return (
    <fieldset {...props} className={cx('motiv-otp', className)} data-status={status}>
      <legend className="motiv-otp__label">{label}</legend>
      <div ref={groupRef} className="motiv-otp__boxes">
        {Array.from({ length }, (_, i) => (
          <input
            // biome-ignore lint/suspicious/noArrayIndexKey: boxes are positions, not items
            key={i}
            className="motiv-otp__box"
            {...inputProps(i)}
          />
        ))}
      </div>
    </fieldset>
  );
}
