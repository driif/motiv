import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { GlitchThemeToggle } from './GlitchThemeToggle';

let reduce = false;
const animate = vi.fn();

beforeEach(() => {
  reduce = false;
  animate.mockClear();
  vi.stubGlobal('matchMedia', () => ({ matches: reduce }));
  Element.prototype.animate = animate;
});

afterEach(() => vi.unstubAllGlobals());

describe('GlitchThemeToggle', () => {
  it('is a pressed-state button named "Toggle theme" that reports clicks', () => {
    const onToggle = vi.fn();
    render(<GlitchThemeToggle dark={false} onToggle={onToggle} className="x" />);
    const button = screen.getByRole('button', { name: 'Toggle theme' });
    expect(button).toHaveAttribute('aria-pressed', 'false');
    expect(button).toHaveAttribute('type', 'button');
    expect(button).toHaveClass('motiv-matrix-glitch', 'x');
    fireEvent.click(button);
    expect(onToggle).toHaveBeenCalledTimes(1);
  });

  it('takes a custom label and marks dark', () => {
    render(<GlitchThemeToggle dark onToggle={() => {}} label="Dark mode" />);
    const button = screen.getByRole('button', { name: 'Dark mode' });
    expect(button).toHaveAttribute('aria-pressed', 'true');
    expect(button).toHaveClass('motiv-matrix-glitch--dark');
  });

  it('glitches only when dark changes, and not under reduced motion', () => {
    const { rerender } = render(<GlitchThemeToggle dark={false} onToggle={() => {}} />);
    expect(animate).not.toHaveBeenCalled();
    rerender(<GlitchThemeToggle dark onToggle={() => {}} />);
    expect(animate).toHaveBeenCalledTimes(3);
    reduce = true;
    rerender(<GlitchThemeToggle dark={false} onToggle={() => {}} />);
    expect(animate).toHaveBeenCalledTimes(3);
  });
});
