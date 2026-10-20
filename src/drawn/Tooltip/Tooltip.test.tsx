import { fireEvent, render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { Tooltip } from './Tooltip';

function setup() {
  render(
    <>
      <Tooltip content="Leave a little room." className="x" data-testid="t" />
      <button type="button">Elsewhere</button>
    </>,
  );
  return {
    wrapper: screen.getByTestId('t'),
    trigger: screen.getByRole('button', { name: 'More information' }),
  };
}

describe('Tooltip', () => {
  it('describes the trigger with the note', () => {
    const { wrapper, trigger } = setup();
    expect(wrapper).toHaveClass('motiv-tooltip', 'x');
    expect(trigger).toHaveAccessibleDescription('Leave a little room.');
    expect(screen.getByRole('tooltip', { hidden: true })).toHaveTextContent('Leave a little room.');
  });

  it('toggles open on click and closes on an outside pointerdown', () => {
    const { wrapper, trigger } = setup();
    fireEvent.click(trigger);
    expect(wrapper).toHaveAttribute('data-open');
    fireEvent.pointerDown(wrapper);
    expect(wrapper).toHaveAttribute('data-open');
    fireEvent.pointerDown(screen.getByRole('button', { name: 'Elsewhere' }));
    expect(wrapper).not.toHaveAttribute('data-open');
    fireEvent.click(trigger);
    fireEvent.click(trigger);
    expect(wrapper).not.toHaveAttribute('data-open');
    expect(wrapper).toHaveAttribute('data-dismissed');
  });

  it('marks keyboard focus on the wrapper and clears it on blur', () => {
    const { wrapper, trigger } = setup();
    // jsdom never matches :focus-visible.
    vi.spyOn(trigger, 'matches').mockReturnValue(true);
    fireEvent.focus(trigger);
    expect(wrapper).toHaveAttribute('data-focus-visible');
    fireEvent.blur(trigger);
    expect(wrapper).not.toHaveAttribute('data-focus-visible');
  });

  it('dismisses on Escape from the focused trigger until blur', () => {
    const { wrapper, trigger } = setup();
    trigger.focus();
    fireEvent.keyDown(trigger, { key: 'Escape' });
    expect(wrapper).toHaveAttribute('data-dismissed');
    fireEvent.blur(trigger);
    expect(wrapper).not.toHaveAttribute('data-dismissed');
  });

  it('dismisses a hovered note on Escape anywhere until the pointer leaves', () => {
    const { wrapper } = setup();
    fireEvent.pointerEnter(wrapper);
    fireEvent.keyDown(document.body, { key: 'Escape' });
    expect(wrapper).toHaveAttribute('data-dismissed');
    fireEvent.pointerLeave(wrapper);
    expect(wrapper).not.toHaveAttribute('data-dismissed');
  });

  it('takes a custom label and passes the ref to the wrapper', () => {
    const ref = createRef<HTMLSpanElement>();
    render(<Tooltip ref={ref} content="Note" label="About fees" />);
    expect(screen.getByRole('button', { name: 'About fees' }).parentElement).toBe(ref.current);
  });
});
