import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { HoldToConfirmButton } from './HoldToConfirmButton';

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

describe('HoldToConfirmButton', () => {
  it('confirms once after a full pointer hold, announces it and resets', () => {
    const onConfirm = vi.fn();
    const { container } = render(<HoldToConfirmButton onConfirm={onConfirm} className="x" />);
    const button = screen.getByRole('button', {
      name: 'Hold to confirm, press and hold to confirm',
    });
    expect(button).toHaveClass('motiv-hold-button', 'x');
    expect(button).toHaveAttribute('type', 'button');
    fireEvent.pointerDown(button, { button: 0 });
    expect(button).toHaveClass('motiv-hold-button--holding');
    expect(button).toHaveAccessibleName('Keep holding…');
    act(() => vi.advanceTimersByTime(1400));
    expect(onConfirm).toHaveBeenCalledTimes(1);
    expect(button).toHaveClass('motiv-hold-button--confirmed');
    expect(container.querySelector('[aria-live="assertive"]')).toHaveTextContent('Confirmed');
    fireEvent.pointerDown(button, { button: 0 });
    fireEvent.pointerUp(button);
    act(() => vi.advanceTimersByTime(2200));
    expect(onConfirm).toHaveBeenCalledTimes(1);
    expect(button).not.toHaveClass('motiv-hold-button--confirmed');
  });

  it.each(['pointerUp', 'pointerLeave', 'pointerCancel', 'blur'] as const)(
    'cancels on %s',
    (event) => {
      const onConfirm = vi.fn();
      render(<HoldToConfirmButton onConfirm={onConfirm} />);
      const button = screen.getByRole('button');
      fireEvent.pointerDown(button, { button: 0 });
      act(() => vi.advanceTimersByTime(1000));
      fireEvent[event](button);
      act(() => vi.advanceTimersByTime(1000));
      expect(onConfirm).not.toHaveBeenCalled();
      expect(button).not.toHaveClass('motiv-hold-button--holding');
    },
  );

  it('holds with Space and Enter and suppresses their native click', () => {
    const onConfirm = vi.fn();
    render(<HoldToConfirmButton onConfirm={onConfirm} />);
    const button = screen.getByRole('button');
    expect(fireEvent.keyDown(button, { key: 'Enter' })).toBe(false);
    act(() => vi.advanceTimersByTime(500));
    expect(fireEvent.keyUp(button, { key: 'Enter' })).toBe(false);
    act(() => vi.advanceTimersByTime(1400));
    expect(onConfirm).not.toHaveBeenCalled();
    fireEvent.keyDown(button, { key: ' ' });
    fireEvent.keyDown(button, { key: ' ', repeat: true });
    act(() => vi.advanceTimersByTime(1400));
    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  it('ignores secondary buttons and does nothing when disabled', () => {
    const onConfirm = vi.fn();
    const { rerender } = render(<HoldToConfirmButton onConfirm={onConfirm} />);
    fireEvent.pointerDown(screen.getByRole('button'), { button: 2 });
    act(() => vi.advanceTimersByTime(1400));
    rerender(<HoldToConfirmButton onConfirm={onConfirm} disabled />);
    fireEvent.pointerDown(screen.getByRole('button'), { button: 0 });
    act(() => vi.advanceTimersByTime(1400));
    expect(onConfirm).not.toHaveBeenCalled();
  });

  it('cancels a hold when it becomes disabled', () => {
    const onConfirm = vi.fn();
    const { rerender } = render(<HoldToConfirmButton onConfirm={onConfirm} />);
    fireEvent.pointerDown(screen.getByRole('button'), { button: 0 });
    act(() => vi.advanceTimersByTime(1000));
    rerender(<HoldToConfirmButton onConfirm={onConfirm} disabled />);
    act(() => vi.advanceTimersByTime(1000));
    expect(onConfirm).not.toHaveBeenCalled();
    expect(screen.getByRole('button')).not.toHaveClass('motiv-hold-button--holding');
  });

  it('does not submit its form on a short click', () => {
    const onSubmit = vi.fn((event) => event.preventDefault());
    render(
      <form onSubmit={onSubmit}>
        <HoldToConfirmButton onConfirm={vi.fn()} />
      </form>,
    );
    fireEvent.click(screen.getByRole('button'), { detail: 1 });
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('clears its timers on unmount', () => {
    const onConfirm = vi.fn();
    const { unmount } = render(<HoldToConfirmButton onConfirm={onConfirm} />);
    fireEvent.pointerDown(screen.getByRole('button'), { button: 0 });
    unmount();
    act(() => vi.advanceTimersByTime(1400));
    expect(onConfirm).not.toHaveBeenCalled();
  });

  it('takes custom labels', () => {
    render(
      <HoldToConfirmButton
        onConfirm={vi.fn()}
        label="Hold to delete"
        instructions="keep pressing"
      />,
    );
    expect(
      screen.getByRole('button', { name: 'Hold to delete, keep pressing' }),
    ).toBeInTheDocument();
  });

  it('releases implicit touch pointer capture so dragging off cancels', () => {
    render(<HoldToConfirmButton onConfirm={vi.fn()} />);
    const button = screen.getByRole('button');
    // jsdom has no pointer capture, so stub the release this element would call.
    button.releasePointerCapture = vi.fn();
    fireEvent.gotPointerCapture(button, { pointerId: 7 });
    expect(button.releasePointerCapture).toHaveBeenCalledWith(7);
  });

  it('confirms on a screen-reader click (detail 0) but not on a mouse click', () => {
    const onConfirm = vi.fn();
    render(<HoldToConfirmButton onConfirm={onConfirm} />);
    const button = screen.getByRole('button');
    fireEvent.click(button, { detail: 1 });
    expect(onConfirm).not.toHaveBeenCalled();
    fireEvent.click(button, { detail: 0 });
    expect(onConfirm).toHaveBeenCalledTimes(1);
    expect(button).toHaveClass('motiv-hold-button--confirmed');
  });

  it('still calls the consumer event handlers', () => {
    const handlers = {
      onPointerDown: vi.fn(),
      onPointerUp: vi.fn(),
      onPointerLeave: vi.fn(),
      onPointerCancel: vi.fn(),
      onBlur: vi.fn(),
      onKeyDown: vi.fn(),
      onKeyUp: vi.fn(),
      onContextMenu: vi.fn(),
      onGotPointerCapture: vi.fn(),
    };
    render(<HoldToConfirmButton onConfirm={vi.fn()} {...handlers} />);
    const button = screen.getByRole('button');
    fireEvent.pointerDown(button, { button: 0 });
    fireEvent.pointerUp(button);
    fireEvent.pointerLeave(button);
    fireEvent.pointerCancel(button);
    fireEvent.blur(button);
    fireEvent.keyDown(button, { key: 'a' });
    fireEvent.keyUp(button, { key: 'a' });
    fireEvent.contextMenu(button);
    button.releasePointerCapture = vi.fn();
    fireEvent.gotPointerCapture(button);
    for (const handler of Object.values(handlers)) expect(handler).toHaveBeenCalledTimes(1);
  });
});
