import { Tabs } from '@driif/motiv';
import { useState } from 'react';

const items = [
  { value: 'overview', label: 'Overview', panel: 'A quick look at everything.' },
  { value: 'activity', label: 'Activity', panel: 'What happened recently.' },
  { value: 'settings', label: 'Settings', panel: 'Tune it to taste.' },
];

export function TabsDemo() {
  const [tab, setTab] = useState('overview');
  return <Tabs label="Sections" items={items} value={tab} onChange={setTab} />;
}
