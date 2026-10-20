import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { ThemePair } from '../../../.storybook/ThemePair';
import { LiquidSwitch } from './LiquidSwitch';

function Demo({ initial = false }: { initial?: boolean }) {
  const [checked, setChecked] = useState(initial);
  return <LiquidSwitch checked={checked} onChange={setChecked} label="Wi-Fi" />;
}

const meta = {
  title: 'Components/LiquidSwitch',
  component: LiquidSwitch,
  args: { checked: false, onChange: () => {}, label: 'Wi-Fi' },
  render: () => <Demo />,
} satisfies Meta<typeof LiquidSwitch>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const On: Story = { render: () => <Demo initial /> };

export const Disabled: Story = {
  args: { disabled: true },
  render: (args) => <LiquidSwitch {...args} />,
};

export const Themes: Story = {
  render: () => <ThemePair>{() => <Demo />}</ThemePair>,
};
