import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { ThemePair } from '../../../.storybook/ThemePair';
import { Tabs } from './Tabs';

const items = [
  { value: 'overview', label: 'Overview', panel: 'A quick look at everything.' },
  { value: 'activity', label: 'Activity', panel: 'What happened recently.' },
  { value: 'settings', label: 'Settings', panel: 'Tune it to taste.' },
];

function Demo() {
  const [value, setValue] = useState('overview');
  return <Tabs label="Sections" items={items} value={value} onChange={setValue} />;
}

const meta = {
  title: 'Components/Tabs',
  component: Tabs,
  args: { label: 'Sections', items, value: 'overview', onChange: () => {} },
  render: () => <Demo />,
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Themes: Story = {
  render: () => <ThemePair>{() => <Demo />}</ThemePair>,
};
