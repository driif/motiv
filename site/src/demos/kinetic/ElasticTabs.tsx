import { ElasticTabs } from '@driif/motiv';
import { useState } from 'react';

const tabs = [
  { value: 'overview', label: 'Overview' },
  { value: 'activity', label: 'Activity' },
  { value: 'settings', label: 'Settings' },
];

const panels = {
  overview: 'Twelve deploys this week, two rolled back.',
  activity: 'Mira merged #482 an hour ago.',
  settings: 'Release notes go to the #releases channel.',
};

export function ElasticTabsDemo() {
  const [tab, setTab] = useState('overview');
  return (
    <ElasticTabs
      label="Project"
      tabs={tabs}
      value={tab}
      onChange={setTab}
      panels={panels}
      style={{ width: '24rem' }}
    />
  );
}
