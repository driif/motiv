import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Nav } from './Nav';

const items = [
  { id: 'inbox', label: 'Inbox', icon: <svg />, count: 4 },
  { id: 'sent', label: 'Sent' },
];

describe('Nav', () => {
  it('is a labelled list of buttons with the current one marked', () => {
    render(<Nav label="Mail" items={items} value="sent" onChange={vi.fn()} />);
    const nav = screen.getByRole('navigation', { name: 'Mail' });
    expect(nav).toHaveClass('motiv-nav');
    expect(screen.getAllByRole('listitem')).toHaveLength(2);
    expect(screen.getByRole('button', { name: 'Sent' })).toHaveAttribute('aria-current', 'page');
    expect(screen.getByRole('button', { name: /^Inbox, ?4$/ })).not.toHaveAttribute('aria-current');
  });

  it('reports the clicked id', () => {
    const onChange = vi.fn();
    render(<Nav label="Mail" items={items} value="inbox" onChange={onChange} />);
    fireEvent.click(screen.getByRole('button', { name: 'Sent' }));
    expect(onChange).toHaveBeenCalledWith('sent');
  });

  it('renders the icon chrome only for items with an icon', () => {
    const { container } = render(
      <Nav label="Mail" items={items} value="inbox" onChange={vi.fn()} />,
    );
    expect(container.querySelectorAll('.motiv-nav-item__icon')).toHaveLength(1);
    expect(container.querySelectorAll('.motiv-nav__count')).toHaveLength(1);
  });
});
