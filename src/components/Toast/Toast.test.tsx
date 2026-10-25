import { act, cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { createRef, StrictMode } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { dismissToast, Toaster, type ToastOptions, toast } from './Toast';

let ids: string[];

function notify(options: ToastOptions) {
  let id = '';
  act(() => {
    id = toast(options);
    ids.push(id);
  });
  return id;
}

function advance(milliseconds: number) {
  act(() => vi.advanceTimersByTime(milliseconds));
  act(() => vi.advanceTimersByTime(0));
}

function stack() {
  return within(screen.getByRole('list'));
}

beforeEach(() => {
  vi.useFakeTimers();
  ids = [];
});

afterEach(() => {
  cleanup();
  render(<Toaster />);
  act(() => {
    for (const id of ids) dismissToast(id);
  });
  advance(0);
  cleanup();
  vi.useRealTimers();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe('Toaster', () => {
  it('has empty announcement regions before the first toast and accepts a plain callback', () => {
    render(<Toaster />);
    const polite = screen.getByRole('status');
    const alert = screen.getByRole('alert');
    expect(polite).toBeEmptyDOMElement();
    expect(alert).toBeEmptyDOMElement();
    expect(screen.getByRole('region', { name: 'Notifications' })).toBeInTheDocument();
    const onSaved = () => {
      const id = toast({ title: 'Saved', description: 'Your changes are ready.' });
      ids.push(id);
      return id;
    };
    let id = '';
    act(() => {
      id = onSaved();
    });
    expect(id).toEqual(expect.any(String));
    expect(id).not.toBe('');
    expect(stack().getByText('Saved').closest('li')).toHaveClass('motiv-toast--info');
    expect(polite).toHaveTextContent('Saved: Your changes are ready.');
    expect(screen.getByRole('status')).toBe(polite);
    expect(screen.getByRole('alert')).toBe(alert);
    expect(alert).toBeEmptyDOMElement();
  });

  it('routes success and info to polite announcements and errors to alerts', () => {
    render(<Toaster />);
    notify({ tone: 'success', title: 'Saved' });
    notify({ tone: 'info', title: 'Sync started' });
    notify({ tone: 'error', title: 'Could not sync', description: 'Try again.' });
    expect(screen.getByRole('status')).toHaveTextContent('SavedSync started');
    expect(screen.getByRole('status')).not.toHaveTextContent('Could not sync');
    expect(screen.getByRole('alert')).toHaveTextContent('Could not sync: Try again.');
    expect(stack().getByText('Saved').closest('li')).toHaveClass('motiv-toast--success');
    expect(stack().getByText('Could not sync').closest('li')).toHaveClass('motiv-toast--error');
  });

  it('creates unique ids without crypto.randomUUID, including after dismissal', () => {
    vi.stubGlobal('crypto', { randomUUID: undefined });
    render(<Toaster />);
    const first = notify({ title: 'First' });
    const second = notify({ title: 'Second' });
    expect(first).not.toBe('');
    expect(second).not.toBe(first);
    act(() => dismissToast(first));
    advance(0);
    const third = notify({ title: 'Third' });
    expect(new Set([first, second, third]).size).toBe(3);
    expect(stack().queryByText('First')).not.toBeInTheDocument();
    expect(stack().getByText('Second')).toBeInTheDocument();
    expect(stack().getByText('Third')).toBeInTheDocument();
  });

  it.each(['info', 'error'] as const)(
    'adds new announcement nodes for repeated %s messages',
    (tone) => {
      render(<Toaster />);
      const id = notify({ tone, title: 'Same message' });
      const region = screen.getByRole(tone === 'error' ? 'alert' : 'status');
      const first = region.firstElementChild;
      notify({ tone, title: 'Same message' });
      expect(region.children).toHaveLength(2);
      expect(region.firstElementChild).toBe(first);
      expect(region.lastElementChild).not.toBe(first);
      expect(region).toHaveAttribute('aria-relevant', 'additions');
      expect(region).toHaveAttribute('aria-atomic', 'false');
      act(() => dismissToast(id));
      advance(0);
      notify({ tone, title: 'Same message' });
      expect(region.children).toHaveLength(2);
      expect(first).not.toBeInTheDocument();
    },
  );

  it('does not steal focus when a toast arrives', () => {
    render(
      <>
        <button type="button">Save</button>
        <Toaster />
      </>,
    );
    screen.getByRole('button', { name: 'Save' }).focus();
    notify({ title: 'Saved' });
    expect(screen.getByRole('button', { name: 'Save' })).toHaveFocus();
  });

  it('auto-dismisses success and info after five seconds but keeps errors', () => {
    render(<Toaster />);
    notify({ tone: 'success', title: 'Saved' });
    notify({ title: 'Syncing' });
    notify({ tone: 'error', title: 'Offline' });
    advance(4999);
    expect(stack().getAllByRole('listitem')).toHaveLength(3);
    advance(1);
    expect(stack().queryByText('Saved')).not.toBeInTheDocument();
    expect(stack().queryByText('Syncing')).not.toBeInTheDocument();
    advance(60000);
    expect(stack().getByText('Offline')).toBeInTheDocument();
  });

  it('honors duration overrides, including Infinity and zero', () => {
    render(<Toaster />);
    notify({ tone: 'error', title: 'Temporary error', duration: 1000 });
    notify({ title: 'Persistent info', duration: Infinity });
    notify({ title: 'Immediate', duration: 0 });
    advance(0);
    expect(stack().queryByText('Immediate')).not.toBeInTheDocument();
    advance(1000);
    expect(stack().queryByText('Temporary error')).not.toBeInTheDocument();
    advance(60000);
    expect(stack().getByText('Persistent info')).toBeInTheDocument();
  });

  it('queues FIFO and starts each timer only after promotion', () => {
    render(<Toaster />);
    const first = notify({ title: 'First', duration: Infinity });
    notify({ title: 'Second', duration: Infinity });
    notify({ title: 'Third', duration: Infinity });
    notify({ title: 'Fourth', duration: 1000 });
    notify({ title: 'Fifth', duration: 1000 });
    expect(
      stack()
        .getAllByRole('listitem')
        .map((item) => item.textContent),
    ).toEqual(['First', 'Second', 'Third']);
    expect(screen.getByRole('status')).not.toHaveTextContent('Fourth');
    advance(10000);
    act(() => dismissToast(first));
    advance(0);
    expect(
      stack()
        .getAllByRole('listitem')
        .map((item) => item.textContent),
    ).toEqual(['Second', 'Third', 'Fourth']);
    expect(screen.getByRole('status')).toHaveTextContent('Fourth');
    advance(999);
    expect(stack().getByText('Fourth')).toBeInTheDocument();
    advance(1);
    expect(stack().queryByText('Fourth')).not.toBeInTheDocument();
    expect(stack().getByText('Fifth')).toBeInTheDocument();
    advance(999);
    expect(stack().getByText('Fifth')).toBeInTheDocument();
    advance(1);
    expect(stack().queryByText('Fifth')).not.toBeInTheDocument();
  });

  it('can dismiss a queued toast before it is ever shown or announced', () => {
    render(<Toaster />);
    const first = notify({ title: 'First', duration: Infinity });
    notify({ title: 'Second', duration: Infinity });
    notify({ title: 'Third', duration: Infinity });
    const queued = notify({ title: 'Queued' });
    act(() => {
      dismissToast(queued);
      dismissToast(first);
    });
    advance(0);
    expect(stack().getAllByRole('listitem')).toHaveLength(2);
    expect(screen.getByRole('status')).not.toHaveTextContent('Queued');
  });

  it.each(['hover', 'focus'])(
    'keeps remaining time until both hover and focus end (%s ends first)',
    (endsFirst) => {
      render(
        <>
          <button type="button">Outside</button>
          <Toaster />
        </>,
      );
      notify({ title: 'First', duration: 5000 });
      notify({ title: 'Second', duration: 7000 });
      advance(2000);
      const region = screen.getByRole('region');
      const outside = screen.getByRole('button', { name: 'Outside' });
      fireEvent.pointerEnter(region, { pointerType: 'mouse' });
      act(() => stack().getAllByRole('button')[0].focus());
      advance(10000);
      if (endsFirst === 'hover') fireEvent.pointerLeave(region, { pointerType: 'mouse' });
      else act(() => outside.focus());
      advance(10000);
      expect(stack().getAllByRole('listitem')).toHaveLength(2);
      if (endsFirst === 'hover') act(() => outside.focus());
      else fireEvent.pointerLeave(region, { pointerType: 'mouse' });
      advance(2999);
      expect(stack().getByText('First')).toBeInTheDocument();
      advance(1);
      expect(stack().queryByText('First')).not.toBeInTheDocument();
      advance(1999);
      expect(stack().getByText('Second')).toBeInTheDocument();
      advance(1);
      expect(stack().queryByText('Second')).not.toBeInTheDocument();
    },
  );

  it('keeps newly promoted toasts paused while the stack is hovered', () => {
    render(<Toaster />);
    const first = notify({ title: 'First', duration: Infinity });
    notify({ title: 'Second', duration: Infinity });
    notify({ title: 'Third', duration: Infinity });
    notify({ title: 'Fourth', duration: 1000 });
    const region = screen.getByRole('region');
    vi.spyOn(region, 'matches').mockReturnValue(true);
    fireEvent.pointerEnter(region, { pointerType: 'mouse' });
    act(() => dismissToast(first));
    advance(0);
    advance(10000);
    expect(stack().getByText('Fourth')).toBeInTheDocument();
    fireEvent.pointerLeave(region, { pointerType: 'mouse' });
    advance(999);
    expect(stack().getByText('Fourth')).toBeInTheDocument();
    advance(1);
    expect(stack().queryByText('Fourth')).not.toBeInTheDocument();
  });

  it('does not pause for touch hover or compatibility mouse events', () => {
    render(<Toaster />);
    notify({ title: 'Touch hover', duration: 1000 });
    const region = screen.getByRole('region');
    fireEvent.pointerEnter(region, { pointerType: 'touch' });
    fireEvent.mouseEnter(region);
    advance(999);
    expect(stack().getByText('Touch hover')).toBeInTheDocument();
    advance(1);
    expect(stack().queryAllByRole('listitem')).toHaveLength(0);
  });

  it('resumes after touch dismissal without pointerleave or mouseleave', () => {
    render(<Toaster />);
    notify({ title: 'First' });
    notify({ title: 'Second' });
    advance(2000);
    const button = stack().getAllByRole('button')[0];
    fireEvent.pointerEnter(button, { pointerType: 'touch' });
    fireEvent.mouseEnter(button);
    fireEvent.pointerDown(button, { pointerType: 'touch' });
    fireEvent.mouseDown(button);
    act(() => button.focus());
    fireEvent.pointerUp(button, { pointerType: 'touch' });
    fireEvent.mouseUp(button);
    fireEvent.click(button);
    advance(0);
    expect(document.body).toHaveFocus();
    advance(2999);
    expect(stack().getByText('Second')).toBeInTheDocument();
    advance(1);
    expect(stack().queryAllByRole('listitem')).toHaveLength(0);
  });

  it.each([0, 200])('resumes after a hovered toast exits in %s ms without pointerleave', (exit) => {
    render(<Toaster />);
    const first = notify({ title: 'First', duration: Infinity });
    notify({ title: 'Second' });
    advance(2000);
    const item = stack().getAllByRole('listitem')[0];
    item.style.transitionDuration = `${exit}ms`;
    vi.spyOn(screen.getByRole('region'), 'matches').mockImplementation(() => item.isConnected);
    fireEvent.pointerEnter(item, { pointerType: 'mouse' });
    advance(10000);
    expect(stack().getByText('Second')).toBeInTheDocument();
    act(() => dismissToast(first));
    advance(exit);
    expect(item).not.toBeInTheDocument();
    advance(2999);
    expect(stack().getByText('Second')).toBeInTheDocument();
    advance(1);
    expect(stack().queryAllByRole('listitem')).toHaveLength(0);
  });

  it('clears hover when the last toast is removed before another arrives', () => {
    render(<Toaster />);
    const first = notify({ title: 'First', duration: 1000 });
    const region = screen.getByRole('region');
    vi.spyOn(region, 'matches').mockReturnValue(true);
    fireEvent.pointerEnter(region, { pointerType: 'mouse' });
    advance(2000);
    expect(stack().getByText('First')).toBeInTheDocument();
    act(() => dismissToast(first));
    advance(0);
    notify({ title: 'Later', duration: 1000 });
    advance(999);
    expect(stack().getByText('Later')).toBeInTheDocument();
    advance(1);
    expect(stack().queryAllByRole('listitem')).toHaveLength(0);
  });

  it('dismisses by button and id, and tolerates repeated or unknown ids', () => {
    render(<Toaster />);
    notify({ title: 'First' });
    const second = notify({ title: 'Second' });
    fireEvent.click(stack().getAllByRole('button', { name: 'Dismiss' })[0]);
    act(() => {
      dismissToast(second);
      dismissToast(second);
      dismissToast('unknown');
    });
    advance(0);
    expect(stack().queryAllByRole('listitem')).toHaveLength(0);
    act(() => dismissToast(second));
    expect(vi.getTimerCount()).toBe(0);
  });

  it('moves focus to the next dismiss button, then returns outside the empty stack', () => {
    render(
      <>
        <button type="button">Save</button>
        <Toaster />
      </>,
    );
    const outside = screen.getByRole('button', { name: 'Save' });
    outside.focus();
    notify({ title: 'First' });
    const second = notify({ title: 'Second' });
    const buttons = stack().getAllByRole('button');
    // jsdom treats keyboard-generated clicks as pointer input for :focus-visible.
    for (const button of buttons) vi.spyOn(button, 'matches').mockReturnValue(true);
    act(() => buttons[0].focus());
    fireEvent.click(buttons[0]);
    expect(buttons[1]).toHaveFocus();
    advance(0);
    advance(10000);
    expect(stack().getByText('Second')).toBeInTheDocument();
    act(() => dismissToast(second));
    expect(outside).toHaveFocus();
    advance(0);
    expect(stack().queryAllByRole('button')).toHaveLength(0);
  });

  it('resumes remaining timers after pointer dismissal and leaving the stack', () => {
    render(<Toaster />);
    notify({ tone: 'success', title: 'First' });
    notify({ tone: 'success', title: 'Second' });
    notify({ tone: 'success', title: 'Third' });
    advance(2000);
    const region = screen.getByRole('region');
    const button = stack().getAllByRole('button')[0];
    vi.spyOn(region, 'matches').mockReturnValue(true);
    fireEvent.pointerEnter(region, { pointerType: 'mouse' });
    fireEvent.pointerDown(button, { pointerType: 'mouse' });
    fireEvent.mouseDown(button);
    act(() => button.focus());
    expect(button).toHaveFocus();
    fireEvent.mouseUp(button);
    fireEvent.click(button);
    advance(0);
    expect(document.body).toHaveFocus();
    advance(10000);
    expect(stack().getAllByRole('listitem')).toHaveLength(2);
    fireEvent.pointerLeave(region, { pointerType: 'mouse' });
    advance(2999);
    expect(stack().getAllByRole('listitem')).toHaveLength(2);
    advance(1);
    expect(stack().queryAllByRole('listitem')).toHaveLength(0);
  });

  it('blurs a dismissed last toast when no outside focus target exists', () => {
    render(<Toaster />);
    const id = notify({ title: 'Only toast' });
    act(() => stack().getByRole('button').focus());
    act(() => dismissToast(id));
    advance(0);
    expect(document.body).toHaveFocus();
  });

  it('leaves the stack cleanly if its previous focus target has become disabled', () => {
    render(
      <>
        <button type="button">Save</button>
        <Toaster />
      </>,
    );
    const outside = screen.getByRole('button', { name: 'Save' });
    outside.focus();
    const id = notify({ title: 'Saved' });
    act(() => stack().getByRole('button').focus());
    outside.setAttribute('disabled', '');
    act(() => dismissToast(id));
    advance(0);
    expect(document.body).toHaveFocus();
  });

  it('keeps an exiting toast in its slot until its transition finishes', () => {
    render(<Toaster />);
    const id = notify({ title: 'First', duration: Infinity });
    notify({ title: 'Second', duration: Infinity });
    notify({ title: 'Third', duration: Infinity });
    notify({ title: 'Fourth' });
    const first = stack().getAllByRole('listitem')[0];
    first.style.transitionDuration = '0.2s';
    act(() => dismissToast(id));
    expect(first).toHaveAttribute('data-exiting');
    expect(stack().queryByText('Fourth')).not.toBeInTheDocument();
    advance(199);
    expect(first).toBeInTheDocument();
    advance(1);
    expect(first).not.toBeInTheDocument();
    expect(stack().getByText('Fourth')).toBeInTheDocument();
    expect(stack().getAllByRole('listitem')).toHaveLength(3);
  });

  it('completes reduced-motion exits without a transition event', () => {
    render(<Toaster />);
    const id = notify({ title: 'Reduced motion' });
    const item = stack().getByRole('listitem');
    item.style.transitionDuration = '0s';
    act(() => dismissToast(id));
    advance(0);
    expect(item).not.toBeInTheDocument();
    expect(vi.getTimerCount()).toBe(0);
  });

  it('survives StrictMode effect replay and clears duration and exit timers on unmount', () => {
    notify({ title: 'Queued before mount', duration: 1000 });
    const { unmount } = render(
      <StrictMode>
        <Toaster />
      </StrictMode>,
    );
    expect(vi.getTimerCount()).toBe(1);
    advance(999);
    expect(stack().getByText('Queued before mount')).toBeInTheDocument();
    advance(1);
    expect(stack().queryByText('Queued before mount')).not.toBeInTheDocument();
    const id = notify({ title: 'Exit in progress' });
    notify({ title: 'Still running' });
    stack().getAllByRole('listitem')[0].style.transitionDuration = '0.2s';
    act(() => dismissToast(id));
    expect(vi.getTimerCount()).toBe(2);
    unmount();
    expect(vi.getTimerCount()).toBe(0);
    advance(10000);
    expect(vi.getTimerCount()).toBe(0);
  });

  it('passes root native props and ref through and composes interaction handlers', () => {
    const ref = createRef<HTMLElement>();
    const onMouseEnter = vi.fn();
    const onMouseLeave = vi.fn();
    const onPointerEnter = vi.fn();
    const onPointerLeave = vi.fn();
    const onFocus = vi.fn();
    const onBlur = vi.fn();
    render(
      <Toaster
        label="Updates"
        dismissLabel="Close update"
        ref={ref}
        className="custom"
        id="updates"
        style={{ zIndex: 2000 }}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        onPointerEnter={onPointerEnter}
        onPointerLeave={onPointerLeave}
        onFocus={onFocus}
        onBlur={onBlur}
      />,
    );
    const region = screen.getByRole('region', { name: 'Updates' });
    expect(ref.current).toBe(region);
    expect(region).toHaveClass('motiv-toast-stack', 'custom');
    expect(region).toHaveAttribute('id', 'updates');
    expect(region).toHaveStyle({ zIndex: 2000 });
    notify({ title: 'Saved' });
    fireEvent.pointerEnter(region, { pointerType: 'mouse' });
    fireEvent.pointerLeave(region, { pointerType: 'mouse' });
    fireEvent.mouseEnter(region);
    fireEvent.mouseLeave(region);
    const button = stack().getByRole('button', { name: 'Close update' });
    act(() => button.focus());
    act(() => button.blur());
    for (const handler of [
      onMouseEnter,
      onMouseLeave,
      onPointerEnter,
      onPointerLeave,
      onFocus,
      onBlur,
    ])
      expect(handler).toHaveBeenCalledOnce();
  });

  it('does not enqueue server calls for a later browser host', () => {
    vi.stubGlobal('window', undefined);
    const id = toast({ title: 'Server-only message' });
    expect(typeof id).toBe('string');
    dismissToast(id);
    vi.unstubAllGlobals();
    render(<Toaster />);
    expect(stack().queryAllByRole('listitem')).toHaveLength(0);
    expect(screen.getByRole('status')).toBeEmptyDOMElement();
  });
});
