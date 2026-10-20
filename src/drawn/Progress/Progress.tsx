import type { ComponentProps, CSSProperties } from 'react';
import { cx } from '../../utils/cx';

export interface ProgressProps extends Omit<ComponentProps<'div'>, 'children'> {
  value: number;
  label: string;
  showValue?: boolean;
}

export function Progress({
  value,
  label,
  showValue = true,
  className,
  style,
  ...props
}: ProgressProps) {
  const rounded = Math.round(Math.min(100, Math.max(0, value)));
  return (
    <div
      {...props}
      className={cx('motiv-progress', className)}
      style={{ ...style, '--_value': rounded } as CSSProperties}
      data-complete={rounded === 100 || undefined}
    >
      <div className="motiv-progress__head">
        <span>{label}</span>
        {showValue && (
          <span className="motiv-progress__value" aria-hidden="true">
            {rounded}%
          </span>
        )}
      </div>
      <div
        className="motiv-progress__track"
        role="progressbar"
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={rounded}
      >
        <div className="motiv-progress__fill">
          <span className="motiv-progress__hatch" />
          <span className="motiv-progress__tip" />
        </div>
      </div>
    </div>
  );
}
