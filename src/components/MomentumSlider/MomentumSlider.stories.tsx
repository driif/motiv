import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { ThemePair } from '../../../.storybook/ThemePair';
import { MomentumSlider } from './MomentumSlider';

function Demo() {
  const [value, setValue] = useState(40);
  return (
    <MomentumSlider
      value={value}
      onChange={setValue}
      label="Monthly budget"
      max={200}
      step={5}
      format={(v) => `€${v}`}
      marks={[0, 100, 200]}
    />
  );
}

const meta = {
  title: 'Components/MomentumSlider',
  component: MomentumSlider,
  args: { value: 40, onChange: () => {}, label: 'Budget' },
  render: () => <Demo />,
} satisfies Meta<typeof MomentumSlider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Plain: Story = { render: (args) => <MomentumSlider {...args} /> };

export const Themes: Story = { render: () => <ThemePair>{() => <Demo />}</ThemePair> };
