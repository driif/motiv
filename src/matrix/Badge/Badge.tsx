import type { BadgeProps } from '../../components/Badge';
import { cx } from '../../utils/cx';

export function Badge({ tone = 'neutral', size = 'sm', className, ...props }: BadgeProps) {
  return (
    <span
      {...props}
      className={cx(
        'motiv-matrix-badge',
        `motiv-matrix-badge--${tone}`,
        size === 'md' && 'motiv-matrix-badge--md',
        className,
      )}
    />
  );
}
