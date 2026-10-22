import type { TabsProps } from '../../drawn/Tabs';
import { HudTabs } from '../HudTabs';

export function Tabs({ items, ...props }: TabsProps) {
  return (
    <HudTabs
      {...props}
      tabs={items.map(({ value, label }) => ({ value, label }))}
      panels={Object.fromEntries(items.map((item) => [item.value, item.panel]))}
    />
  );
}
