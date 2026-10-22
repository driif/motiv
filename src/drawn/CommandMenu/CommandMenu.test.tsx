import { act, fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { CommandMenu } from './CommandMenu';

function setup(onSelect = vi.fn()) {
  const commands = [
    { id: 'new', label: 'New project', shortcut: 'N', onSelect },
    { id: 'invite', label: 'Invite people', onSelect: vi.fn() },
    { id: 'settings', label: 'Settings', onSelect: vi.fn() },
  ];
  return render(<CommandMenu commands={commands} className="x" data-testid="m" />);
}

describe('CommandMenu', () => {
  it('has a launcher that controls a menu of commands', () => {
    setup();
    expect(screen.getByTestId('m')).toHaveClass('motiv-sketch-command-menu', 'x');
    const launcher = screen.getByRole('button', { name: 'Search or jump to…' });
    expect(launcher).toHaveAttribute('aria-haspopup', 'menu');
    expect(launcher).toHaveAttribute('aria-expanded', 'false');
    fireEvent.click(launcher);
    expect(launcher).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('menu', { name: 'Commands' })).toHaveAttribute(
      'id',
      launcher.getAttribute('aria-controls'),
    );
    expect(screen.getAllByRole('menuitem')).toHaveLength(3);
  });

  it('moves focus with arrows, Home and End and closes on Escape', () => {
    setup();
    const launcher = screen.getByRole('button', { name: 'Search or jump to…' });
    fireEvent.click(launcher);
    const [first, second, third] = screen.getAllByRole('menuitem');
    first.focus();
    fireEvent.keyDown(first, { key: 'ArrowDown' });
    expect(second).toHaveFocus();
    fireEvent.keyDown(second, { key: 'End' });
    expect(third).toHaveFocus();
    fireEvent.keyDown(third, { key: 'ArrowDown' });
    expect(first).toHaveFocus();
    fireEvent.keyDown(first, { key: 'Escape' });
    expect(launcher).toHaveAttribute('aria-expanded', 'false');
    expect(launcher).toHaveFocus();
  });

  it('focuses the first command when opened from the keyboard, not by pointer', async () => {
    setup();
    const launcher = screen.getByRole('button', { name: 'Search or jump to…' });
    launcher.focus();
    fireEvent.click(launcher, { detail: 1 });
    await act(() => new Promise(requestAnimationFrame));
    expect(launcher).toHaveFocus();
    fireEvent.click(launcher, { detail: 1 });
    // Enter and Space on a button fire click with detail 0.
    fireEvent.click(launcher, { detail: 0 });
    await act(() => new Promise(requestAnimationFrame));
    expect(screen.getAllByRole('menuitem')[0]).toHaveFocus();
  });

  it('runs a command and closes', () => {
    const onSelect = vi.fn();
    setup(onSelect);
    const launcher = screen.getByRole('button', { name: 'Search or jump to…' });
    fireEvent.click(launcher);
    fireEvent.click(screen.getByRole('menuitem', { name: /New project/ }));
    expect(onSelect).toHaveBeenCalledTimes(1);
    expect(launcher).toHaveAttribute('aria-expanded', 'false');
  });

  it('opens with Ctrl+K when hotkey is on', () => {
    render(<CommandMenu commands={[]} hotkey />);
    expect(screen.getByText('Ctrl K')).toBeInTheDocument();
    fireEvent.keyDown(window, { key: 'k', ctrlKey: true });
    expect(screen.getByRole('button')).toHaveAttribute('aria-expanded', 'true');
  });
});
