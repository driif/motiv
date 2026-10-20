import { fireEvent, render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { SpringCheckbox } from './SpringCheckbox';

describe('SpringCheckbox', () => {
  it('is a native checkbox named by its label', () => {
    render(<SpringCheckbox label="Subscribe" />);
    const box = screen.getByRole('checkbox', { name: 'Subscribe' });
    expect(box).not.toBeChecked();
    fireEvent.click(screen.getByText('Subscribe'));
    expect(box).toBeChecked();
  });

  it('works controlled', () => {
    const onChange = vi.fn();
    render(<SpringCheckbox label="Subscribe" checked onChange={onChange} />);
    const box = screen.getByRole('checkbox');
    expect(box).toBeChecked();
    fireEvent.click(box);
    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it('puts className on the label and ref and native props on the input', () => {
    const ref = createRef<HTMLInputElement>();
    const { container } = render(
      <SpringCheckbox ref={ref} label="A" className="x" name="a" disabled />,
    );
    expect(container.firstChild).toHaveClass('motiv-check', 'x');
    expect(ref.current).toBe(screen.getByRole('checkbox'));
    expect(ref.current).toHaveAttribute('name', 'a');
    expect(ref.current).toBeDisabled();
  });
});
