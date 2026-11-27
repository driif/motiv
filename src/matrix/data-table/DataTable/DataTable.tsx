import { DataTableBase, type DataTableProps } from '../../../data-table/DataTable/DataTable';
import { tableClassNames } from '../../Table/Table';

export type { DataTableProps };

export function DataTable<Row>(props: DataTableProps<Row>) {
  return <DataTableBase {...props} classNames={tableClassNames} />;
}
