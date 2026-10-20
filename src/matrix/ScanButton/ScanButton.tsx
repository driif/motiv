import type { ComponentProps } from 'react';
import { cx } from '../../utils/cx';

export interface ScanButtonProps extends ComponentProps<'button'> {
  showArrow?: boolean;
}

export function ScanButton({
  showArrow = true,
  className,
  children,
  type = 'button',
  ...props
}: ScanButtonProps) {
  return (
    <button {...props} type={type} className={cx('motiv-matrix-scan', className)}>
      <span className="motiv-matrix-scan__beam" aria-hidden="true" />
      <span
        className="motiv-matrix-scan__corner motiv-matrix-scan__corner--tl"
        aria-hidden="true"
      />
      <span
        className="motiv-matrix-scan__corner motiv-matrix-scan__corner--tr"
        aria-hidden="true"
      />
      <span
        className="motiv-matrix-scan__corner motiv-matrix-scan__corner--bl"
        aria-hidden="true"
      />
      <span
        className="motiv-matrix-scan__corner motiv-matrix-scan__corner--br"
        aria-hidden="true"
      />
      <span className="motiv-matrix-scan__label">{children}</span>
      {showArrow && (
        <svg className="motiv-matrix-scan__arrow" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M4 12h14M13 6l6 6-6 6" />
        </svg>
      )}
    </button>
  );
}
