import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { MenuButton } from './MenuButton';

describe('MenuButton', () => {
  it('reflects open in aria-expanded and reports clicks', () => {
    const onToggle = vi.fn();
    const { rerender } = render(
      <MenuButton open={false} onToggle={onToggle} aria-controls="nav" className="x" />,
    );
    const button = screen.getByRole('button', { name: 'Menu' });
    expect(button).toHaveClass('motiv-menu-button', 'x');
    expect(button).toHaveAttribute('aria-expanded', 'false');
    expect(button).toHaveAttribute('aria-controls', 'nav');
    fireEvent.click(button);
    expect(onToggle).toHaveBeenCalledTimes(1);
    rerender(<MenuButton open onToggle={onToggle} />);
    expect(button).toHaveAttribute('aria-expanded', 'true');
  });

  it('takes a custom label', () => {
    render(<MenuButton open={false} onToggle={vi.fn()} label="Navigation" />);
    expect(screen.getByRole('button', { name: 'Navigation' })).toBeInTheDocument();
  });
});
