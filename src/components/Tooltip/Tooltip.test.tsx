import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Tooltip } from './Tooltip';

describe('Tooltip', () => {
  it('describes the info trigger with the note', () => {
    render(<Tooltip content="Leave a little room." className="x" data-testid="t" />);
    expect(screen.getByTestId('t')).toHaveClass('motiv-tip', 'x');
    expect(screen.getByRole('button', { name: 'More information' })).toHaveAccessibleDescription(
      'Leave a little room.',
    );
  });

  it('opens on click and dismisses on Escape and outside pointerdown', () => {
    render(
      <>
        <Tooltip content="Note" label="About fees" data-testid="t" />
        <button type="button">Elsewhere</button>
      </>,
    );
    const wrapper = screen.getByTestId('t');
    const trigger = screen.getByRole('button', { name: 'About fees' });
    fireEvent.click(trigger);
    expect(wrapper).toHaveAttribute('data-open');
    fireEvent.pointerDown(screen.getByRole('button', { name: 'Elsewhere' }));
    expect(wrapper).not.toHaveAttribute('data-open');
    fireEvent.pointerEnter(wrapper);
    fireEvent.keyDown(document.body, { key: 'Escape' });
    expect(wrapper).toHaveAttribute('data-dismissed');
    fireEvent.pointerLeave(wrapper);
    expect(wrapper).not.toHaveAttribute('data-dismissed');
  });
});
