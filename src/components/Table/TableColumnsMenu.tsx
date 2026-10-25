import { type ComponentProps, useId, useLayoutEffect, useRef, useState } from 'react';
import { cx } from '../../utils/cx';
import { Button } from '../Button';
import { SpringCheckbox } from '../SpringCheckbox';

export type TableColumnsMenuProps = Omit<ComponentProps<'div'>, 'children'> & {
  columns: { id: string; label: string }[];
  hiddenColumns: string[];
  onHiddenColumnsChange: (hiddenColumns: string[]) => void;
  label?: string;
};

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

export function TableColumnsMenu({
  columns,
  hiddenColumns,
  onHiddenColumnsChange,
  label = 'Columns',
  className,
  ...props
}: TableColumnsMenuProps) {
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

  return (
    <div {...props} className={cx('motiv-table-menu', className)}>
      <Button ref={triggerRef} variant="outline" popoverTarget={`${id}-panel`}>
        {label}
      </Button>
      <fieldset
        ref={panelRef}
        id={`${id}-panel`}
        popover="auto"
        aria-label={label}
        className="motiv-table-menu__panel"
        onBeforeToggle={(event) => {
          if (event.newState === 'open' && triggerRef.current)
            position(triggerRef.current, event.currentTarget);
        }}
        onToggle={(event) => setOpen(event.newState === 'open')}
      >
        {columns.map((column) => {
          const hidden = hiddenColumns.includes(column.id);
          return (
            <SpringCheckbox
              key={column.id}
              label={column.label}
              checked={!hidden}
              disabled={!hidden && visible === 1}
              onChange={() =>
                onHiddenColumnsChange(
                  hidden
                    ? hiddenColumns.filter((item) => item !== column.id)
                    : [...hiddenColumns, column.id],
                )
              }
            />
          );
        })}
      </fieldset>
    </div>
  );
}
