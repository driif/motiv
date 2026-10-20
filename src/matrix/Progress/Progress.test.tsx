import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Progress } from './Progress';

describe('Progress', () => {
  it('exposes a labelled progressbar and a hidden visible value', () => {
    const { container } = render(<Progress value={42.4} label="Upload" className="x" />);
    const bar = screen.getByRole('progressbar', { name: 'Upload' });
    expect(bar).toHaveAttribute('aria-valuemin', '0');
    expect(bar).toHaveAttribute('aria-valuemax', '100');
    expect(bar).toHaveAttribute('aria-valuenow', '42');
    const root = container.firstElementChild as HTMLElement;
    expect(root).toHaveClass('motiv-matrix-progress', 'x');
    expect(root.style.getPropertyValue('--_value')).toBe('42');
    expect(screen.getByText('42%')).toHaveAttribute('aria-hidden', 'true');
  });

  it('clamps to 0..100', () => {
    const { rerender } = render(<Progress value={-5} label="Upload" />);
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '0');
    rerender(<Progress value={140} label="Upload" />);
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '100');
  });

  it('hides the value with showValue false', () => {
    render(<Progress value={10} label="Upload" showValue={false} />);
    expect(screen.queryByText('10%')).toBeNull();
  });
});
