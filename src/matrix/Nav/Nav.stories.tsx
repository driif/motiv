import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { ThemePair } from '../../../.storybook/ThemePair';
import { withMatrix } from '../../../.storybook/withMatrix';
import { Nav } from './Nav';

const items = [
  { id: 'inbox', label: 'Inbox', count: 4 },
  { id: 'drafts', label: 'Drafts', count: 1 },
  { id: 'sent', label: 'Sent' },
  { id: 'archive', label: 'Archive' },
];

function Demo() {
  const [value, setValue] = useState('inbox');
  return <Nav items={items} value={value} onChange={setValue} label="Mail" />;
}

const meta = {
  title: 'Matrix/Nav',
  component: Nav,
  decorators: [withMatrix],
  args: { items, value: 'inbox', onChange: () => {}, label: 'Mail' },
  render: () => <Demo />,
} satisfies Meta<typeof Nav>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Themes: Story = {
  render: () => <ThemePair>{() => <Demo />}</ThemePair>,
};
