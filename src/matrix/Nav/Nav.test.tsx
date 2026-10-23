import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Nav } from './Nav';

const items = [
  { id: 'secrets', label: 'Secrets', count: 12 },
  { id: 'audit', label: 'Audit log' },
];

describe('Nav', () => {
  it('is a labelled list of buttons with the current one marked', () => {
    render(<Nav label="Vault" items={items} value="audit" onChange={vi.fn()} />);
    expect(screen.getByRole('navigation', { name: 'Vault' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Audit log' })).toHaveAttribute(
      'aria-current',
      'page',
    );
    expect(screen.getByRole('button', { name: /^Secrets, ?12$/ })).not.toHaveAttribute(
      'aria-current',
    );
  });

  it('reports the clicked id with the event', () => {
    const onChange = vi.fn();
    render(<Nav label="Vault" items={items} value="secrets" onChange={onChange} />);
    fireEvent.click(screen.getByRole('button', { name: 'Audit log' }));
    expect(onChange).toHaveBeenCalledWith('audit', expect.objectContaining({ type: 'click' }));
  });

  it('renders href items as links', () => {
    render(
      <Nav
        label="Vault"
        items={[...items, { id: 'help', label: 'Help', href: '/help' }]}
        value="help"
        onChange={() => {}}
      />,
    );
    const help = screen.getByRole('link', { name: 'Help' });
    expect(help).toHaveAttribute('href', '/help');
    expect(help).toHaveAttribute('aria-current', 'page');
  });
});
