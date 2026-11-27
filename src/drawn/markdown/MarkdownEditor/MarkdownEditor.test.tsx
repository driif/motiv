import { act, fireEvent, render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { MarkdownEditor } from './MarkdownEditor';

describe('drawn MarkdownEditor', () => {
  it('renders the drawn Textarea and a preview labelled like its field label', () => {
    const { container } = render(<MarkdownEditor defaultValue="*Start*" />);
    expect(screen.getByRole('textbox', { name: 'Markdown' })).toHaveValue('*Start*');
    expect(container.querySelector('.motiv-textarea__line')).not.toBeNull();
    const preview = screen.getByRole('region', { name: 'Preview' });
    expect(screen.getByText('Preview')).toHaveClass('motiv-textarea__label');
    expect(preview.querySelector('.motiv-markdown em')).toHaveTextContent('Start');
  });

  it('updates an uncontrolled preview and calls the native change handler', () => {
    const onChange = vi.fn();
    render(<MarkdownEditor onChange={(event) => onChange(event.currentTarget.value)} />);
    fireEvent.change(screen.getByRole('textbox'), { target: { value: '## Edited' } });
    expect(screen.getByRole('heading', { name: 'Edited' })).toBeVisible();
    expect(onChange).toHaveBeenCalledExactlyOnceWith('## Edited');
  });

  it('mirrors the controlled value until the caller changes it', () => {
    const { rerender } = render(<MarkdownEditor value="# Original" onChange={() => {}} />);
    fireEvent.change(screen.getByRole('textbox'), { target: { value: '# Ignored' } });
    expect(screen.getByRole('heading')).toHaveTextContent('Original');
    rerender(<MarkdownEditor value="# Updated" onChange={() => {}} />);
    expect(screen.getByRole('heading')).toHaveTextContent('Updated');
  });

  it('passes the textarea ref, with class and style on the wrapper', () => {
    const ref = createRef<HTMLTextAreaElement>();
    const { container } = render(
      <MarkdownEditor ref={ref} label="Notes" className="custom" style={{ width: 400 }} />,
    );
    expect(ref.current).toBe(screen.getByRole('textbox', { name: 'Notes' }));
    expect(container.firstChild).toHaveClass('motiv-markdown-editor', 'custom');
    expect(container.firstChild).toHaveStyle({ width: '400px' });
  });

  it('follows a form reset after a user reset click', async () => {
    render(
      <form>
        <MarkdownEditor defaultValue="# Default" />
        <button type="reset">Reset</button>
      </form>,
    );
    fireEvent.change(screen.getByRole('textbox'), { target: { value: '# Typed' } });
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: 'Reset' }));
      await new Promise((resolve) => setTimeout(resolve));
    });
    expect(screen.getByRole('textbox')).toHaveValue('# Default');
    expect(screen.getByRole('heading')).toHaveTextContent('Default');
  });
});
