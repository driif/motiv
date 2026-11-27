import { type TableClassNames, TableHead, type TableProps } from '../../components/Table/Table';
import { cx } from '../../utils/cx';
import { useColumnResize } from '../../utils/useColumnResize';

export const tableClassNames: TableClassNames = {
  root: 'motiv-matrix-table',
  table: 'motiv-matrix-table__table',
  head: 'motiv-matrix-table__head',
  header: 'motiv-matrix-table__header',
  label: 'motiv-matrix-table__label',
  resize: 'motiv-matrix-table__resize',
  resizeDragging: 'motiv-matrix-table__resize--dragging',
  row: 'motiv-matrix-table__row',
  cell: 'motiv-matrix-table__cell',
};

export function Table<Row>({
  caption,
  columns,
  rows,
  getRowKey,
  columnWidths,
  onColumnWidthsChange,
  resizeLabel = (label) => `Resize ${label}`,
  className,
  ...props
}: TableProps<Row>) {
  const { widthOf, separatorProps } = useColumnResize({
    columnWidths,
    onColumnWidthsChange,
    resizeLabel,
  });

  return (
    <div
      role="region"
      aria-label={caption}
      tabIndex={0}
      {...props}
      className={cx(tableClassNames.root, className)}
    >
      <table
        className={tableClassNames.table}
        style={{ width: columns.reduce((sum, column) => sum + widthOf(column), 0) }}
      >
        <caption className="motiv-visually-hidden">{caption}</caption>
        <TableHead
          classNames={tableClassNames}
          columns={columns}
          widthOf={widthOf}
          separatorProps={separatorProps}
        />
        <tbody>
          {rows.map((row) => (
            <tr key={getRowKey(row)} className={tableClassNames.row}>
              {columns.map((column) => (
                <td key={column.id} className={tableClassNames.cell}>
                  {column.cell(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
