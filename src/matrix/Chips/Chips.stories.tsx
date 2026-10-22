import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { ThemePair } from '../../../.storybook/ThemePair';
import { withMatrix } from '../../../.storybook/withMatrix';
import { Chips } from './Chips';

const options = [
  { value: 'open', label: 'Open' },
  { value: 'review', label: 'In review' },
  { value: 'blocked', label: 'Blocked' },
  { value: 'done', label: 'Done' },
];

function Demo({ showSummary }: { showSummary?: boolean }) {
  const [value, setValue] = useState(['open']);
  return (
    <Chips
      label="Status"
      options={options}
      value={value}
      onChange={setValue}
      showSummary={showSummary}
    />
  );
}

const meta = {
  title: 'Matrix/Chips',
  component: Chips,
  decorators: [withMatrix],
  args: { label: 'Status', options, value: [], onChange: () => {} },
  render: () => <Demo />,
} satisfies Meta<typeof Chips>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithoutSummary: Story = { render: () => <Demo showSummary={false} /> };

export const Themes: Story = {
  render: () => <ThemePair>{() => <Demo />}</ThemePair>,
};
