import { type KeyboardEvent, useRef, useState } from 'react';

const SWIPE_MIN = 40;

/** Slide index of a carousel: `goTo` for the controls, `keyNav` for the root's keydown, `swipe` for the view. */
export function useCarousel({
  count,
  index,
  defaultIndex,
  onIndexChange,
  loop,
}: {
  count: number;
  index?: number;
  defaultIndex: number;
  onIndexChange?: (index: number) => void;
  loop: boolean;
}) {
  const [inner, setInner] = useState(defaultIndex);
  const current = Math.min(Math.max(index ?? inner, 0), Math.max(count - 1, 0));
  const startX = useRef<number | null>(null);

  function goTo(i: number) {
    if (count === 0) return;
    const next = loop ? (i + count) % count : Math.min(Math.max(i, 0), count - 1);
    if (next === current) return;
    if (index === undefined) setInner(next);
    onIndexChange?.(next);
  }

  return {
    current,
    goTo,
    keyNav(event: KeyboardEvent) {
      if (event.defaultPrevented) return;
      if ((event.target as HTMLElement).closest('input, textarea, select, [contenteditable]'))
        return;
      if (event.key === 'ArrowLeft') goTo(current - 1);
      else if (event.key === 'ArrowRight') goTo(current + 1);
    },
    swipe: {
      onPointerDown(event: { clientX: number }) {
        startX.current = event.clientX;
      },
      onPointerCancel() {
        startX.current = null;
      },
      onPointerUp(event: { clientX: number }) {
        if (startX.current === null) return;
        const dx = event.clientX - startX.current;
        startX.current = null;
        if (Math.abs(dx) > SWIPE_MIN) goTo(current + (dx < 0 ? 1 : -1));
      },
    },
  };
}
