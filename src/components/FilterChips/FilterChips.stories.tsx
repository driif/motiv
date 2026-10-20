import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { ThemePair } from '../../../.storybook/ThemePair';
import { FilterChips } from './FilterChips';

const options = [
  { value: 'open', label: 'Open' },
  { value: 'review', label: 'In review' },
  { value: 'blocked', label: 'Blocked' },
  { value: 'done', label: 'Done' },
];

function Demo({ showSummary }: { showSummary?: boolean }) {
  const [value, setValue] = useState(['open']);
  return (
    <FilterChips
      label="Status"
      options={options}
      value={value}
      onChange={setValue}
      showSummary={showSummary}
    />
  );
}

const meta = {
  title: 'Components/FilterChips',
  component: FilterChips,
  args: { label: 'Status', options, value: [], onChange: () => {} },
  render: () => <Demo />,
} satisfies Meta<typeof FilterChips>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithoutSummary: Story = { render: () => <Demo showSummary={false} /> };

export const Themes: Story = {
  render: () => <ThemePair>{() => <Demo />}</ThemePair>,
};
