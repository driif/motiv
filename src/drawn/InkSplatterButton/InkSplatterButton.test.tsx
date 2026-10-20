import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { InkSplatterButton } from './InkSplatterButton';

let reduce = false;
const animate = vi.fn();

beforeEach(() => {
  reduce = false;
  animate.mockClear();
  vi.stubGlobal('matchMedia', () => ({ matches: reduce }));
  Element.prototype.animate = animate;
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.useRealTimers();
});

describe('InkSplatterButton', () => {
  it('renders a type="button" with merged className and calls onClick', () => {
    const onClick = vi.fn();
    render(
      <InkSplatterButton className="x" onClick={onClick}>
        Send
      </InkSplatterButton>,
    );
    const button = screen.getByRole('button', { name: 'Send' });
    expect(button).toHaveClass('motiv-splatter-button', 'x');
    expect(button).toHaveAttribute('type', 'button');
    fireEvent.click(button);
    expect(onClick).toHaveBeenCalledTimes(1);
    expect(animate).toHaveBeenCalledTimes(1);
  });

  it('remounts the drops on every click', () => {
    const { container } = render(<InkSplatterButton>Send</InkSplatterButton>);
    expect(container.querySelector('.motiv-splatter-button__drops')).toBeNull();
    fireEvent.click(screen.getByRole('button'));
    const first = container.querySelector('.motiv-splatter-button__drops');
    expect(first?.children).toHaveLength(8);
    fireEvent.click(screen.getByRole('button'));
    expect(container.querySelector('.motiv-splatter-button__drops')).not.toBe(first);
  });

  it('skips the squish under reduced motion', () => {
    reduce = true;
    render(<InkSplatterButton>Send</InkSplatterButton>);
    fireEvent.click(screen.getByRole('button'));
    expect(animate).not.toHaveBeenCalled();
  });

  it('swaps to the success label and announces it for 1500ms', () => {
    vi.useFakeTimers();
    const { container } = render(<InkSplatterButton successLabel="Sent">Send</InkSplatterButton>);
    const live = container.querySelector('[aria-live="polite"]');
    expect(live).toBeEmptyDOMElement();
    fireEvent.click(screen.getByRole('button', { name: 'Send' }));
    expect(screen.getByRole('button', { name: 'Sent' })).toBeInTheDocument();
    expect(live).toHaveTextContent('Sent');
    act(() => vi.advanceTimersByTime(1500));
    expect(screen.getByRole('button', { name: 'Send' })).toBeInTheDocument();
    expect(live).toBeEmptyDOMElement();
  });
});
