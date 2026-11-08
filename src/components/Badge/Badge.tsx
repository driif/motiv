import type { ComponentProps } from 'react';
import { cx } from '../../utils/cx';

export interface BadgeProps extends ComponentProps<'span'> {
  tone?: 'neutral' | 'success' | 'warning' | 'danger';
  size?: 'sm' | 'md';
}

export function Badge({ tone = 'neutral', size = 'sm', className, ...props }: BadgeProps) {
  return (
    <span
      {...props}
      className={cx(
        'motiv-status-badge',
        `motiv-status-badge--${tone}`,
        size === 'md' && 'motiv-status-badge--md',
        className,
      )}
    />
  );
}
