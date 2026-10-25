import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { ThemePair } from '../../../.storybook/ThemePair';
import { Table, type TableColumn } from './Table';
import { TableColumnsMenu } from './TableColumnsMenu';

type Doc = { id: number; name: string; email: string; city: string; submitted: string };

const docs: Doc[] = Array.from({ length: 40 }, (_, i) => ({
  id: i + 1,
  name: ['Ada Lovelace', 'Grace Hopper', 'Alan Turing', 'Margaret Hamilton'][i % 4],
  email: `person${i + 1}@example.com`,
  city: ['London', 'New York', 'Wilmslow', 'Boston'][i % 4],
  submitted: `2026-10-${String((i % 28) + 1).padStart(2, '0')}`,
}));

const columns: TableColumn<Doc>[] = [
  { id: 'id', label: 'No.', cell: (row) => row.id, width: 80 },
  { id: 'name', label: 'Name', cell: (row) => row.name },
  { id: 'email', label: 'Email', cell: (row) => row.email, width: 240 },
  { id: 'city', label: 'City', cell: (row) => row.city, width: 160, minWidth: 120 },
  { id: 'submitted', label: 'Submitted', cell: (row) => row.submitted, width: 140 },
];

const meta = {
  title: 'Components/Table',
  component: Table<Doc>,
  subcomponents: { TableColumnsMenu },
  args: { caption: 'Documents', columns, rows: docs.slice(0, 5), getRowKey: (row) => row.id },
} satisfies Meta<typeof Table<Doc>>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Narrow: Story = {
  decorators: [
    (Story) => (
      <div style={{ width: '20rem' }}>
        <Story />
      </div>
    ),
  ],
};

export const Wide: Story = {
  args: { columns: columns.slice(0, 2) },
  decorators: [
    (Story) => (
      <div style={{ width: '60rem' }}>
        <Story />
      </div>
    ),
  ],
};

export const LongContent: Story = {
  args: {
    columns: [
      {
        id: 'question',
        label: 'Which of our services did you use most often during the last reporting period?',
        cell: (row) => `${row.name} used the online appointment booking and the document upload.`,
        width: 260,
      },
      { id: 'email', label: 'Email', cell: (row) => row.email.repeat(3), width: 160 },
    ],
  },
};

export const ManyColumnsWithStickyHeader: Story = {
  args: {
    rows: docs,
    columns: Array.from({ length: 30 }, (_, i) => ({
      id: `q${i + 1}`,
      label: `Question ${i + 1}`,
      cell: (row: Doc) => `${row.city} ${i + 1}`,
      width: 140,
    })),
    style: { maxHeight: '24rem' },
  },
};

function WithMenu() {
  const [hidden, setHidden] = useState(['email']);
  const [widths, setWidths] = useState<Record<string, number>>({ name: 220 });
  const [descending, setDescending] = useState(false);
  const sorted = [...docs.slice(0, 12)].sort((a, b) =>
    descending ? b.name.localeCompare(a.name) : a.name.localeCompare(b.name),
  );
  const sortable = columns.map((column) =>
    column.id === 'name'
      ? {
          ...column,
          header: (
            <button type="button" onClick={() => setDescending(!descending)}>
              Name {descending ? '↓' : '↑'}
            </button>
          ),
        }
      : column,
  );
  return (
    <div style={{ display: 'grid', gap: '1rem', minHeight: '32rem', alignContent: 'start' }}>
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <TableColumnsMenu
          columns={columns}
          hiddenColumns={hidden}
          onHiddenColumnsChange={setHidden}
        />
      </div>
      <Table
        caption="Documents"
        columns={sortable.filter((column) => !hidden.includes(column.id))}
        rows={sorted}
        getRowKey={(row) => row.id}
        columnWidths={widths}
        onColumnWidthsChange={setWidths}
        style={{ maxHeight: '20rem' }}
      />
      <code>{JSON.stringify({ hidden, widths })}</code>
    </div>
  );
}

export const ControlledWithColumnsMenu: Story = { render: () => <WithMenu /> };

export const Themes: Story = {
  render: (args) => <ThemePair>{() => <Table {...args} />}</ThemePair>,
};
