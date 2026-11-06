import { type ToggleEvent, useId, useLayoutEffect, useRef, useState } from 'react';
import type { TableColumnsMenuProps } from '../components/Table';

// On beforetoggle the panel is still hidden and measures 0×0, so it opens below the trigger;
// the layout effect measures again once it shows and flips it above when it does not fit.
function position(trigger: HTMLElement, panel: HTMLElement) {
  const rect = trigger.getBoundingClientRect();
  const { clientWidth, clientHeight } = document.documentElement;
  panel.style.removeProperty('--_space');
  const { width, height } = panel.getBoundingClientRect();
  const below = clientHeight - rect.bottom;
  const flip = height > below && rect.top > below;
  panel.style.setProperty('--_space', `${Math.max(0, flip ? rect.top : below)}px`);
  panel.style.top = flip ? 'auto' : `${rect.bottom}px`;
  panel.style.bottom = flip ? `${clientHeight - rect.top}px` : 'auto';
  panel.style.right = `${Math.max(0, Math.min(clientWidth - rect.right, clientWidth - width))}px`;
}

/**
 * A `popover="auto"` column picker: keeps the panel right-aligned under (or flipped above) its
 * trigger while open, and maps each column to checkbox props that never hide the last visible one.
 */
export function useColumnsMenu({
  columns,
  hiddenColumns,
  onHiddenColumnsChange,
}: Pick<TableColumnsMenuProps, 'columns' | 'hiddenColumns' | 'onHiddenColumnsChange'>) {
  const id = useId();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLFieldSetElement>(null);
  const [open, setOpen] = useState(false);
  const visible = columns.filter((column) => !hiddenColumns.includes(column.id)).length;

  useLayoutEffect(() => {
    const trigger = triggerRef.current;
    const panel = panelRef.current;
    if (!open || !trigger || !panel) return;
    const reposition = (event?: Event) => {
      // Scrolling the panel itself must not re-measure: clearing its max-height resets scrollTop.
      if (!(event?.target instanceof Node && panel.contains(event.target)))
        position(trigger, panel);
    };
    reposition();
    window.addEventListener('scroll', reposition, true);
    window.addEventListener('resize', reposition);
    return () => {
      window.removeEventListener('scroll', reposition, true);
      window.removeEventListener('resize', reposition);
    };
  }, [open]);

  return {
    triggerProps: { ref: triggerRef, popoverTarget: `${id}-panel` },
    panelProps: {
      ref: panelRef,
      id: `${id}-panel`,
      popover: 'auto' as const,
      onBeforeToggle: (event: ToggleEvent<HTMLFieldSetElement>) => {
        if (event.newState === 'open' && triggerRef.current)
          position(triggerRef.current, event.currentTarget);
      },
      onToggle: (event: ToggleEvent<HTMLFieldSetElement>) => setOpen(event.newState === 'open'),
    },
    checkboxProps(columnId: string) {
      const hidden = hiddenColumns.includes(columnId);
      return {
        checked: !hidden,
        disabled: !hidden && visible === 1,
        onChange: () =>
          onHiddenColumnsChange(
            hidden
              ? hiddenColumns.filter((item) => item !== columnId)
              : [...hiddenColumns, columnId],
          ),
      };
    },
  };
}
