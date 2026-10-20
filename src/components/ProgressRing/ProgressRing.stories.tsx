import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { ThemePair } from '../../../.storybook/ThemePair';
import { ProgressRing } from './ProgressRing';

function Demo() {
  const [value, setValue] = useState(35);
  return (
    <div style={{ display: 'grid', gap: '1rem', justifyItems: 'start' }}>
      <ProgressRing value={value} label="Upload" />
      <button type="button" onClick={() => setValue(value >= 100 ? 0 : Math.min(100, value + 25))}>
        Advance
      </button>
    </div>
  );
}

const meta = {
  title: 'Components/ProgressRing',
  component: ProgressRing,
  args: { value: 35, label: 'Upload' },
} satisfies Meta<typeof ProgressRing>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Interactive: Story = { render: () => <Demo /> };

export const Done: Story = { args: { value: 100 } };

export const Small: Story = { args: { size: 64 } };

export const Themes: Story = {
  render: (args) => <ThemePair>{() => <ProgressRing {...args} />}</ThemePair>,
};
