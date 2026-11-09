import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { ActionMenu, type ActionMenuItem } from './ActionMenu';

function setup(items: ActionMenuItem[] = exports(), props = {}) {
  render(
    <>
      <ActionMenu label="Export" items={items} {...props} />
      <button type="button">Outside</button>
    </>,
  );
  return screen.getByRole('button', { name: 'Export' });
}

function exports(): ActionMenuItem[] {
  return [
    { label: 'CSV', onSelect: vi.fn() },
    { label: 'XLSX', onSelect: vi.fn(), disabled: true },
    { label: 'JSON', onSelect: vi.fn() },
  ];
}

const pointerDown = (target: Element) =>
  fireEvent.pointerDown(target, { button: 0, ctrlKey: false, pointerType: 'mouse' });

describe('ActionMenu', () => {
  it('opens with the pointer and renders the items inline', () => {
    const trigger = setup();
    expect(trigger).toHaveAttribute('aria-haspopup', 'menu');
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    pointerDown(trigger);
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    const menu = screen.getByRole('menu');
    expect(menu).toHaveClass('motiv-action-menu__content');
    expect(trigger.parentElement).toContainElement(menu);
    expect(screen.getAllByRole('menuitem').map((item) => item.textContent)).toEqual([
      'CSV',
      'XLSX',
      'JSON',
    ]);
  });

  it.each(['ArrowDown', 'Enter'])('opens with %s and focuses the first item', async (key) => {
    const trigger = setup();
    fireEvent.keyDown(trigger, { key });
    await waitFor(() => expect(screen.getByRole('menuitem', { name: 'CSV' })).toHaveFocus());
  });

  it.each([undefined, 'export-menu'])('names the menu by its trigger (id %s)', (id) => {
    const trigger = setup(exports(), { id });
    if (id) expect(trigger).toHaveAttribute('id', id);
    pointerDown(trigger);
    expect(screen.getByRole('menu', { name: 'Export' })).toBeInTheDocument();
  });

  it('calls onSelect and closes', () => {
    const items = exports();
    const trigger = setup(items);
    pointerDown(trigger);
    fireEvent.click(screen.getByRole('menuitem', { name: 'JSON' }));
    expect(items[2].onSelect).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  it('neither selects nor focuses a disabled item', async () => {
    const items = exports();
    const trigger = setup(items);
    fireEvent.keyDown(trigger, { key: 'ArrowDown' });
    const csv = screen.getByRole('menuitem', { name: 'CSV' });
    await waitFor(() => expect(csv).toHaveFocus());
    fireEvent.keyDown(csv, { key: 'ArrowDown' });
    await waitFor(() => expect(screen.getByRole('menuitem', { name: 'JSON' })).toHaveFocus());
    const xlsx = screen.getByRole('menuitem', { name: 'XLSX' });
    expect(xlsx).toHaveAttribute('aria-disabled', 'true');
    fireEvent.click(xlsx);
    expect(items[1].onSelect).not.toHaveBeenCalled();
    expect(screen.getByRole('menu')).toBeInTheDocument();
  });

  it('moves focus by typeahead', async () => {
    const trigger = setup();
    fireEvent.keyDown(trigger, { key: 'ArrowDown' });
    const csv = screen.getByRole('menuitem', { name: 'CSV' });
    await waitFor(() => expect(csv).toHaveFocus());
    fireEvent.keyDown(csv, { key: 'j' });
    await waitFor(() => expect(screen.getByRole('menuitem', { name: 'JSON' })).toHaveFocus());
  });

  it('closes on Escape and returns focus to the trigger', async () => {
    const trigger = setup();
    fireEvent.keyDown(trigger, { key: 'ArrowDown' });
    const csv = screen.getByRole('menuitem', { name: 'CSV' });
    await waitFor(() => expect(csv).toHaveFocus());
    fireEvent.keyDown(csv, { key: 'Escape' });
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    await waitFor(() => expect(trigger).toHaveFocus());
  });

  it('closes on an outside pointer press', async () => {
    const trigger = setup();
    pointerDown(trigger);
    // Radix registers its outside listener a tick after opening.
    await act(() => new Promise((resolve) => setTimeout(resolve)));
    pointerDown(screen.getByText('Outside'));
    await waitFor(() => expect(screen.queryByRole('menu')).not.toBeInTheDocument());
  });

  it.each([
    ['loading', exports(), { loading: true }],
    ['disabled', exports(), { disabled: true }],
    ['empty', [], {}],
  ])('keeps a %s trigger disabled and closed', (_, items, props) => {
    const trigger = setup(items, props);
    expect(trigger).toBeDisabled();
    pointerDown(trigger);
    fireEvent.keyDown(trigger, { key: 'Enter' });
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  it('keeps the loading spinner and aria-busy', () => {
    const trigger = setup(exports(), { loading: true });
    expect(trigger).toHaveAttribute('aria-busy', 'true');
    expect(trigger.querySelector('.motiv-btn__spinner')).not.toBeNull();
  });

  it('passes native props, button styling and the ref to the trigger', () => {
    const ref = createRef<HTMLButtonElement>();
    render(
      <ActionMenu
        ref={ref}
        items={exports()}
        variant="outline"
        size="sm"
        className="extra"
        data-testid="trigger"
        aria-describedby="hint"
      />,
    );
    const trigger = screen.getByTestId('trigger');
    expect(ref.current).toBe(trigger);
    expect(trigger).toHaveAccessibleName('Actions');
    expect(trigger).toHaveClass('motiv-btn', 'motiv-btn--outline', 'motiv-btn--sm', 'extra');
    expect(trigger).toHaveAttribute('aria-describedby', 'hint');
    expect(trigger).toHaveAttribute('type', 'button');
  });
});
