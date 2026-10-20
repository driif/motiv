import { ThemeToggle } from '@driif/motiv/drawn';
import { useTheme } from '../../useTheme';

export function ThemeToggleDemo() {
  const { dark, toggle } = useTheme();
  return <ThemeToggle dark={dark} onToggle={toggle} />;
}
