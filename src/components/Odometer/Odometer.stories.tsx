import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { ThemePair } from '../../../.storybook/ThemePair';
import { Button } from '../Button';
import { Odometer } from './Odometer';

function Demo() {
  const [value, setValue] = useState(128);
  return (
    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', fontSize: '2rem' }}>
      <Odometer value={value} minDigits={4} dimLeadingZeros />
      <Button size="sm" onClick={() => setValue(value + 7)}>
        Add 7
      </Button>
    </div>
  );
}

const meta = {
  title: 'Components/Odometer',
  component: Odometer,
  args: { value: 42 },
  render: () => <Demo />,
} satisfies Meta<typeof Odometer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Static: Story = {
  args: { value: 7, minDigits: 3, dimLeadingZeros: true },
  render: (args) => <Odometer {...args} />,
};

export const Themes: Story = { render: () => <ThemePair>{() => <Demo />}</ThemePair> };
