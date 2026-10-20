import { SignalBurger } from '@driif/motiv/matrix';
import { useState } from 'react';

export function SignalBurgerDemo() {
  const [open, setOpen] = useState(false);
  return <SignalBurger open={open} onToggle={() => setOpen(!open)} />;
}
