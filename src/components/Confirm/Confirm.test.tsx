import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import { createRef, StrictMode, useState } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Confirm } from './Confirm';

beforeEach(() => {
  Object.defineProperties(HTMLDialogElement.prototype, {
    showModal: {
      configurable: true,
      value: vi.fn(function (this: HTMLDialogElement) {
        this.open = true;
      }),
    },
    close: {
      configurable: true,
      value: vi.fn(function (this: HTMLDialogElement) {
        this.open = false;
        this.dispatchEvent(new Event('close'));
      }),
    },
  });
});

afterEach(() => {
  cleanup();
  Reflect.deleteProperty(HTMLDialogElement.prototype, 'showModal');
  Reflect.deleteProperty(HTMLDialogElement.prototype, 'close');
});

const defaults = { title: 'Delete project?', onConfirm: () => {}, onCancel: () => {} };

describe('Confirm', () => {
  it('stays hidden until opened and synchronizes the controlled state', () => {
    const { rerender } = render(<Confirm {...defaults} open={false} />);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(HTMLDialogElement.prototype.showModal).not.toHaveBeenCalled();
    rerender(<Confirm {...defaults} open />);
    const dialog = screen.getByRole('dialog', { name: 'Delete project?' });
    expect(dialog).toHaveAttribute('open');
    expect(screen.getByRole('button', { name: 'Cancel' })).toHaveFocus();
    expect(screen.getByRole('button', { name: 'Delete' })).toHaveClass('motiv-btn--danger');
    rerender(<Confirm {...defaults} open />);
    expect(HTMLDialogElement.prototype.showModal).toHaveBeenCalledTimes(1);
    rerender(<Confirm {...defaults} open={false} />);
    expect(dialog).not.toHaveAttribute('open');
  });

  it('offers a primary action for non-destructive dialogs', () => {
    render(<Confirm {...defaults} open confirmLabel="Register" confirmVariant="primary" />);
    expect(screen.getByRole('button', { name: 'Register' })).toHaveClass('motiv-btn--primary');
  });

  it('reports confirmation and cancellation without closing itself', () => {
    const onConfirm = vi.fn();
    const onCancel = vi.fn();
    render(<Confirm {...defaults} open onConfirm={onConfirm} onCancel={onCancel} />);
    const dialog = screen.getByRole('dialog');
    fireEvent.click(screen.getByRole('button', { name: 'Delete' }));
    expect(onConfirm).toHaveBeenCalledTimes(1);
    expect(dialog).toHaveAttribute('open');
    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(onCancel).toHaveBeenCalledTimes(1);
    const cancel = new Event('cancel', { cancelable: true });
    fireEvent(dialog, cancel);
    expect(cancel.defaultPrevented).toBe(true);
    expect(onCancel).toHaveBeenCalledTimes(2);
    expect(dialog).toHaveAttribute('open');
    fireEvent.click(dialog);
    expect(onCancel).toHaveBeenCalledTimes(2);
  });

  it('requires an exact slug match and focuses the input', () => {
    const onConfirm = vi.fn();
    render(<Confirm {...defaults} open slug="my-project" onConfirm={onConfirm} />);
    const input = screen.getByRole('textbox', { name: 'Type the slug to confirm' });
    const confirm = screen.getByRole('button', { name: 'Delete' });
    expect(input).toHaveFocus();
    expect(input).toHaveAccessibleDescription('my-project');
    for (const value of ['', 'MY-PROJECT', 'my-project ', ' my-project']) {
      fireEvent.change(input, { target: { value } });
      expect(confirm).toBeDisabled();
      fireEvent.click(confirm);
    }
    expect(onConfirm).not.toHaveBeenCalled();
    fireEvent.change(input, { target: { value: 'my-project' } });
    expect(confirm).toBeEnabled();
    fireEvent.click(confirm);
    expect(onConfirm).toHaveBeenCalledTimes(1);
    expect(screen.getByRole('dialog')).toHaveAttribute('open');
  });

  it('clears the slug when reopened or changed, including when removed', () => {
    const { rerender } = render(<Confirm {...defaults} open slug="old" />);
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'old' } });
    rerender(<Confirm {...defaults} open={false} slug="old" />);
    rerender(<Confirm {...defaults} open slug="old" />);
    expect(input).toHaveValue('');
    fireEvent.change(input, { target: { value: 'new' } });
    rerender(<Confirm {...defaults} open slug="new" />);
    expect(input).toHaveValue('');
    expect(screen.getByRole('button', { name: 'Delete' })).toBeDisabled();
    rerender(<Confirm {...defaults} open />);
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Cancel' })).toHaveFocus();
    expect(screen.getByRole('button', { name: 'Delete' })).toBeEnabled();
  });

  it('locks both actions, native cancellation and the input while pending', () => {
    const onConfirm = vi.fn();
    const onCancel = vi.fn();
    const props = { ...defaults, onConfirm, onCancel, open: true, slug: 'my-project' };
    const { rerender } = render(<Confirm {...props} />);
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'my-project' } });
    rerender(<Confirm {...props} pending />);
    const dialog = screen.getByRole('dialog');
    const confirm = screen.getByRole('button', { name: 'Delete' });
    const cancel = screen.getByRole('button', { name: 'Cancel' });
    expect(dialog).toHaveAttribute('aria-busy', 'true');
    expect(confirm).toHaveAttribute('aria-busy', 'true');
    expect(confirm).toBeDisabled();
    expect(cancel).toBeDisabled();
    expect(input).toBeDisabled();
    fireEvent.click(confirm);
    fireEvent.click(cancel);
    const event = new Event('cancel', { cancelable: true });
    fireEvent(dialog, event);
    expect(event.defaultPrevented).toBe(true);
    expect(onConfirm).not.toHaveBeenCalled();
    expect(onCancel).not.toHaveBeenCalled();
    input.blur(); // browsers drop focus from a control that becomes disabled
    rerender(
      <Confirm {...props}>
        <p role="alert">Deletion failed. Try again.</p>
      </Confirm>,
    );
    expect(screen.getByRole('alert')).toHaveTextContent('Deletion failed. Try again.');
    expect(dialog).toHaveAttribute('open');
    expect(confirm).toBeEnabled();
    expect(cancel).toBeEnabled();
    expect(input).toHaveValue('my-project');
    expect(input).toHaveFocus();
  });

  it('keeps native close requests controlled, including while pending', () => {
    const ref = createRef<HTMLDialogElement>();
    const onClose = vi.fn();
    const onCancel = vi.fn();
    const { rerender } = render(
      <Confirm {...defaults} ref={ref} open pending onClose={onClose} onCancel={onCancel} />,
    );
    act(() => ref.current?.close());
    expect(ref.current).toHaveAttribute('open');
    expect(onClose).toHaveBeenCalledTimes(1);
    expect(onCancel).not.toHaveBeenCalled();
    rerender(<Confirm {...defaults} ref={ref} open={false} onClose={onClose} />);
    expect(ref.current).not.toHaveAttribute('open');
    expect(onClose).toHaveBeenCalledTimes(2);
  });

  it('allows the parent to dismiss on cancel or confirm', () => {
    function Example() {
      const [open, setOpen] = useState(true);
      return (
        <>
          <button type="button" onClick={() => setOpen(true)}>
            Open
          </button>
          <Confirm
            {...defaults}
            open={open}
            onCancel={() => setOpen(false)}
            onConfirm={() => setOpen(false)}
          />
        </>
      );
    }
    render(<Example />);
    fireEvent(screen.getByRole('dialog'), new Event('cancel', { cancelable: true }));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Open' }));
    fireEvent.click(screen.getByRole('button', { name: 'Delete' }));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('preserves semantic impact content and supports custom labels and dialog props', () => {
    const ref = createRef<HTMLDialogElement>();
    const onClick = vi.fn();
    render(
      <Confirm
        {...defaults}
        ref={ref}
        open
        slug="my-project"
        confirmLabel="Remove project"
        cancelLabel="Keep project"
        slugLabel="Project slug"
        className="custom"
        id="confirm-project"
        style={{ width: 400 }}
        aria-describedby="impact"
        onClick={onClick}
      >
        <p id="impact">This also deletes:</p>
        <ul>
          <li>3 bindings</li>
          <li>12 permissions</li>
        </ul>
      </Confirm>,
    );
    const dialog = screen.getByRole('dialog');
    expect(ref.current).toBe(dialog);
    expect(dialog).toHaveClass('motiv-confirm', 'custom');
    expect(dialog).toHaveAttribute('id', 'confirm-project');
    expect(dialog).toHaveStyle({ width: '400px' });
    expect(dialog).toHaveAccessibleDescription('This also deletes:');
    expect(screen.getAllByRole('listitem')).toHaveLength(2);
    expect(screen.getByRole('textbox', { name: 'Project slug' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Remove project' })).toHaveClass('motiv-btn--danger');
    expect(screen.getByRole('button', { name: 'Keep project' })).toBeInTheDocument();
    fireEvent.click(dialog);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('supports callback ref cleanup', () => {
    const cleanup = vi.fn();
    const ref = vi.fn(() => cleanup);
    const { unmount } = render(<Confirm {...defaults} open ref={ref} />);
    expect(ref).toHaveBeenCalledWith(screen.getByRole('dialog'));
    unmount();
    expect(cleanup).toHaveBeenCalledTimes(1);
  });

  it('survives Strict Mode effect replay and closes on unmount without cancelling', () => {
    const onCancel = vi.fn();
    const { unmount } = render(
      <StrictMode>
        <Confirm {...defaults} open onCancel={onCancel} />
      </StrictMode>,
    );
    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute('open');
    expect(screen.getByRole('button', { name: 'Cancel' })).toHaveFocus();
    unmount();
    expect(dialog).not.toHaveAttribute('open');
    expect(onCancel).not.toHaveBeenCalled();
  });
});
