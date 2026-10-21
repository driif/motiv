import { fireEvent, render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { Slider } from './Slider';

describe('Slider', () => {
  it('is a labelled range that reports numbers', () => {
    const onChange = vi.fn();
    render(<Slider value={20} onChange={onChange} label="Budget" format={(v) => `€${v}`} />);
    const slider = screen.getByRole('slider', { name: 'Budget' });
    expect(slider).toHaveAttribute('aria-valuetext', '€20');
    fireEvent.change(slider, { target: { value: '55' } });
    expect(onChange).toHaveBeenCalledWith(55);
  });

  it('fills to the value within a custom range', () => {
    const { container, rerender } = render(
      <Slider value={150} onChange={vi.fn()} label="Size" min={100} max={300} step={50} />,
    );
    const root = container.firstChild as HTMLElement;
    const slider = screen.getByRole('slider');
    expect(root.style.getPropertyValue('--_p')).toBe('25.00');
    expect(slider).toHaveAttribute('min', '100');
    expect(slider).toHaveAttribute('max', '300');
    expect(slider).toHaveAttribute('step', '50');
    rerender(<Slider value={300} onChange={vi.fn()} label="Size" min={100} max={300} />);
    expect(root.style.getPropertyValue('--_p')).toBe('100.00');
    expect(slider).toHaveValue('300');
  });

  it('labels marks and passes ref, className, style and native props through', () => {
    const ref = createRef<HTMLInputElement>();
    const { container } = render(
      <Slider
        ref={ref}
        value={0}
        onChange={vi.fn()}
        label="Size"
        marks={[0, 50, 100]}
        className="x"
        style={{ margin: 1 }}
        name="size"
      />,
    );
    const root = container.firstChild as HTMLElement;
    expect(root).toHaveClass('motiv-slider', 'x');
    expect(root.style.margin).toBe('1px');
    expect(ref.current).toBe(screen.getByRole('slider'));
    expect(ref.current).toHaveAttribute('name', 'size');
    expect(screen.getByText('50')).toBeInTheDocument();
  });
});
