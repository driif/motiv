import { Select } from '@driif/motiv/matrix';
import { useState } from 'react';

const methods = [
  { value: 'token', label: 'Token', code: 'TOKEN', hint: 'Paste a vault token.' },
  { value: 'oidc', label: 'OIDC', hint: 'Sign in with your identity provider.' },
  { value: 'ldap', label: 'LDAP', hint: 'Use your directory credentials.' },
];

export function SelectDemo() {
  const [method, setMethod] = useState('');
  return (
    <div style={{ display: 'grid', alignContent: 'start', width: '20rem', minHeight: '15rem' }}>
      <Select label="Auth method" options={methods} value={method} onChange={setMethod} clearable />
    </div>
  );
}
