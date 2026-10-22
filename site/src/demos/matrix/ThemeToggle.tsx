import { ThemeToggle } from '@driif/motiv/matrix';
import { useTheme } from '../../useTheme';

export function ThemeToggleDemo() {
  const { dark, toggle } = useTheme();
  return <ThemeToggle dark={dark} onToggle={toggle} />;
}
