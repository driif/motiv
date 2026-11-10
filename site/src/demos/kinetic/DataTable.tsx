import { DataTable, type DataTableColumn } from '@driif/motiv/data-table';

type Row = { id: number; name: string; city: string };

const cities = ['London', 'New York', 'Wilmslow', 'Boston'];
const rows: Row[] = Array.from({ length: 10_000 }, (_, i) => ({
  id: i + 1,
  name: `Record ${i + 1}`,
  city: cities[i % cities.length],
}));

const columns: DataTableColumn<Row>[] = [
  { id: 'id', label: 'No.', cell: (row) => row.id, width: 90 },
  { id: 'name', label: 'Name', cell: (row) => row.name },
  { id: 'city', label: 'City', cell: (row) => row.city, width: 160 },
];

export function DataTableDemo() {
  return (
    <DataTable
      caption="10,000 records"
      columns={columns}
      rows={rows}
      getRowKey={(row) => row.id}
      maxHeight="20rem"
    />
  );
}
