import type { ComponentProps, ReactNode } from 'react';
import { cx } from '../../utils/cx';

export interface IconButtonProps extends Omit<ComponentProps<'button'>, 'children'> {
  icon: ReactNode;
  label: string;
  /** `xs` matches `--motiv-row-height`, so a list row keeps its height. */
  size?: 'xs' | 'sm' | 'md';
  shape?: 'square' | 'round';
}

export function IconButton({
  icon,
  label,
  size = 'md',
  shape = 'square',
  className,
  ...props
}: IconButtonProps) {
  return (
    <button
      type="button"
      {...props}
      aria-label={label}
      title={label}
      className={cx(
        'motiv-icon-button',
        size !== 'md' && `motiv-icon-button--${size}`,
        shape === 'round' && 'motiv-icon-button--round',
        className,
      )}
    >
      <span className="motiv-icon-button__icon" aria-hidden="true">
        {icon}
      </span>
    </button>
  );
}

export interface IconButtonGroupProps extends ComponentProps<'div'> {
  label: string;
  /** `sm` makes every IconButton in the group small and tightens the frame. */
  size?: 'sm' | 'md';
}

export function IconButtonGroup({ label, size = 'md', className, ...props }: IconButtonGroupProps) {
  return (
    <div
      {...props}
      role="group"
      aria-label={label}
      className={cx(
        'motiv-icon-button-group',
        size === 'sm' && 'motiv-icon-button-group--sm',
        className,
      )}
    />
  );
}
