import { FilterChips } from '@driif/motiv';
import { useState } from 'react';

const statuses = [
  { value: 'open', label: 'Open' },
  { value: 'review', label: 'In review' },
  { value: 'blocked', label: 'Blocked' },
  { value: 'done', label: 'Done' },
];

export function FilterChipsDemo() {
  const [status, setStatus] = useState(['open', 'review']);
  return <FilterChips label="Status" options={statuses} value={status} onChange={setStatus} />;
}
