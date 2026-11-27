import type { BadgeProps } from '../../components/Badge';
import { cx } from '../../utils/cx';

export function Badge({ tone = 'neutral', size = 'sm', className, ...props }: BadgeProps) {
  return (
    <span
      {...props}
      className={cx(
        'motiv-sketch-badge',
        `motiv-sketch-badge--${tone}`,
        size === 'md' && 'motiv-sketch-badge--md',
        className,
      )}
    />
  );
}
