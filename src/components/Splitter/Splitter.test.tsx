import { fireEvent, render, screen } from '@testing-library/react';
import { createRef, useState } from 'react';
import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { Splitter, type SplitterProps } from './Splitter';

const captures = new Map<HTMLElement, number>();

beforeAll(() => {
  HTMLElement.prototype.setPointerCapture = vi.fn(function (this: HTMLElement, id: number) {
    captures.set(this, id);
  });
  HTMLElement.prototype.hasPointerCapture = vi.fn(function (this: HTMLElement, id: number) {
    return captures.get(this) === id;
  });
  HTMLElement.prototype.releasePointerCapture = vi.fn(function (this: HTMLElement, id: number) {
    captures.delete(this);
    fireEvent.lostPointerCapture(this, { pointerId: id });
  });
});

beforeEach(() => {
  captures.clear();
  vi.clearAllMocks();
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

describe('Splitter', () => {
  it('passes ref, class, style and native props to a labelled, focusable separator', () => {
    const ref = createRef<HTMLDivElement>();
    const onDoubleClick = vi.fn();
    const onFocus = vi.fn();
    render(
      <Splitter
        {...defaults}
        onChange={vi.fn()}
        ref={ref}
        className="custom"
        style={{ height: 120 }}
        data-testid="splitter"
        id="rail"
        title="Resize sidebar"
        aria-controls="sidebar"
        aria-valuetext="256 pixels"
        onDoubleClick={onDoubleClick}
        onFocus={onFocus}
      />,
    );
    const separator = screen.getByRole('separator', { name: 'Sidebar width' });
    expect(separator).toBe(ref.current);
    expect(separator).toBe(screen.getByTestId('splitter'));
    expect(separator).toHaveClass('motiv-splitter', 'motiv-splitter--vertical', 'custom');
    expect(separator).toHaveStyle({ height: '120px' });
    expect(separator).toHaveAttribute('id', 'rail');
    expect(separator).toHaveAttribute('title', 'Resize sidebar');
    expect(separator).toHaveAttribute('aria-controls', 'sidebar');
    expect(separator).toHaveAttribute('aria-orientation', 'vertical');
    expect(separator).toHaveAttribute('aria-valuenow', '256');
    expect(separator).toHaveAttribute('aria-valuemin', '200');
    expect(separator).toHaveAttribute('aria-valuemax', '480');
    expect(separator).toHaveAttribute('aria-valuetext', '256 pixels');
    expect(separator).toHaveAttribute('tabindex', '0');
    expect(separator).not.toHaveAttribute('data-dragging');
    fireEvent.doubleClick(separator);
    fireEvent.focus(separator);
    expect(onDoubleClick).toHaveBeenCalledOnce();
    expect(onFocus).toHaveBeenCalledOnce();
  });

  it.each(['vertical', 'horizontal'] as const)(
    'previews the %s axis through rerenders and commits the release coordinate once',
    (orientation) => {
      const onChange = vi.fn();
      const onCommit = vi.fn();
      render(<Controlled orientation={orientation} onChange={onChange} onCommit={onCommit} />);
      const separator = screen.getByRole('separator');
      const coordinate = orientation === 'vertical' ? 'clientX' : 'clientY';
      const other = orientation === 'vertical' ? 'clientY' : 'clientX';
      fireEvent.pointerDown(separator, { ...pointer, [coordinate]: 100 });
      expect(separator).toHaveFocus();
      expect(separator).toHaveAttribute('data-dragging', 'true');
      expect(separator.setPointerCapture).toHaveBeenCalledWith(1);
      expect(separator).toHaveAttribute('aria-orientation', orientation);
      fireEvent.pointerMove(separator, { ...pointer, [coordinate]: 120, [other]: 900 });
      expect(separator).toHaveAttribute('aria-valuenow', '276');
      fireEvent.pointerMove(separator, { ...pointer, [coordinate]: 140 });
      expect(separator).toHaveAttribute('aria-valuenow', '296');
      expect(onCommit).not.toHaveBeenCalled();
      fireEvent.pointerUp(separator, { ...pointer, [coordinate]: 150 });
      fireEvent.lostPointerCapture(separator, pointer);
      expect(onChange.mock.calls.map(([value]) => value)).toEqual([276, 296, 306]);
      expect(onCommit).toHaveBeenCalledExactlyOnceWith(306);
      expect(onChange.mock.invocationCallOrder.at(-1)).toBeLessThan(
        onCommit.mock.invocationCallOrder[0],
      );
      expect(separator).toHaveAttribute('aria-valuenow', '306');
      expect(separator).not.toHaveAttribute('data-dragging');
      expect(separator.releasePointerCapture).toHaveBeenCalledExactlyOnceWith(1);
    },
  );

  it('does not repeat the last preview on release and commits a stationary drag once', () => {
    const onChange = vi.fn();
    const onCommit = vi.fn();
    render(<Controlled onChange={onChange} onCommit={onCommit} />);
    const separator = screen.getByRole('separator');
    fireEvent.pointerDown(separator, pointer);
    fireEvent.pointerMove(separator, { ...pointer, clientX: 120 });
    fireEvent.pointerUp(separator, { ...pointer, clientX: 120 });
    expect(onChange).toHaveBeenCalledExactlyOnceWith(276);
    expect(onCommit).toHaveBeenCalledExactlyOnceWith(276);
    fireEvent.pointerDown(separator, pointer);
    fireEvent.pointerUp(separator, pointer);
    expect(onChange).toHaveBeenCalledOnce();
    expect(onCommit).toHaveBeenCalledTimes(2);
  });

  it('rounds default pointer values to step and clamps both ends of the pixel range', () => {
    const onChange = vi.fn();
    render(<Controlled onChange={onChange} step={5} />);
    const separator = screen.getByRole('separator');
    fireEvent.pointerDown(separator, pointer);
    fireEvent.pointerMove(separator, { ...pointer, clientX: 108 });
    expect(onChange).toHaveBeenLastCalledWith(265);
    fireEvent.pointerMove(separator, { ...pointer, clientX: -1000 });
    expect(onChange).toHaveBeenLastCalledWith(200);
    fireEvent.pointerUp(separator, { ...pointer, clientX: 1000 });
    expect(onChange).toHaveBeenLastCalledWith(480);
  });

  it('keeps default fractional pointer rounding decimal-safe', () => {
    const onChange = vi.fn();
    render(<Controlled value={0.29} min={0.1} max={0.9} step={0.01} onChange={onChange} />);
    const separator = screen.getByRole('separator');
    fireEvent.pointerDown(separator, { ...pointer, clientX: 0 });
    fireEvent.pointerUp(separator, { ...pointer, clientX: 0.01 });
    expect(onChange).toHaveBeenCalledExactlyOnceWith(0.3);
  });

  it('converts pixels to a fractional range without rounding custom results and clamps them', () => {
    const convert = vi.fn((delta: number, start: number) => start + delta / 400);
    const onCommit = vi.fn();
    render(
      <Controlled
        value={0.5}
        min={0.1}
        max={0.9}
        step={0.01}
        getValueFromDelta={convert}
        onCommit={onCommit}
      />,
    );
    const separator = screen.getByRole('separator');
    fireEvent.pointerDown(separator, pointer);
    fireEvent.pointerMove(separator, { ...pointer, clientX: 101 });
    expect(convert).toHaveBeenLastCalledWith(1, 0.5);
    expect(separator).toHaveAttribute('aria-valuenow', '0.5025');
    fireEvent.pointerMove(separator, { ...pointer, clientX: -1000 });
    expect(separator).toHaveAttribute('aria-valuenow', '0.1');
    fireEvent.pointerUp(separator, { ...pointer, clientX: 1000 });
    expect(separator).toHaveAttribute('aria-valuenow', '0.9');
    expect(onCommit).toHaveBeenCalledExactlyOnceWith(0.9);
  });

  it('uses new callbacks and conversion after a rerender without replacing the drag origin', () => {
    const firstChange = vi.fn();
    const firstCommit = vi.fn();
    const nextChange = vi.fn();
    const nextCommit = vi.fn();
    const { rerender } = render(
      <Splitter {...defaults} onChange={firstChange} onCommit={firstCommit} />,
    );
    const separator = screen.getByRole('separator');
    fireEvent.pointerDown(separator, pointer);
    fireEvent.pointerMove(separator, { ...pointer, clientX: 110 });
    const convert = vi.fn((delta: number, start: number) => start + delta * 2);
    rerender(
      <Splitter
        {...defaults}
        value={400}
        onChange={nextChange}
        onCommit={nextCommit}
        getValueFromDelta={convert}
      />,
    );
    fireEvent.pointerMove(separator, { ...pointer, clientX: 120 });
    expect(convert).toHaveBeenLastCalledWith(20, 256);
    expect(nextChange).toHaveBeenLastCalledWith(296);
    fireEvent.pointerUp(separator, { ...pointer, clientX: 130 });
    expect(firstChange).toHaveBeenCalledExactlyOnceWith(266);
    expect(firstCommit).not.toHaveBeenCalled();
    expect(nextChange).toHaveBeenLastCalledWith(316);
    expect(nextCommit).toHaveBeenCalledExactlyOnceWith(316);
  });

  it('ignores non-primary buttons and foreign pointers without losing the active drag', () => {
    const onChange = vi.fn();
    const onCommit = vi.fn();
    render(<Controlled onChange={onChange} onCommit={onCommit} />);
    const separator = screen.getByRole('separator');
    for (const button of [1, 2]) fireEvent.pointerDown(separator, { ...pointer, button });
    fireEvent.pointerMove(separator, { ...pointer, clientX: 200 });
    fireEvent.pointerUp(separator, { ...pointer, clientX: 200 });
    expect(separator.setPointerCapture).not.toHaveBeenCalled();
    fireEvent.pointerDown(separator, pointer);
    for (const event of [
      'pointerDown',
      'pointerMove',
      'pointerUp',
      'pointerCancel',
      'lostPointerCapture',
    ] as const) {
      fireEvent[event](separator, { ...pointer, pointerId: 2, clientX: 200 });
    }
    expect(onChange).not.toHaveBeenCalled();
    expect(onCommit).not.toHaveBeenCalled();
    expect(separator).toHaveAttribute('data-dragging');
    fireEvent.pointerUp(separator, { ...pointer, clientX: 110 });
    expect(onCommit).toHaveBeenCalledExactlyOnceWith(266);
  });

  it.each(['pointerCancel', 'lostPointerCapture', 'Escape'] as const)(
    'rolls back on %s, composes native handlers and allows a fresh drag',
    (cancel) => {
      const onChange = vi.fn();
      const onCommit = vi.fn();
      const handlers = {
        onPointerDown: vi.fn(),
        onPointerMove: vi.fn(),
        onPointerUp: vi.fn(),
        onPointerCancel: vi.fn(),
        onLostPointerCapture: vi.fn(),
        onKeyDown: vi.fn(),
      };
      render(<Controlled onChange={onChange} onCommit={onCommit} {...handlers} />);
      const separator = screen.getByRole('separator');
      fireEvent.pointerDown(separator, pointer);
      fireEvent.pointerMove(separator, { ...pointer, clientX: 140 });
      if (cancel === 'Escape') expect(fireEvent.keyDown(separator, { key: 'Escape' })).toBe(false);
      else {
        if (cancel === 'lostPointerCapture') captures.delete(separator);
        fireEvent[cancel](separator, pointer);
      }
      expect(separator).toHaveAttribute('aria-valuenow', '256');
      expect(separator).not.toHaveAttribute('data-dragging');
      expect(onChange.mock.calls.map(([value]) => value)).toEqual([296, 256]);
      fireEvent.pointerUp(separator, { ...pointer, clientX: 140 });
      fireEvent.pointerMove(separator, { ...pointer, clientX: 150 });
      expect(onCommit).not.toHaveBeenCalled();
      expect(onChange).toHaveBeenCalledTimes(2);
      expect(handlers.onPointerDown).toHaveBeenCalledOnce();
      expect(handlers.onPointerMove).toHaveBeenCalledTimes(2);
      expect(handlers.onPointerUp).toHaveBeenCalledOnce();
      expect(handlers.onLostPointerCapture).toHaveBeenCalledOnce();
      if (cancel === 'Escape') expect(handlers.onKeyDown).toHaveBeenCalledOnce();
      if (cancel === 'pointerCancel') expect(handlers.onPointerCancel).toHaveBeenCalledOnce();
      fireEvent.pointerDown(separator, { ...pointer, pointerId: 3 });
      fireEvent.pointerUp(separator, { ...pointer, pointerId: 3, clientX: 120 });
      expect(onCommit).toHaveBeenCalledExactlyOnceWith(276);
    },
  );

  function Previewed({ onCommit }: { onCommit: (value: number) => void }) {
    const [saved, setSaved] = useState(0.5);
    const [preview, setPreview] = useState<number | null>(null);
    const clear = () => setPreview(null);
    return (
      <>
        <Splitter
          {...defaults}
          value={preview ?? saved}
          min={0.1}
          max={0.9}
          getValueFromDelta={(delta, start) => Math.round(start * 1000 + delta) / 1000}
          onChange={setPreview}
          onCommit={(value) => {
            setSaved(value);
            onCommit(value);
          }}
          onPointerUp={clear}
          onPointerCancel={clear}
          onLostPointerCapture={clear}
          onKeyDown={(event) => {
            if (event.key === 'Escape') clear();
          }}
        />
        <button type="button" onClick={() => setSaved(0.7)}>
          Save
        </button>
      </>
    );
  }

  it.each(['pointerCancel', 'lostPointerCapture', 'Escape'] as const)(
    'leaves no stale preview after %s when native handlers clear it',
    (cancel) => {
      const onCommit = vi.fn();
      render(<Previewed onCommit={onCommit} />);
      const separator = screen.getByRole('separator');
      fireEvent.pointerDown(separator, pointer);
      fireEvent.pointerMove(separator, { ...pointer, clientX: 200 });
      expect(separator).toHaveAttribute('aria-valuenow', '0.6');
      if (cancel === 'Escape') fireEvent.keyDown(separator, { key: 'Escape' });
      else {
        if (cancel === 'lostPointerCapture') captures.delete(separator);
        fireEvent[cancel](separator, pointer);
      }
      fireEvent.click(screen.getByRole('button', { name: 'Save' }));
      expect(separator).toHaveAttribute('aria-valuenow', '0.7');
      expect(onCommit).not.toHaveBeenCalled();
      fireEvent.pointerDown(separator, pointer);
      fireEvent.pointerMove(separator, { ...pointer, clientX: 200 });
      fireEvent.pointerUp(separator, { ...pointer, clientX: 200 });
      expect(onCommit).toHaveBeenCalledExactlyOnceWith(0.8);
      expect(separator).toHaveAttribute('aria-valuenow', '0.8');
    },
  );

  it('leaves no stale preview after a release when native end handlers clear it', () => {
    const onCommit = vi.fn();
    render(<Previewed onCommit={onCommit} />);
    const separator = screen.getByRole('separator');
    fireEvent.pointerDown(separator, pointer);
    fireEvent.pointerMove(separator, { ...pointer, clientX: 150 });
    fireEvent.pointerUp(separator, { ...pointer, clientX: 200 });
    expect(onCommit).toHaveBeenCalledExactlyOnceWith(0.6);
    expect(separator).toHaveAttribute('aria-valuenow', '0.6');
    fireEvent.click(screen.getByRole('button', { name: 'Save' }));
    expect(separator).toHaveAttribute('aria-valuenow', '0.7');
  });

  it('rolls back through the latest onChange after a rerender', () => {
    const initialChange = vi.fn();
    const latestChange = vi.fn();
    const { rerender } = render(<Splitter {...defaults} onChange={initialChange} />);
    const separator = screen.getByRole('separator');
    fireEvent.pointerDown(separator, pointer);
    rerender(<Splitter {...defaults} value={300} onChange={latestChange} />);
    fireEvent.keyDown(separator, { key: 'Escape' });
    expect(initialChange).not.toHaveBeenCalled();
    expect(latestChange).toHaveBeenCalledExactlyOnceWith(256);
  });

  it.each(['vertical', 'horizontal'] as const)(
    'steps the %s keyboard axis precisely, handles Home/End and commits only changes',
    (orientation) => {
      const onChange = vi.fn();
      const onCommit = vi.fn();
      render(
        <Controlled
          orientation={orientation}
          value={0.29}
          min={0.1}
          max={0.9}
          step={0.01}
          onChange={onChange}
          onCommit={onCommit}
        />,
      );
      const separator = screen.getByRole('separator');
      const increment = orientation === 'vertical' ? 'ArrowRight' : 'ArrowDown';
      const decrement = orientation === 'vertical' ? 'ArrowLeft' : 'ArrowUp';
      const ignored = orientation === 'vertical' ? 'ArrowDown' : 'ArrowRight';
      expect(fireEvent.keyDown(separator, { key: ignored })).toBe(true);
      expect(fireEvent.keyDown(separator, { key: 'Enter' })).toBe(true);
      expect(onChange).not.toHaveBeenCalled();
      expect(fireEvent.keyDown(separator, { key: increment })).toBe(false);
      expect(separator).toHaveAttribute('aria-valuenow', '0.3');
      expect(onChange).toHaveBeenCalledExactlyOnceWith(0.3);
      expect(onCommit).toHaveBeenCalledExactlyOnceWith(0.3);
      expect(onChange.mock.invocationCallOrder[0]).toBeLessThan(
        onCommit.mock.invocationCallOrder[0],
      );
      expect(fireEvent.keyDown(separator, { key: decrement })).toBe(false);
      expect(separator).toHaveAttribute('aria-valuenow', '0.29');
      expect(fireEvent.keyDown(separator, { key: 'Home' })).toBe(false);
      expect(separator).toHaveAttribute('aria-valuenow', '0.1');
      fireEvent.keyDown(separator, { key: decrement });
      expect(fireEvent.keyDown(separator, { key: 'End' })).toBe(false);
      expect(separator).toHaveAttribute('aria-valuenow', '0.9');
      fireEvent.keyDown(separator, { key: increment });
      expect(onChange).toHaveBeenCalledTimes(4);
      expect(onCommit).toHaveBeenCalledTimes(4);
    },
  );

  it('uses the default keyboard step and lets consumers prevent pointer and keyboard starts', () => {
    const onChange = vi.fn();
    const { rerender } = render(<Splitter {...defaults} onChange={onChange} />);
    const separator = screen.getByRole('separator');
    fireEvent.keyDown(separator, { key: 'ArrowLeft' });
    expect(onChange).toHaveBeenCalledExactlyOnceWith(255);
    rerender(
      <Splitter
        {...defaults}
        onChange={onChange}
        onPointerDown={(event) => event.preventDefault()}
        onKeyDown={(event) => event.preventDefault()}
      />,
    );
    fireEvent.pointerDown(separator, pointer);
    fireEvent.keyDown(separator, { key: 'ArrowRight' });
    expect(separator).not.toHaveAttribute('data-dragging');
    expect(onChange).toHaveBeenCalledOnce();
  });

  it('releases capture on unmount without committing or emitting another preview', () => {
    const onChange = vi.fn();
    const onCommit = vi.fn();
    const ref = createRef<HTMLDivElement>();
    const { unmount } = render(<Controlled ref={ref} onChange={onChange} onCommit={onCommit} />);
    const separator = screen.getByRole('separator');
    fireEvent.pointerDown(separator, pointer);
    fireEvent.pointerMove(separator, { ...pointer, clientX: 120 });
    unmount();
    expect(separator.releasePointerCapture).toHaveBeenCalledExactlyOnceWith(1);
    expect(captures.size).toBe(0);
    expect(ref.current).toBeNull();
    expect(onChange).toHaveBeenCalledExactlyOnceWith(276);
    expect(onCommit).not.toHaveBeenCalled();
  });
});
