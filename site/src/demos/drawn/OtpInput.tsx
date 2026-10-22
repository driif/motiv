import { OtpInput } from '@driif/motiv/drawn';
import { useState } from 'react';

export function OtpInputDemo() {
  const [code, setCode] = useState('');
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  return (
    <OtpInput
      label="Enter the code we sent you (try 123456)"
      value={code}
      onChange={(next) => {
        setCode(next);
        setStatus('idle');
      }}
      onComplete={(full) => setStatus(full === '123456' ? 'success' : 'error')}
      status={status}
    />
  );
}
