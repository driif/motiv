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

/** Literal class names per style, so bundlers and the tree-shake check can see them. */
export type TableClassNames = Record<
  'root' | 'table' | 'head' | 'header' | 'label' | 'resize' | 'resizeDragging' | 'row' | 'cell',
  string
>;

export const tableClassNames: TableClassNames = {
  root: 'motiv-table',
  table: 'motiv-table__table',
  head: 'motiv-table__head',
  header: 'motiv-table__header',
  label: 'motiv-table__label',
  resize: 'motiv-table__resize',
  resizeDragging: 'motiv-table__resize--dragging',
  row: 'motiv-table__row',
  cell: 'motiv-table__cell',
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

type Resize = ReturnType<typeof useColumnResize>;

/** Column widths and the header row, shared by every style's Table and DataTable. */
export function TableHead<Row>({
  classNames,
  columns,
  widthOf,
  separatorProps,
  rowIndex,
}: {
  classNames: TableClassNames;
  columns: TableColumn<Row>[];
  widthOf: Resize['widthOf'];
  separatorProps: Resize['separatorProps'];
  rowIndex?: number;
}) {
  const labelId = useId();
  return (
    <>
      <colgroup>
        {columns.map((column) => (
          <col key={column.id} style={{ width: widthOf(column) }} />
        ))}
      </colgroup>
      <thead className={classNames.head}>
        <tr aria-rowindex={rowIndex}>
          {columns.map((column, index) => {
            const separator = separatorProps(column);
            return (
              // Named by the label alone: the separator's name and value would leak into it.
              <th
                key={column.id}
                scope="col"
                aria-labelledby={`${labelId}-${index}`}
                className={classNames.header}
              >
                <span id={`${labelId}-${index}`} className={classNames.label}>
                  {column.header ?? column.label}
                </span>
                <div
                  {...separator.props}
                  className={cx(classNames.resize, separator.dragging && classNames.resizeDragging)}
                />
              </th>
            );
          })}
        </tr>
      </thead>
    </>
  );
}
