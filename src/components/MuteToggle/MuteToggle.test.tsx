import { fireEvent, render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { MuteToggle } from './MuteToggle';

describe('MuteToggle', () => {
  it('reflects muted in aria-pressed and reports the next state', () => {
    const onChange = vi.fn();
    const { rerender } = render(<MuteToggle muted={false} onChange={onChange} />);
    const button = screen.getByRole('button', { name: 'Mute notifications' });
    expect(button).toHaveAttribute('aria-pressed', 'false');
    fireEvent.click(button);
    expect(onChange).toHaveBeenCalledWith(true);
    rerender(<MuteToggle muted onChange={onChange} />);
    expect(button).toHaveAttribute('aria-pressed', 'true');
  });

  it('calls a native onClick and skips onChange when it prevents default', () => {
    const onChange = vi.fn();
    const onClick = vi.fn((event: { preventDefault: () => void }) => event.preventDefault());
    render(<MuteToggle muted={false} onChange={onChange} onClick={onClick} />);
    fireEvent.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalledTimes(1);
    expect(onChange).not.toHaveBeenCalled();
  });

  it('takes custom strings, className, ref and native props', () => {
    const ref = createRef<HTMLButtonElement>();
    render(
      <MuteToggle
        ref={ref}
        muted
        onChange={vi.fn()}
        label="Mute chat"
        onText="Sound on"
        mutedText="Quiet"
        className="x"
      />,
    );
    const button = screen.getByRole('button', { name: 'Mute chat' });
    expect(button).toHaveClass('motiv-mute', 'x');
    expect(button).toHaveTextContent('Quiet');
    expect(ref.current).toBe(button);
  });
});
