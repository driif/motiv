import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { ThemePair } from '../../../.storybook/ThemePair';
import { withDrawn } from '../../../.storybook/withDrawn';
import { Radio, RadioGroup } from '.';

const meta = {
  title: 'Drawn/Radio',
  component: Radio,
  decorators: [withDrawn],
  args: { label: 'Tea', name: 'single' },
} satisfies Meta<typeof Radio>;

export default meta;
type Story = StoryObj<typeof meta>;

const options = [
  { value: 'tea', label: 'Tea' },
  { value: 'coffee', label: 'Coffee' },
  { value: 'water', label: 'Water' },
];

function Group({ name }: { name: string }) {
  const [value, setValue] = useState('tea');
  return (
    <RadioGroup name={name} legend="Drink" options={options} value={value} onChange={setValue} />
  );
}

export const Default: Story = {};

export const InGroup: Story = { name: 'RadioGroup', render: () => <Group name="drink" /> };

export const Disabled: Story = { args: { disabled: true, defaultChecked: true } };

export const Themes: Story = {
  render: () => <ThemePair>{(theme) => <Group name={`drink-${theme}`} />}</ThemePair>,
};
