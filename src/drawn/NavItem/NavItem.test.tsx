import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { NavItem } from './NavItem';

describe('NavItem', () => {
  it('renders a link when href is given', () => {
    const onClick = vi.fn();
    render(<NavItem href="#home" icon="⌂" label="Home" className="x" onClick={onClick} />);
    const link = screen.getByRole('link', { name: 'Home' });
    expect(link).toHaveAttribute('href', '#home');
    expect(link).toHaveClass('motiv-nav-item', 'x');
    expect(link).not.toHaveAttribute('aria-current');
    fireEvent.click(link);
    expect(onClick).toHaveBeenCalled();
  });

  it('renders a button without href', () => {
    const onClick = vi.fn();
    render(<NavItem icon="⚙" label="Settings" onClick={onClick} />);
    const button = screen.getByRole('button', { name: 'Settings' });
    expect(button).toHaveAttribute('type', 'button');
    fireEvent.click(button);
    expect(onClick).toHaveBeenCalled();
  });

  it('marks the active item as the current page', () => {
    render(<NavItem href="/" icon="⌂" label="Home" active />);
    expect(screen.getByRole('link')).toHaveAttribute('aria-current', 'page');
  });

  it('adds a decorative chevron only with hasSubmenu', () => {
    const { container, rerender } = render(<NavItem icon="⚙" label="Settings" />);
    expect(container.querySelector('.motiv-nav-item__chevron')).toBeNull();
    rerender(<NavItem icon="⚙" label="Settings" hasSubmenu />);
    expect(container.querySelector('.motiv-nav-item__chevron')).toHaveAttribute(
      'aria-hidden',
      'true',
    );
    expect(screen.getByRole('button', { name: 'Settings' })).toBeInTheDocument();
  });
});
