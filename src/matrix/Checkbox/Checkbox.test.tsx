import { fireEvent, render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { Checkbox } from './Checkbox';

describe('Checkbox', () => {
  it('is a native checkbox named by its label', () => {
    render(<Checkbox label="Subscribe" />);
    const box = screen.getByRole('checkbox', { name: 'Subscribe' });
    expect(box).not.toBeChecked();
    fireEvent.click(screen.getByText('Subscribe'));
    expect(box).toBeChecked();
  });

  it('works controlled', () => {
    const onChange = vi.fn();
    render(<Checkbox label="Subscribe" checked onChange={onChange} />);
    const box = screen.getByRole('checkbox');
    expect(box).toBeChecked();
    fireEvent.click(box);
    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it('respects disabled', () => {
    render(<Checkbox label="Subscribe" disabled />);
    expect(screen.getByRole('checkbox')).toBeDisabled();
  });

  it('puts className on the label and ref on the input', () => {
    const ref = createRef<HTMLInputElement>();
    const { container } = render(<Checkbox ref={ref} label="A" className="extra" name="a" />);
    expect(container.firstChild).toHaveClass('motiv-matrix-checkbox', 'extra');
    expect(ref.current).toBe(screen.getByRole('checkbox'));
    expect(ref.current).toHaveAttribute('name', 'a');
  });
});
