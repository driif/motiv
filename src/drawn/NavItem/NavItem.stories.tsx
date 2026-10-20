import type { Meta, StoryObj } from '@storybook/react-vite';
import { ThemePair } from '../../../.storybook/ThemePair';
import { withDrawn } from '../../../.storybook/withDrawn';
import { NavItem } from './NavItem';

function Icon({ d }: { d: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} aria-hidden="true">
      <path d={d} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const home = <Icon d="M4 11l8-7 8 7v9h-5v-6H9v6H4z" />;

function Nav() {
  return (
    <nav style={{ display: 'grid', gap: 4, width: 240 }}>
      <NavItem href="#home" icon={home} label="Home" active />
      <NavItem href="#inbox" icon={<Icon d="M4 6h16v12H4zM4 6l8 7 8-7" />} label="Inbox" />
      <NavItem icon={<Icon d="M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8z" />} label="Settings" hasSubmenu />
    </nav>
  );
}

const meta = {
  title: 'Drawn/NavItem',
  component: NavItem,
  decorators: [withDrawn],
  args: { href: '#home', icon: home, label: 'Home' },
} satisfies Meta<typeof NavItem>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Active: Story = { args: { active: true } };

export const Menu: Story = { render: () => <Nav /> };

export const Themes: Story = {
  render: () => <ThemePair>{() => <Nav />}</ThemePair>,
};
