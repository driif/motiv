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
    expect(screen.getByTestId('s')).toHaveClass('motiv-sketch-stepper', 'x');
    const spin = screen.getByRole('spinbutton', { name: 'Guests' });
    expect(spin).toHaveAttribute('aria-valuenow', '3');
    expect(spin).toHaveAttribute('aria-valuemin', '0');
    expect(spin).toHaveAttribute('aria-valuemax', '99');
    expect(spin).toHaveTextContent('3');
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

  it('shows fractional values at the precision in play', () => {
    const onChange = vi.fn();
    render(<Stepper label="Dose" value={0.5} onChange={onChange} min={0.25} max={2} step={0.5} />);
    expect(screen.getByRole('spinbutton')).toHaveTextContent('0.50');
    fireEvent.click(screen.getByRole('button', { name: 'Increase Dose' }));
    expect(onChange).toHaveBeenCalledWith(1);
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
