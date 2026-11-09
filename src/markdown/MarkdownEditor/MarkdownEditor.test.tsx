import { act, fireEvent, render, screen, within } from '@testing-library/react';
import { createRef, useState } from 'react';
import { hydrateRoot, type Root } from 'react-dom/client';
import { renderToString } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import { Markdown } from '../Markdown';
import { MarkdownEditor } from './MarkdownEditor';

describe('MarkdownEditor', () => {
  it('labels the empty field and always-visible preview without live announcements', () => {
    const { container } = render(<MarkdownEditor />);
    expect(screen.getByRole('textbox', { name: 'Markdown' })).toHaveValue('');
    expect(screen.getByRole('region', { name: 'Preview' })).toBeVisible();
    expect(container.querySelector('.motiv-markdown')).toBeEmptyDOMElement();
    expect(container.querySelector('[aria-live], [role="status"], [role="alert"]')).toBeNull();
  });

  it('updates an uncontrolled preview and calls the native change handler', () => {
    const onChange = vi.fn();
    render(
      <MarkdownEditor
        defaultValue="*Start*"
        onChange={(event) => onChange(event.currentTarget.value)}
      />,
    );
    expect(screen.getByText('Start').tagName).toBe('EM');
    fireEvent.change(screen.getByRole('textbox'), { target: { value: '## Edited' } });
    expect(screen.getByRole('heading', { name: 'Edited' })).toBeVisible();
    expect(onChange).toHaveBeenCalledExactlyOnceWith('## Edited');
  });

  it('mirrors the controlled value until the caller changes it', () => {
    const onChange = vi.fn();
    const { rerender } = render(<MarkdownEditor value="# Original" onChange={onChange} />);
    fireEvent.change(screen.getByRole('textbox'), { target: { value: '# Ignored' } });
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(screen.getByRole('textbox')).toHaveValue('# Original');
    expect(screen.getByRole('heading')).toHaveTextContent('Original');
    rerender(<MarkdownEditor value="# Updated" onChange={onChange} />);
    expect(screen.getByRole('textbox')).toHaveValue('# Updated');
    expect(screen.getByRole('heading')).toHaveTextContent('Updated');
  });

  it('passes labels, native props and the textarea ref, with class and style on the wrapper', () => {
    const ref = createRef<HTMLTextAreaElement>();
    const { container } = render(
      <form>
        <MarkdownEditor
          ref={ref}
          label="Notes"
          previewLabel="Rendered notes"
          hint="Use Markdown"
          name="notes"
          id="notes"
          required
          readOnly
          defaultValue="Saved"
          className="custom"
          style={{ width: 400 }}
        />
      </form>,
    );
    const input = screen.getByRole('textbox', { name: 'Notes' });
    expect(ref.current).toBe(input);
    expect(input).toBeRequired();
    expect(input).toHaveAttribute('readonly');
    expect(input).toHaveAttribute('id', 'notes');
    expect(input).toHaveAccessibleDescription('Use Markdown');
    expect(screen.getByRole('region', { name: 'Rendered notes' })).toBeVisible();
    expect(container.querySelector('.motiv-markdown-editor')).toHaveClass('custom');
    expect(container.querySelector('.motiv-markdown-editor')).toHaveStyle({ width: '400px' });
    expect(new FormData(container.querySelector('form') as HTMLFormElement).get('notes')).toBe(
      'Saved',
    );
  });

  it.each(['# Default', ''])(
    'resets to %j and reports typing the same value again',
    async (defaultValue) => {
      const onChange = vi.fn();
      const { container } = render(
        <form>
          <MarkdownEditor
            defaultValue={defaultValue}
            onChange={(event) => onChange(event.currentTarget.value)}
          />
        </form>,
      );
      const input = screen.getByRole('textbox');
      fireEvent.change(input, { target: { value: '# Typed' } });
      await act(async () => (container.querySelector('form') as HTMLFormElement).reset());
      expect(input).toHaveValue(defaultValue);
      const preview = screen.getByRole('region');
      if (defaultValue) expect(within(preview).getByRole('heading')).toHaveTextContent('Default');
      else expect(within(preview).queryByRole('heading')).toBeNull();
      fireEvent.change(input, { target: { value: '# Typed' } });
      expect(onChange.mock.calls).toEqual([['# Typed'], ['# Typed']]);
      expect(within(preview).getByRole('heading')).toHaveTextContent('Typed');
    },
  );

  it('resets an externally associated form and respects a cancelled reset', async () => {
    const { rerender } = render(
      <>
        <form id="external" />
        <MarkdownEditor form="external" defaultValue="# Default" />
      </>,
    );
    fireEvent.change(screen.getByRole('textbox'), { target: { value: '# Typed' } });
    await act(async () => (document.getElementById('external') as HTMLFormElement).reset());
    expect(screen.getByRole('heading')).toHaveTextContent('Default');
    rerender(
      <>
        <form id="external" onReset={(event) => event.preventDefault()} />
        <MarkdownEditor form="external" defaultValue="# Default" />
      </>,
    );
    fireEvent.change(screen.getByRole('textbox'), { target: { value: '# Kept' } });
    await act(async () => (document.getElementById('external') as HTMLFormElement).reset());
    expect(screen.getByRole('textbox')).toHaveValue('# Kept');
    expect(screen.getByRole('heading')).toHaveTextContent('Kept');
  });

  it('keeps the controlled field and preview in step after a form reset', async () => {
    const { container, rerender } = render(
      <form>
        <MarkdownEditor value="# First" readOnly />
      </form>,
    );
    rerender(
      <form>
        <MarkdownEditor value="# Current" readOnly />
      </form>,
    );
    await act(async () => (container.querySelector('form') as HTMLFormElement).reset());
    expect(screen.getByRole('textbox')).toHaveValue('# Current');
    expect(screen.getByRole('heading')).toHaveTextContent('Current');
  });

  it('preserves React 19 callback-ref cleanup', () => {
    const cleanup = vi.fn();
    const ref = vi.fn(() => cleanup);
    const { unmount } = render(<MarkdownEditor ref={ref} />);
    expect(ref).toHaveBeenCalledExactlyOnceWith(screen.getByRole('textbox'));
    unmount();
    expect(cleanup).toHaveBeenCalledTimes(1);
  });

  it('lets the app replace a controlled value in its reset handler', async () => {
    function ControlledForm() {
      const [value, setValue] = useState('# Before');
      return (
        <form onReset={() => setValue('# Reset')}>
          <MarkdownEditor value={value} onChange={(event) => setValue(event.currentTarget.value)} />
          <button type="reset">Reset</button>
        </form>
      );
    }
    render(<ControlledForm />);
    fireEvent.click(screen.getByRole('button', { name: 'Reset' }));
    await act(async () => {});
    expect(screen.getByRole('textbox')).toHaveValue('# Reset');
    expect(screen.getByRole('heading')).toHaveTextContent('Reset');
  });

  it.each([false, true])(
    'hydrates without errors and keeps editing (controlled=%s)',
    async (controlled) => {
      function Hydrated() {
        const [value, setValue] = useState('# Initial');
        return (
          <>
            <Markdown>{'**Read** [safe](/guide) <script>inert</script>'}</Markdown>
            <MarkdownEditor
              value={controlled ? value : undefined}
              defaultValue={controlled ? undefined : value}
              onChange={(event) => setValue(event.currentTarget.value)}
            />
          </>
        );
      }
      const errors = vi.spyOn(console, 'error').mockImplementation(() => {});
      const warnings = vi.spyOn(console, 'warn').mockImplementation(() => {});
      const recoverable = vi.fn();
      const container = document.createElement('div');
      container.innerHTML = renderToString(<Hydrated />);
      document.body.append(container);
      let root: Root | undefined;
      try {
        await act(async () => {
          root = hydrateRoot(container, <Hydrated />, { onRecoverableError: recoverable });
        });
        fireEvent.change(within(container).getByRole('textbox'), {
          target: { value: '# Hydrated' },
        });
        expect(within(container).getByRole('heading')).toHaveTextContent('Hydrated');
        expect(within(container).getByRole('textbox')).toHaveValue('# Hydrated');
        expect(container.querySelector('script')).toBeNull();
        expect(recoverable).not.toHaveBeenCalled();
        expect(errors).not.toHaveBeenCalled();
        expect(warnings).not.toHaveBeenCalled();
      } finally {
        await act(async () => root?.unmount());
        container.remove();
        errors.mockRestore();
        warnings.mockRestore();
      }
    },
  );
});
