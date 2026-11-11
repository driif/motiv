import { fireEvent, render, screen, within } from '@testing-library/react';
import { createRef } from 'react';
import { afterAll, afterEach, beforeAll, describe, expect, it, vi } from 'vitest';
import {
  type NotificationItem,
  NotificationList,
  type NotificationListProps,
} from './NotificationList';

const items: NotificationItem[] = [
  { id: 'a', title: 'Build passed', time: '2 min ago', tone: 'success' },
  { id: 'b', title: 'New comment', text: 'Ada replied to your post.', time: '1 h ago' },
  { id: 'c', title: 'Disk almost full', time: 'Yesterday', tone: 'warning', href: '/disk' },
];

function renderList(props: Partial<NotificationListProps> = {}) {
  const callbacks = { onDismiss: vi.fn(), onDismissAll: vi.fn() };
  const view = render(<NotificationList items={items} {...callbacks} {...props} />);
  return { ...view, ...callbacks };
}

const toggle = (element: Element, newState: string) =>
  fireEvent(element, Object.assign(new Event('toggle'), { newState }));

const panel = () => document.querySelector<HTMLElement>('.motiv-notification-list') as HTMLElement;

describe('NotificationList', () => {
  // jsdom hides popovers but has no popover API; show the panel and stub what the component calls.
  const style = document.createElement('style');
  beforeAll(() => {
    style.textContent = '[popover] { display: block !important; }';
    document.head.append(style);
  });
  afterAll(() => style.remove());
  afterEach(() => vi.restoreAllMocks());

  it('wires the bell to a labelled auto popover and passes props and ref to the bell', () => {
    const ref = createRef<HTMLButtonElement>();
    renderList({ ref, className: 'custom', id: 'bell' });
    const bell = screen.getByRole('button', { name: 'Notifications, 3 new' });
    expect(ref.current).toBe(bell);
    expect(bell).toHaveClass('motiv-bell', 'custom');
    expect(bell).toHaveAttribute('id', 'bell');
    const section = screen.getByRole('region', { name: 'Notifications' });
    expect(section).toHaveAttribute('popover', 'auto');
    expect(bell).toHaveAttribute('popovertarget', section.id);
    expect(within(section).getByRole('heading', { level: 2, name: 'Notifications' })).toBeVisible();
  });

  it('opens and closes on bell clicks through the native popover', () => {
    renderList();
    const section = panel();
    let open = false;
    section.togglePopover = vi.fn(() => {
      open = !open;
      toggle(section, open ? 'open' : 'closed');
      return open;
    });
    const bell = screen.getByRole('button', { name: /Notifications/ });
    // jsdom has no popovertarget activation; mirror it so a click toggles the panel.
    bell.addEventListener('click', () => section.togglePopover());
    fireEvent.click(bell);
    expect(section.togglePopover).toHaveBeenCalledTimes(1);
    expect(open).toBe(true);
    fireEvent.click(bell);
    expect(open).toBe(false);
  });

  it('renders a list of items with title, text, time and a labelled dismiss button', () => {
    const { onDismiss } = renderList();
    const list = screen.getByRole('list');
    const rows = within(list).getAllByRole('listitem');
    expect(rows).toHaveLength(3);
    expect(rows[0]).toHaveAttribute('data-tone', 'success');
    expect(rows[1]).toHaveAttribute('data-tone', 'info');
    expect(rows[1]).toHaveTextContent('Ada replied to your post.');
    expect(rows[1]).toHaveTextContent('1 h ago');
    fireEvent.click(screen.getByRole('button', { name: 'Dismiss New comment' }));
    expect(onDismiss).toHaveBeenCalledWith('b');
  });

  it('dismisses everything from the footer', () => {
    const { onDismissAll } = renderList();
    fireEvent.click(screen.getByRole('button', { name: 'Dismiss all' }));
    expect(onDismissAll).toHaveBeenCalledTimes(1);
  });

  it('shows the empty text without a list or Dismiss all', () => {
    renderList({ items: [], emptyText: 'All caught up' });
    expect(screen.getByText('All caught up')).toBeInTheDocument();
    expect(screen.queryByRole('list')).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Dismiss all' })).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Notifications' })).toBeInTheDocument();
  });

  it('accepts translated strings and an explicit count', () => {
    renderList({
      count: 1,
      label: 'Mitteilungen',
      newText: 'neu',
      dismissLabel: 'Entfernen',
      dismissAllLabel: 'Alle entfernen',
    });
    expect(screen.getByRole('button', { name: 'Mitteilungen, 1 neu' })).toBeInTheDocument();
    expect(screen.getByRole('region', { name: 'Mitteilungen' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Entfernen Build passed' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Alle entfernen' })).toBeInTheDocument();
  });

  it('renders titles as link, button or text and hides the panel when an item opens', () => {
    const onOpen = vi.fn();
    const { rerender, onDismiss, onDismissAll } = renderList({ onOpen });
    const hide = vi.fn();
    panel().hidePopover = hide;
    const link = screen.getByRole('link', { name: 'Disk almost full' });
    expect(link).toHaveAttribute('href', '/disk');
    fireEvent.click(screen.getByRole('button', { name: 'Build passed' }));
    expect(onOpen).toHaveBeenCalledWith('a');
    expect(hide).toHaveBeenCalledTimes(1);
    fireEvent.click(screen.getByRole('button', { name: 'Dismiss Build passed' }));
    expect(onOpen).toHaveBeenCalledTimes(1);

    rerender(<NotificationList items={items} onDismiss={onDismiss} onDismissAll={onDismissAll} />);
    expect(screen.queryByRole('button', { name: 'Build passed' })).not.toBeInTheDocument();
    expect(screen.getByText('Build passed').tagName).toBe('SPAN');
    expect(screen.getByRole('link', { name: 'Disk almost full' })).toBeInTheDocument();
  });

  it('moves focus to the next, previous, then the heading when the focused item goes away', () => {
    const { rerender, onDismiss, onDismissAll } = renderList();
    toggle(panel(), 'open');
    const show = (next: NotificationItem[]) =>
      rerender(<NotificationList items={next} onDismiss={onDismiss} onDismissAll={onDismissAll} />);

    screen.getByRole('button', { name: 'Dismiss New comment' }).focus();
    show([items[0], items[2]]);
    expect(screen.getByRole('button', { name: 'Dismiss Disk almost full' })).toHaveFocus();

    show([items[0]]);
    expect(screen.getByRole('button', { name: 'Dismiss Build passed' })).toHaveFocus();

    screen.getByRole('button', { name: 'Dismiss all' }).focus();
    show([]);
    expect(screen.getByRole('heading', { name: 'Notifications' })).toHaveFocus();
  });

  it('follows the focused item across inserts and batched removals', () => {
    const { rerender, onDismiss, onDismissAll } = renderList();
    toggle(panel(), 'open');
    const show = (next: NotificationItem[]) =>
      rerender(<NotificationList items={next} onDismiss={onDismiss} onDismissAll={onDismissAll} />);
    const added = { id: 'x', title: 'Deploy started', time: 'now' };

    screen.getByRole('button', { name: 'Dismiss New comment' }).focus();
    show([added, ...items]);
    show([added, items[0], items[2]]);
    expect(screen.getByRole('button', { name: 'Dismiss Disk almost full' })).toHaveFocus();

    show([added, ...items]);
    screen.getByRole('button', { name: 'Dismiss Disk almost full' }).focus();
    show([added, items[0]]);
    expect(screen.getByRole('button', { name: 'Dismiss Build passed' })).toHaveFocus();
  });

  it('leaves focus alone when it is outside the panel', () => {
    const { rerender, onDismiss, onDismissAll } = renderList();
    toggle(panel(), 'open');
    const bell = screen.getByRole('button', { name: /Notifications/ });
    screen.getByRole('button', { name: 'Dismiss New comment' }).focus();
    bell.focus();
    rerender(
      <NotificationList items={[items[0]]} onDismiss={onDismiss} onDismissAll={onDismissAll} />,
    );
    expect(bell).toHaveFocus();
  });

  it('places the panel under the bell, flips it when it does not fit, and re-measures on updates', () => {
    vi.spyOn(document.documentElement, 'clientWidth', 'get').mockReturnValue(1000);
    vi.spyOn(document.documentElement, 'clientHeight', 'get').mockReturnValue(800);
    const { rerender, onDismiss, onDismissAll } = renderList();
    const section = panel();
    const rect = vi
      .spyOn(screen.getByRole('button', { name: /Notifications/ }), 'getBoundingClientRect')
      .mockReturnValue({ top: 100, bottom: 140, right: 900 } as DOMRect);
    const size = vi
      .spyOn(section, 'getBoundingClientRect')
      .mockReturnValue({ width: 0, height: 0 } as DOMRect);
    fireEvent(section, Object.assign(new Event('beforetoggle'), { newState: 'open' }));
    expect(section.style.top).toBe('140px');
    expect(section.style.right).toBe('100px');
    expect(section.style.getPropertyValue('--_space')).toBe('660px');

    size.mockReturnValue({ width: 320, height: 300 } as DOMRect);
    rect.mockReturnValue({ top: 700, bottom: 740, right: 200 } as DOMRect);
    toggle(section, 'open');
    expect(section.style.top).toBe('auto');
    expect(section.style.bottom).toBe('100px');
    expect(section.style.right).toBe('680px');

    rect.mockReturnValue({ top: 100, bottom: 140, right: 900 } as DOMRect);
    rerender(
      <NotificationList items={[items[0]]} onDismiss={onDismiss} onDismissAll={onDismissAll} />,
    );
    expect(section.style.top).toBe('140px');
    fireEvent(window, new Event('resize'));
    fireEvent.scroll(section);
    expect(rect).toHaveBeenCalledTimes(4);

    toggle(section, 'closed');
    fireEvent.scroll(document);
    expect(rect).toHaveBeenCalledTimes(4);
  });
});
