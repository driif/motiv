import { act, fireEvent, render, screen } from '@testing-library/react';
import { useState } from 'react';
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

describe('CommandMenu open state', () => {
  const commands = [
    { id: 'a', label: 'Alpha', onSelect: vi.fn() },
    { id: 'b', label: 'Beta', onSelect: vi.fn() },
  ];

  function Controlled({ accept = true, onOpenChange = vi.fn() }) {
    const [open, setOpen] = useState(false);
    return (
      <>
        <button type="button" onClick={() => setOpen((o) => !o)}>
          Toggle
        </button>
        <CommandMenu
          commands={commands}
          hotkey
          open={open}
          onOpenChange={(next) => {
            onOpenChange(next);
            if (accept) setOpen(next);
          }}
        />
      </>
    );
  }
  const launcher = () => screen.getByRole('button', { name: /Search or jump to/ });

  it('opens and closes through onOpenChange when controlled', () => {
    const onOpenChange = vi.fn();
    render(<Controlled onOpenChange={onOpenChange} />);
    launcher().focus();
    fireEvent.click(launcher(), { detail: 0 });
    expect(onOpenChange).toHaveBeenLastCalledWith(true);
    expect(launcher()).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getAllByRole('menuitem')[0]).toHaveFocus();
    fireEvent.keyDown(screen.getAllByRole('menuitem')[0], { key: 'Escape' });
    expect(onOpenChange).toHaveBeenLastCalledWith(false);
    expect(onOpenChange).toHaveBeenCalledTimes(2);
    expect(launcher()).toHaveAttribute('aria-expanded', 'false');
    expect(launcher()).toHaveFocus();
  });

  it('stays closed and keeps focus when the parent refuses, every time', () => {
    const onOpenChange = vi.fn();
    const { rerender } = render(<Controlled accept={false} onOpenChange={onOpenChange} />);
    launcher().focus();
    fireEvent.click(launcher(), { detail: 0 });
    fireEvent.click(launcher(), { detail: 0 });
    expect(onOpenChange).toHaveBeenCalledTimes(2);
    rerender(<Controlled accept={false} onOpenChange={onOpenChange} />);
    fireEvent.keyDown(launcher(), { key: 'ArrowDown' });
    expect(onOpenChange).toHaveBeenCalledTimes(3);
    expect(onOpenChange).toHaveBeenLastCalledWith(true);
    expect(launcher()).toHaveAttribute('aria-expanded', 'false');
    expect(launcher()).toHaveFocus();
  });

  it('follows an external open and close', () => {
    const onOpenChange = vi.fn();
    render(<Controlled onOpenChange={onOpenChange} />);
    fireEvent.click(screen.getByRole('button', { name: 'Toggle' }));
    expect(launcher()).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getAllByRole('menuitem')[0]).toHaveFocus();
    fireEvent.click(screen.getByRole('button', { name: 'Toggle' }));
    expect(launcher()).toHaveAttribute('aria-expanded', 'false');
    expect(onOpenChange).not.toHaveBeenCalled();
  });

  it('closes on an outside pointerdown without stealing focus or repeating the callback', () => {
    const onOpenChange = vi.fn();
    render(<Controlled onOpenChange={onOpenChange} />);
    launcher().focus();
    fireEvent.click(launcher(), { detail: 0 });
    fireEvent.pointerDown(document.body);
    expect(onOpenChange).toHaveBeenCalledTimes(2);
    expect(onOpenChange).toHaveBeenLastCalledWith(false);
    expect(launcher()).toHaveAttribute('aria-expanded', 'false');
    expect(launcher()).not.toHaveFocus();
  });

  it('closes once when the outside pointerdown is followed by blur before a re-render', () => {
    const onOpenChange = vi.fn();
    render(<Controlled accept={false} onOpenChange={onOpenChange} />);
    fireEvent.click(screen.getByRole('button', { name: 'Toggle' }));
    const toggle = screen.getByRole('button', { name: 'Toggle' });
    fireEvent.pointerDown(toggle);
    toggle.focus();
    expect(onOpenChange).toHaveBeenCalledTimes(1);
    expect(toggle).toHaveFocus();
  });

  it('selects a command with a single close callback', () => {
    const onOpenChange = vi.fn();
    render(<Controlled onOpenChange={onOpenChange} />);
    fireEvent.click(launcher(), { detail: 0 });
    fireEvent.click(screen.getByRole('menuitem', { name: 'Alpha' }));
    expect(commands[0].onSelect).toHaveBeenCalledTimes(1);
    expect(onOpenChange.mock.calls).toEqual([[true], [false]]);
    expect(launcher()).toHaveFocus();
  });

  it('ignores a hotkey another handler already prevented', () => {
    const onOpenChange = vi.fn();
    render(<Controlled onOpenChange={onOpenChange} />);
    const prevent = (event: KeyboardEvent) => event.preventDefault();
    document.addEventListener('keydown', prevent);
    fireEvent.keyDown(document.body, { key: 'k', ctrlKey: true });
    document.removeEventListener('keydown', prevent);
    expect(onOpenChange).not.toHaveBeenCalled();
    fireEvent.keyDown(document.body, { key: 'k', ctrlKey: true });
    expect(onOpenChange).toHaveBeenCalledWith(true);
    expect(screen.getAllByRole('menuitem')[0]).toHaveFocus();
  });

  it('focuses the first command when the hotkey fires while already open', () => {
    render(<CommandMenu commands={commands} hotkey />);
    launcher().focus();
    fireEvent.click(launcher(), { detail: 1 });
    expect(launcher()).toHaveFocus();
    fireEvent.keyDown(window, { key: 'k', ctrlKey: true });
    expect(screen.getAllByRole('menuitem')[0]).toHaveFocus();
  });

  it('opens only one of two hotkey instances', () => {
    render(
      <>
        <CommandMenu commands={commands} hotkey placeholder="One" />
        <CommandMenu commands={commands} hotkey placeholder="Two" />
      </>,
    );
    fireEvent.keyDown(window, { key: 'k', ctrlKey: true });
    const [one, two] = screen.getAllByRole('button', { name: /One|Two/ });
    expect(one).toHaveAttribute('aria-expanded', 'true');
    expect(two).toHaveAttribute('aria-expanded', 'false');
  });
  it('focuses the first command when mounted open', () => {
    render(<CommandMenu commands={commands} open />);
    expect(screen.getAllByRole('menuitem')[0]).toHaveFocus();
  });

  it('focuses the first command on an external open after refused pointer opens', () => {
    const onOpenChange = vi.fn();
    render(<Controlled accept={false} onOpenChange={onOpenChange} />);
    fireEvent.click(launcher(), { detail: 1 });
    fireEvent.click(launcher(), { detail: 1 });
    expect(onOpenChange.mock.calls).toEqual([[true], [true]]);
    fireEvent.click(screen.getByRole('button', { name: 'Toggle' }));
    expect(screen.getAllByRole('menuitem')[0]).toHaveFocus();
  });

  it('focuses the first command on an accepted controlled pointer open', () => {
    render(<Controlled />);
    fireEvent.click(launcher(), { detail: 1 });
    expect(launcher()).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getAllByRole('menuitem')[0]).toHaveFocus();
  });

  it.each([
    ['controlled', true],
    ['uncontrolled', false],
  ])('closes once and keeps focus a %s command moves outside', (_, controlled) => {
    const onOpenChange = vi.fn();
    function Focusing() {
      const [open, setOpen] = useState(true);
      const focusInput = [
        { id: 'a', label: 'Alpha', onSelect: () => document.getElementById('field')?.focus() },
      ];
      return (
        <>
          <input id="field" aria-label="Field" />
          <CommandMenu
            commands={focusInput}
            open={controlled ? open : undefined}
            onOpenChange={(next) => {
              onOpenChange(next);
              setOpen(next);
            }}
          />
        </>
      );
    }
    render(<Focusing />);
    if (!controlled) fireEvent.click(launcher(), { detail: 0 });
    onOpenChange.mockClear();
    fireEvent.click(screen.getByRole('menuitem', { name: 'Alpha' }));
    expect(onOpenChange.mock.calls).toEqual([[false]]);
    expect(launcher()).toHaveAttribute('aria-expanded', 'false');
    expect(screen.getByRole('textbox', { name: 'Field' })).toHaveFocus();
  });

  it('requests one close per outside dismissal when a refusal re-renders', () => {
    const onOpenChange = vi.fn();
    function Refusing() {
      const [, setCount] = useState(0);
      return (
        <>
          <button type="button">Outside</button>
          <CommandMenu
            commands={commands}
            open
            onOpenChange={(next) => {
              onOpenChange(next);
              setCount((c) => c + 1);
            }}
          />
        </>
      );
    }
    render(<Refusing />);
    const outside = screen.getByRole('button', { name: 'Outside' });
    fireEvent.pointerDown(outside);
    act(() => outside.focus());
    expect(onOpenChange.mock.calls).toEqual([[false]]);
    act(() => screen.getAllByRole('menuitem')[0].focus());
    fireEvent.pointerDown(outside);
    act(() => outside.focus());
    expect(onOpenChange.mock.calls).toEqual([[false], [false]]);
    act(() => screen.getAllByRole('menuitem')[0].focus());
    act(() => outside.focus());
    expect(onOpenChange.mock.calls).toEqual([[false], [false], [false]]);
  });
});
