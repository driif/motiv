import type { Meta, StoryObj } from '@storybook/react-vite';
import type { TableColumn } from '../../components/Table/Table';
import { DataTable } from './DataTable';

type Row = { id: number; name: string; city: string; note: string };

const cities = ['London', 'New York', 'Wilmslow', 'Boston'];
const rows: Row[] = Array.from({ length: 10_000 }, (_, i) => ({
  id: i + 1,
  name: `Record ${i + 1}`,
  city: cities[i % cities.length],
  note: i % 7 === 0 ? 'A much longer note that the narrow column cuts with an ellipsis' : '',
}));

const columns: TableColumn<Row>[] = [
  { id: 'id', label: 'No.', cell: (row) => row.id, width: 90 },
  { id: 'name', label: 'Name', cell: (row) => <a href={`#${row.id}`}>{row.name}</a> },
  { id: 'city', label: 'City', cell: (row) => row.city, width: 160 },
  { id: 'note', label: 'Note', cell: (row) => row.note, width: 220 },
];

const meta = {
  title: 'Data table/DataTable',
  component: DataTable<Row>,
  args: {
    caption: '10,000 records',
    columns,
    rows,
    getRowKey: (row) => row.id,
    maxHeight: '24rem',
  },
} satisfies Meta<typeof DataTable<Row>>;

export default meta;
type Story = StoryObj<typeof meta>;

export const TenThousandRows: Story = {};
