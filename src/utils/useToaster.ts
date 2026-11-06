import { type ComponentProps, useEffect, useRef, useState, useSyncExternalStore } from 'react';
import {
  getServerSnapshot,
  getSnapshot,
  subscribe,
  type ToastEntry,
} from '../components/Toast/toastStore';

/**
 * Toaster state: the first three toasts of the shared queue, what to announce (for
 * `ToastLiveRegions`), and the hover and focus pause. Spread `sectionProps` on the stack's `<section>` and pass `listRef` to its list.
 */
export function useToaster({
  onPointerEnter,
  onPointerLeave,
  onFocus,
  onBlur,
}: Pick<ComponentProps<'section'>, 'onPointerEnter' | 'onPointerLeave' | 'onFocus' | 'onBlur'>) {
  const items = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const listRef = useRef<HTMLOListElement>(null);
  const returnFocus = useRef<HTMLElement | null>(null);
  const [announcements, setAnnouncements] = useState<ToastEntry[]>([]);

  useEffect(() => {
    setAnnouncements(items.slice(0, 3).filter((item) => !item.dismissed));
    if (!items.length || !listRef.current?.parentElement?.matches(':hover')) setHovered(false);
  }, [items]);

  return {
    visible: items.slice(0, 3),
    paused: hovered || focused,
    returnFocus,
    listRef,
    announcements,
    sectionProps: {
      onPointerEnter: (event) => {
        if (event.pointerType === 'mouse') setHovered(true);
        onPointerEnter?.(event);
      },
      onPointerLeave: (event) => {
        if (event.pointerType === 'mouse') setHovered(false);
        onPointerLeave?.(event);
      },
      onFocus: (event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          returnFocus.current =
            event.relatedTarget instanceof HTMLElement ? event.relatedTarget : null;
        }
        setFocused(true);
        onFocus?.(event);
      },
      onBlur: (event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false);
        onBlur?.(event);
      },
    } satisfies ComponentProps<'section'>,
  };
}
