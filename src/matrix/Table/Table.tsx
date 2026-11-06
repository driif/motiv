import { useId } from 'react';
import type { TableProps } from '../../components/Table';
import { cx } from '../../utils/cx';
import { useColumnResize } from '../../utils/useColumnResize';

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
  const labelId = useId();
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
      className={cx('motiv-matrix-table', className)}
    >
      <table
        className="motiv-matrix-table__table"
        style={{ width: columns.reduce((sum, column) => sum + widthOf(column), 0) }}
      >
        <caption className="motiv-visually-hidden">{caption}</caption>
        <colgroup>
          {columns.map((column) => (
            <col key={column.id} style={{ width: widthOf(column) }} />
          ))}
        </colgroup>
        <thead className="motiv-matrix-table__head">
          <tr>
            {columns.map((column, index) => {
              const separator = separatorProps(column);
              return (
                // Named by the label alone: the separator's name and value would leak into it.
                <th
                  key={column.id}
                  scope="col"
                  aria-labelledby={`${labelId}-${index}`}
                  className="motiv-matrix-table__header"
                >
                  <span id={`${labelId}-${index}`} className="motiv-matrix-table__label">
                    {column.header ?? column.label}
                  </span>
                  <div
                    {...separator.props}
                    className={cx(
                      'motiv-matrix-table__resize',
                      separator.dragging && 'motiv-matrix-table__resize--dragging',
                    )}
                  />
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={getRowKey(row)} className="motiv-matrix-table__row">
              {columns.map((column) => (
                <td key={column.id} className="motiv-matrix-table__cell">
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
