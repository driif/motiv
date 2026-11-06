import { type RefObject, useEffect, useRef } from 'react';
import { dismissToast, removeToast, type ToastEntry } from '../components/Toast/toastStore';

/**
 * Runs one toast's timer while not paused and, once dismissed, hands keyboard focus to the next
 * toast (or back out of the stack) and removes it after its exit transition. Returns the li ref.
 */
export function useToastItem(
  { id, dismissed, duration }: ToastEntry,
  paused: boolean,
  returnFocus: RefObject<HTMLElement | null>,
) {
  const element = useRef<HTMLLIElement>(null);
  const remaining = useRef(duration);

  useEffect(() => {
    if (dismissed || paused || remaining.current === Infinity) return;
    const started = Date.now();
    const timer = setTimeout(() => dismissToast(id), remaining.current);
    return () => {
      clearTimeout(timer);
      remaining.current = Math.max(0, remaining.current - (Date.now() - started));
    };
  }, [id, dismissed, paused]);

  useEffect(() => {
    const node = element.current;
    if (!dismissed || !node) return;
    const focused = node.ownerDocument.activeElement;
    if (focused instanceof HTMLElement && node.contains(focused)) {
      if (focused.matches(':focus-visible')) {
        const siblings = Array.from(node.parentElement?.children ?? []);
        const index = siblings.indexOf(node);
        const next = [...siblings.slice(index + 1), ...siblings.slice(0, index)].find(
          (sibling) => !sibling.hasAttribute('data-exiting'),
        );
        const target = next?.querySelector('button') ?? returnFocus.current;
        if (target?.isConnected) target.focus();
      }
      if (node.contains(node.ownerDocument.activeElement)) focused.blur();
    }
    // A timeout also completes exits when reduced motion or absent CSS produces no transitionend.
    const duration = window.getComputedStyle(node).transitionDuration;
    const milliseconds = (Number.parseFloat(duration) || 0) * (duration.endsWith('ms') ? 1 : 1000);
    const timer = setTimeout(() => removeToast(id), milliseconds);
    return () => clearTimeout(timer);
  }, [id, dismissed, returnFocus]);

  return element;
}
