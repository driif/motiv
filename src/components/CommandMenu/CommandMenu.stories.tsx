import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { ThemePair } from '../../../.storybook/ThemePair';
import { CommandMenu } from './CommandMenu';

const commands = [
  { id: 'new', label: 'New project', shortcut: 'N', onSelect: () => {} },
  { id: 'invite', label: 'Invite people', shortcut: 'I', onSelect: () => {} },
  { id: 'settings', label: 'Settings', onSelect: () => {} },
];

const meta = {
  title: 'Components/CommandMenu',
  component: CommandMenu,
  args: { commands },
  render: (args) => (
    <div style={{ minHeight: '14rem' }}>
      <CommandMenu {...args} />
    </div>
  ),
} satisfies Meta<typeof CommandMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithHotkey: Story = { args: { hotkey: true } };

function ControlledDemo() {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ minHeight: '14rem' }}>
      <button type="button" onClick={() => setOpen(true)}>
        Open from outside
      </button>
      <CommandMenu commands={commands} open={open} onOpenChange={setOpen} />
    </div>
  );
}

export const Controlled: Story = {
  render: () => <ControlledDemo />,
  parameters: {
    docs: {
      description: {
        story:
          'Every controlled opening, by pointer or from outside, focuses the first command. Uncontrolled pointer opens leave focus on the launcher.',
      },
    },
  },
};

export const Themes: Story = {
  render: () => <ThemePair>{() => <CommandMenu commands={commands} />}</ThemePair>,
};
