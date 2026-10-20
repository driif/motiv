import { act, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { ProgressRing } from './ProgressRing';

describe('ProgressRing', () => {
  it('is a labelled progressbar with a clamped, rounded value', () => {
    const { rerender } = render(<ProgressRing value={42.4} label="Upload" className="x" />);
    const ring = screen.getByRole('progressbar', { name: 'Upload' });
    expect(ring).toHaveClass('motiv-ring', 'x');
    expect(ring).toHaveAttribute('aria-valuenow', '42');
    expect(ring).toHaveTextContent('42%');
    expect(ring).not.toHaveAttribute('data-done');
    rerender(<ProgressRing value={140} label="Upload" />);
    expect(ring).toHaveAttribute('aria-valuenow', '100');
    expect(ring).toHaveAttribute('data-done');
  });

  it('continues the count from the number on screen when the value changes mid-way', () => {
    vi.useFakeTimers({ toFake: ['requestAnimationFrame', 'cancelAnimationFrame', 'performance'] });
    const { rerender } = render(<ProgressRing value={0} label="Upload" />);
    const num = () => Number(screen.getByRole('progressbar').querySelector('b')?.textContent);
    rerender(<ProgressRing value={100} label="Upload" />);
    act(() => vi.advanceTimersByTime(500));
    const midway = num();
    expect(midway).toBeGreaterThan(0);
    expect(midway).toBeLessThan(100);
    rerender(<ProgressRing value={20} label="Upload" />);
    expect(num()).toBe(midway);
    act(() => vi.advanceTimersByTime(1100));
    expect(num()).toBe(20);
    vi.useRealTimers();
  });

  it('keeps the number at 100% without the check', () => {
    render(<ProgressRing value={100} label="Sync" showCheck={false} />);
    expect(screen.getByRole('progressbar')).not.toHaveAttribute('data-done');
  });
});
