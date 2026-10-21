import { Switch } from '@driif/motiv/drawn';
import { useState } from 'react';

export function SwitchDemo() {
  const [wifi, setWifi] = useState(true);
  const [sync, setSync] = useState(false);
  return (
    <>
      <Switch checked={wifi} onChange={setWifi} label="Wi-Fi" />
      <Switch checked={sync} onChange={setSync} label="Sync over cellular" />
    </>
  );
}
