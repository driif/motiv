import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { ThemePair } from '../../../.storybook/ThemePair';
import { withDrawn } from '../../../.storybook/withDrawn';
import { SegmentedControl } from './SegmentedControl';

const options = [
  { value: 'day', label: 'Day', hint: 'Last 24 hours' },
  { value: 'week', label: 'Week', hint: 'Last 7 days' },
  { value: 'month', label: 'Month', hint: 'Last 30 days' },
];

function Demo({ hints = true }: { hints?: boolean }) {
  const [value, setValue] = useState('day');
  return (
    <SegmentedControl
      label="Range"
      options={hints ? options : options.map(({ hint: _, ...option }) => option)}
      value={value}
      onChange={setValue}
    />
  );
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

export const WithoutHints: Story = { render: () => <Demo hints={false} /> };

export const Themes: Story = {
  render: () => <ThemePair>{() => <Demo />}</ThemePair>,
};
