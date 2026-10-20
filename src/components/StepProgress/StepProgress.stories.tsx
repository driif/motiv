import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { ThemePair } from '../../../.storybook/ThemePair';
import { StepProgress } from './StepProgress';

const steps = [
  { id: 'cart', label: 'Cart', description: 'Check what you are ordering.' },
  { id: 'ship', label: 'Shipping', description: 'Tell us where it should go.' },
  { id: 'pay', label: 'Payment', description: 'Card, invoice or bank transfer.' },
  { id: 'review', label: 'Review', description: 'One last look before you order.' },
];

function Demo() {
  const [current, setCurrent] = useState(1);
  const completed = current >= steps.length;
  return (
    <div style={{ display: 'grid', gap: '1rem' }}>
      <StepProgress
        steps={steps}
        current={current}
        completed={completed}
        completedText="Ordered."
      />
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <button type="button" onClick={() => setCurrent(Math.max(0, current - 1))}>
          Back
        </button>
        <button type="button" onClick={() => setCurrent(Math.min(steps.length, current + 1))}>
          Next
        </button>
      </div>
    </div>
  );
}

const meta = {
  title: 'Components/StepProgress',
  component: StepProgress,
  args: { steps, current: 1 },
} satisfies Meta<typeof StepProgress>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Interactive: Story = { render: () => <Demo /> };

export const Completed: Story = { args: { completed: true, completedText: 'Ordered.' } };

export const Themes: Story = {
  render: (args) => <ThemePair>{() => <StepProgress {...args} />}</ThemePair>,
};
