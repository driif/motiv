import { fireEvent, render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { FloatingField } from './FloatingField';

describe('FloatingField', () => {
  it('is a text input named by its label and described by its hint', () => {
    render(<FloatingField label="Email" hint="We only use it to reply." type="email" />);
    const input = screen.getByRole('textbox', { name: 'Email' });
    expect(input).toHaveAttribute('type', 'email');
    expect(input).toHaveAttribute('placeholder', ' ');
    expect(input).toHaveAccessibleDescription('We only use it to reply.');
  });

  it('works controlled and passes ref, className and native props through', () => {
    const ref = createRef<HTMLInputElement>();
    const onChange = vi.fn();
    const { container } = render(
      <FloatingField
        ref={ref}
        label="Name"
        value="Ada"
        onChange={onChange}
        className="x"
        required
      />,
    );
    expect(container.firstChild).toHaveClass('motiv-float', 'x');
    expect(ref.current).toBe(screen.getByRole('textbox'));
    expect(ref.current).toBeRequired();
    fireEvent.change(ref.current as HTMLInputElement, { target: { value: 'Grace' } });
    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it('can hide the validity check', () => {
    const { container } = render(<FloatingField label="Note" showValidity={false} />);
    expect(container.querySelector('.motiv-float__ok')).toBeNull();
  });
});
