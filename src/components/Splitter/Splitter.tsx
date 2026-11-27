import type { ComponentProps } from 'react';
import { cx } from '../../utils/cx';
import { useSplitter } from '../../utils/useSplitter';

export interface SplitterProps extends Omit<ComponentProps<'div'>, 'onChange'> {
  /** Vertical separates columns; horizontal separates rows. */
  orientation?: 'vertical' | 'horizontal';
  value: number;
  min: number;
  max: number;
  label: string;
  onChange: (value: number) => void;
  onCommit?: (value: number) => void;
  step?: number;
  /** Converts pointer pixels to a value; custom results are clamped without step rounding. */
  getValueFromDelta?: (delta: number, startValue: number) => number;
}

export function Splitter({ orientation = 'vertical', className, ...props }: SplitterProps) {
  return (
    <div
      {...useSplitter({ ...props, orientation })}
      className={cx('motiv-splitter', `motiv-splitter--${orientation}`, className)}
    />
  );
}
