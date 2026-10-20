import { fireEvent, render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { FrequencySlider } from './FrequencySlider';

describe('FrequencySlider', () => {
  it('is a labelled range that reports numbers and formats its value', () => {
    const onChange = vi.fn();
    render(<FrequencySlider value={40} onChange={onChange} label="Volume" />);
    const slider = screen.getByRole('slider', { name: 'Volume' });
    expect(slider).toHaveAttribute('aria-valuetext', '40%');
    expect(screen.getByText('40%')).toBeInTheDocument();
    fireEvent.change(slider, { target: { value: '70' } });
    expect(onChange).toHaveBeenCalledWith(70);
  });

  it('merges className on the root and passes ref and native props to the input', () => {
    const ref = createRef<HTMLInputElement>();
    const { container } = render(
      <FrequencySlider
        ref={ref}
        value={5}
        onChange={vi.fn()}
        label="Gain"
        min={0}
        max={10}
        format={(v) => `${v} dB`}
        className="x"
        disabled
      />,
    );
    expect(container.firstChild).toHaveClass('motiv-freq', 'x');
    expect(ref.current).toBe(screen.getByRole('slider'));
    expect(ref.current).toBeDisabled();
    expect(ref.current).toHaveAttribute('aria-valuetext', '5 dB');
  });
});
