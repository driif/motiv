import { DecodeSecretField } from '@driif/motiv/matrix';
import { useState } from 'react';

export function DecodeSecretFieldDemo() {
  const [token, setToken] = useState('hvs.CAESIJ3x9QmZkT2pL');
  return <DecodeSecretField label="Root token" value={token} onChange={setToken} />;
}
