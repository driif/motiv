import { fireEvent, render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { MomentumSlider } from './MomentumSlider';

describe('MomentumSlider', () => {
  it('is a labelled range that reports numbers', () => {
    const onChange = vi.fn();
    render(
      <MomentumSlider value={20} onChange={onChange} label="Budget" format={(v) => `€${v}`} />,
    );
    const slider = screen.getByRole('slider', { name: 'Budget' });
    expect(slider).toHaveAttribute('aria-valuetext', '€20');
    fireEvent.change(slider, { target: { value: '55' } });
    expect(onChange).toHaveBeenCalledWith(55);
  });

  it('labels marks and passes ref, className and native props through', () => {
    const ref = createRef<HTMLInputElement>();
    const { container } = render(
      <MomentumSlider
        ref={ref}
        value={0}
        onChange={vi.fn()}
        label="Size"
        marks={[0, 50, 100]}
        className="x"
        name="size"
      />,
    );
    expect(container.firstChild).toHaveClass('motiv-momentum', 'x');
    expect(ref.current).toBe(screen.getByRole('slider'));
    expect(ref.current).toHaveAttribute('name', 'size');
    expect(screen.getByText('50')).toBeInTheDocument();
  });
});
