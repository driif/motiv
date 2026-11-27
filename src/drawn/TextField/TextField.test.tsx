import { fireEvent, render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { TextField } from './TextField';

describe('TextField', () => {
  it('associates the label with a text input', () => {
    render(<TextField label="Email" />);
    const input = screen.getByRole('textbox', { name: 'Email' });
    expect(input).toHaveAttribute('type', 'text');
    expect(input).toHaveAttribute('placeholder', ' ');
    expect(input).not.toHaveAttribute('aria-describedby');
  });

  it('describes the input with the hint', () => {
    render(<TextField label="Email" hint="We never share it." />);
    expect(screen.getByRole('textbox')).toHaveAccessibleDescription('We never share it.');
  });

  it('puts the label above the box with labelPosition="above"', () => {
    const { container } = render(<TextField label="Email" labelPosition="above" hint="Hint" />);
    expect(screen.getByRole('textbox', { name: 'Email' })).toHaveAccessibleDescription('Hint');
    expect(container.firstChild).toHaveClass('motiv-text-field', 'motiv-text-field--above');
    expect(container.querySelector('.motiv-text-field__title')?.nextElementSibling).toHaveClass(
      'motiv-text-field__control',
    );
    expect(container.querySelector('.motiv-text-field__label')).toBeNull();
  });

  it('keeps the label for screen readers only with labelPosition="hidden"', () => {
    const { container } = render(<TextField label="Name" labelPosition="hidden" />);
    expect(screen.getByRole('textbox', { name: 'Name' })).toBeInTheDocument();
    expect(container.firstChild).toHaveClass('motiv-text-field--hidden');
    expect(container.querySelector('label')).toHaveClass('motiv-visually-hidden');
  });

  it('keeps a caller id and aria-describedby', () => {
    render(
      <>
        <TextField id="mail" label="Email" hint="Hint" aria-describedby="err" />
        <p id="err">Required</p>
      </>,
    );
    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('id', 'mail');
    expect(input).toHaveAttribute('aria-describedby', 'err mail-hint');
  });

  it('puts className on the wrapper and native props and ref on the input', () => {
    const ref = createRef<HTMLInputElement>();
    const onChange = vi.fn();
    const { container } = render(
      <TextField ref={ref} label="Name" className="extra" type="email" onChange={onChange} />,
    );
    expect(container.firstChild).toHaveClass('motiv-text-field', 'extra');
    const input = screen.getByRole('textbox');
    expect(ref.current).toBe(input);
    expect(input).toHaveAttribute('type', 'email');
    fireEvent.change(input, { target: { value: 'a' } });
    expect(onChange).toHaveBeenCalled();
  });
});
