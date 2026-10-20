import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { ThemePair } from '../../../.storybook/ThemePair';
import { OtpInput } from './OtpInput';

function Demo() {
  const [code, setCode] = useState('');
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  return (
    <OtpInput
      value={code}
      onChange={(next) => {
        setCode(next);
        setStatus('idle');
      }}
      onComplete={(full) => setStatus(full === '123456' ? 'success' : 'error')}
      status={status}
      label="Enter the code we sent (try 123456)"
    />
  );
}

const meta = {
  title: 'Components/OtpInput',
  component: OtpInput,
  args: { value: '', onChange: () => {}, label: 'Code' },
  render: () => <Demo />,
} satisfies Meta<typeof OtpInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Success: Story = {
  args: { value: '123456', status: 'success' },
  render: (args) => <OtpInput {...args} />,
};

export const Disabled: Story = {
  args: { disabled: true },
  render: (args) => <OtpInput {...args} />,
};

export const Themes: Story = { render: () => <ThemePair>{() => <Demo />}</ThemePair> };
