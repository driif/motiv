import { CommandMenu } from '@driif/motiv/drawn';
import { useState } from 'react';

export function CommandMenuDemo() {
  const [last, setLast] = useState('nothing yet');
  const commands = [
    { id: 'new', label: 'New project', shortcut: 'N', onSelect: () => setLast('New project') },
    {
      id: 'invite',
      label: 'Invite people',
      shortcut: 'I',
      onSelect: () => setLast('Invite people'),
    },
    { id: 'settings', label: 'Settings', onSelect: () => setLast('Settings') },
  ];
  return (
    <div
      style={{
        display: 'grid',
        alignContent: 'start',
        gap: '0.75rem',
        width: '20rem',
        minHeight: '15rem',
      }}
    >
      <CommandMenu commands={commands} hotkey />
      <span>Last command: {last}</span>
    </div>
  );
}
