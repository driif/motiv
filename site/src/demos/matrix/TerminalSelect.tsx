import { TerminalSelect } from '@driif/motiv/matrix';
import { useState } from 'react';

const methods = [
  { value: 'token', label: 'Token', code: 'TOKEN', hint: 'Paste a vault token.' },
  { value: 'oidc', label: 'OIDC', code: 'OIDC', hint: 'Sign in with your identity provider.' },
  { value: 'ldap', label: 'LDAP', code: 'LDAP', hint: 'Use your directory credentials.' },
  { value: 'userpass', label: 'Username', code: 'USERPASS', hint: 'Username and password.' },
];

export function TerminalSelectDemo() {
  const [method, setMethod] = useState('oidc');
  return (
    <TerminalSelect
      label="Auth method"
      prefix="auth://"
      options={methods}
      value={method}
      onChange={setMethod}
    />
  );
}
