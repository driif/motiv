import { Table, type TableColumn, TableColumnsMenu } from '@driif/motiv';
import { useState } from 'react';

type Entry = { id: number; name: string; city: string; plan: string; submitted: string };

const entries: Entry[] = [
  { id: 1, name: 'Ada Lovelace', city: 'London', plan: 'Team', submitted: '2026-10-02' },
  { id: 2, name: 'Grace Hopper', city: 'New York', plan: 'Enterprise', submitted: '2026-10-09' },
  { id: 3, name: 'Alan Turing', city: 'Wilmslow', plan: 'Free', submitted: '2026-10-14' },
  { id: 4, name: 'Margaret Hamilton', city: 'Boston', plan: 'Team', submitted: '2026-10-21' },
];

const columns: TableColumn<Entry>[] = [
  { id: 'name', label: 'Name', cell: (entry) => entry.name },
  { id: 'city', label: 'City', cell: (entry) => entry.city, width: 140 },
  { id: 'plan', label: 'Plan', cell: (entry) => entry.plan, width: 120 },
  { id: 'submitted', label: 'Submitted', cell: (entry) => entry.submitted, width: 140 },
];

export function TableDemo() {
  const [hidden, setHidden] = useState(['plan']);
  const [widths, setWidths] = useState<Record<string, number>>({});
  return (
    <div style={{ display: 'grid', gap: '0.75rem', width: '100%', minHeight: '22rem' }}>
      <TableColumnsMenu
        columns={columns}
        hiddenColumns={hidden}
        onHiddenColumnsChange={setHidden}
        style={{ justifySelf: 'end' }}
      />
      <Table
        caption="Submitted forms"
        columns={columns.filter((column) => !hidden.includes(column.id))}
        rows={entries}
        getRowKey={(entry) => entry.id}
        columnWidths={widths}
        onColumnWidthsChange={setWidths}
      />
    </div>
  );
}
