import { type ComponentProps, type Key, type ReactNode, useId } from 'react';
import { cx } from '../../utils/cx';
import { useColumnResize } from '../../utils/useColumnResize';

export type TableColumn<Row> = {
  id: string;
  label: string;
  header?: ReactNode;
  cell: (row: Row) => ReactNode;
  width?: number;
  minWidth?: number;
};

export type TableProps<Row> = Omit<ComponentProps<'div'>, 'children'> & {
  caption: string;
  columns: TableColumn<Row>[];
  rows: Row[];
  getRowKey: (row: Row) => Key;
  columnWidths?: Record<string, number>;
  onColumnWidthsChange?: (widths: Record<string, number>) => void;
  resizeLabel?: (label: string) => string;
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
      className={cx('motiv-table', className)}
    >
      <table
        className="motiv-table__table"
        style={{ width: columns.reduce((sum, column) => sum + widthOf(column), 0) }}
      >
        <caption className="motiv-visually-hidden">{caption}</caption>
        <TableHead columns={columns} widthOf={widthOf} separatorProps={separatorProps} />
        <tbody>
          {rows.map((row) => (
            <tr key={getRowKey(row)} className="motiv-table__row">
              {columns.map((column) => (
                <td key={column.id} className="motiv-table__cell">
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

type Resize = ReturnType<typeof useColumnResize>;

/** Column widths and the header row, shared with `DataTable`. */
export function TableHead<Row>({
  columns,
  widthOf,
  separatorProps,
}: {
  columns: TableColumn<Row>[];
  widthOf: Resize['widthOf'];
  separatorProps: Resize['separatorProps'];
}) {
  const labelId = useId();
  return (
    <>
      <colgroup>
        {columns.map((column) => (
          <col key={column.id} style={{ width: widthOf(column) }} />
        ))}
      </colgroup>
      <thead className="motiv-table__head">
        <tr>
          {columns.map((column, index) => {
            const separator = separatorProps(column);
            return (
              // Named by the label alone: the separator's name and value would leak into it.
              <th
                key={column.id}
                scope="col"
                aria-labelledby={`${labelId}-${index}`}
                className="motiv-table__header"
              >
                <span id={`${labelId}-${index}`} className="motiv-table__label">
                  {column.header ?? column.label}
                </span>
                <div
                  {...separator.props}
                  className={cx(
                    'motiv-table__resize',
                    separator.dragging && 'motiv-table__resize--dragging',
                  )}
                />
              </th>
            );
          })}
        </tr>
      </thead>
    </>
  );
}
