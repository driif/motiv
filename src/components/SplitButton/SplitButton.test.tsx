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
    expect(container.firstChild).toHaveClass('motiv-split-button', 'x');
    const main = screen.getByRole('button', { name: 'New terminal' });
    expect(main).toHaveClass('motiv-btn--outline', 'motiv-split-button__main');
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
});
