import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { GlideNav } from './GlideNav';

const items = [
  { id: 'inbox', label: 'Inbox', count: 4 },
  { id: 'drafts', label: 'Drafts' },
  { id: 'sent', label: 'Sent' },
];

let resize = () => {};
beforeEach(() => {
  vi.stubGlobal(
    'ResizeObserver',
    class {
      constructor(callback: () => void) {
        resize = callback;
      }
      observe() {}
      disconnect() {}
    },
  );
});

describe('GlideNav', () => {
  it('is a nav landmark marking the current item', () => {
    render(<GlideNav items={items} value="drafts" onChange={vi.fn()} label="Mail" className="x" />);
    const nav = screen.getByRole('navigation', { name: 'Mail' });
    expect(nav).toHaveClass('motiv-glide-nav', 'x');
    expect(screen.getByRole('button', { name: 'Drafts' })).toHaveAttribute('aria-current', 'page');
    expect(screen.getByRole('button', { name: 'Sent' })).not.toHaveAttribute('aria-current');
    expect(screen.getByRole('button', { name: /^Inbox, ?4$/ })).toBeInTheDocument();
  });

  it('reports the chosen id', () => {
    const onChange = vi.fn();
    render(<GlideNav items={items} value="inbox" onChange={onChange} label="Mail" />);
    fireEvent.click(screen.getByRole('button', { name: 'Sent' }));
    expect(onChange).toHaveBeenCalledWith('sent', expect.objectContaining({ type: 'click' }));
  });

  it('renders href items as links and passes the click event', () => {
    const onChange = vi.fn((_id: string, event?: { preventDefault: () => void }) =>
      event?.preventDefault(),
    );
    render(
      <GlideNav
        items={[
          { id: 'inbox', label: 'Inbox', href: '#inbox' },
          { id: 'sent', label: 'Sent', href: '#sent' },
        ]}
        value="inbox"
        onChange={onChange}
        label="Mail"
      />,
    );
    expect(screen.getByRole('link', { name: 'Inbox' })).toHaveAttribute('aria-current', 'page');
    const sent = screen.getByRole('link', { name: 'Sent' });
    expect(sent).toHaveAttribute('href', '#sent');
    expect(sent).toHaveClass('motiv-glide-nav__item');
    expect(fireEvent.click(sent)).toBe(false);
    expect(onChange).toHaveBeenCalledWith('sent', expect.objectContaining({ type: 'click' }));
  });

  it('marks the nav once the bar is placed', () => {
    render(<GlideNav items={items} value="inbox" onChange={() => {}} label="Mail" />);
    expect(screen.getByRole('navigation')).toHaveAttribute('data-placed');
  });

  it('moves the bar when the rows resize', () => {
    render(<GlideNav items={items} value="sent" onChange={() => {}} label="Mail" />);
    const sent = screen.getByRole('button', { name: 'Sent' });
    const bar = document.querySelector<HTMLElement>('.motiv-glide-nav__bar');
    Object.defineProperty(sent, 'offsetTop', { configurable: true, value: 66 });
    resize();
    expect(bar?.style.transform).toBe('translateY(66px)');
  });

  it('places the bar where ResizeObserver is missing', () => {
    vi.stubGlobal('ResizeObserver', undefined);
    render(<GlideNav items={items} value="inbox" onChange={() => {}} label="Mail" />);
    expect(screen.getByRole('navigation')).toHaveAttribute('data-placed');
  });
});
