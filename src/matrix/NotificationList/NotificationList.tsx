import { useEffect, useRef } from 'react';
import type { NotificationListProps } from '../../components/NotificationList';
import { cx } from '../../utils/cx';
import { Icon } from '../../utils/Icon';
import { mergeRefs } from '../../utils/mergeRefs';
import { playOnce } from '../../utils/motion';
import { useNotificationList } from '../../utils/useNotificationList';
import { Button } from '../Button';
import { IconButton } from '../IconButton';

const BLINK: Keyframe[] = [
  { opacity: 1 },
  { opacity: 0 },
  { opacity: 1 },
  { opacity: 0 },
  { opacity: 1 },
];

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
  } = useNotificationList(items, onOpen, '.motiv-matrix-notification-list__dismiss');
  const badgeRef = useRef<HTMLSpanElement>(null);
  const prevCount = useRef(count);

  useEffect(() => {
    if (count > prevCount.current)
      playOnce(badgeRef.current, BLINK, { duration: 600, easing: 'steps(1)' });
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
        className={cx('motiv-matrix-bell', className)}
      >
        <span className="motiv-matrix-bell__icon" aria-hidden="true">
          <Icon>
            <path d="M6 16v-5a6 6 0 0 1 12 0v5l1.5 2h-15z" />
            <path d="M10 20.5a2 2 0 0 0 4 0" />
          </Icon>
        </span>
        <span
          ref={badgeRef}
          className="motiv-matrix-bell__badge"
          data-on={count > 0}
          aria-hidden="true"
        >
          {count > max ? `${max}+` : String(count).padStart(2, '0')}
        </span>
      </button>
      <section
        ref={panelRef}
        id={`${id}-panel`}
        popover="auto"
        aria-labelledby={`${id}-heading`}
        className="motiv-matrix-notification-list"
        onBeforeToggle={onBeforeToggle}
        onToggle={onToggle}
        onBlur={onBlur}
      >
        <h2
          ref={headingRef}
          id={`${id}-heading`}
          tabIndex={-1}
          className="motiv-matrix-notification-list__heading"
        >
          {label}
        </h2>
        {items.length === 0 ? (
          <p className="motiv-matrix-notification-list__empty">{emptyText}</p>
        ) : (
          <>
            <ul className="motiv-matrix-notification-list__items">
              {items.map((item) => (
                <li
                  key={item.id}
                  className="motiv-matrix-notification-list__item"
                  data-tone={item.tone ?? 'info'}
                  onFocus={() => focusItem(item.id)}
                >
                  <div className="motiv-matrix-notification-list__body">
                    {item.href ? (
                      <a
                        href={item.href}
                        className="motiv-matrix-notification-list__title"
                        onClick={onOpen && (() => openItem(item.id))}
                      >
                        {item.title}
                      </a>
                    ) : onOpen ? (
                      <button
                        type="button"
                        className="motiv-matrix-notification-list__title"
                        onClick={() => openItem(item.id)}
                      >
                        {item.title}
                      </button>
                    ) : (
                      <span className="motiv-matrix-notification-list__title">{item.title}</span>
                    )}
                    {item.text && (
                      <p className="motiv-matrix-notification-list__text">{item.text}</p>
                    )}
                    <span className="motiv-matrix-notification-list__time">{item.time}</span>
                  </div>
                  <IconButton
                    size="sm"
                    className="motiv-matrix-notification-list__dismiss"
                    label={`${dismissLabel} ${item.title}`}
                    icon={
                      <Icon>
                        <path d="M6 6l12 12M18 6 6 18" />
                      </Icon>
                    }
                    onClick={() => onDismiss(item.id)}
                  />
                </li>
              ))}
            </ul>
            <div className="motiv-matrix-notification-list__footer">
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
