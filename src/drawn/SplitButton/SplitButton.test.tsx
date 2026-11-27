import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { SplitButton } from './SplitButton';

function setup(props = {}) {
  const onClick = vi.fn();
  const items = [
    { label: 'Split right', onSelect: vi.fn() },
    { label: 'Split down', onSelect: vi.fn(), disabled: true },
    { label: 'New tab', onSelect: vi.fn() },
  ];
  const { container } = render(
    <SplitButton items={items} onClick={onClick} variant="outline" className="x" {...props}>
      New terminal
    </SplitButton>,
  );
  return {
    onClick,
    items,
    container,
    toggle: screen.getByRole('button', { name: 'More options' }),
  };
}

describe('SplitButton', () => {
  it('runs the main action from the main button', () => {
    const { onClick, container } = setup();
    expect(container.firstChild).toHaveClass('motiv-sketch-split-button', 'x');
    const main = screen.getByRole('button', { name: 'New terminal' });
    expect(main).toHaveClass('motiv-btn--outline', 'motiv-sketch-split-button__main');
    fireEvent.click(main);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('opens the menu from the keyboard and selects an item', async () => {
    const { toggle, items } = setup();
    expect(toggle).toHaveAttribute('aria-haspopup', 'menu');
    expect(toggle).toHaveClass('motiv-btn--outline');
    fireEvent.keyDown(toggle, { key: 'ArrowDown' });
    const first = screen.getByRole('menuitem', { name: 'Split right' });
    await waitFor(() => expect(first).toHaveFocus());
    fireEvent.keyDown(first, { key: 'ArrowDown' });
    const last = screen.getByRole('menuitem', { name: 'New tab' });
    await waitFor(() => expect(last).toHaveFocus());
    expect(screen.getByRole('menuitem', { name: 'Split down' })).toHaveAttribute(
      'aria-disabled',
      'true',
    );
    fireEvent.click(last);
    expect(items[2].onSelect).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  it('disables both halves', () => {
    const { toggle } = setup({ disabled: true });
    expect(screen.getByRole('button', { name: 'New terminal' })).toBeDisabled();
    expect(toggle).toBeDisabled();
  });

  it('takes a custom menu label', () => {
    render(<SplitButton items={[]} menuLabel="Other editors" />);
    expect(screen.getByRole('button', { name: 'Other editors' })).toBeDisabled();
  });

  it('shows item icons and the reason of a disabled item', () => {
    render(
      <SplitButton
        items={[
          { label: 'Split right', onSelect: vi.fn(), icon: <svg data-testid="icon" /> },
          { label: 'Split down', onSelect: vi.fn(), disabled: true, disabledReason: 'No room' },
          { label: 'New tab', onSelect: vi.fn(), disabledReason: 'Hidden while enabled' },
        ]}
      >
        New terminal
      </SplitButton>,
    );
    fireEvent.keyDown(screen.getByRole('button', { name: 'More options' }), { key: 'ArrowDown' });
    const right = screen.getByRole('menuitem', { name: 'Split right' });
    expect(right).toContainElement(screen.getByTestId('icon'));
    expect(screen.getByRole('menuitem', { name: 'Split down' })).toHaveAccessibleDescription(
      'No room',
    );
    expect(screen.queryByText('Hidden while enabled')).not.toBeInTheDocument();
  });
});
