import type { CSSProperties } from 'react';
import type { OtpInputProps } from '../../components/OtpInput';
import { cx } from '../../utils/cx';
import { useOtp } from '../../utils/useOtp';

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
  const { inputProps } = useOtp({ value, onChange, length, onComplete, disabled, digitLabel });

  return (
    <fieldset {...props} className={cx('motiv-matrix-otp', className)} data-status={status}>
      <legend className="motiv-matrix-otp__label">{label}</legend>
      <div className="motiv-matrix-otp__boxes">
        {Array.from({ length }, (_, i) => (
          <input
            // biome-ignore lint/suspicious/noArrayIndexKey: boxes are positions, not items
            key={i}
            className="motiv-matrix-otp__box"
            style={{ '--_i': i } as CSSProperties}
            {...inputProps(i)}
          />
        ))}
      </div>
    </fieldset>
  );
}
