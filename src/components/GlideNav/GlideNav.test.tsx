import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { GlideNav } from './GlideNav';

const items = [
  { id: 'inbox', label: 'Inbox', count: 4 },
  { id: 'drafts', label: 'Drafts' },
  { id: 'sent', label: 'Sent' },
];

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
    expect(onChange).toHaveBeenCalledWith('sent');
  });
});
