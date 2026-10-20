import { fireEvent, render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { type RadialAction, RadialMenu } from './RadialMenu';

const actions = (onSelect = vi.fn()): RadialAction[] => [
  { id: 'note', label: 'New note', icon: '✎', onSelect },
  { id: 'photo', label: 'Photo', icon: '◉', onSelect: vi.fn() },
];

describe('RadialMenu', () => {
  it('opens from the trigger and runs an action, closing again', () => {
    const onSelect = vi.fn();
    render(<RadialMenu actions={actions(onSelect)} />);
    expect(screen.getByRole('group', { name: 'Quick actions' })).toHaveAttribute(
      'data-open',
      'false',
    );
    const trigger = screen.getByRole('button', { name: 'Open quick actions' });
    expect(screen.getByRole('button', { name: 'New note' })).toBeDisabled();
    fireEvent.click(trigger);
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    expect(trigger).toHaveAccessibleName('Close quick actions');
    fireEvent.click(screen.getByRole('button', { name: 'New note' }));
    expect(onSelect).toHaveBeenCalledTimes(1);
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    expect(trigger).toHaveFocus();
  });

  it('puts the trigger first so Tab moves on to the opened actions', () => {
    render(<RadialMenu actions={actions()} />);
    const [first, second] = screen.getAllByRole('button');
    expect(first).toHaveAccessibleName('Open quick actions');
    expect(second).toHaveAccessibleName('New note');
  });

  it('closes on Escape and on an outside pointerdown', () => {
    render(<RadialMenu actions={actions()} />);
    const trigger = screen.getByRole('button', { name: 'Open quick actions' });
    fireEvent.click(trigger);
    fireEvent.keyDown(trigger, { key: 'Escape' });
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    fireEvent.click(trigger);
    fireEvent.pointerDown(document.body);
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
  });

  it('merges className and passes ref and native props to the root', () => {
    const ref = createRef<HTMLDivElement>();
    render(<RadialMenu ref={ref} actions={actions()} label="Share" className="x" />);
    const group = screen.getByRole('group', { name: 'Share' });
    expect(group).toHaveClass('motiv-radial', 'x');
    expect(ref.current).toBe(group);
    fireEvent.click(screen.getByRole('button', { name: 'Open share' }));
    fireEvent.pointerDown(document.body);
    expect(screen.getByRole('button', { name: 'Open share' })).toHaveAttribute(
      'aria-expanded',
      'false',
    );
  });
});
