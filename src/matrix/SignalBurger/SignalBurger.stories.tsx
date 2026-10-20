import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { ThemePair } from '../../../.storybook/ThemePair';
import { withMatrix } from '../../../.storybook/withMatrix';
import { SignalBurger } from './SignalBurger';

function Burger() {
  const [open, setOpen] = useState(false);
  return <SignalBurger open={open} onToggle={() => setOpen(!open)} />;
}

const meta = {
  title: 'Matrix/SignalBurger',
  component: SignalBurger,
  decorators: [withMatrix],
  args: { open: false, onToggle: () => {} },
} satisfies Meta<typeof SignalBurger>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { render: () => <Burger /> };

export const Open: Story = { args: { open: true } };

export const Themes: Story = {
  render: () => <ThemePair>{() => <Burger />}</ThemePair>,
};
