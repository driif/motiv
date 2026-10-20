import {
  type ComponentProps,
  type CSSProperties,
  type ReactNode,
  useEffect,
  useRef,
  useState,
} from 'react';
import { cx } from '../../utils/cx';
import { Icon } from '../../utils/Icon';
import { mergeRefs } from '../../utils/mergeRefs';

export interface RadialAction {
  id: string;
  label: string;
  icon: ReactNode;
  onSelect: () => void;
}

export interface RadialMenuProps extends Omit<ComponentProps<'div'>, 'children'> {
  actions: RadialAction[];
  label?: string;
  openLabel?: string;
  closeLabel?: string;
  /** Distance of the actions from the trigger, in px. */
  radius?: number;
  /** Spread of the arc in degrees, centred upward. */
  spread?: number;
}

export function RadialMenu({
  actions,
  label = 'Quick actions',
  openLabel = `Open ${label.toLowerCase()}`,
  closeLabel = `Close ${label.toLowerCase()}`,
  radius = 84,
  spread = 160,
  className,
  style,
  onKeyDown,
  ref,
  ...props
}: RadialMenuProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const n = actions.length;

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener('pointerdown', onPointerDown);
    return () => document.removeEventListener('pointerdown', onPointerDown);
  }, [open]);

  return (
    // biome-ignore lint/a11y/useSemanticElements: a positioned stage of buttons, not a form fieldset
    <div
      role="group"
      aria-label={label}
      {...props}
      ref={mergeRefs(rootRef, ref)}
      data-open={open}
      className={cx('motiv-radial', className)}
      style={{ ...style, '--_r': `${radius}px` } as CSSProperties}
      onKeyDown={(event) => {
        onKeyDown?.(event);
        if (event.defaultPrevented || event.key !== 'Escape' || !open) return;
        event.stopPropagation();
        setOpen(false);
        triggerRef.current?.focus();
      }}
    >
      <button
        ref={triggerRef}
        type="button"
        className="motiv-radial__trigger"
        aria-expanded={open}
        aria-label={open ? closeLabel : openLabel}
        onClick={() => setOpen(!open)}
      >
        <Icon>
          <path d="M12 5v14M5 12h14" />
        </Icon>
      </button>
      {actions.map((action, i) => {
        const angle =
          ((90 + spread / 2 - (n > 1 ? (spread * i) / (n - 1) : spread / 2)) * Math.PI) / 180;
        return (
          <button
            key={action.id}
            type="button"
            className="motiv-radial__item"
            style={
              {
                '--_x': `${(Math.cos(angle) * radius).toFixed(1)}px`,
                '--_y': `${(-Math.sin(angle) * radius).toFixed(1)}px`,
                '--_i': i,
                '--_ri': n - 1 - i,
              } as CSSProperties
            }
            aria-label={action.label}
            disabled={!open}
            onClick={() => {
              setOpen(false);
              triggerRef.current?.focus();
              action.onSelect();
            }}
          >
            <span className="motiv-radial__icon" aria-hidden="true">
              {action.icon}
            </span>
            <span className="motiv-radial__tip" aria-hidden="true">
              {action.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
