import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { ThemePair } from '../../../.storybook/ThemePair';
import { withMatrix } from '../../../.storybook/withMatrix';
import { Slider } from './Slider';

function Demo() {
  const [value, setValue] = useState(40);
  return (
    <Slider
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
  title: 'Matrix/Slider',
  component: Slider,
  decorators: [withMatrix],
  args: { value: 40, onChange: () => {}, label: 'Budget' },
  render: () => <Demo />,
} satisfies Meta<typeof Slider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Plain: Story = { render: (args) => <Slider {...args} /> };

export const Disabled: Story = { render: (args) => <Slider {...args} disabled /> };

export const Themes: Story = { render: () => <ThemePair>{() => <Demo />}</ThemePair> };
