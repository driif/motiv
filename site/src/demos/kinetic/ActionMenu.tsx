import { IconButton } from '@driif/motiv';
import { ActionMenu } from '@driif/motiv/action-menu';
import { useState } from 'react';

const more = (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <circle cx="5" cy="12" r="1.6" />
    <circle cx="12" cy="12" r="1.6" />
    <circle cx="19" cy="12" r="1.6" />
  </svg>
);

export function ActionMenuDemo() {
  const [last, setLast] = useState('nothing yet');
  return (
    <div style={{ display: 'grid', alignContent: 'start', gap: '0.75rem', minHeight: '13rem' }}>
      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <ActionMenu
          label="Export"
          variant="outline"
          items={[
            { label: 'CSV', onSelect: () => setLast('CSV') },
            { label: 'XLSX', onSelect: () => setLast('XLSX'), disabled: true },
            { label: 'JSON', onSelect: () => setLast('JSON') },
          ]}
        />
        <ActionMenu label="Export" variant="outline" loading />
        <ActionMenu
          trigger={<IconButton size="sm" icon={more} label="Actions for report.pdf" />}
          items={[
            { label: 'Rename', onSelect: () => setLast('Rename') },
            {
              label: 'Move to',
              submenu: [
                { label: 'Archive', onSelect: () => setLast('Move to Archive') },
                { label: 'Shared', onSelect: () => setLast('Move to Shared') },
              ],
            },
          ]}
        />
      </div>
      <span>Last action: {last}</span>
    </div>
  );
}
