import { type ComponentProps, useState } from 'react';
import type { TableColumn, TableProps } from '../components/Table';

const MAX_WIDTH = 800;

type Column = Omit<TableColumn<never>, 'cell' | 'header'>;

/**
 * Column widths for a resizable table: controlled or own state, a local drag preview committed
 * once on release, arrow-key steps and reset. `separatorProps` goes on each header's resize handle.
 */
export function useColumnResize({
  columnWidths,
  onColumnWidthsChange,
  resizeLabel,
}: Pick<TableProps<never>, 'columnWidths' | 'onColumnWidthsChange'> & {
  resizeLabel: (label: string) => string;
}) {
  const [ownWidths, setOwnWidths] = useState<Record<string, number>>({});
  const [draft, setDraft] = useState<{ id: string; x: number; base: number; width: number }>();
  const widths = columnWidths ?? ownWidths;
  // Column ids are app data, so `constructor` or `__proto__` must not hit Object.prototype.
  const saved = (id: string) => Object.hasOwn(widths, id);
  const clamp = (column: Column, width: number) =>
    Math.min(MAX_WIDTH, Math.max(column.minWidth ?? 80, Math.round(width)));
  const widthOf = (column: Column) => {
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

  function separatorProps(column: Column) {
    const width = widthOf(column);
    const dragging = draft?.id === column.id;
    const reset = () => {
      if (saved(column.id)) commit(column.id);
    };
    return {
      dragging,
      props: {
        role: 'separator',
        'aria-orientation': 'vertical',
        'aria-label': resizeLabel(column.label),
        'aria-valuenow': width,
        'aria-valuemin': column.minWidth ?? 80,
        'aria-valuemax': MAX_WIDTH,
        tabIndex: 0,
        onPointerDown: (event) => {
          event.currentTarget.setPointerCapture(event.pointerId);
          setDraft({ id: column.id, x: event.clientX, base: width, width });
        },
        onPointerMove: (event) => {
          if (dragging)
            setDraft({ ...draft, width: clamp(column, draft.base + event.clientX - draft.x) });
        },
        onPointerUp: (event) => {
          if (!dragging) return;
          const next = clamp(column, draft.base + event.clientX - draft.x);
          if (next === draft.base) setDraft(undefined);
          else commit(column.id, next);
        },
        onPointerCancel: () => setDraft(undefined),
        onLostPointerCapture: () => setDraft(undefined),
        onDoubleClick: reset,
        onKeyDown: (event) => {
          if (event.key === 'Enter') reset();
          else if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
            event.preventDefault();
            const next = clamp(column, width + (event.key === 'ArrowLeft' ? -10 : 10));
            if (next !== width) commit(column.id, next);
          }
        },
      } satisfies ComponentProps<'div'>,
    };
  }

  return { widthOf, separatorProps };
}
