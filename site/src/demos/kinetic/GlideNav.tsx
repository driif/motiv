import { GlideNav } from '@driif/motiv';
import { useState } from 'react';

const items = [
  { id: 'inbox', label: 'Inbox', count: 4 },
  { id: 'drafts', label: 'Drafts', count: 1 },
  { id: 'sent', label: 'Sent' },
  { id: 'archive', label: 'Archive' },
];

export function GlideNavDemo() {
  const [page, setPage] = useState('inbox');
  return <GlideNav label="Mail" items={items} value={page} onChange={setPage} />;
}
