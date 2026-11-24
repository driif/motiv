import { fireEvent, render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { TextField } from './TextField';

describe('TextField', () => {
  it('is a text input named by its label and described by its hint', () => {
    const { container } = render(<TextField label="Email" hint="We only use it to reply." />);
    const input = screen.getByRole('textbox', { name: 'Email' });
    expect(input).toHaveAttribute('type', 'text');
    expect(input).toHaveAttribute('placeholder', ' ');
    expect(input).toHaveAccessibleDescription('We only use it to reply.');
    expect(container.querySelector('.motiv-float__ok')).toBeNull();
  });

  it('puts the label above the box with labelPosition="above"', () => {
    const { container } = render(<TextField label="Email" labelPosition="above" hint="Hint" />);
    const input = screen.getByRole('textbox', { name: 'Email' });
    expect(input).toHaveAccessibleDescription('Hint');
    expect(container.firstChild).toHaveClass('motiv-float', 'motiv-float--above');
    expect(container.querySelector('.motiv-float__title')?.nextElementSibling).toHaveClass(
      'motiv-float__control',
    );
    expect(container.querySelector('.motiv-float__label')).toBeNull();
  });

  it('keeps the label for screen readers only with labelPosition="hidden"', () => {
    const { container } = render(<TextField label="Name" labelPosition="hidden" />);
    expect(screen.getByRole('textbox', { name: 'Name' })).toBeInTheDocument();
    expect(container.firstChild).toHaveClass('motiv-float', 'motiv-float--hidden');
    expect(container.querySelector('label')).toHaveClass('motiv-visually-hidden');
  });

  it('merges a caller aria-describedby with the hint', () => {
    render(<TextField id="mail" label="Email" hint="Hint" aria-describedby="err" />);
    expect(screen.getByRole('textbox')).toHaveAttribute('aria-describedby', 'err mail-hint');
  });

  it('puts className on the wrapper and style, native props and ref on the input', () => {
    const ref = createRef<HTMLInputElement>();
    const onChange = vi.fn();
    const { container } = render(
      <TextField
        ref={ref}
        label="Name"
        className="x"
        style={{ width: 200 }}
        onChange={onChange}
        required
      />,
    );
    const input = screen.getByRole('textbox');
    expect(container.firstChild).toHaveClass('motiv-float', 'x');
    expect(container.firstChild).not.toHaveAttribute('style');
    expect(input).toHaveStyle({ width: '200px' });
    expect(ref.current).toBe(input);
    expect(input).toBeRequired();
    fireEvent.change(input, { target: { value: 'Ada' } });
    expect(onChange).toHaveBeenCalledTimes(1);
  });
});
