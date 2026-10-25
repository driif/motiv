import {
  type ComponentProps,
  type RefObject,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from 'react';
import { cx } from '../../utils/cx';

export interface ToastOptions {
  title: string;
  description?: string;
  tone?: 'success' | 'error' | 'info';
  /** Milliseconds on screen; errors default to Infinity, other tones to 5000. */
  duration?: number;
}

interface ToastEntry extends ToastOptions {
  id: string;
  tone: NonNullable<ToastOptions['tone']>;
  duration: number;
  dismissed?: boolean;
}

const empty: ToastEntry[] = [];
let queue = empty;
const listeners = new Set<() => void>();
let nextId = 0;

function publish(next: ToastEntry[]) {
  queue = next;
  for (const listener of listeners) listener();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot() {
  return queue;
}

function getServerSnapshot() {
  return empty;
}

export function toast({ tone = 'info', duration, ...options }: ToastOptions): string {
  if (typeof window === 'undefined') return '';
  const id = String(++nextId);
  publish([
    ...queue,
    { ...options, id, tone, duration: duration ?? (tone === 'error' ? Infinity : 5000) },
  ]);
  return id;
}

export function dismissToast(id: string): void {
  const index = queue.findIndex((item) => item.id === id);
  if (index === -1 || queue[index].dismissed) return;
  publish(
    index < 3
      ? queue.map((item) => (item.id === id ? { ...item, dismissed: true } : item))
      : queue.filter((item) => item.id !== id),
  );
}

function ToastItem({
  item,
  paused,
  dismissLabel,
  returnFocus,
}: {
  item: ToastEntry;
  paused: boolean;
  dismissLabel: string;
  returnFocus: RefObject<HTMLElement | null>;
}) {
  const element = useRef<HTMLLIElement>(null);
  const remaining = useRef(item.duration);
  const { id, dismissed } = item;

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
    const timer = setTimeout(() => publish(queue.filter((entry) => entry.id !== id)), milliseconds);
    return () => clearTimeout(timer);
  }, [id, dismissed, returnFocus]);

  return (
    <li
      ref={element}
      className={`motiv-toast motiv-toast--${item.tone}`}
      data-exiting={dismissed || undefined}
    >
      <svg
        className="motiv-toast__icon"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="9" />
        {item.tone === 'success' ? (
          <path d="m8 12 3 3 5-6" />
        ) : item.tone === 'error' ? (
          <path d="M12 7v6m0 4h.01" />
        ) : (
          <path d="M12 11v6m0-10h.01" />
        )}
      </svg>
      <div className="motiv-toast__content">
        <div className="motiv-toast__title">{item.title}</div>
        {item.description && <div className="motiv-toast__description">{item.description}</div>}
      </div>
      <button
        className="motiv-toast__dismiss"
        type="button"
        aria-label={dismissLabel}
        tabIndex={dismissed ? -1 : undefined}
        onClick={() => dismissToast(id)}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          aria-hidden="true"
        >
          <path d="m6 6 12 12M6 18 18 6" />
        </svg>
      </button>
    </li>
  );
}

export interface ToasterProps extends ComponentProps<'section'> {
  label?: string;
  dismissLabel?: string;
}

/** Mount once per app; additional hosts render the same notifications again. */
export function Toaster({
  label = 'Notifications',
  dismissLabel = 'Dismiss',
  className,
  children,
  onMouseEnter,
  onMouseLeave,
  onFocus,
  onBlur,
  ...props
}: ToasterProps) {
  const items = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const returnFocus = useRef<HTMLElement | null>(null);
  const [announcements, setAnnouncements] = useState<ToastEntry[]>([]);

  useEffect(() => {
    setAnnouncements(items.slice(0, 3).filter((item) => !item.dismissed));
  }, [items]);

  return (
    <section
      aria-label={label}
      {...props}
      className={cx('motiv-toast-stack', className)}
      onMouseEnter={(event) => {
        setHovered(true);
        onMouseEnter?.(event);
      }}
      onMouseLeave={(event) => {
        setHovered(false);
        onMouseLeave?.(event);
      }}
      onFocus={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          returnFocus.current =
            event.relatedTarget instanceof HTMLElement ? event.relatedTarget : null;
        }
        setFocused(true);
        onFocus?.(event);
      }}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false);
        onBlur?.(event);
      }}
    >
      <div
        role="status"
        aria-live="polite"
        aria-atomic="false"
        aria-relevant="additions"
        className="motiv-visually-hidden"
      >
        {announcements
          .filter((item) => item.tone !== 'error')
          .map((item) => (
            <div key={item.id}>
              {item.title}
              {item.description && `: ${item.description}`}
            </div>
          ))}
      </div>
      <div
        role="alert"
        aria-atomic="false"
        aria-relevant="additions"
        className="motiv-visually-hidden"
      >
        {announcements
          .filter((item) => item.tone === 'error')
          .map((item) => (
            <div key={item.id}>
              {item.title}
              {item.description && `: ${item.description}`}
            </div>
          ))}
      </div>
      <ol className="motiv-toast-stack__list">
        {items.slice(0, 3).map((item) => (
          <ToastItem
            key={item.id}
            item={item}
            paused={hovered || focused}
            dismissLabel={dismissLabel}
            returnFocus={returnFocus}
          />
        ))}
      </ol>
      {children}
    </section>
  );
}
