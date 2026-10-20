import { type ComponentProps, type KeyboardEvent, useEffect, useRef, useState } from 'react';
import { cx } from '../../utils/cx';

export interface HoldToConfirmButtonProps
  extends Omit<ComponentProps<'button'>, 'children' | 'onClick' | 'type'> {
  onConfirm: () => void;
  label?: string;
  holdingLabel?: string;
  confirmedLabel?: string;
  instructions?: string;
}

// HOLD_MS must match --_hold in HoldToConfirmButton.css, which runs the fill.
const HOLD_MS = 1400;
const RESET_MS = 2200;

function LockIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="5" y="11" width="14" height="10" rx="2" />
      <path className="motiv-hold-button__shackle" d="M8 11V8a4 4 0 0 1 8 0v3" />
    </svg>
  );
}

export function HoldToConfirmButton({
  onConfirm,
  label = 'Hold to confirm',
  holdingLabel = 'Keep holding…',
  confirmedLabel = 'Confirmed',
  instructions = 'press and hold to confirm',
  disabled,
  className,
  onPointerDown,
  onPointerUp,
  onPointerLeave,
  onPointerCancel,
  onBlur,
  onKeyDown,
  onKeyUp,
  onContextMenu,
  onGotPointerCapture,
  ...props
}: HoldToConfirmButtonProps) {
  const [phase, setPhase] = useState<'idle' | 'holding' | 'confirmed'>('idle');
  const holdTimer = useRef<number>(undefined);
  const resetTimer = useRef<number>(undefined);

  useEffect(
    () => () => {
      window.clearTimeout(holdTimer.current);
      window.clearTimeout(resetTimer.current);
    },
    [],
  );

  // A disabled button gets no pointerup/keyup, so a hold in progress must be dropped here.
  useEffect(() => {
    if (!disabled) return;
    window.clearTimeout(holdTimer.current);
    setPhase((current) => (current === 'holding' ? 'idle' : current));
  }, [disabled]);

  const confirm = () => {
    setPhase('confirmed');
    onConfirm();
    resetTimer.current = window.setTimeout(() => setPhase('idle'), RESET_MS);
  };

  const start = () => {
    if (phase !== 'idle' || disabled) return;
    setPhase('holding');
    holdTimer.current = window.setTimeout(confirm, HOLD_MS);
  };

  const cancel = () => {
    if (phase !== 'holding') return;
    window.clearTimeout(holdTimer.current);
    setPhase('idle');
  };

  // preventDefault stops the native click that Enter (keydown) and Space (keyup) would fire.
  const isHoldKey = (event: KeyboardEvent) => event.key === ' ' || event.key === 'Enter';

  const text = { idle: label, holding: holdingLabel, confirmed: confirmedLabel }[phase];

  return (
    <>
      <button
        {...props}
        type="button"
        disabled={disabled}
        className={cx(
          'motiv-hold-button',
          phase !== 'idle' && `motiv-hold-button--${phase}`,
          className,
        )}
        onPointerDown={(event) => {
          onPointerDown?.(event);
          if (event.button === 0) start();
        }}
        // Touch captures the pointer implicitly, which would hide pointerleave until release.
        onGotPointerCapture={(event) => {
          onGotPointerCapture?.(event);
          event.currentTarget.releasePointerCapture(event.pointerId);
        }}
        onPointerUp={(event) => {
          onPointerUp?.(event);
          cancel();
        }}
        onPointerLeave={(event) => {
          onPointerLeave?.(event);
          cancel();
        }}
        onPointerCancel={(event) => {
          onPointerCancel?.(event);
          cancel();
        }}
        onBlur={(event) => {
          onBlur?.(event);
          cancel();
        }}
        onKeyDown={(event) => {
          onKeyDown?.(event);
          if (!isHoldKey(event)) return;
          event.preventDefault();
          if (!event.repeat) start();
        }}
        onKeyUp={(event) => {
          onKeyUp?.(event);
          if (!isHoldKey(event)) return;
          event.preventDefault();
          cancel();
        }}
        // Screen readers activate with a bare click (detail 0) and cannot hold, so it confirms.
        onClick={(event) => {
          if (event.detail === 0 && phase === 'idle') confirm();
        }}
        onContextMenu={(event) => {
          onContextMenu?.(event);
          event.preventDefault();
        }}
      >
        <span className="motiv-hold-button__content">
          <span className="motiv-hold-button__icon">
            <LockIcon />
          </span>
          {text}
          {phase === 'idle' && <span className="motiv-visually-hidden">, {instructions}</span>}
        </span>
        <span className="motiv-hold-button__fill" aria-hidden="true" />
        <span
          className="motiv-hold-button__content motiv-hold-button__content--ink"
          aria-hidden="true"
        >
          <span className="motiv-hold-button__icon">
            <LockIcon />
          </span>
          {text}
        </span>
      </button>
      <span className="motiv-visually-hidden" aria-live="assertive">
        {phase === 'confirmed' && confirmedLabel}
      </span>
    </>
  );
}
