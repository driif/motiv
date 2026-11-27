import { type FocusEvent, type ToggleEvent, useId, useLayoutEffect, useRef, useState } from 'react';

interface Item {
  id: string;
}

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

/** Bell + popover panel: fixed placement that flips above, and focus recovery on removal. */
export function useNotificationList(
  items: Item[],
  onOpen: ((id: string) => void) | undefined,
  dismissSelector: string,
) {
  const id = useId();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  // Id of the item that last held focus in the panel ('' for Dismiss all), and the items it was in.
  const focusId = useRef<string | null>(null);
  const prevItems = useRef(items);
  const [open, setOpen] = useState(false);

  // Changed items resize the panel.
  // biome-ignore lint/correctness/useExhaustiveDependencies: items re-run the measurement
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
  }, [open, items]);

  // Changed items may remove the focused one: focus the next survivor, else the previous one.
  useLayoutEffect(() => {
    const prev = prevItems.current;
    prevItems.current = items;
    const panel = panelRef.current;
    const focused = focusId.current;
    if (focused === null || !panel || panel.contains(document.activeElement)) return;
    const at = prev.findIndex((item) => item.id === focused);
    const survivor = [...prev.slice(at + 1), ...prev.slice(0, Math.max(at, 0)).reverse()].find(
      (item) => items.some((next) => next.id === item.id),
    );
    const index = items.findIndex((item) => item.id === survivor?.id);
    const buttons = panel.querySelectorAll<HTMLElement>(dismissSelector);
    (buttons[index] ?? headingRef.current)?.focus();
  }, [items, dismissSelector]);

  return {
    id,
    triggerRef,
    panelRef,
    headingRef,
    openItem: (itemId: string) => {
      onOpen?.(itemId);
      panelRef.current?.hidePopover();
    },
    /** Remembers the focused item; '' marks Dismiss all. */
    focusItem: (itemId: string) => {
      focusId.current = itemId;
    },
    onBeforeToggle: (event: ToggleEvent<HTMLElement>) => {
      if (event.newState === 'closed') focusId.current = null;
      else if (triggerRef.current) position(triggerRef.current, event.currentTarget);
    },
    onToggle: (event: ToggleEvent<HTMLElement>) => setOpen(event.newState === 'open'),
    onBlur: (event: FocusEvent<HTMLElement>) => {
      // A removed element blurs without a relatedTarget; keep its id for the recovery.
      if (event.relatedTarget && !event.currentTarget.contains(event.relatedTarget))
        focusId.current = null;
    },
  };
}
