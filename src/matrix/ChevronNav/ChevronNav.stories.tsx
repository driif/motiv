import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { ThemePair } from '../../../.storybook/ThemePair';
import { withMatrix } from '../../../.storybook/withMatrix';
import { ChevronNav, type ChevronNavSection } from './ChevronNav';

function Icon({ d }: { d: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} aria-hidden="true">
      <path d={d} strokeLinecap="square" />
    </svg>
  );
}

const sections: ChevronNavSection[] = [
  {
    title: 'Vault',
    items: [
      {
        id: 'secrets',
        label: 'Secrets',
        icon: <Icon d="M6 10V7a6 6 0 0 1 12 0v3M5 10h14v10H5z" />,
        expandable: true,
      },
      {
        id: 'policies',
        label: 'Policies',
        icon: <Icon d="M12 3l8 3v6c0 5-4 8-8 9-4-1-8-4-8-9V6z" />,
      },
      {
        id: 'audit',
        label: 'Audit log',
        icon: <Icon d="M5 4h14v16H5zM9 9h6M9 13h6" />,
        expandable: true,
      },
    ],
  },
  {
    title: 'System',
    items: [{ id: 'settings', label: 'Settings', icon: <Icon d="M4 7h16M4 12h16M4 17h16" /> }],
  },
];

function Nav() {
  const [value, setValue] = useState('secrets');
  return (
    <div style={{ width: '18rem' }}>
      <ChevronNav label="Main" sections={sections} value={value} onChange={setValue} />
    </div>
  );
}

const meta = {
  title: 'Matrix/ChevronNav',
  component: ChevronNav,
  decorators: [withMatrix],
  args: { label: 'Main', sections, value: 'secrets', onChange: () => {} },
} satisfies Meta<typeof ChevronNav>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { render: () => <Nav /> };

export const Themes: Story = {
  render: () => <ThemePair>{() => <Nav />}</ThemePair>,
};
