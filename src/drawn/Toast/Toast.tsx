import type { RefObject } from 'react';
import type { ToasterProps } from '../../components/Toast';
import { dismissToast, type ToastEntry } from '../../components/Toast/toastStore';
import { cx } from '../../utils/cx';
import { ToastLiveRegions } from '../../utils/ToastLiveRegions';
import { useToaster } from '../../utils/useToaster';
import { useToastItem } from '../../utils/useToastItem';

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
      className={`motiv-sketch-toast motiv-sketch-toast--${item.tone}`}
      data-exiting={item.dismissed || undefined}
    >
      <svg className="motiv-sketch-toast__icon" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12.4 3.1c5 .2 8.7 4 8.5 8.9-.2 4.8-4.1 8.5-9 8.4C7 20.2 3.2 16.5 3.4 11.6 3.6 6.8 7.6 3.3 13.6 3.6" />
        {item.tone === 'success' ? (
          <path d="M7.6 12.4c1.3 1 2.3 2.2 3.2 3.4 1.5-3 3.4-5.6 5.8-7.6" />
        ) : item.tone === 'error' ? (
          <path d="M12.2 7.2c-.3 2-.2 4 0 5.8m-.1 3.6v.3" />
        ) : (
          <path d="M11.8 11c.3 2 .2 4-.1 6.2m.3-10v.3" />
        )}
      </svg>
      <div className="motiv-sketch-toast__content">
        <div className="motiv-sketch-toast__title">{item.title}</div>
        {item.description && (
          <div className="motiv-sketch-toast__description">{item.description}</div>
        )}
      </div>
      <button
        className="motiv-sketch-toast__dismiss"
        type="button"
        aria-label={dismissLabel}
        tabIndex={item.dismissed ? -1 : undefined}
        onClick={() => dismissToast(item.id)}
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M6.3 5.8c4 3.8 8 8.1 11.6 12.6M17.6 5.6c-4.2 3.9-8 8.2-11.4 12.8" />
        </svg>
      </button>
    </li>
  );
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
      className={cx('motiv-sketch-toast-stack', className)}
      {...sectionProps}
    >
      <ToastLiveRegions items={announcements} />
      <ol ref={listRef} className="motiv-sketch-toast-stack__list">
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
