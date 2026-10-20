import { MuteToggle } from '@driif/motiv';
import { useState } from 'react';

export function MuteToggleDemo() {
  const [muted, setMuted] = useState(false);
  return <MuteToggle muted={muted} onChange={setMuted} />;
}
