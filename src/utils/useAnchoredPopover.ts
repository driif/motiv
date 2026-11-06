import { type RefObject, useCallback, useLayoutEffect } from 'react';

/**
 * Shows a `popover="manual"` element while `open` and keeps it fixed under (or flipped above) its
 * anchor. `content` re-measures when what changes the popover height changes. Sets `--_flip` 0 or 1.
 */
export function useAnchoredPopover(
  anchorRef: RefObject<HTMLElement | null>,
  popoverRef: RefObject<HTMLElement | null>,
  open: boolean,
  gap: number,
  content: unknown,
) {
  const position = useCallback(
    (event?: Event) => {
      const popover = popoverRef.current;
      const anchor = anchorRef.current;
      // Scrolling the popover itself must not re-measure: clearing maxHeight clamps its scrollTop.
      if (!popover || !anchor || (event?.target instanceof Node && popover.contains(event.target)))
        return;
      const rect = anchor.getBoundingClientRect();
      popover.style.width = `${rect.width}px`;
      const scrollTop = popover.scrollTop;
      popover.style.maxHeight = '';
      const height = popover.offsetHeight;
      const below = window.innerHeight - rect.bottom - gap;
      const above = rect.top - gap;
      const flip = height > below && above > below;
      popover.style.maxHeight = `${Math.min(height, Math.max(0, flip ? above : below))}px`;
      popover.scrollTop = scrollTop;
      popover.style.top = `${flip ? Math.max(0, rect.top - gap - height) : rect.bottom + gap}px`;
      popover.style.left = `${rect.left}px`;
      popover.style.setProperty('--_flip', flip ? '1' : '0');
    },
    [anchorRef, popoverRef, gap],
  );

  useLayoutEffect(() => {
    const popover = popoverRef.current;
    if (!open || !popover) return;
    popover.showPopover?.();
    window.addEventListener('scroll', position, true);
    window.addEventListener('resize', position);
    return () => {
      window.removeEventListener('scroll', position, true);
      window.removeEventListener('resize', position);
      popover.hidePopover?.();
    };
  }, [open, popoverRef, position]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: content changes the popover height.
  useLayoutEffect(() => {
    if (open) position();
  }, [open, content, position]);
}
