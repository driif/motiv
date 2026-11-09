import type { CSSProperties } from 'react';
import type { ProgressProps } from '../../drawn/Progress';
import { cx } from '../../utils/cx';

export function Progress({
  value,
  label,
  showValue = true,
  className,
  style,
  ...props
}: ProgressProps) {
  const rounded = value === undefined ? undefined : Math.round(Math.min(100, Math.max(0, value)));
  return (
    <div
      {...props}
      className={cx('motiv-matrix-progress', className)}
      style={{ ...style, '--_value': rounded } as CSSProperties}
      data-indeterminate={rounded === undefined || undefined}
    >
      <div className="motiv-matrix-progress__head">
        <span>{label}</span>
        {showValue && rounded !== undefined && (
          <span className="motiv-matrix-progress__value" aria-hidden="true">
            {rounded}%
          </span>
        )}
      </div>
      <div
        className="motiv-matrix-progress__track"
        role="progressbar"
        aria-label={label}
        aria-valuemin={rounded === undefined ? undefined : 0}
        aria-valuemax={rounded === undefined ? undefined : 100}
        aria-valuenow={rounded}
      >
        <div className="motiv-matrix-progress__fill" />
      </div>
    </div>
  );
}
