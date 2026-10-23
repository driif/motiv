import type { Meta, StoryObj } from '@storybook/react-vite';
import { type CSSProperties, useState } from 'react';
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

const links = items.map((item) => ({ ...item, href: `#${item.id}` }));

function LinksDemo({ style }: { style?: CSSProperties }) {
  const [value, setValue] = useState('inbox');
  return (
    <GlideNav
      items={links}
      value={value}
      onChange={(id, event) => {
        event?.preventDefault();
        setValue(id);
      }}
      label="Mail"
      style={style}
    />
  );
}

const flat = {
  '--motiv-nav-bg': 'transparent',
  '--motiv-nav-border-color': 'transparent',
  maxWidth: 'none',
} as CSSProperties;

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

export const Links: Story = {
  render: () => <LinksDemo />,
};

export const FlatInSidebar: Story = {
  render: () => (
    <aside
      style={{
        width: 240,
        padding: 8,
        background: 'var(--motiv-color-surface)',
        borderRight: '1px solid var(--motiv-color-border)',
      }}
    >
      <LinksDemo style={flat} />
    </aside>
  ),
};
