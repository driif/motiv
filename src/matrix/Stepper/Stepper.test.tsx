import { fireEvent, render, screen } from '@testing-library/react';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { Stepper } from './Stepper';

function Controlled() {
  const [value, setValue] = useState(2);
  return <Stepper label="Guests" value={value} onChange={setValue} min={1} max={8} />;
}

describe('Stepper', () => {
  it('is a spinbutton with labelled buttons', () => {
    render(<Stepper label="Guests" value={3} onChange={vi.fn()} className="x" data-testid="s" />);
    expect(screen.getByTestId('s')).toHaveClass('motiv-matrix-stepper', 'x');
    const spin = screen.getByRole('spinbutton', { name: 'Guests' });
    expect(spin).toHaveAttribute('aria-valuenow', '3');
    expect(spin).toHaveAttribute('aria-valuemin', '0');
    expect(spin).toHaveAttribute('aria-valuemax', '99');
    expect(spin).toHaveTextContent('03');
    expect(screen.getByRole('button', { name: 'Decrease Guests' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Increase Guests' })).toBeInTheDocument();
  });

  it('steps with buttons and keys and stops at the limits', () => {
    render(<Controlled />);
    const spin = screen.getByRole('spinbutton');
    fireEvent.click(screen.getByRole('button', { name: 'Increase Guests' }));
    expect(spin).toHaveAttribute('aria-valuenow', '3');
    fireEvent.keyDown(spin, { key: 'ArrowDown' });
    fireEvent.keyDown(spin, { key: 'ArrowDown' });
    fireEvent.keyDown(spin, { key: 'ArrowDown' });
    expect(spin).toHaveAttribute('aria-valuenow', '1');
    fireEvent.keyDown(spin, { key: 'End' });
    expect(spin).toHaveAttribute('aria-valuenow', '8');
    fireEvent.keyDown(spin, { key: 'ArrowUp' });
    expect(spin).toHaveAttribute('aria-valuenow', '8');
    fireEvent.keyDown(spin, { key: 'Home' });
    expect(spin).toHaveAttribute('aria-valuenow', '1');
  });

  it('zero-pads only the integer part of the readout', () => {
    const { rerender } = render(
      <Stepper label="Offset" value={-0.5} onChange={vi.fn()} min={-20} max={20} step={0.1} />,
    );
    const spin = screen.getByRole('spinbutton');
    expect(spin).toHaveTextContent('-00.5');
    rerender(<Stepper label="Offset" value={7.25} onChange={vi.fn()} min={-20} max={20} />);
    expect(spin).toHaveTextContent('07.25');
    rerender(<Stepper label="Offset" value={-12} onChange={vi.fn()} min={-20} max={20} />);
    expect(spin).toHaveTextContent('-12');
  });

  it('keeps the precision of bounds finer than the step', () => {
    const onChange = vi.fn();
    render(<Stepper label="Dose" value={0.25} onChange={onChange} min={0.25} max={2} step={0.5} />);
    fireEvent.click(screen.getByRole('button', { name: 'Increase Dose' }));
    expect(onChange).toHaveBeenCalledWith(0.75);
  });

  it('takes custom button labels', () => {
    render(
      <Stepper
        label="Guests"
        value={1}
        onChange={vi.fn()}
        decreaseLabel="Less"
        increaseLabel="More"
      />,
    );
    expect(screen.getByRole('button', { name: 'Less' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'More' })).toBeInTheDocument();
  });
});
