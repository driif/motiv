import { type ComponentProps, type CSSProperties, useEffect, useRef, useState } from 'react';
import { cx } from '../../utils/cx';
import { Icon } from '../../utils/Icon';
import { playOnce, SHAKE } from '../../utils/motion';

export interface MorphSubmitButtonProps
  extends Omit<ComponentProps<'button'>, 'onClick' | 'children'> {
  /** Runs on click; the button shows a spinner until the returned promise settles. */
  onAction: () => unknown;
  label?: string;
  successLabel?: string;
  successMs?: number;
}

export function MorphSubmitButton({
  onAction,
  label = 'Save changes',
  successLabel = 'Saved',
  successMs = 1700,
  className,
  style,
  ...props
}: MorphSubmitButtonProps) {
  const [phase, setPhase] = useState<'idle' | 'loading' | 'done'>('idle');
  const [shrink, setShrink] = useState(1);
  const timer = useRef<number | undefined>(undefined);
  const alive = useRef(true);

  useEffect(() => {
    alive.current = true;
    return () => {
      alive.current = false;
      window.clearTimeout(timer.current);
    };
  }, []);

  const run = async (button: HTMLButtonElement) => {
    if (phase !== 'idle') return;
    setShrink(button.offsetHeight / button.offsetWidth);
    setPhase('loading');
    try {
      await onAction();
      if (!alive.current) return;
      setPhase('done');
      timer.current = window.setTimeout(() => setPhase('idle'), successMs);
    } catch {
      if (!alive.current) return;
      setPhase('idle');
      playOnce(button, SHAKE, { duration: 400 });
    }
  };

  return (
    <>
      <button
        type="button"
        {...props}
        data-phase={phase}
        aria-busy={phase === 'loading'}
        className={cx('motiv-morph', className)}
        style={{ ...style, '--_shrink': shrink } as CSSProperties}
        onClick={(event) => run(event.currentTarget)}
      >
        <span className="motiv-morph__bg" aria-hidden="true" />
        <span className="motiv-morph__label">{label}</span>
        <span className="motiv-morph__spinner" aria-hidden="true" />
        <span className="motiv-morph__done" aria-hidden="true">
          <Icon className="motiv-morph__check">
            <path d="M5 12.5l4.5 4.5L19 7.5" />
          </Icon>
          {successLabel}
        </span>
      </button>
      <span className="motiv-visually-hidden" aria-live="polite">
        {phase === 'done' ? successLabel : ''}
      </span>
    </>
  );
}
