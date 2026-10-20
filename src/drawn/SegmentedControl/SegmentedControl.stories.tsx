import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { ThemePair } from '../../../.storybook/ThemePair';
import { withDrawn } from '../../../.storybook/withDrawn';
import { SegmentedControl } from './SegmentedControl';

const options = [
  { value: 'day', label: 'Day' },
  { value: 'week', label: 'Week' },
  { value: 'month', label: 'Month' },
];

function Demo() {
  const [value, setValue] = useState('day');
  return <SegmentedControl label="Range" options={options} value={value} onChange={setValue} />;
}

const meta = {
  title: 'Drawn/SegmentedControl',
  component: SegmentedControl,
  decorators: [withDrawn],
  args: { label: 'Range', options, value: 'day', onChange: () => {} },
  render: () => <Demo />,
} satisfies Meta<typeof SegmentedControl>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Themes: Story = {
  render: () => <ThemePair>{() => <Demo />}</ThemePair>,
};
