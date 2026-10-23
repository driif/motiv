import { GlideNav } from '@driif/motiv';
import { useState } from 'react';

const items = [
  { id: 'inbox', label: 'Inbox', count: 4, href: '#inbox' },
  { id: 'drafts', label: 'Drafts', count: 1, href: '#drafts' },
  { id: 'sent', label: 'Sent', href: '#sent' },
  { id: 'archive', label: 'Archive', href: '#archive' },
];

export function GlideNavDemo() {
  const [page, setPage] = useState('inbox');
  return (
    <GlideNav
      label="Mail"
      items={items}
      value={page}
      onChange={(id, event) => {
        event?.preventDefault();
        setPage(id);
      }}
    />
  );
}
