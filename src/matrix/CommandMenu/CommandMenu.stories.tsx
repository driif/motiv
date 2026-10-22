import type { Meta, StoryObj } from '@storybook/react-vite';
import { ThemePair } from '../../../.storybook/ThemePair';
import { withMatrix } from '../../../.storybook/withMatrix';
import { CommandMenu } from './CommandMenu';

const commands = [
  { id: 'new', label: 'New project', shortcut: 'N', onSelect: () => {} },
  { id: 'invite', label: 'Invite people', shortcut: 'I', onSelect: () => {} },
  { id: 'settings', label: 'Settings', onSelect: () => {} },
];

const meta = {
  title: 'Matrix/CommandMenu',
  component: CommandMenu,
  decorators: [withMatrix],
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

export const Themes: Story = {
  render: () => <ThemePair>{() => <CommandMenu commands={commands} />}</ThemePair>,
};
