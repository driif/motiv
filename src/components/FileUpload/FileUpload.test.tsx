import { act, fireEvent, render, screen, within } from '@testing-library/react';
import { Activity, createRef, StrictMode } from 'react';
import { describe, expect, expectTypeOf, it, vi } from 'vitest';
import { FileUpload, type FileUploadProps } from './FileUpload';

function uploads() {
  const attempts: {
    signal: AbortSignal;
    onProgress: (percent: number) => void;
    resolve: () => void;
    reject: (error?: unknown) => void;
  }[] = [];
  const upload = vi.fn<FileUploadProps['upload']>(
    (_file, options) =>
      new Promise<void>((resolve, reject) => {
        attempts.push({ ...options, resolve, reject });
      }),
  );
  return { upload, attempts };
}

function pick(...files: File[]) {
  const input = screen.getByLabelText('Choose files');
  fireEvent.change(input, { target: { files } });
  return input;
}

const first = new File(['hello'], 'first.txt', { type: 'text/plain' });
const second = new File(['world'], 'second.txt', { type: 'text/plain' });
const third = new File(['again'], 'third.txt', { type: 'text/plain' });

describe('FileUpload', () => {
  it('excludes native required validation from its props', () => {
    expectTypeOf<FileUploadProps>().not.toHaveProperty('required');
  });

  it('selects, reports progress, completes and announces without visible percentages', async () => {
    const { upload, attempts } = uploads();
    const onUploaded = vi.fn();
    const { container } = render(<FileUpload upload={upload} onUploaded={onUploaded} />);
    pick(first);
    expect(upload).toHaveBeenCalledWith(
      first,
      expect.objectContaining({ signal: expect.any(AbortSignal) }),
    );
    expect(screen.getByText('5 B')).toBeInTheDocument();
    expect(screen.getByText('Uploading')).toBeInTheDocument();
    act(() => attempts[0].onProgress(42));
    expect(screen.getByRole('progressbar', { name: first.name })).toHaveAttribute(
      'aria-valuenow',
      '42',
    );
    expect(screen.queryByText('42%')).not.toBeInTheDocument();
    await act(async () => attempts[0].resolve());
    expect(onUploaded).toHaveBeenCalledExactlyOnceWith(first);
    expect(screen.getByText('Uploaded')).toBeInTheDocument();
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '100');
    expect(container.querySelector('[aria-live="polite"]')).toHaveTextContent('first.txt uploaded');
    act(() => attempts[0].onProgress(2));
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '100');
  });

  it('resets the input and allows the same file to be selected again', () => {
    const { upload, attempts } = uploads();
    const onChange = vi.fn();
    render(<FileUpload upload={upload} onChange={onChange} />);
    const input = screen.getByLabelText('Choose files');
    Object.defineProperty(input, 'value', {
      configurable: true,
      writable: true,
      value: 'fakepath',
    });
    pick(first);
    expect(input).toHaveValue('');
    pick(first);
    expect(upload).toHaveBeenCalledTimes(2);
    expect(onChange).toHaveBeenCalledTimes(2);
    expect(attempts[0].signal.aborted).toBe(true);
    expect(screen.getAllByRole('listitem')).toHaveLength(1);
  });

  it.each([
    [new Error('Permission denied'), 'Permission denied'],
    [{ message: 'Quota exceeded' }, 'Quota exceeded'],
    [new Error(''), 'Upload failed'],
    [undefined, 'Upload failed'],
    ['no details', 'Upload failed'],
  ])('shows the rejection message or fallback and describes its row: %s', async (error, text) => {
    const { upload, attempts } = uploads();
    const { container } = render(<FileUpload upload={upload} />);
    pick(first);
    await act(async () => attempts[0].reject(error));
    expect(screen.getByRole('listitem', { name: first.name })).toHaveAccessibleDescription(text);
    expect(screen.getByText('Error')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: `Retry: ${first.name}` })).toBeEnabled();
    expect(screen.getByRole('button', { name: `Remove: ${first.name}` })).toBeEnabled();
    expect(container.querySelector('[aria-live="polite"]')).toHaveTextContent(
      'first.txt upload failed',
    );
  });

  it('handles a synchronously thrown upload error', () => {
    render(
      <FileUpload
        upload={() => {
          throw new Error('Could not presign');
        }}
      />,
    );
    pick(first);
    expect(screen.getByText('Could not presign')).toBeInTheDocument();
  });

  it('retries with a new signal and ignores progress from the failed attempt', async () => {
    const { upload, attempts } = uploads();
    const onUploaded = vi.fn();
    render(<FileUpload upload={upload} onUploaded={onUploaded} />);
    pick(first);
    act(() => attempts[0].onProgress(70));
    await act(async () => attempts[0].reject(new Error('Try again')));
    fireEvent.click(screen.getByRole('button', { name: `Retry: ${first.name}` }));
    expect(attempts[1].signal).not.toBe(attempts[0].signal);
    expect(screen.queryByText('Try again')).not.toBeInTheDocument();
    act(() => attempts[0].onProgress(99));
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '0');
    act(() => attempts[1].onProgress(25));
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '25');
    await act(async () => attempts[1].resolve());
    expect(onUploaded).toHaveBeenCalledExactlyOnceWith(first);
  });

  it.each(['resolve', 'reject'] as const)(
    'cancels, aborts and ignores late %s and progress',
    async (settle) => {
      const { upload, attempts } = uploads();
      const onUploaded = vi.fn();
      const onRemove = vi.fn();
      const { container } = render(
        <FileUpload upload={upload} onUploaded={onUploaded} onRemove={onRemove} />,
      );
      const input = pick(first);
      fireEvent.click(screen.getByRole('button', { name: `Cancel: ${first.name}` }));
      expect(attempts[0].signal.aborted).toBe(true);
      expect(input).toHaveFocus();
      pick(first);
      await act(async () => {
        attempts[0].onProgress(80);
        attempts[0][settle]();
      });
      expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '0');
      expect(onUploaded).not.toHaveBeenCalled();
      expect(onRemove).not.toHaveBeenCalled();
      expect(container.querySelector('[aria-live="polite"]')).toBeEmptyDOMElement();
    },
  );

  it.each(['resolve', 'reject'] as const)(
    'replaces in-flight files and ignores their late %s',
    async (settle) => {
      const { upload, attempts } = uploads();
      const onUploaded = vi.fn();
      render(<FileUpload upload={upload} onUploaded={onUploaded} />);
      pick(first);
      pick(second);
      expect(attempts[0].signal.aborted).toBe(true);
      await act(async () => {
        attempts[0].onProgress(90);
        attempts[0][settle]();
      });
      expect(screen.getAllByRole('listitem')).toHaveLength(1);
      expect(screen.getByRole('progressbar', { name: second.name })).toHaveAttribute(
        'aria-valuenow',
        '0',
      );
      expect(onUploaded).not.toHaveBeenCalled();
    },
  );

  it('calls onRemove for completed replacements and removals only', async () => {
    const { upload, attempts } = uploads();
    const onRemove = vi.fn();
    render(<FileUpload upload={upload} onRemove={onRemove} />);
    pick(first);
    await act(async () => attempts[0].resolve());
    pick(second);
    expect(onRemove).toHaveBeenCalledExactlyOnceWith(first);
    await act(async () => attempts[1].resolve());
    fireEvent.click(screen.getByRole('button', { name: `Remove: ${second.name}` }));
    expect(onRemove).toHaveBeenLastCalledWith(second);
    expect(onRemove).toHaveBeenCalledTimes(2);
    pick(third);
    await act(async () => attempts[2].reject());
    fireEvent.click(screen.getByRole('button', { name: `Remove: ${third.name}` }));
    act(() => attempts[2].onProgress(99));
    expect(screen.queryByRole('listitem')).not.toBeInTheDocument();
    expect(onRemove).toHaveBeenCalledTimes(2);
  });

  it('calls onRemove when Cancel is clicked after the upload settled but before re-render', async () => {
    const { upload, attempts } = uploads();
    const onRemove = vi.fn();
    render(<FileUpload upload={upload} onRemove={onRemove} />);
    pick(first);
    const cancel = screen.getByRole('button', { name: `Cancel: ${first.name}` });
    attempts[0].resolve();
    await Promise.resolve();
    fireEvent.click(cancel);
    expect(onRemove).toHaveBeenCalledExactlyOnceWith(first);
  });

  it('appends multiple selections and keeps simultaneous announcements', async () => {
    const { upload, attempts } = uploads();
    const { container } = render(<FileUpload upload={upload} multiple />);
    pick(first, second);
    pick(third);
    expect(screen.getAllByRole('listitem')).toHaveLength(3);
    await act(async () => {
      attempts[0].resolve();
      attempts[1].reject();
      attempts[2].resolve();
    });
    const live = container.querySelector('[aria-live="polite"]');
    expect(live).toHaveTextContent('first.txt uploaded');
    expect(live).toHaveTextContent('second.txt upload failed');
    expect(live).toHaveTextContent('third.txt uploaded');
  });

  it('keeps the existing entry if the file picker is dismissed', () => {
    const { upload, attempts } = uploads();
    render(<FileUpload upload={upload} />);
    pick(first);
    pick();
    expect(attempts[0].signal.aborted).toBe(false);
    expect(screen.getByRole('listitem', { name: first.name })).toBeInTheDocument();
  });

  it('moves focus to the next action, previous action, then the input', async () => {
    const { upload, attempts } = uploads();
    render(<FileUpload upload={upload} multiple />);
    const input = pick(first, second, third);
    await act(async () => {
      attempts[0].resolve();
      attempts[1].reject();
    });
    const removeSecond = screen.getByRole('button', { name: `Remove: ${second.name}` });
    removeSecond.focus();
    fireEvent.click(removeSecond);
    const cancelThird = screen.getByRole('button', { name: `Cancel: ${third.name}` });
    expect(cancelThird).toHaveFocus();
    fireEvent.click(cancelThird);
    const removeFirst = screen.getByRole('button', { name: `Remove: ${first.name}` });
    expect(removeFirst).toHaveFocus();
    fireEvent.click(removeFirst);
    expect(input).toHaveFocus();
  });

  it('disables the picker and all row actions without stopping ongoing uploads', async () => {
    const { upload, attempts } = uploads();
    const { rerender } = render(<FileUpload upload={upload} multiple />);
    pick(first, second, third);
    await act(async () => {
      attempts[1].resolve();
      attempts[2].reject();
    });
    rerender(<FileUpload upload={upload} multiple disabled />);
    expect(screen.getByLabelText('Choose files')).toBeDisabled();
    for (const button of screen.getAllByRole('button')) {
      expect(button).toBeDisabled();
      fireEvent.click(button);
    }
    pick(first);
    expect(upload).toHaveBeenCalledTimes(3);
    expect(attempts[0].signal.aborted).toBe(false);
    expect(screen.getAllByRole('listitem')).toHaveLength(3);
  });

  it('forwards ref, native input props and onChange; merges root class and style', () => {
    const { upload } = uploads();
    const ref = createRef<HTMLInputElement>();
    const { container } = render(
      <FileUpload
        upload={upload}
        ref={ref}
        id="attachments"
        name="files"
        accept="image/*"
        multiple
        aria-describedby="hint"
        className="extra"
        style={{ width: '80%' }}
      />,
    );
    expect(ref.current).toBe(screen.getByLabelText('Choose files'));
    expect(ref.current).toHaveAttribute('type', 'file');
    expect(ref.current).toHaveAttribute('id', 'attachments');
    expect(ref.current).toHaveAttribute('name', 'files');
    expect(ref.current).toHaveAttribute('accept', 'image/*');
    expect(ref.current).toHaveAttribute('multiple');
    expect(ref.current).toHaveAttribute('aria-describedby', 'hint');
    expect(container.firstChild).toHaveClass('motiv-file-upload', 'extra');
    expect(container.firstChild).toHaveStyle({ width: '80%' });
  });

  it('preserves React 19 callback-ref cleanup', () => {
    const { upload } = uploads();
    const cleanup = vi.fn();
    const ref = vi.fn(() => cleanup);
    const { unmount } = render(<FileUpload upload={upload} ref={ref} />);
    expect(ref).toHaveBeenCalledExactlyOnceWith(screen.getByLabelText('Choose files'));
    unmount();
    expect(cleanup).toHaveBeenCalledTimes(1);
  });

  it('overrides every visible string and announcement formatter', async () => {
    const { upload, attempts } = uploads();
    const { container } = render(
      <FileUpload
        upload={upload}
        label="Attach"
        uploadingLabel="Sending"
        uploadedLabel="Sent"
        errorLabel="Failed"
        errorMessage="Please retry"
        retryLabel="Try again"
        removeLabel="Delete"
        cancelLabel="Stop"
        formatSize={(size) => `${size} bytes`}
        formatUploadedMessage={(name) => `Sent ${name}`}
        formatErrorMessage={(name) => `Failed ${name}`}
      />,
    );
    fireEvent.change(screen.getByLabelText('Attach'), { target: { files: [first] } });
    expect(screen.getByText('Sending')).toBeInTheDocument();
    expect(screen.getByText('5 bytes')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: `Stop: ${first.name}` })).toBeInTheDocument();
    await act(async () => attempts[0].reject());
    expect(screen.getByText('Failed')).toBeInTheDocument();
    expect(screen.getByText('Please retry')).toBeInTheDocument();
    const live = container.querySelector('[aria-live="polite"]');
    expect(live).toHaveTextContent('Failed first.txt');
    fireEvent.click(screen.getByRole('button', { name: `Try again: ${first.name}` }));
    await act(async () => attempts[1].resolve());
    expect(screen.getByText('Sent')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: `Delete: ${first.name}` })).toBeInTheDocument();
    expect(live).toHaveTextContent('Sent first.txt');
  });

  it('formats kilobytes and megabytes by default', () => {
    const { upload } = uploads();
    render(<FileUpload upload={upload} multiple />);
    pick(new File([new Uint8Array(1024)], 'kb'), new File([new Uint8Array(1024 ** 2)], 'mb'));
    expect(
      within(screen.getByRole('listitem', { name: 'kb' })).getByText('1.0 KB'),
    ).toBeInTheDocument();
    expect(
      within(screen.getByRole('listitem', { name: 'mb' })).getByText('1.0 MB'),
    ).toBeInTheDocument();
  });

  it('preserves completed files across Activity hide/show and notifies on replacement', async () => {
    const { upload, attempts } = uploads();
    const onRemove = vi.fn();
    const component = <FileUpload upload={upload} onRemove={onRemove} />;
    const { rerender } = render(<Activity mode="visible">{component}</Activity>);
    pick(first);
    await act(async () => attempts[0].resolve());

    rerender(<Activity mode="hidden">{component}</Activity>);
    rerender(<Activity mode="visible">{component}</Activity>);
    expect(screen.getByRole('button', { name: `Remove: ${first.name}` })).toBeInTheDocument();
    expect(onRemove).not.toHaveBeenCalled();

    pick(second);
    expect(onRemove).toHaveBeenCalledExactlyOnceWith(first);
    expect(screen.queryByRole('listitem', { name: first.name })).not.toBeInTheDocument();
    await act(async () => attempts[1].resolve());
    expect(screen.getByText('Uploaded')).toBeInTheDocument();
    expect(screen.queryByText('Uploading')).not.toBeInTheDocument();
  });

  it.each(['resolve', 'reject'] as const)(
    'cancels active files on Activity hide, preserves settled rows and ignores late %s',
    async (settle) => {
      const { upload, attempts } = uploads();
      const onUploaded = vi.fn();
      const onRemove = vi.fn();
      const component = (
        <FileUpload upload={upload} multiple onUploaded={onUploaded} onRemove={onRemove} />
      );
      const { container, rerender } = render(<Activity mode="visible">{component}</Activity>);
      pick(first, second, third);
      await act(async () => {
        attempts[0].resolve();
        attempts[2].reject(new Error('Try again'));
      });
      attempts[1].signal.addEventListener('abort', () => attempts[1].onProgress(90));
      const announcements = container.querySelector('[aria-live="polite"]')?.textContent;

      rerender(<Activity mode="hidden">{component}</Activity>);
      expect(attempts[1].signal.aborted).toBe(true);
      rerender(<Activity mode="visible">{component}</Activity>);
      expect(screen.getByRole('button', { name: `Remove: ${first.name}` })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: `Retry: ${third.name}` })).toBeInTheDocument();
      expect(screen.queryByRole('listitem', { name: second.name })).not.toBeInTheDocument();
      expect(screen.queryByText('Uploading')).not.toBeInTheDocument();
      expect(onRemove).not.toHaveBeenCalled();

      pick(second);
      await act(async () => {
        attempts[1].onProgress(80);
        attempts[1][settle]();
      });
      expect(screen.getAllByRole('listitem')).toHaveLength(3);
      expect(screen.getByRole('progressbar', { name: second.name })).toHaveAttribute(
        'aria-valuenow',
        '0',
      );
      expect(onUploaded).toHaveBeenCalledExactlyOnceWith(first);
      expect(container.querySelector('[aria-live="polite"]')?.textContent).toBe(announcements);

      fireEvent.click(screen.getByRole('button', { name: `Cancel: ${second.name}` }));
      expect(attempts[3].signal.aborted).toBe(true);
      expect(screen.getAllByRole('listitem')).toHaveLength(2);
      expect(onRemove).not.toHaveBeenCalled();
      fireEvent.click(screen.getByRole('button', { name: `Remove: ${first.name}` }));
      expect(onRemove).toHaveBeenCalledExactlyOnceWith(first);
    },
  );

  it('aborts every active attempt on unmount and ignores all late callbacks in StrictMode', async () => {
    const { upload, attempts } = uploads();
    const onUploaded = vi.fn();
    const onRemove = vi.fn();
    const { unmount } = render(
      <StrictMode>
        <FileUpload upload={upload} multiple onUploaded={onUploaded} onRemove={onRemove} />
      </StrictMode>,
    );
    pick(first, second);
    unmount();
    expect(attempts.every(({ signal }) => signal.aborted)).toBe(true);
    await act(async () => {
      attempts[0].onProgress(20);
      attempts[0].resolve();
      attempts[1].reject();
    });
    expect(onUploaded).not.toHaveBeenCalled();
    expect(onRemove).not.toHaveBeenCalled();
  });
});
