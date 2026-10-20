import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { ThemePair } from '../../../.storybook/ThemePair';
import { FrequencySlider } from './FrequencySlider';

function Demo({ initial = 60 }: { initial?: number }) {
  const [value, setValue] = useState(initial);
  return <FrequencySlider value={value} onChange={setValue} label="Volume" />;
}

const meta = {
  title: 'Components/FrequencySlider',
  component: FrequencySlider,
  args: { value: 60, onChange: () => {}, label: 'Volume' },
  render: () => <Demo />,
} satisfies Meta<typeof FrequencySlider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

function Pitch() {
  const [hz, setHz] = useState(440);
  return (
    <FrequencySlider
      value={hz}
      onChange={setHz}
      label="Pitch"
      min={20}
      max={2000}
      step={10}
      format={(v) => `${v} Hz`}
    />
  );
}

export const CustomFormat: Story = { render: () => <Pitch /> };

export const Disabled: Story = {
  args: { disabled: true },
  render: (args) => <FrequencySlider {...args} />,
};

export const Themes: Story = { render: () => <ThemePair>{() => <Demo />}</ThemePair> };
