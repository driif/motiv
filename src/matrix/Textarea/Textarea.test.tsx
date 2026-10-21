import { fireEvent, render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { Textarea } from './Textarea';

function contentHeight(textarea: HTMLElement, px: number) {
  Object.defineProperty(textarea, 'scrollHeight', { configurable: true, value: px });
}

describe('Textarea', () => {
  it('is a multi-line textbox named by its label and described by its hint', () => {
    render(<Textarea label="Message" hint="Shift+Enter adds a line." />);
    const textarea = screen.getByRole('textbox', { name: 'Message' });
    expect(textarea.tagName).toBe('TEXTAREA');
    expect(textarea).toHaveAccessibleDescription('Shift+Enter adds a line.');
  });

  it('can hide the label visually and keep the name', () => {
    render(<Textarea label="Message" hideLabel />);
    expect(screen.getByText('Message')).toHaveClass('motiv-visually-hidden');
    expect(screen.getByRole('textbox', { name: 'Message' })).toBeInTheDocument();
  });

  it('passes ref, className, style and native props through', () => {
    const ref = createRef<HTMLTextAreaElement>();
    const onChange = vi.fn();
    const onKeyDown = vi.fn();
    const { container } = render(
      <Textarea
        ref={ref}
        label="Message"
        value="Hi"
        onChange={onChange}
        onKeyDown={onKeyDown}
        placeholder="Write a message"
        rows={1}
        maxRows={4}
        className="x"
        style={{ margin: 1 }}
      />,
    );
    const root = container.firstChild as HTMLElement;
    expect(root).toHaveClass('motiv-matrix-textarea', 'x');
    expect(root.style.getPropertyValue('--_max-rows')).toBe('4');
    expect(root.style.margin).toBe('1px');
    expect(ref.current).toBe(screen.getByRole('textbox'));
    expect(ref.current).toHaveAttribute('rows', '1');
    expect(ref.current).toHaveAttribute('placeholder', 'Write a message');
    fireEvent.change(ref.current as HTMLTextAreaElement, { target: { value: 'Hi!' } });
    fireEvent.keyDown(ref.current as HTMLTextAreaElement, { key: 'Enter' });
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onKeyDown).toHaveBeenCalledTimes(1);
  });

  it('grows with typed content and fits a new controlled value', () => {
    const { rerender } = render(<Textarea label="Message" value="" onChange={() => {}} />);
    const textarea = screen.getByRole('textbox');
    contentHeight(textarea, 80);
    fireEvent.input(textarea);
    expect(textarea.style.height).toBe('80px');
    contentHeight(textarea, 24);
    rerender(<Textarea label="Message" value="x" onChange={() => {}} />);
    expect(textarea.style.height).toBe('24px');
  });
});
