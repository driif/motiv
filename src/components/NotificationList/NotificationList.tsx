import { type ReactNode, type ToggleEvent, useId, useLayoutEffect, useRef, useState } from 'react';
import { Icon } from '../../utils/Icon';
import { mergeRefs } from '../../utils/mergeRefs';
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

// On beforetoggle the panel is still hidden and measures 0×0, so it opens below the trigger;
// the layout effect measures again once it shows and flips it above when it does not fit.
function position(trigger: HTMLElement, panel: HTMLElement) {
  const rect = trigger.getBoundingClientRect();
  const { clientWidth, clientHeight } = document.documentElement;
  panel.style.removeProperty('--_space');
  const { width, height } = panel.getBoundingClientRect();
  const below = clientHeight - rect.bottom;
  const flip = height > below && rect.top > below;
  panel.style.setProperty('--_space', `${Math.max(0, flip ? rect.top : below)}px`);
  panel.style.top = flip ? 'auto' : `${rect.bottom}px`;
  panel.style.bottom = flip ? `${clientHeight - rect.top}px` : 'auto';
  panel.style.right = `${Math.max(0, Math.min(clientWidth - rect.right, clientWidth - width))}px`;
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
  const id = useId();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  // Id of the item that last held focus in the panel ('' for Dismiss all), and the items it was in.
  const focusId = useRef<string | null>(null);
  const prevItems = useRef(items);
  const [open, setOpen] = useState(false);

  // Changed items resize the panel.
  useLayoutEffect(() => {
    const trigger = triggerRef.current;
    const panel = panelRef.current;
    if (!open || !trigger || !panel) return;
    const reposition = (event?: Event) => {
      // Scrolling the panel itself must not re-measure: clearing its max-height resets scrollTop.
      if (!(event?.target instanceof Node && panel.contains(event.target)))
        position(trigger, panel);
    };
    reposition();
    window.addEventListener('scroll', reposition, true);
    window.addEventListener('resize', reposition);
    return () => {
      window.removeEventListener('scroll', reposition, true);
      window.removeEventListener('resize', reposition);
    };
  }, [open, items]);

  // Changed items may remove the focused one: focus the next survivor, else the previous one.
  useLayoutEffect(() => {
    const prev = prevItems.current;
    prevItems.current = items;
    const panel = panelRef.current;
    const focused = focusId.current;
    if (focused === null || !panel || panel.contains(document.activeElement)) return;
    const at = prev.findIndex((item) => item.id === focused);
    const survivor = [...prev.slice(at + 1), ...prev.slice(0, Math.max(at, 0)).reverse()].find(
      (item) => items.some((next) => next.id === item.id),
    );
    const index = items.findIndex((item) => item.id === survivor?.id);
    const buttons = panel.querySelectorAll<HTMLElement>('.motiv-notification-list__dismiss');
    (buttons[index] ?? headingRef.current)?.focus();
  }, [items]);

  const openItem = (itemId: string) => {
    onOpen?.(itemId);
    panelRef.current?.hidePopover();
  };

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
        onBeforeToggle={(event: ToggleEvent<HTMLElement>) => {
          if (event.newState === 'closed') focusId.current = null;
          else if (triggerRef.current) position(triggerRef.current, event.currentTarget);
        }}
        onToggle={(event: ToggleEvent<HTMLElement>) => setOpen(event.newState === 'open')}
        onBlur={(event) => {
          // A removed element blurs without a relatedTarget; keep its id for the recovery.
          if (event.relatedTarget && !event.currentTarget.contains(event.relatedTarget))
            focusId.current = null;
        }}
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
                  onFocus={() => {
                    focusId.current = item.id;
                  }}
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
                onFocus={() => {
                  focusId.current = '';
                }}
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
