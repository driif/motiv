import { fireEvent, render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { LikeButton } from './LikeButton';

describe('LikeButton', () => {
  it('is a toggle button named with the count that reports the next state', () => {
    const onToggle = vi.fn();
    const { rerender } = render(<LikeButton liked={false} count={41} onToggle={onToggle} />);
    const button = screen.getByRole('button', { name: 'Like, 41' });
    expect(button).toHaveAttribute('aria-pressed', 'false');
    fireEvent.click(button);
    expect(onToggle).toHaveBeenCalledWith(true);
    rerender(<LikeButton liked count={42} onToggle={onToggle} />);
    expect(button).toHaveAttribute('aria-pressed', 'true');
    expect(button).toHaveAccessibleName('Like, 42');
  });

  it('calls a native onClick and skips the toggle when it prevents default', () => {
    const onToggle = vi.fn();
    const onClick = vi.fn((event: { preventDefault: () => void }) => event.preventDefault());
    render(<LikeButton liked={false} count={1} onToggle={onToggle} onClick={onClick} />);
    fireEvent.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalledTimes(1);
    expect(onToggle).not.toHaveBeenCalled();
  });

  it('merges className and passes ref and native props through', () => {
    const ref = createRef<HTMLButtonElement>();
    render(
      <LikeButton
        ref={ref}
        liked
        count={1}
        onToggle={vi.fn()}
        label="Love"
        className="x"
        disabled
      />,
    );
    const button = screen.getByRole('button', { name: 'Love, 1' });
    expect(button).toHaveClass('motiv-like', 'x');
    expect(button).toBeDisabled();
    expect(ref.current).toBe(button);
  });
});
