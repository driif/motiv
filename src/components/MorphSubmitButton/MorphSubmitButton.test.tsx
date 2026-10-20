import { act, fireEvent, render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { MorphSubmitButton } from './MorphSubmitButton';

describe('MorphSubmitButton', () => {
  it('goes idle → loading → done → idle around the action', async () => {
    vi.useFakeTimers();
    let resolve = () => {};
    const onAction = vi.fn(() => new Promise<void>((r) => (resolve = r)));
    render(<MorphSubmitButton onAction={onAction} successMs={500} />);
    const button = screen.getByRole('button', { name: /Save changes/ });
    expect(button).toHaveAttribute('data-phase', 'idle');
    fireEvent.click(button);
    expect(onAction).toHaveBeenCalledTimes(1);
    expect(button).toHaveAttribute('data-phase', 'loading');
    expect(button).toHaveAttribute('aria-busy', 'true');
    fireEvent.click(button);
    expect(onAction).toHaveBeenCalledTimes(1);
    await act(async () => resolve());
    expect(button).toHaveAttribute('data-phase', 'done');
    expect(screen.getByText('Saved', { selector: '[aria-live]' })).toBeInTheDocument();
    act(() => vi.advanceTimersByTime(500));
    expect(button).toHaveAttribute('data-phase', 'idle');
    vi.useRealTimers();
  });

  it('returns to idle when the action rejects', async () => {
    const onAction = vi.fn(() => Promise.reject(new Error('nope')));
    render(<MorphSubmitButton onAction={onAction} label="Send" />);
    const button = screen.getByRole('button', { name: /Send/ });
    await act(async () => fireEvent.click(button));
    expect(button).toHaveAttribute('data-phase', 'idle');
  });

  it('shakes on rejection when the consumer passes a ref', async () => {
    const animate = vi.fn();
    HTMLElement.prototype.animate = animate;
    const ref = createRef<HTMLButtonElement>();
    render(<MorphSubmitButton ref={ref} onAction={() => Promise.reject(new Error('nope'))} />);
    const button = screen.getByRole('button');
    await act(async () => fireEvent.click(button));
    expect(ref.current).toBe(button);
    expect(animate).toHaveBeenCalledTimes(1);
    expect(animate.mock.contexts[0]).toBe(button);
    Reflect.deleteProperty(HTMLElement.prototype, 'animate');
  });

  it('merges className and passes ref and native props through', () => {
    const ref = createRef<HTMLButtonElement>();
    render(<MorphSubmitButton ref={ref} onAction={vi.fn()} className="x" type="submit" />);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('motiv-morph', 'x');
    expect(button).toHaveAttribute('type', 'submit');
    expect(ref.current).toBe(button);
  });
});
