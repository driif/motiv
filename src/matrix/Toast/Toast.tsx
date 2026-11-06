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
      className={`motiv-matrix-toast motiv-matrix-toast--${item.tone}`}
      data-exiting={item.dismissed || undefined}
    >
      <span className="motiv-matrix-toast__tag" aria-hidden="true" />
      <div className="motiv-matrix-toast__content">
        <div className="motiv-matrix-toast__title">{item.title}</div>
        {item.description && (
          <div className="motiv-matrix-toast__description">{item.description}</div>
        )}
      </div>
      <button
        className="motiv-matrix-toast__dismiss"
        type="button"
        aria-label={dismissLabel}
        tabIndex={item.dismissed ? -1 : undefined}
        onClick={() => dismissToast(item.id)}
      />
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
      className={cx('motiv-matrix-toast-stack', className)}
      {...sectionProps}
    >
      <ToastLiveRegions items={announcements} />
      <ol ref={listRef} className="motiv-matrix-toast-stack__list">
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
