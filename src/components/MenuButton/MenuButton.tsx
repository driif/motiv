import type { ComponentProps } from 'react';
import { cx } from '../../utils/cx';

export interface MenuButtonProps extends Omit<ComponentProps<'button'>, 'children' | 'onClick'> {
  open: boolean;
  onToggle: () => void;
  label?: string;
}

export function MenuButton({
  open,
  onToggle,
  label = 'Menu',
  className,
  ...props
}: MenuButtonProps) {
  return (
    <button
      type="button"
      {...props}
      aria-label={label}
      aria-expanded={open}
      className={cx('motiv-menu-button', className)}
      onClick={onToggle}
    >
      <span className="motiv-menu-button__line" />
      <span className="motiv-menu-button__line" />
      <span className="motiv-menu-button__line" />
    </button>
  );
}
