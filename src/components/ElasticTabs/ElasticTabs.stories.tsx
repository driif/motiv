import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { ThemePair } from '../../../.storybook/ThemePair';
import { ElasticTabs } from './ElasticTabs';

const tabs = [
  { value: 'overview', label: 'Overview' },
  { value: 'activity', label: 'Activity' },
  { value: 'settings', label: 'Settings' },
];
const panels = {
  overview: 'Twelve deploys this week, two rolled back.',
  activity: 'Mira merged #482 an hour ago.',
  settings: 'Notifications go to the #releases channel.',
};

function Demo({ withPanels = true }: { withPanels?: boolean }) {
  const [value, setValue] = useState('overview');
  return (
    <ElasticTabs
      label="Project"
      tabs={tabs}
      value={value}
      onChange={setValue}
      panels={withPanels ? panels : undefined}
      style={{ maxWidth: '24rem' }}
    />
  );
}

const meta = {
  title: 'Components/ElasticTabs',
  component: ElasticTabs,
  args: { label: 'Project', tabs, value: 'overview', onChange: () => {} },
  render: () => <Demo />,
} satisfies Meta<typeof ElasticTabs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const TabsOnly: Story = { render: () => <Demo withPanels={false} /> };

function FillDemo() {
  const [value, setValue] = useState('overview');
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '16rem', maxWidth: '24rem' }}>
      <ElasticTabs
        label="Project"
        tabs={tabs}
        value={value}
        onChange={setValue}
        panels={{
          ...panels,
          activity: Array.from({ length: 30 }, (_, i) => `Event ${i + 1}`).map((line) => (
            <p key={line}>{line}</p>
          )),
        }}
        fill
      />
    </div>
  );
}

export const Fill: Story = { render: () => <FillDemo /> };

export const Themes: Story = {
  render: () => <ThemePair>{() => <Demo />}</ThemePair>,
};
