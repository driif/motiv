import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import { createRef, StrictMode, useState } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Confirm } from '../Confirm';
import { Dialog } from './Dialog';

// Browsers queue the close event; the stub leaves it to each test to dispatch it.
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
      }),
    },
  });
});

afterEach(() => {
  cleanup();
  Reflect.deleteProperty(HTMLDialogElement.prototype, 'showModal');
  Reflect.deleteProperty(HTMLDialogElement.prototype, 'close');
});

const fireClose = (dialog: HTMLElement) => fireEvent(dialog, new Event('close'));

describe('Dialog', () => {
  it('opens modally from the prop and closes when the prop turns false', () => {
    const onClose = vi.fn();
    const { rerender } = render(
      <Dialog open={false} title="Edit question" onClose={onClose}>
        <p>Body</p>
      </Dialog>,
    );
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    rerender(
      <Dialog open title="Edit question" onClose={onClose}>
        <p>Body</p>
      </Dialog>,
    );
    const dialog = screen.getByRole('dialog', { name: 'Edit question' });
    expect(dialog).toHaveAttribute('open');
    expect(HTMLDialogElement.prototype.showModal).toHaveBeenCalledTimes(1);
    rerender(
      <Dialog open={false} title="Edit question" onClose={onClose}>
        <p>Body</p>
      </Dialog>,
    );
    expect(dialog).not.toHaveAttribute('open');
    fireClose(dialog);
    expect(onClose).not.toHaveBeenCalled();
  });

  it('reports Escape once, stays open and still reports a later native close', () => {
    const onClose = vi.fn();
    render(<Dialog open title="Edit" onClose={onClose} />);
    const dialog = screen.getByRole('dialog');
    const cancel = new Event('cancel', { cancelable: true });
    fireEvent(dialog, cancel);
    expect(cancel.defaultPrevented).toBe(true);
    expect(onClose).toHaveBeenCalledTimes(1);
    expect(dialog).toHaveAttribute('open');
    act(() => (dialog as HTMLDialogElement).close());
    fireClose(dialog);
    expect(onClose).toHaveBeenCalledTimes(2);
  });

  it('reports the close button once', () => {
    const onClose = vi.fn();
    render(<Dialog open title="Edit" onClose={onClose} />);
    fireEvent.click(screen.getByRole('button', { name: 'Close' }));
    expect(onClose).toHaveBeenCalledTimes(1);
    expect(screen.getByRole('dialog')).toHaveAttribute('open');
  });

  it('reports a backdrop click once, but not clicks inside or drags out of the content', () => {
    const onClose = vi.fn();
    render(
      <Dialog open title="Edit" onClose={onClose}>
        <p>Body</p>
      </Dialog>,
    );
    const dialog = screen.getByRole('dialog');
    vi.spyOn(dialog, 'getBoundingClientRect').mockReturnValue(new DOMRect(100, 100, 400, 300));
    const outside = { clientX: 20, clientY: 20 };
    const inside = { clientX: 200, clientY: 200 };

    fireEvent.pointerDown(dialog, outside);
    fireEvent.click(dialog, outside);
    expect(onClose).toHaveBeenCalledTimes(1);

    fireEvent.pointerDown(screen.getByText('Body'), inside);
    fireEvent.click(dialog, outside);
    fireEvent.pointerDown(dialog, inside);
    fireEvent.click(dialog, inside);
    fireEvent.click(screen.getByText('Body'), inside);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('reports an uncancelable cancel and its queued close once, and reopens', () => {
    const onClose = vi.fn();
    render(<Dialog open title="Edit" onClose={onClose} />);
    const dialog = screen.getByRole('dialog') as HTMLDialogElement;
    fireEvent(dialog, new Event('cancel', { cancelable: false }));
    dialog.open = false;
    fireClose(dialog);
    expect(onClose).toHaveBeenCalledTimes(1);
    expect(dialog).toHaveAttribute('open');
    act(() => dialog.close());
    fireClose(dialog);
    expect(onClose).toHaveBeenCalledTimes(2);
  });

  it('ignores the cancel and close events of a nested Confirm', () => {
    const onClose = vi.fn();
    const onCancel = vi.fn();
    render(
      <Dialog open title="Edit" onClose={onClose}>
        <Confirm open title="Discard changes?" onConfirm={() => {}} onCancel={onCancel} />
      </Dialog>,
    );
    const confirm = screen.getByRole('dialog', { name: 'Discard changes?' });
    fireEvent(confirm, new Event('cancel', { cancelable: true }));
    expect(onCancel).toHaveBeenCalledTimes(1);
    act(() => (confirm as HTMLDialogElement).close());
    fireClose(confirm);
    expect(onClose).not.toHaveBeenCalled();
    expect(screen.getByRole('dialog', { name: 'Edit' })).toHaveAttribute('open');
  });

  it('reports an independent native close once and keeps the dialog open', () => {
    const ref = createRef<HTMLDialogElement>();
    const onClose = vi.fn();
    render(<Dialog ref={ref} open title="Edit" onClose={onClose} />);
    act(() => ref.current?.close());
    fireClose(ref.current as HTMLDialogElement);
    expect(onClose).toHaveBeenCalledTimes(1);
    expect(ref.current).toHaveAttribute('open');
  });

  it('does not report the close events of a Strict Mode replay or an unmount', () => {
    const onClose = vi.fn();
    const { unmount } = render(
      <StrictMode>
        <Dialog open title="Edit" onClose={onClose} />
      </StrictMode>,
    );
    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute('open');
    fireClose(dialog);
    expect(dialog).toHaveAttribute('open');
    unmount();
    fireClose(dialog);
    expect(onClose).not.toHaveBeenCalled();
  });

  it('returns focus to the opener', () => {
    function Example() {
      const [open, setOpen] = useState(false);
      return (
        <>
          <button type="button" onClick={() => setOpen(true)}>
            Open
          </button>
          <Dialog open={open} title="Edit" onClose={() => setOpen(false)} />
        </>
      );
    }
    render(<Example />);
    const opener = screen.getByRole('button', { name: 'Open' });
    opener.focus();
    fireEvent.click(opener);
    const close = screen.getByRole('button', { name: 'Close' });
    close.focus();
    fireEvent.click(close);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(opener).toHaveFocus();
  });

  it('passes labels, size, native props and handlers through', () => {
    const ref = createRef<HTMLDialogElement>();
    const onClick = vi.fn();
    const onPointerDown = vi.fn();
    render(
      <Dialog
        ref={ref}
        open
        title="Table rows"
        onClose={() => {}}
        closeLabel="Schließen"
        size="wide"
        className="custom"
        id="rows"
        style={{ color: 'red' }}
        aria-describedby="hint"
        onClick={onClick}
        onPointerDown={onPointerDown}
      >
        <p id="hint">Edit each row.</p>
      </Dialog>,
    );
    const dialog = screen.getByRole('dialog', { name: 'Table rows' });
    expect(ref.current).toBe(dialog);
    expect(dialog).toHaveClass('motiv-dialog', 'motiv-dialog--wide', 'custom');
    expect(dialog).toHaveAttribute('id', 'rows');
    expect(dialog).toHaveStyle({ color: 'rgb(255, 0, 0)' });
    expect(dialog).toHaveAccessibleDescription('Edit each row.');
    expect(screen.getByRole('heading', { level: 2, name: 'Table rows' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Schließen' })).toBeInTheDocument();
    fireEvent.pointerDown(dialog);
    fireEvent.click(dialog);
    expect(onPointerDown).toHaveBeenCalledTimes(1);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('defaults to the md width and supports callback ref cleanup', () => {
    const refCleanup = vi.fn();
    const ref = vi.fn(() => refCleanup);
    const { unmount } = render(<Dialog open title="Edit" onClose={() => {}} ref={ref} />);
    const dialog = screen.getByRole('dialog');
    expect(dialog).not.toHaveClass('motiv-dialog--wide');
    expect(ref).toHaveBeenCalledWith(dialog);
    unmount();
    expect(refCleanup).toHaveBeenCalledTimes(1);
  });
});
