import type { ComponentProps } from 'react';
import { cx } from '../../utils/cx';
import { Icon } from '../../utils/Icon';

export interface ThemeToggleProps extends Omit<ComponentProps<'button'>, 'children' | 'onClick'> {
  dark: boolean;
  onToggle: () => void;
  label?: string;
}

export function ThemeToggle({
  dark,
  onToggle,
  label = 'Dark mode',
  className,
  ...props
}: ThemeToggleProps) {
  return (
    <button
      type="button"
      {...props}
      aria-label={label}
      aria-pressed={dark}
      className={cx('motiv-theme-toggle', className)}
      onClick={onToggle}
    >
      <Icon className="motiv-theme-toggle__sun">
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2.5v2M12 19.5v2M4.6 4.6L6 6M18 18l1.4 1.4M2.5 12h2M19.5 12h2M4.6 19.4L6 18M18 6l1.4-1.4" />
      </Icon>
      <Icon className="motiv-theme-toggle__moon">
        <path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z" />
      </Icon>
    </button>
  );
}
