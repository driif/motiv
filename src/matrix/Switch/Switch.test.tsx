import { fireEvent, render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { Switch } from './Switch';

describe('Switch', () => {
  it('is a switch named by its label that reports the next state', () => {
    const onChange = vi.fn();
    const { rerender } = render(<Switch checked={false} onChange={onChange} label="Wi-Fi" />);
    const toggle = screen.getByRole('switch', { name: 'Wi-Fi' });
    expect(toggle).toHaveAttribute('aria-checked', 'false');
    fireEvent.click(toggle);
    expect(onChange).toHaveBeenCalledWith(true);
    rerender(<Switch checked onChange={onChange} label="Wi-Fi" />);
    expect(toggle).toHaveAttribute('aria-checked', 'true');
    fireEvent.click(screen.getByText('Wi-Fi'));
    expect(onChange).toHaveBeenLastCalledWith(false);
  });

  it('skips onChange when onClick prevents default', () => {
    const onChange = vi.fn();
    render(
      <Switch
        checked={false}
        onChange={onChange}
        label="A"
        onClick={(event) => event.preventDefault()}
      />,
    );
    fireEvent.click(screen.getByRole('switch'));
    expect(onChange).not.toHaveBeenCalled();
  });

  it('puts className and style on the wrapper and ref and native props on the button', () => {
    const ref = createRef<HTMLButtonElement>();
    const { container } = render(
      <Switch
        ref={ref}
        checked
        onChange={vi.fn()}
        label="A"
        className="x"
        style={{ margin: 1 }}
        disabled
      />,
    );
    const root = container.firstChild as HTMLElement;
    expect(root).toHaveClass('motiv-matrix-switch', 'x');
    expect(root.style.margin).toBe('1px');
    expect(ref.current).toBe(screen.getByRole('switch'));
    expect(ref.current).toBeDisabled();
  });
});
