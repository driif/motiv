import { Nav } from '@driif/motiv/matrix';
import { useState } from 'react';

const items = [
  { id: 'secrets', label: 'Secrets', count: 12 },
  { id: 'policies', label: 'Policies', count: 4 },
  { id: 'audit', label: 'Audit log' },
];

export function NavDemo() {
  const [page, setPage] = useState('secrets');
  return (
    <div style={{ width: '18rem' }}>
      <Nav label="Vault" items={items} value={page} onChange={setPage} />
    </div>
  );
}
