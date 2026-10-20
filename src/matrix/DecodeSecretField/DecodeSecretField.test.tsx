import { act, fireEvent, render, screen } from '@testing-library/react';
import { createRef, useState } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { DecodeSecretField } from './DecodeSecretField';

let reduce = false;

beforeEach(() => {
  reduce = false;
  vi.useFakeTimers();
  vi.stubGlobal('matchMedia', () => ({ matches: reduce }));
});

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
});

function Controlled() {
  const [value, setValue] = useState('s3cr3t-token');
  return <DecodeSecretField label="Root token" value={value} onChange={setValue} />;
}

const input = () => screen.getByLabelText('Root token') as HTMLInputElement;
const scramble = () => document.querySelector('.motiv-matrix-decode__scramble');

describe('DecodeSecretField', () => {
  it('is a masked input with a show toggle that controls it', () => {
    render(<Controlled />);
    expect(input()).toHaveAttribute('type', 'password');
    const eye = screen.getByRole('button', { name: 'Show secret' });
    expect(eye).toHaveAttribute('aria-pressed', 'false');
    expect(eye).toHaveAttribute('aria-controls', input().id);
  });

  it('reports typed values', () => {
    const onChange = vi.fn();
    render(<DecodeSecretField label="Root token" value="" onChange={onChange} />);
    fireEvent.change(input(), { target: { value: 'abc' } });
    expect(onChange).toHaveBeenCalledWith('abc');
  });

  it('decodes over a still-masked input, then reveals', () => {
    render(<Controlled />);
    fireEvent.click(screen.getByRole('button', { name: 'Show secret' }));
    expect(input()).toHaveAttribute('type', 'password');
    expect(input()).toHaveAttribute('readonly');
    expect(input().value).toBe('');
    expect(scramble()).toHaveAttribute('aria-hidden', 'true');
    expect(scramble()?.textContent).toHaveLength('s3cr3t-token'.length);
    expect(scramble()?.textContent).not.toBe('s3cr3t-token');
    act(() => vi.advanceTimersByTime(45 * 16));
    expect(scramble()).toBeNull();
    expect(input()).toHaveAttribute('type', 'text');
    expect(input().value).toBe('s3cr3t-token');
    expect(input()).not.toHaveAttribute('readonly');
    expect(screen.getByRole('button', { name: 'Hide secret' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
  });

  it('masks at once when hiding and scrambles on top', () => {
    render(<Controlled />);
    fireEvent.click(screen.getByRole('button', { name: 'Show secret' }));
    act(() => vi.advanceTimersByTime(45 * 16));
    fireEvent.click(screen.getByRole('button', { name: 'Hide secret' }));
    expect(input()).toHaveAttribute('type', 'password');
    expect(scramble()).not.toBeNull();
    act(() => vi.advanceTimersByTime(45 * 8));
    expect(scramble()).toBeNull();
    expect(screen.getByRole('button', { name: 'Show secret' })).toBeInTheDocument();
  });

  it('hides again on a second click during the reveal', () => {
    render(<Controlled />);
    fireEvent.click(screen.getByRole('button', { name: 'Show secret' }));
    act(() => vi.advanceTimersByTime(45 * 4));
    fireEvent.click(screen.getByRole('button', { name: 'Hide secret' }));
    act(() => vi.advanceTimersByTime(45 * 16));
    expect(scramble()).toBeNull();
    expect(input()).toHaveAttribute('type', 'password');
    expect(screen.getByRole('button', { name: 'Show secret' })).toHaveAttribute(
      'aria-pressed',
      'false',
    );
  });

  it('skips the scramble under reduced motion', () => {
    reduce = true;
    render(<Controlled />);
    fireEvent.click(screen.getByRole('button', { name: 'Show secret' }));
    expect(scramble()).toBeNull();
    expect(input()).toHaveAttribute('type', 'text');
  });

  it('clears the scramble timer on unmount', () => {
    const { unmount } = render(<Controlled />);
    fireEvent.click(screen.getByRole('button', { name: 'Show secret' }));
    expect(vi.getTimerCount()).toBe(1);
    unmount();
    expect(vi.getTimerCount()).toBe(0);
  });

  it('puts className and style on the wrapper and ref and native props on the input', () => {
    const ref = createRef<HTMLInputElement>();
    const { container } = render(
      <DecodeSecretField
        ref={ref}
        label="Root token"
        value=""
        onChange={() => {}}
        className="x"
        name="token"
        disabled
        showLabel="Reveal"
      />,
    );
    expect(container.firstChild).toHaveClass('motiv-matrix-decode', 'x');
    expect(ref.current).toBe(input());
    expect(input()).toHaveAttribute('name', 'token');
    expect(screen.getByRole('button', { name: 'Reveal' })).toBeDisabled();
  });
});
