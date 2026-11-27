import { useEffect, useRef } from 'react';
import type { NotificationListProps } from '../../components/NotificationList';
import { cx } from '../../utils/cx';
import { Icon } from '../../utils/Icon';
import { mergeRefs } from '../../utils/mergeRefs';
import { EASE_OUT, playOnce, SWING } from '../../utils/motion';
import { useNotificationList } from '../../utils/useNotificationList';
import { Button } from '../Button';
import { IconButton } from '../IconButton';

export function NotificationList({
  items,
  onDismiss,
  onDismissAll,
  onOpen,
  count = items.length,
  label = 'Notifications',
  newText = 'new',
  max = 99,
  emptyText = 'No notifications',
  dismissLabel = 'Dismiss',
  dismissAllLabel = 'Dismiss all',
  className,
  ref,
  ...props
}: NotificationListProps) {
  const {
    id,
    triggerRef,
    panelRef,
    headingRef,
    openItem,
    focusItem,
    onBeforeToggle,
    onToggle,
    onBlur,
  } = useNotificationList(items, onOpen, '.motiv-sketch-notification-list__dismiss');
  const iconRef = useRef<HTMLSpanElement>(null);
  const prevCount = useRef(count);

  useEffect(() => {
    if (count > prevCount.current)
      playOnce(iconRef.current, SWING, { duration: 750, easing: EASE_OUT });
    prevCount.current = count;
  }, [count]);

  return (
    <>
      <button
        type="button"
        {...props}
        ref={mergeRefs(triggerRef, ref)}
        popoverTarget={`${id}-panel`}
        aria-label={count > 0 ? `${label}, ${count} ${newText}` : label}
        className={cx('motiv-sketch-bell', className)}
      >
        <svg className="motiv-sketch-bell__ring" viewBox="0 0 52 52" aria-hidden="true">
          <path d="M27 4C41 4 48 14 48 26C48 39 39 48 26 48C13 48 4 39 4 26C4 14 13 5 29 5" />
        </svg>
        <span ref={iconRef} className="motiv-sketch-bell__icon" aria-hidden="true">
          <Icon>
            <path d="M6.2 16.3c.4-1.8-.1-3.6.1-5.4.3-3.2 2.7-5.6 5.8-5.6 3.2.1 5.6 2.6 5.7 5.8.1 1.8-.2 3.5.2 5.2l1.4 1.9c-4.9.3-9.8.2-14.7-.1z" />
            <path d="M10.1 20.3c.4 1.2 1.2 1.8 2.1 1.7 1-.1 1.6-.8 1.9-1.8M11.9 5.2c0-.8.1-1.4.3-2" />
          </Icon>
        </span>
        <span className="motiv-sketch-bell__badge" data-on={count > 0} aria-hidden="true">
          {count > max ? `${max}+` : count}
        </span>
      </button>
      <section
        ref={panelRef}
        id={`${id}-panel`}
        popover="auto"
        aria-labelledby={`${id}-heading`}
        className="motiv-sketch-notification-list"
        onBeforeToggle={onBeforeToggle}
        onToggle={onToggle}
        onBlur={onBlur}
      >
        <h2
          ref={headingRef}
          id={`${id}-heading`}
          tabIndex={-1}
          className="motiv-sketch-notification-list__heading"
        >
          {label}
        </h2>
        {items.length === 0 ? (
          <p className="motiv-sketch-notification-list__empty">{emptyText}</p>
        ) : (
          <>
            <ul className="motiv-sketch-notification-list__items">
              {items.map((item) => (
                <li
                  key={item.id}
                  className="motiv-sketch-notification-list__item"
                  data-tone={item.tone ?? 'info'}
                  onFocus={() => focusItem(item.id)}
                >
                  <div className="motiv-sketch-notification-list__body">
                    {item.href ? (
                      <a
                        href={item.href}
                        className="motiv-sketch-notification-list__title"
                        onClick={onOpen && (() => openItem(item.id))}
                      >
                        {item.title}
                      </a>
                    ) : onOpen ? (
                      <button
                        type="button"
                        className="motiv-sketch-notification-list__title"
                        onClick={() => openItem(item.id)}
                      >
                        {item.title}
                      </button>
                    ) : (
                      <span className="motiv-sketch-notification-list__title">{item.title}</span>
                    )}
                    {item.text && (
                      <p className="motiv-sketch-notification-list__text">{item.text}</p>
                    )}
                    <span className="motiv-sketch-notification-list__time">{item.time}</span>
                  </div>
                  <IconButton
                    size="sm"
                    className="motiv-sketch-notification-list__dismiss"
                    label={`${dismissLabel} ${item.title}`}
                    icon={
                      <Icon>
                        <path d="M6.3 5.8c3.9 3.8 7.7 7.9 11.4 12.3M17.6 6.1c-4 3.7-7.8 7.6-11.3 11.9" />
                      </Icon>
                    }
                    onClick={() => onDismiss(item.id)}
                  />
                </li>
              ))}
            </ul>
            <div className="motiv-sketch-notification-list__footer">
              <Button
                variant="ghost"
                size="sm"
                onClick={onDismissAll}
                onFocus={() => focusItem('')}
              >
                {dismissAllLabel}
              </Button>
            </div>
          </>
        )}
      </section>
    </>
  );
}
