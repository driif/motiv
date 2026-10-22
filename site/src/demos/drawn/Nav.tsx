import { Nav } from '@driif/motiv/drawn';
import { useState } from 'react';

function Icon({ d }: { d: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} aria-hidden="true">
      <path d={d} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const items = [
  { id: 'inbox', label: 'Inbox', icon: <Icon d="M4 6h16v12H4zM4 6l8 7 8-7" />, count: 4 },
  { id: 'drafts', label: 'Drafts', icon: <Icon d="M5 19l4-1 10-10-3-3L6 15z" />, count: 1 },
  { id: 'archive', label: 'Archive', icon: <Icon d="M4 5h16v4H4zM6 9v10h12V9M10 13h4" /> },
];

export function NavDemo() {
  const [page, setPage] = useState('inbox');
  return (
    <div style={{ width: 240 }}>
      <Nav label="Mail" items={items} value={page} onChange={setPage} />
    </div>
  );
}
