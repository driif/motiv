import { type ComponentProps, type Key, type ReactNode, useId, useState } from 'react';
import { cx } from '../../utils/cx';

const MAX_WIDTH = 800;

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
  const labelId = useId();
  const [ownWidths, setOwnWidths] = useState<Record<string, number>>({});
  const [draft, setDraft] = useState<{ id: string; x: number; base: number; width: number }>();
  const widths = columnWidths ?? ownWidths;
  // Column ids are app data, so `constructor` or `__proto__` must not hit Object.prototype.
  const saved = (id: string) => Object.hasOwn(widths, id);
  const clamp = (column: TableColumn<Row>, width: number) =>
    Math.min(MAX_WIDTH, Math.max(column.minWidth ?? 80, Math.round(width)));
  const widthOf = (column: TableColumn<Row>) => {
    if (draft?.id === column.id) return draft.width;
    return clamp(column, saved(column.id) ? widths[column.id] : (column.width ?? 200));
  };

  function commit(id: string, width?: number) {
    const { [id]: _, ...rest } = widths;
    const next = width === undefined ? rest : { ...rest, [id]: width };
    setDraft(undefined);
    if (!columnWidths) setOwnWidths(next);
    onColumnWidthsChange?.(next);
  }

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
        <colgroup>
          {columns.map((column) => (
            <col key={column.id} style={{ width: widthOf(column) }} />
          ))}
        </colgroup>
        <thead className="motiv-table__head">
          <tr>
            {columns.map((column, index) => {
              const width = widthOf(column);
              const dragging = draft?.id === column.id;
              const reset = () => {
                if (saved(column.id)) commit(column.id);
              };
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
                    role="separator"
                    aria-orientation="vertical"
                    aria-label={resizeLabel(column.label)}
                    aria-valuenow={width}
                    aria-valuemin={column.minWidth ?? 80}
                    aria-valuemax={MAX_WIDTH}
                    tabIndex={0}
                    className={cx(
                      'motiv-table__resize',
                      dragging && 'motiv-table__resize--dragging',
                    )}
                    onPointerDown={(event) => {
                      event.currentTarget.setPointerCapture(event.pointerId);
                      setDraft({ id: column.id, x: event.clientX, base: width, width });
                    }}
                    onPointerMove={(event) => {
                      if (dragging)
                        setDraft({
                          ...draft,
                          width: clamp(column, draft.base + event.clientX - draft.x),
                        });
                    }}
                    onPointerUp={(event) => {
                      if (!dragging) return;
                      const next = clamp(column, draft.base + event.clientX - draft.x);
                      if (next === draft.base) setDraft(undefined);
                      else commit(column.id, next);
                    }}
                    onPointerCancel={() => setDraft(undefined)}
                    onLostPointerCapture={() => setDraft(undefined)}
                    onDoubleClick={reset}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter') reset();
                      else if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
                        event.preventDefault();
                        const next = clamp(column, width + (event.key === 'ArrowLeft' ? -10 : 10));
                        if (next !== width) commit(column.id, next);
                      }
                    }}
                  />
                </th>
              );
            })}
          </tr>
        </thead>
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
