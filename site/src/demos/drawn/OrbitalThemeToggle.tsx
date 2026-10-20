import { OrbitalThemeToggle } from '@driif/motiv/drawn';
import { useTheme } from '../../useTheme';

export function OrbitalThemeToggleDemo() {
  const { dark, toggle } = useTheme();
  return <OrbitalThemeToggle dark={dark} onToggle={toggle} />;
}
