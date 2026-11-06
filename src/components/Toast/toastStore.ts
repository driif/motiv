export interface ToastOptions {
  title: string;
  description?: string;
  tone?: 'success' | 'error' | 'info';
  /** Milliseconds on screen; errors default to Infinity, other tones to 5000. */
  duration?: number;
}

export interface ToastEntry extends ToastOptions {
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

export function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getSnapshot() {
  return queue;
}

export function getServerSnapshot() {
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

/** Drops a dismissed toast once its exit has finished. */
export function removeToast(id: string): void {
  publish(queue.filter((entry) => entry.id !== id));
}
