import { Stepper } from '@driif/motiv/matrix';
import { useState } from 'react';

export function StepperDemo() {
  const [guests, setGuests] = useState(2);
  return <Stepper label="Guests" value={guests} onChange={setGuests} min={1} max={12} />;
}
