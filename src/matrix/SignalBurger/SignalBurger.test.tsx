import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { SignalBurger } from './SignalBurger';

let reduce = false;
const animate = vi.fn();

beforeEach(() => {
  reduce = false;
  animate.mockClear();
  vi.stubGlobal('matchMedia', () => ({ matches: reduce }));
  Element.prototype.animate = animate;
});

afterEach(() => vi.unstubAllGlobals());

describe('SignalBurger', () => {
  it('is a "Menu" button that reports expansion and clicks', () => {
    const onToggle = vi.fn();
    render(<SignalBurger open={false} onToggle={onToggle} aria-controls="nav" className="x" />);
    const button = screen.getByRole('button', { name: 'Menu' });
    expect(button).toHaveAttribute('aria-expanded', 'false');
    expect(button).toHaveAttribute('aria-controls', 'nav');
    expect(button).toHaveAttribute('type', 'button');
    expect(button).toHaveClass('motiv-matrix-burger', 'x');
    fireEvent.click(button);
    expect(onToggle).toHaveBeenCalledTimes(1);
  });

  it('marks open and takes a custom label', () => {
    render(<SignalBurger open onToggle={() => {}} label="Navigation" />);
    const button = screen.getByRole('button', { name: 'Navigation' });
    expect(button).toHaveAttribute('aria-expanded', 'true');
    expect(button).toHaveClass('motiv-matrix-burger--open');
  });

  it('flashes the RGB split on every bar when open changes, not under reduced motion', () => {
    const { rerender } = render(<SignalBurger open={false} onToggle={() => {}} />);
    expect(animate).not.toHaveBeenCalled();
    rerender(<SignalBurger open onToggle={() => {}} />);
    expect(animate).toHaveBeenCalledTimes(6);
    expect(animate.mock.calls[0][1]).toMatchObject({ pseudoElement: '::before' });
    reduce = true;
    rerender(<SignalBurger open={false} onToggle={() => {}} />);
    expect(animate).toHaveBeenCalledTimes(6);
  });
});
