import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { ThemePair } from '../../../.storybook/ThemePair';
import { withDrawn } from '../../../.storybook/withDrawn';
import { Stepper } from './Stepper';

function Demo() {
  const [value, setValue] = useState(2);
  return <Stepper label="Guests" value={value} onChange={setValue} min={1} max={12} />;
}

const meta = {
  title: 'Drawn/Stepper',
  component: Stepper,
  decorators: [withDrawn],
  args: { label: 'Guests', value: 2, onChange: () => {} },
  render: () => <Demo />,
} satisfies Meta<typeof Stepper>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Themes: Story = {
  render: () => <ThemePair>{() => <Demo />}</ThemePair>,
};
