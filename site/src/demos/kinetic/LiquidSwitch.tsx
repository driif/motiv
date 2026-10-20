import { LiquidSwitch } from '@driif/motiv';
import { useState } from 'react';

export function LiquidSwitchDemo() {
  const [wifi, setWifi] = useState(true);
  const [sync, setSync] = useState(false);
  return (
    <>
      <LiquidSwitch checked={wifi} onChange={setWifi} label="Wi-Fi" />
      <LiquidSwitch checked={sync} onChange={setSync} label="Sync over cellular" />
    </>
  );
}
