import { GlitchThemeToggle } from '@driif/motiv/matrix';
import { useTheme } from '../../useTheme';

export function GlitchThemeToggleDemo() {
  const { dark, toggle } = useTheme();
  return <GlitchThemeToggle dark={dark} onToggle={toggle} />;
}
