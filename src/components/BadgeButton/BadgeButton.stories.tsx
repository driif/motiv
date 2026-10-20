import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { ThemePair } from '../../../.storybook/ThemePair';
import { Button } from '../Button';
import { BadgeButton } from './BadgeButton';

function Demo() {
  const [count, setCount] = useState(3);
  return (
    <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
      <BadgeButton count={count} label="Inbox" onClick={() => setCount(0)} />
      <Button size="sm" variant="outline" onClick={() => setCount(count + 1)}>
        New mail
      </Button>
    </div>
  );
}

const meta = {
  title: 'Components/BadgeButton',
  component: BadgeButton,
  args: { count: 3, label: 'Inbox' },
  render: () => <Demo />,
} satisfies Meta<typeof BadgeButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Overflow: Story = {
  args: { count: 120 },
  render: (args) => <BadgeButton {...args} />,
};

export const Themes: Story = { render: () => <ThemePair>{() => <Demo />}</ThemePair> };
