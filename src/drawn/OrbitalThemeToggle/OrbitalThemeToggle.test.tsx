import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { OrbitalThemeToggle } from './OrbitalThemeToggle';

describe('OrbitalThemeToggle', () => {
  it('reflects dark in aria-pressed and the modifier, and reports clicks', () => {
    const onToggle = vi.fn();
    const { container, rerender } = render(
      <OrbitalThemeToggle dark={false} onToggle={onToggle} className="x" id="o" />,
    );
    const root = container.firstElementChild;
    expect(root).toHaveClass('motiv-orbital-toggle', 'x');
    expect(root).not.toHaveClass('motiv-orbital-toggle--dark');
    expect(root).toHaveAttribute('id', 'o');
    expect(root).not.toHaveAttribute('role');
    expect(root).not.toHaveAttribute('data-theme');
    const button = screen.getByRole('button', { name: 'Dark mode' });
    expect(button).toHaveAttribute('aria-pressed', 'false');
    fireEvent.click(button);
    expect(onToggle).toHaveBeenCalledTimes(1);
    rerender(<OrbitalThemeToggle dark onToggle={onToggle} />);
    expect(button).toHaveAttribute('aria-pressed', 'true');
    expect(root).toHaveClass('motiv-orbital-toggle--dark');
  });

  it('takes a custom label', () => {
    render(<OrbitalThemeToggle dark onToggle={vi.fn()} label="Night" />);
    expect(screen.getByRole('button', { name: 'Night' })).toBeInTheDocument();
  });

  it('renders the default copy as hidden decoration', () => {
    const { container } = render(<OrbitalThemeToggle dark={false} onToggle={vi.fn()} />);
    const root = container.firstElementChild as HTMLElement;
    expect(root).toHaveTextContent('Fig. 01 / A change of atmosphere');
    expect(root).toHaveTextContent('a familiar orbit,an unexpected feeling.');
    expect(root).toHaveTextContent('go on, give it a click');
    for (const child of root.children) {
      if (child.tagName !== 'BUTTON') expect(child).toHaveAttribute('aria-hidden', 'true');
    }
    expect(screen.getByRole('button')).toHaveAccessibleName('Dark mode');
  });

  it('overrides or hides the copy', () => {
    const { container, rerender } = render(
      <OrbitalThemeToggle dark={false} onToggle={vi.fn()} figure="F" note="N" hint="H" />,
    );
    const root = container.firstElementChild as HTMLElement;
    expect(root.querySelector('.motiv-orbital-toggle__figure')).toHaveTextContent('F');
    expect(root.querySelector('.motiv-orbital-toggle__note')).toHaveTextContent('N');
    expect(root.querySelector('.motiv-orbital-toggle__hint')).toHaveTextContent('H');
    rerender(
      <OrbitalThemeToggle dark={false} onToggle={vi.fn()} figure={null} note={null} hint={null} />,
    );
    expect(root.querySelector('.motiv-orbital-toggle__figure')).toBeNull();
    expect(root.querySelector('.motiv-orbital-toggle__note')).toBeNull();
    expect(root.querySelector('.motiv-orbital-toggle__hint')).toBeNull();
    expect(root.querySelectorAll('svg')).toHaveLength(4);
  });

  it('gives each instance its own ink filter', () => {
    const { container } = render(
      <>
        <OrbitalThemeToggle dark={false} onToggle={vi.fn()} />
        <OrbitalThemeToggle dark onToggle={vi.fn()} />
      </>,
    );
    const ids = [...container.querySelectorAll('filter')].map((filter) => filter.id);
    expect(ids).toHaveLength(2);
    expect(ids[0]).not.toBe(ids[1]);
    const washes = container.querySelectorAll<HTMLElement>('.motiv-orbital-toggle__wash');
    ids.forEach((id, i) => {
      expect(id).toMatch(/^motiv-ink-[a-zA-Z0-9_-]+$/);
      expect(washes[i].style.filter).toBe(`url("#${id}")`);
    });
  });
});
