import { Chips } from '@driif/motiv/matrix';
import { useState } from 'react';

const statuses = [
  { value: 'open', label: 'Open' },
  { value: 'review', label: 'In review' },
  { value: 'blocked', label: 'Blocked' },
  { value: 'done', label: 'Done' },
];

export function ChipsDemo() {
  const [status, setStatus] = useState(['open', 'review']);
  return <Chips label="Status" options={statuses} value={status} onChange={setStatus} />;
}
