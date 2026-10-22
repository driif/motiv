import type { TabsProps } from '../../drawn/Tabs';
import { ElasticTabs } from '../ElasticTabs';

export function Tabs({ items, ...props }: TabsProps) {
  return (
    <ElasticTabs
      {...props}
      tabs={items.map(({ value, label }) => ({ value, label }))}
      panels={Object.fromEntries(items.map((item) => [item.value, item.panel]))}
    />
  );
}
