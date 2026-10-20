import { type ComponentProps, type ReactNode, useEffect, useId, useRef, useState } from 'react';
import { cx } from '../../utils/cx';

export interface TooltipProps extends Omit<ComponentProps<'span'>, 'content'> {
  content: ReactNode;
  label?: string;
}

export function Tooltip({
  content,
  label = 'More information',
  className,
  onPointerEnter,
  onPointerLeave,
  ...props
}: TooltipProps) {
  const id = useId();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState(false);
  // Tracked in state because the CSS cannot use :has(), which Firefox < 121 lacks.
  const [focusVisible, setFocusVisible] = useState(false);
  // Escape hides the note even while hovered or focused, until the pointer or focus leaves.
  const [dismissed, setDismissed] = useState(false);

  // Hover can show the note while focus is elsewhere, so Escape is heard on the document too.
  useEffect(() => {
    if (!open && !hovered) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      setOpen(false);
      setDismissed(true);
    };
    const onPointerDown = (event: PointerEvent) => {
      if (!triggerRef.current?.parentElement?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('pointerdown', onPointerDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('pointerdown', onPointerDown);
    };
  }, [open, hovered]);

  return (
    <span
      {...props}
      className={cx('motiv-tooltip', className)}
      data-open={open || undefined}
      data-focus-visible={focusVisible || undefined}
      data-dismissed={dismissed || undefined}
      onPointerEnter={(event) => {
        setHovered(true);
        onPointerEnter?.(event);
      }}
      onPointerLeave={(event) => {
        setHovered(false);
        setDismissed(false);
        onPointerLeave?.(event);
      }}
    >
      <button
        ref={triggerRef}
        type="button"
        className="motiv-tooltip__trigger"
        aria-label={label}
        aria-describedby={id}
        onClick={() => {
          setDismissed(open);
          setOpen(!open);
        }}
        onKeyDown={(event) => {
          if (event.key !== 'Escape') return;
          setOpen(false);
          setDismissed(true);
        }}
        onFocus={(event) => setFocusVisible(event.currentTarget.matches(':focus-visible'))}
        onBlur={() => {
          setFocusVisible(false);
          setDismissed(false);
        }}
      >
        i
      </button>
      <span role="tooltip" id={id} className="motiv-tooltip__note">
        {content}
      </span>
    </span>
  );
}
