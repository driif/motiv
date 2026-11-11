import { defaultRangeExtractor, useVirtualizer } from '@tanstack/react-virtual';
import { type CSSProperties, type Key, useCallback, useRef, useState } from 'react';
import { TableHead, type TableProps } from '../../components/Table/Table';
import { cx } from '../../utils/cx';
import { useColumnResize } from '../../utils/useColumnResize';

export type DataTableProps<Row> = TableProps<Row> & {
  maxHeight?: CSSProperties['maxHeight'];
  estimateRowHeight?: number;
};

export function DataTable<Row>({
  caption,
  columns,
  rows,
  getRowKey,
  columnWidths,
  onColumnWidthsChange,
  resizeLabel = (label) => `Resize ${label}`,
  maxHeight = '70vh',
  estimateRowHeight = 40,
  className,
  style,
  onKeyDown,
  ...props
}: DataTableProps<Row>) {
  const { widthOf, separatorProps } = useColumnResize({
    columnWidths,
    onColumnWidthsChange,
    resizeLabel,
  });
  const scroller = useRef<HTMLDivElement>(null);
  const [focused, setFocused] = useState<Key>();
  const focusedIndex =
    focused === undefined ? -1 : rows.findIndex((row) => getRowKey(row) === focused);
  if (focused !== undefined && focusedIndex < 0) setFocused(undefined);
  // The virtualizer rebuilds every row measurement when this function changes.
  const keyOf = useRef(getRowKey);
  keyOf.current = getRowKey;
  const getItemKey = useCallback((index: number) => keyOf.current(rows[index]), [rows]);
  const virtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => scroller.current,
    estimateSize: () => estimateRowHeight,
    getItemKey,
    overscan: 8,
    // A focused row stays mounted outside the window, so focus never lands on a reused row.
    rangeExtractor: (range) => {
      const indexes = defaultRangeExtractor(range);
      if (focusedIndex < 0 || indexes.includes(focusedIndex)) return indexes;
      return [...indexes, focusedIndex].sort((a, b) => a - b);
    },
  });
  const spacer = (key: string, size: number) =>
    size > 0 && (
      // biome-ignore lint/a11y/noAriaHiddenOnFocusable: a spacer row holds no focusable content.
      <tr key={key} aria-hidden="true" className="motiv-data-table__spacer">
        <td colSpan={columns.length} style={{ height: size }} />
      </tr>
    );

  let end = 0;
  return (
    <div
      ref={scroller}
      role="region"
      aria-label={caption}
      tabIndex={0}
      {...props}
      style={{ maxHeight, ...style }}
      // Native End/Home scrolling animates and a re-render can cancel it; the virtualizer settles the target.
      onKeyDown={(event) => {
        onKeyDown?.(event);
        if (event.defaultPrevented || event.target !== event.currentTarget || rows.length === 0)
          return;
        if (event.key === 'End') virtualizer.scrollToIndex(rows.length - 1, { align: 'end' });
        else if (event.key === 'Home') virtualizer.scrollToOffset(0);
        else return;
        event.preventDefault();
      }}
      className={cx('motiv-table', 'motiv-data-table', className)}
    >
      <table
        className="motiv-table__table"
        aria-rowcount={rows.length + 1}
        style={{ width: columns.reduce((sum, column) => sum + widthOf(column), 0) }}
      >
        <caption className="motiv-visually-hidden">{caption}</caption>
        <TableHead
          columns={columns}
          widthOf={widthOf}
          separatorProps={separatorProps}
          rowIndex={1}
        />
        <tbody
          onFocus={(event) => {
            const index = (event.target as Element).closest('tr')?.dataset.index;
            setFocused(index === undefined ? undefined : getRowKey(rows[Number(index)]));
          }}
          onBlur={(event) => {
            // Leaving the window blurs without moving focus; the row must stay for the return.
            if (document.activeElement === event.target) return;
            if (!event.currentTarget.contains(event.relatedTarget)) setFocused(undefined);
          }}
        >
          {virtualizer.getVirtualItems().flatMap((item) => {
            const gap = spacer(`gap-${item.key}`, item.start - end);
            end = item.end;
            return [
              gap,
              <tr
                key={item.key}
                ref={virtualizer.measureElement}
                data-index={item.index}
                aria-rowindex={item.index + 2}
                className="motiv-table__row"
              >
                {columns.map((column) => (
                  <td key={column.id} className="motiv-table__cell">
                    {column.cell(rows[item.index])}
                  </td>
                ))}
              </tr>,
            ];
          })}
          {spacer('gap-end', virtualizer.getTotalSize() - end)}
        </tbody>
      </table>
    </div>
  );
}
