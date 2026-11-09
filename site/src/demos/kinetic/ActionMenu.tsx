import { ActionMenu } from '@driif/motiv/action-menu';
import { useState } from 'react';

export function ActionMenuDemo() {
  const [last, setLast] = useState('nothing yet');
  return (
    <div style={{ display: 'grid', alignContent: 'start', gap: '0.75rem', minHeight: '13rem' }}>
      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
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
      </div>
      <span>Last export: {last}</span>
    </div>
  );
}
