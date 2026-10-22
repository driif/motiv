import { MenuButton } from '@driif/motiv/matrix';
import { useState } from 'react';

export function MenuButtonDemo() {
  const [open, setOpen] = useState(false);
  return <MenuButton open={open} onToggle={() => setOpen(!open)} />;
}
