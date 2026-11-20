import { ElasticTabs } from '@driif/motiv';
import { useState } from 'react';

const tabs = [
  { value: 'overview', label: 'Overview' },
  { value: 'activity', label: 'Activity' },
  { value: 'settings', label: 'Settings' },
];

const panels = {
  overview: 'Twelve deploys this week, two rolled back.',
  activity: 'Mira merged #482 an hour ago. '.repeat(30),
  settings: 'Release notes go to the #releases channel.',
};

export function ElasticTabsDemo() {
  const [tab, setTab] = useState('overview');
  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '24rem', height: '12rem' }}>
      <ElasticTabs label="Project" tabs={tabs} value={tab} onChange={setTab} panels={panels} fill />
    </div>
  );
}
