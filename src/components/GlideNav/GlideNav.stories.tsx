import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { ThemePair } from '../../../.storybook/ThemePair';
import { GlideNav } from './GlideNav';

const items = [
  { id: 'inbox', label: 'Inbox', count: 4 },
  { id: 'drafts', label: 'Drafts', count: 1 },
  { id: 'sent', label: 'Sent' },
  { id: 'archive', label: 'Archive' },
];

function Demo() {
  const [value, setValue] = useState('inbox');
  return <GlideNav items={items} value={value} onChange={setValue} label="Mail" />;
}

const meta = {
  title: 'Components/GlideNav',
  component: GlideNav,
  args: { items, value: 'inbox', onChange: () => {}, label: 'Mail' },
  render: () => <Demo />,
} satisfies Meta<typeof GlideNav>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Themes: Story = {
  render: () => <ThemePair>{() => <Demo />}</ThemePair>,
};
