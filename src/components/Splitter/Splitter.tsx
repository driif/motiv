import { type ComponentProps, type PointerEvent, useEffect, useRef, useState } from 'react';
import { cx } from '../../utils/cx';

export interface SplitterProps extends Omit<ComponentProps<'div'>, 'onChange'> {
  /** Vertical separates columns; horizontal separates rows. */
  orientation?: 'vertical' | 'horizontal';
  value: number;
  min: number;
  max: number;
  label: string;
  onChange: (value: number) => void;
  onCommit?: (value: number) => void;
  step?: number;
  /** Converts pointer pixels to a value; custom results are clamped without step rounding. */
  getValueFromDelta?: (delta: number, startValue: number) => number;
}

type Drag = {
  pointerId: number;
  target: HTMLDivElement;
  orientation: 'vertical' | 'horizontal';
  startCoordinate: number;
  startValue: number;
  latestValue: number;
};

export function Splitter({
  orientation = 'vertical',
  value,
  min,
  max,
  label,
  onChange,
  onCommit,
  step = 1,
  getValueFromDelta,
  className,
  onPointerDown,
  onPointerMove,
  onPointerUp,
  onPointerCancel,
  onLostPointerCapture,
  onKeyDown,
  ...props
}: SplitterProps) {
  const drag = useRef<Drag | null>(null);
  const [dragging, setDragging] = useState(false);
  const callbacks = useRef({ onChange, onCommit, getValueFromDelta });
  callbacks.current = { onChange, onCommit, getValueFromDelta };

  useEffect(() => {
    return () => {
      const current = drag.current;
      drag.current = null;
      if (current?.target.hasPointerCapture(current.pointerId)) {
        current.target.releasePointerCapture(current.pointerId);
      }
    };
  }, []);

  function clamp(next: number) {
    return Math.min(max, Math.max(min, next));
  }

  function pointerValue(event: PointerEvent<HTMLDivElement>, current: Drag) {
    const coordinate = current.orientation === 'vertical' ? event.clientX : event.clientY;
    const delta = coordinate - current.startCoordinate;
    const convert = callbacks.current.getValueFromDelta;
    return clamp(
      convert
        ? convert(delta, current.startValue)
        : Number((Math.round((current.startValue + delta) / step) * step).toPrecision(15)),
    );
  }

  function finishDrag(current: Drag) {
    drag.current = null;
    setDragging(false);
    if (current.target.hasPointerCapture(current.pointerId)) {
      current.target.releasePointerCapture(current.pointerId);
    }
  }

  function cancelDrag() {
    const current = drag.current;
    if (!current) return;
    drag.current = null;
    callbacks.current.onChange(current.startValue);
    finishDrag(current);
  }

  return (
    <div
      {...props}
      role="separator"
      tabIndex={0}
      aria-label={label}
      aria-orientation={orientation}
      aria-valuenow={value}
      aria-valuemin={min}
      aria-valuemax={max}
      className={cx('motiv-splitter', `motiv-splitter--${orientation}`, className)}
      data-dragging={dragging || undefined}
      onPointerDown={(event) => {
        onPointerDown?.(event);
        if (event.defaultPrevented || event.button !== 0 || drag.current) return;
        event.preventDefault();
        event.currentTarget.focus();
        event.currentTarget.setPointerCapture(event.pointerId);
        drag.current = {
          pointerId: event.pointerId,
          target: event.currentTarget,
          orientation,
          startCoordinate: orientation === 'vertical' ? event.clientX : event.clientY,
          startValue: value,
          latestValue: value,
        };
        setDragging(true);
      }}
      onPointerMove={(event) => {
        onPointerMove?.(event);
        const current = drag.current;
        if (!current || event.pointerId !== current.pointerId) return;
        current.latestValue = pointerValue(event, current);
        callbacks.current.onChange(current.latestValue);
      }}
      onPointerUp={(event) => {
        const current = drag.current;
        if (current && event.pointerId === current.pointerId) {
          const next = pointerValue(event, current);
          if (next !== current.latestValue) callbacks.current.onChange(next);
          callbacks.current.onCommit?.(next);
          finishDrag(current);
        }
        onPointerUp?.(event);
      }}
      onPointerCancel={(event) => {
        if (event.pointerId === drag.current?.pointerId) cancelDrag();
        onPointerCancel?.(event);
      }}
      onLostPointerCapture={(event) => {
        if (event.pointerId === drag.current?.pointerId) cancelDrag();
        onLostPointerCapture?.(event);
      }}
      onKeyDown={(event) => {
        if (event.key === 'Escape' && drag.current) {
          event.preventDefault();
          cancelDrag();
          onKeyDown?.(event);
          return;
        }
        onKeyDown?.(event);
        if (event.defaultPrevented) return;
        let next: number;
        if (event.key === 'Home') next = min;
        else if (event.key === 'End') next = max;
        else if (event.key === (orientation === 'vertical' ? 'ArrowLeft' : 'ArrowUp')) {
          next = clamp(Number((value - step).toPrecision(15)));
        } else if (event.key === (orientation === 'vertical' ? 'ArrowRight' : 'ArrowDown')) {
          next = clamp(Number((value + step).toPrecision(15)));
        } else return;
        event.preventDefault();
        if (drag.current || next === value) return;
        callbacks.current.onChange(next);
        callbacks.current.onCommit?.(next);
      }}
    />
  );
}
