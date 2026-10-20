import { RadialMenu } from '@driif/motiv';
import { useState } from 'react';

const icon = (d: string) => (
  <svg
    aria-hidden="true"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.65"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d={d} />
  </svg>
);

export function RadialMenuDemo() {
  const [last, setLast] = useState('nothing yet');
  const actions = [
    { id: 'note', label: 'Note', icon: icon('M5 19h14M7 15l9-9 2 2-9 9H7z') },
    { id: 'task', label: 'Task', icon: icon('M5 12.5l4.5 4.5L19 7.5') },
    { id: 'event', label: 'Event', icon: icon('M5 6h14v13H5zM5 10h14M9 3v4M15 3v4') },
  ].map((action) => ({ ...action, onSelect: () => setLast(action.label) }));
  return (
    <>
      <RadialMenu actions={actions} label="Create" />
      <p>Created: {last}</p>
    </>
  );
}
