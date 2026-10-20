import { fireEvent, render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { LiquidSwitch } from './LiquidSwitch';

describe('LiquidSwitch', () => {
  it('is a switch named by its label that reports the next state', () => {
    const onChange = vi.fn();
    const { rerender } = render(<LiquidSwitch checked={false} onChange={onChange} label="Wi-Fi" />);
    const toggle = screen.getByRole('switch', { name: 'Wi-Fi' });
    expect(toggle).toHaveAttribute('aria-checked', 'false');
    fireEvent.click(toggle);
    expect(onChange).toHaveBeenCalledWith(true);
    rerender(<LiquidSwitch checked onChange={onChange} label="Wi-Fi" />);
    expect(toggle).toHaveAttribute('aria-checked', 'true');
    fireEvent.click(screen.getByText('Wi-Fi'));
    expect(onChange).toHaveBeenLastCalledWith(false);
  });

  it('puts className on the wrapper and ref and native props on the button', () => {
    const ref = createRef<HTMLButtonElement>();
    const { container } = render(
      <LiquidSwitch ref={ref} checked onChange={vi.fn()} label="A" className="x" disabled />,
    );
    expect(container.firstChild).toHaveClass('motiv-liquid', 'x');
    expect(ref.current).toBe(screen.getByRole('switch'));
    expect(ref.current).toBeDisabled();
  });
});
