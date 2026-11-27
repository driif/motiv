import { act, fireEvent, render, screen } from '@testing-library/react';
import { hydrateRoot } from 'react-dom/client';
import { renderToString } from 'react-dom/server';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { GlitchThemeToggle } from './GlitchThemeToggle';

let reduce = false;
const animate = vi.fn();

beforeEach(() => {
  reduce = false;
  animate.mockClear();
  vi.stubGlobal('matchMedia', (query: string) => ({
    matches: query.includes('reduced-motion') && reduce,
    addEventListener() {},
    removeEventListener() {},
  }));
  Element.prototype.animate = animate;
});

afterEach(() => {
  vi.unstubAllGlobals();
  delete document.documentElement.dataset.theme;
});

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

  it('follows the root data-theme when dark is omitted, without glitching on hydration', async () => {
    const root = document.documentElement;
    root.dataset.theme = 'dark';
    const html = renderToString(<GlitchThemeToggle onToggle={() => {}} />);
    expect(html).not.toContain('aria-pressed');
    const container = document.createElement('div');
    container.innerHTML = html;
    document.body.append(container);
    const app = await act(async () =>
      hydrateRoot(container, <GlitchThemeToggle onToggle={() => {}} />),
    );
    const button = screen.getByRole('button', { name: 'Toggle theme' });
    expect(button).toHaveAttribute('aria-pressed', 'true');
    expect(button).toHaveClass('motiv-matrix-glitch--dark');
    expect(animate).not.toHaveBeenCalled();
    await act(async () => {
      root.dataset.theme = 'light';
    });
    expect(button).toHaveAttribute('aria-pressed', 'false');
    expect(animate).toHaveBeenCalledTimes(3);
    act(() => app.unmount());
    container.remove();
  });
});
