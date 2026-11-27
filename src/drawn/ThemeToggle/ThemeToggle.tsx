import type { CSSProperties } from 'react';
import type { ThemeToggleProps } from '../../components/ThemeToggle';
import { cx } from '../../utils/cx';
import { useRootDark } from '../../utils/useRootDark';

const RAYS = [0, 1, 2, 3, 4, 5, 6, 7];

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
      aria-pressed={useRootDark(dark)}
      className={cx('motiv-theme-toggle', className)}
      onClick={onToggle}
    >
      {RAYS.map((i) => (
        <span
          key={i}
          className="motiv-theme-toggle__ray"
          style={{ '--_a': `${i * 45}deg`, '--_i': i } as CSSProperties}
        />
      ))}
      <span className="motiv-theme-toggle__orb" />
      <span className="motiv-theme-toggle__star" />
      <span className="motiv-theme-toggle__star" />
    </button>
  );
}
