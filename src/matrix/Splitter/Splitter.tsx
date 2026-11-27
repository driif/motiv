import type { SplitterProps } from '../../components/Splitter';
import { cx } from '../../utils/cx';
import { useSplitter } from '../../utils/useSplitter';

export function Splitter({ orientation = 'vertical', className, ...props }: SplitterProps) {
  return (
    <div
      {...useSplitter({ ...props, orientation })}
      className={cx('motiv-matrix-splitter', `motiv-matrix-splitter--${orientation}`, className)}
    />
  );
}
