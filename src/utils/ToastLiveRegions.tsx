import type { ToastEntry } from '../components/Toast/toastStore';

const line = (item: ToastEntry) => (
  <div key={item.id}>
    {item.title}
    {item.description && `: ${item.description}`}
  </div>
);

/** A Toaster's hidden announcements: errors as alerts, everything else politely. */
export function ToastLiveRegions({ items }: { items: ToastEntry[] }) {
  return (
    <>
      <div
        role="status"
        aria-live="polite"
        aria-atomic="false"
        aria-relevant="additions"
        className="motiv-visually-hidden"
      >
        {items.filter((item) => item.tone !== 'error').map(line)}
      </div>
      <div
        role="alert"
        aria-atomic="false"
        aria-relevant="additions"
        className="motiv-visually-hidden"
      >
        {items.filter((item) => item.tone === 'error').map(line)}
      </div>
    </>
  );
}
