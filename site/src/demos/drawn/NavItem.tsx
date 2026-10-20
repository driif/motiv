import { NavItem } from '@driif/motiv/drawn';

function Icon({ d }: { d: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} aria-hidden="true">
      <path d={d} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function NavItemDemo() {
  return (
    <nav aria-label="Demo" style={{ display: 'grid', gap: 4, width: 240 }}>
      <NavItem
        href="#nav-item"
        icon={<Icon d="M4 11l8-7 8 7v9h-5v-6H9v6H4z" />}
        label="Home"
        active
      />
      <NavItem href="#nav-item" icon={<Icon d="M4 6h16v12H4zM4 6l8 7 8-7" />} label="Inbox" />
      <NavItem icon={<Icon d="M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8z" />} label="Settings" hasSubmenu />
    </nav>
  );
}
