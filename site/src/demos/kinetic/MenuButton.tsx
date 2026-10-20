import { MenuButton } from '@driif/motiv';
import { useState } from 'react';

export function MenuButtonDemo() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <MenuButton open={open} onToggle={() => setOpen(!open)} aria-controls="demo-nav" />
      <nav id="demo-nav" hidden={!open} aria-label="Main">
        Projects · Reports · Settings
      </nav>
    </>
  );
}
