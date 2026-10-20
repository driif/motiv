import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { ChevronNav } from './ChevronNav';

const sections = [
  {
    title: 'Vault',
    items: [
      { id: 'secrets', label: 'Secrets', icon: <svg />, expandable: true },
      { id: 'policies', label: 'Policies' },
    ],
  },
  { items: [{ id: 'docs', label: 'Docs', href: '/docs' }] },
];

describe('ChevronNav', () => {
  it('is a labelled nav that marks the current item', () => {
    render(
      <ChevronNav
        label="Main"
        sections={sections}
        value="secrets"
        onChange={() => {}}
        className="x"
      />,
    );
    const nav = screen.getByRole('navigation', { name: 'Main' });
    expect(nav).toHaveClass('motiv-matrix-chevnav', 'x');
    expect(screen.getByText('Vault')).toHaveClass('motiv-matrix-chevnav__title');
    const current = screen.getByRole('button', { name: 'Secrets' });
    expect(current).toHaveAttribute('aria-current', 'page');
    expect(current).toHaveClass('motiv-matrix-chevnav__item--active');
    expect(current.querySelector('.motiv-matrix-chevnav__chevs')).toHaveAttribute(
      'aria-hidden',
      'true',
    );
    expect(screen.getByRole('button', { name: 'Policies' })).not.toHaveAttribute('aria-current');
    expect(screen.getByRole('button', { name: 'Policies' }).querySelector('svg')).toBeNull();
  });

  it('renders href items as links and reports clicks with the event', () => {
    const onChange = vi.fn((_id: string, event: { preventDefault(): void }) =>
      event.preventDefault(),
    );
    render(<ChevronNav label="Main" sections={sections} value="secrets" onChange={onChange} />);
    const docs = screen.getByRole('link', { name: 'Docs' });
    expect(docs).toHaveAttribute('href', '/docs');
    fireEvent.click(docs);
    expect(onChange).toHaveBeenCalledWith('docs', expect.anything());
    fireEvent.click(screen.getByRole('button', { name: 'Policies' }));
    expect(onChange).toHaveBeenLastCalledWith('policies', expect.anything());
  });
});
