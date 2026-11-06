import type { ComponentProps, RefObject } from 'react';
import { cx } from '../../utils/cx';
import { ToastLiveRegions } from '../../utils/ToastLiveRegions';
import { useToaster } from '../../utils/useToaster';
import { useToastItem } from '../../utils/useToastItem';
import { dismissToast, type ToastEntry } from './toastStore';

export { dismissToast, type ToastOptions, toast } from './toastStore';

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
  const element = useToastItem(item, paused, returnFocus);

  return (
    <li
      ref={element}
      className={`motiv-toast motiv-toast--${item.tone}`}
      data-exiting={item.dismissed || undefined}
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
        tabIndex={item.dismissed ? -1 : undefined}
        onClick={() => dismissToast(item.id)}
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
  onPointerEnter,
  onPointerLeave,
  onFocus,
  onBlur,
  ...props
}: ToasterProps) {
  const { visible, paused, returnFocus, listRef, announcements, sectionProps } = useToaster({
    onPointerEnter,
    onPointerLeave,
    onFocus,
    onBlur,
  });

  return (
    <section
      aria-label={label}
      {...props}
      className={cx('motiv-toast-stack', className)}
      {...sectionProps}
    >
      <ToastLiveRegions items={announcements} />
      <ol ref={listRef} className="motiv-toast-stack__list">
        {visible.map((item) => (
          <ToastItem
            key={item.id}
            item={item}
            paused={paused}
            dismissLabel={dismissLabel}
            returnFocus={returnFocus}
          />
        ))}
      </ol>
      {children}
    </section>
  );
}
