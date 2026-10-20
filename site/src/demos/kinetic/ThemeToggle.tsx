import { ThemeToggle } from '@driif/motiv';
import { useTheme } from '../../useTheme';

export function ThemeToggleDemo() {
  const { dark, toggle } = useTheme();
  return <ThemeToggle dark={dark} onToggle={toggle} />;
}
