import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { ThemeToggle } from './ThemeToggle';

describe('ThemeToggle', () => {
  it('reflects dark in aria-pressed and reports clicks', () => {
    const onToggle = vi.fn();
    const { rerender } = render(<ThemeToggle dark={false} onToggle={onToggle} className="x" />);
    const button = screen.getByRole('button', { name: 'Dark mode' });
    expect(button).toHaveClass('motiv-theme-toggle', 'x');
    expect(button).toHaveAttribute('aria-pressed', 'false');
    expect(button).not.toHaveAttribute('title');
    fireEvent.click(button);
    expect(onToggle).toHaveBeenCalledTimes(1);
    rerender(<ThemeToggle dark onToggle={onToggle} />);
    expect(button).toHaveAttribute('aria-pressed', 'true');
    expect(document.documentElement).not.toHaveAttribute('data-theme');
  });

  it('takes a custom label', () => {
    render(<ThemeToggle dark onToggle={vi.fn()} label="Night" />);
    expect(screen.getByRole('button', { name: 'Night' })).toBeInTheDocument();
  });
});
