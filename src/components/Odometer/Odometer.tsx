import type { ComponentProps } from 'react';
import { cx } from '../../utils/cx';

const DIGITS = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

export interface OdometerProps extends Omit<ComponentProps<'span'>, 'children'> {
  value: number;
  minDigits?: number;
  /** Fixed number of fraction digits; by default the value's own. */
  decimals?: number;
  dimLeadingZeros?: boolean;
}

/** Decorative rolling digits: label the parent, the odometer itself is aria-hidden. */
export function Odometer({
  value,
  minDigits = 1,
  decimals,
  dimLeadingZeros = false,
  className,
  ...props
}: OdometerProps) {
  const abs = Math.abs(value);
  const [int, fraction] = (decimals === undefined ? String(abs) : abs.toFixed(decimals)).split('.');
  const text = `${value < 0 ? '-' : ''}${int.padStart(minDigits, '0')}${fraction ? `.${fraction}` : ''}`;
  const point = text.includes('.') ? text.indexOf('.') : text.length;
  const firstSignificant = text.search(/[1-9]/);
  const lastLeading = Math.min(firstSignificant === -1 ? text.length : firstSignificant, point - 1);

  return (
    <span {...props} className={cx('motiv-odometer', className)} aria-hidden="true">
      {text.split('').map((char, i) => (
        <span
          // biome-ignore lint/suspicious/noArrayIndexKey: keyed by place value, so units stay units when the number grows a digit
          key={point - i}
          className={cx(
            'motiv-odometer__col',
            dimLeadingZeros && char === '0' && i < lastLeading && 'motiv-odometer__col--dim',
          )}
        >
          {DIGITS.includes(char) ? (
            <span
              className="motiv-odometer__strip"
              style={{ translate: `0 ${-Number(char) * 10}%` }}
            >
              {DIGITS.map((d) => (
                <span key={d}>{d}</span>
              ))}
            </span>
          ) : (
            char
          )}
        </span>
      ))}
    </span>
  );
}
