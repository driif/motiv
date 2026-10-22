import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { ThemePair } from '../../../.storybook/ThemePair';
import { withMatrix } from '../../../.storybook/withMatrix';
import { Stepper } from './Stepper';

function Demo() {
  const [value, setValue] = useState(2);
  return <Stepper label="Guests" value={value} onChange={setValue} min={1} max={12} />;
}

const meta = {
  title: 'Matrix/Stepper',
  component: Stepper,
  decorators: [withMatrix],
  args: { label: 'Guests', value: 2, onChange: () => {} },
  render: () => <Demo />,
} satisfies Meta<typeof Stepper>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

function Offset() {
  const [value, setValue] = useState(-0.5);
  return <Stepper label="Offset" value={value} onChange={setValue} min={-20} max={20} step={0.1} />;
}

export const Fractional: Story = { render: () => <Offset /> };

export const Themes: Story = {
  render: () => <ThemePair>{() => <Demo />}</ThemePair>,
};
