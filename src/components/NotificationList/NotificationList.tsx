import type { ReactNode } from 'react';
import { Icon } from '../../utils/Icon';
import { mergeRefs } from '../../utils/mergeRefs';
import { useNotificationList } from '../../utils/useNotificationList';
import { BellButton, type BellButtonProps } from '../BellButton';
import { Button } from '../Button';
import { IconButton } from '../IconButton';

export interface NotificationItem {
  id: string;
  title: string;
  text?: ReactNode;
  time: ReactNode;
  tone?: 'info' | 'success' | 'warning' | 'danger';
  href?: string;
}

export interface NotificationListProps extends Omit<BellButtonProps, 'count'> {
  items: NotificationItem[];
  onDismiss: (id: string) => void;
  onDismissAll: () => void;
  onOpen?: (id: string) => void;
  /** Unread count shown on the bell; defaults to `items.length`. */
  count?: number;
  emptyText?: string;
  dismissLabel?: string;
  dismissAllLabel?: string;
}

export function NotificationList({
  items,
  onDismiss,
  onDismissAll,
  onOpen,
  count = items.length,
  label = 'Notifications',
  emptyText = 'No notifications',
  dismissLabel = 'Dismiss',
  dismissAllLabel = 'Dismiss all',
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
  } = useNotificationList(items, onOpen, '.motiv-notification-list__dismiss');

  return (
    <>
      <BellButton
        {...props}
        ref={mergeRefs(triggerRef, ref)}
        count={count}
        label={label}
        popoverTarget={`${id}-panel`}
      />
      <section
        ref={panelRef}
        id={`${id}-panel`}
        popover="auto"
        aria-labelledby={`${id}-heading`}
        className="motiv-notification-list"
        onBeforeToggle={onBeforeToggle}
        onToggle={onToggle}
        onBlur={onBlur}
      >
        <h2
          ref={headingRef}
          id={`${id}-heading`}
          tabIndex={-1}
          className="motiv-notification-list__heading"
        >
          {label}
        </h2>
        {items.length === 0 ? (
          <p className="motiv-notification-list__empty">{emptyText}</p>
        ) : (
          <>
            <ul className="motiv-notification-list__items">
              {items.map((item) => (
                <li
                  key={item.id}
                  className="motiv-notification-list__item"
                  data-tone={item.tone ?? 'info'}
                  onFocus={() => focusItem(item.id)}
                >
                  <div className="motiv-notification-list__body">
                    {item.href ? (
                      <a
                        href={item.href}
                        className="motiv-notification-list__title"
                        onClick={onOpen && (() => openItem(item.id))}
                      >
                        {item.title}
                      </a>
                    ) : onOpen ? (
                      <button
                        type="button"
                        className="motiv-notification-list__title"
                        onClick={() => openItem(item.id)}
                      >
                        {item.title}
                      </button>
                    ) : (
                      <span className="motiv-notification-list__title">{item.title}</span>
                    )}
                    {item.text && <p className="motiv-notification-list__text">{item.text}</p>}
                    <span className="motiv-notification-list__time">{item.time}</span>
                  </div>
                  <IconButton
                    size="sm"
                    className="motiv-notification-list__dismiss"
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
            <div className="motiv-notification-list__footer">
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
