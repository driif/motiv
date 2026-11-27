import { fireEvent, render, screen } from '@testing-library/react';
import { createRef, useState } from 'react';
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';
import type { SplitterProps } from '../../components/Splitter';
import { Splitter } from './Splitter';

const captures = new Map<HTMLElement, number>();

beforeAll(() => {
  HTMLElement.prototype.setPointerCapture = vi.fn(function (this: HTMLElement, id: number) {
    captures.set(this, id);
  });
  HTMLElement.prototype.hasPointerCapture = vi.fn(function (this: HTMLElement, id: number) {
    return captures.get(this) === id;
  });
  HTMLElement.prototype.releasePointerCapture = vi.fn(function (this: HTMLElement) {
    captures.delete(this);
  });
});

afterAll(() => {
  delete (HTMLElement.prototype as Partial<HTMLElement>).setPointerCapture;
  delete (HTMLElement.prototype as Partial<HTMLElement>).hasPointerCapture;
  delete (HTMLElement.prototype as Partial<HTMLElement>).releasePointerCapture;
});

const defaults = { label: 'Sidebar width', value: 256, min: 200, max: 480 };
const pointer = { pointerId: 1, button: 0, clientX: 100, clientY: 50 };

function Controlled(props: Partial<SplitterProps>) {
  const [value, setValue] = useState(props.value ?? defaults.value);
  return (
    <Splitter
      {...defaults}
      {...props}
      value={value}
      onChange={(next) => {
        setValue(next);
        props.onChange?.(next);
      }}
    />
  );
}

describe('matrix Splitter', () => {
  it('renders a labelled, focusable separator with matrix classes and native props', () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <Splitter
        {...defaults}
        onChange={vi.fn()}
        ref={ref}
        className="custom"
        aria-valuetext="256 pixels"
      />,
    );
    const separator = screen.getByRole('separator', { name: 'Sidebar width' });
    expect(separator).toBe(ref.current);
    expect(separator).toHaveClass(
      'motiv-matrix-splitter',
      'motiv-matrix-splitter--vertical',
      'custom',
    );
    expect(separator).toHaveAttribute('tabindex', '0');
    expect(separator).toHaveAttribute('aria-orientation', 'vertical');
    expect(separator).toHaveAttribute('aria-valuenow', '256');
    expect(separator).toHaveAttribute('aria-valuemin', '200');
    expect(separator).toHaveAttribute('aria-valuemax', '480');
    expect(separator).toHaveAttribute('aria-valuetext', '256 pixels');
  });

  it('previews a horizontal drag and commits on release', () => {
    const onCommit = vi.fn();
    render(<Controlled orientation="horizontal" onCommit={onCommit} />);
    const separator = screen.getByRole('separator');
    expect(separator).toHaveClass('motiv-matrix-splitter--horizontal');
    fireEvent.pointerDown(separator, pointer);
    expect(separator).toHaveAttribute('data-dragging', 'true');
    fireEvent.pointerMove(separator, { ...pointer, clientY: 80 });
    expect(separator).toHaveAttribute('aria-valuenow', '286');
    expect(onCommit).not.toHaveBeenCalled();
    fireEvent.pointerUp(separator, { ...pointer, clientY: 90 });
    expect(onCommit).toHaveBeenCalledExactlyOnceWith(296);
    expect(separator).not.toHaveAttribute('data-dragging');
  });

  it('restores the start value on Escape without committing', () => {
    const onCommit = vi.fn();
    render(<Controlled onCommit={onCommit} />);
    const separator = screen.getByRole('separator');
    fireEvent.pointerDown(separator, pointer);
    fireEvent.pointerMove(separator, { ...pointer, clientX: 150 });
    fireEvent.keyDown(separator, { key: 'Escape' });
    expect(separator).toHaveAttribute('aria-valuenow', '256');
    expect(onCommit).not.toHaveBeenCalled();
  });

  it('steps with arrows and jumps with Home and End', () => {
    const onCommit = vi.fn();
    render(<Controlled step={10} onCommit={onCommit} />);
    const separator = screen.getByRole('separator');
    fireEvent.keyDown(separator, { key: 'ArrowRight' });
    fireEvent.keyDown(separator, { key: 'ArrowLeft' });
    fireEvent.keyDown(separator, { key: 'End' });
    fireEvent.keyDown(separator, { key: 'Home' });
    expect(onCommit.mock.calls.map(([value]) => value)).toEqual([266, 256, 480, 200]);
  });

  it('converts pointer pixels through getValueFromDelta', () => {
    render(
      <Controlled
        value={0.5}
        min={0.1}
        max={0.9}
        getValueFromDelta={(delta, start) => start + delta / 400}
      />,
    );
    const separator = screen.getByRole('separator');
    fireEvent.pointerDown(separator, pointer);
    fireEvent.pointerMove(separator, { ...pointer, clientX: 140 });
    expect(separator).toHaveAttribute('aria-valuenow', '0.6');
  });
});
