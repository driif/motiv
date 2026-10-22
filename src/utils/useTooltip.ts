import { type KeyboardEvent, useEffect, useRef, useState } from 'react';

/** Toggletip state for an info trigger whose parent wraps the note: spread `root` and `trigger`. */
export function useTooltip() {
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [focusVisible, setFocusVisible] = useState(false);
  // Escape hides the note even while hovered or focused, until the pointer or focus leaves.
  const [dismissed, setDismissed] = useState(false);

  // Hover can show the note while focus is elsewhere, so Escape is heard on the document too.
  useEffect(() => {
    if (!open && !hovered) return;
    const onKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      setOpen(false);
      setDismissed(true);
    };
    const onPointerDown = (event: PointerEvent) => {
      if (!triggerRef.current?.parentElement?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('pointerdown', onPointerDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('pointerdown', onPointerDown);
    };
  }, [open, hovered]);

  return {
    root: {
      'data-open': open || undefined,
      'data-focus-visible': focusVisible || undefined,
      'data-dismissed': dismissed || undefined,
    },
    hover(on: boolean) {
      setHovered(on);
      if (!on) setDismissed(false);
    },
    trigger: {
      ref: triggerRef,
      onClick() {
        setDismissed(open);
        setOpen(!open);
      },
      onKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
        if (event.key !== 'Escape') return;
        setOpen(false);
        setDismissed(true);
      },
      onFocus(event: { currentTarget: HTMLButtonElement }) {
        setFocusVisible(event.currentTarget.matches(':focus-visible'));
      },
      onBlur() {
        setFocusVisible(false);
        setDismissed(false);
      },
    },
  };
}
