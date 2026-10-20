import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { ThemePair } from '../../../.storybook/ThemePair';
import { Button } from '../Button';
import { BellButton } from './BellButton';

function Demo() {
  const [count, setCount] = useState(2);
  return (
    <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
      <BellButton count={count} onClick={() => setCount(0)} />
      <Button size="sm" variant="outline" onClick={() => setCount(count + 1)}>
        Notify
      </Button>
    </div>
  );
}

const meta = {
  title: 'Components/BellButton',
  component: BellButton,
  args: { count: 3 },
  render: () => <Demo />,
} satisfies Meta<typeof BellButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Overflow: Story = { args: { count: 140 }, render: (args) => <BellButton {...args} /> };

export const Themes: Story = { render: () => <ThemePair>{() => <Demo />}</ThemePair> };
