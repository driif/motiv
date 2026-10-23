import {
  type ComponentProps,
  type FocusEvent,
  type MouseEvent,
  type ReactNode,
  type SyntheticEvent,
  useLayoutEffect,
  useRef,
} from 'react';
import { cx } from '../../utils/cx';

export interface GlideNavItem {
  id: string;
  label: ReactNode;
  icon?: ReactNode;
  count?: ReactNode;
  href?: string;
}

export interface GlideNavProps extends Omit<ComponentProps<'nav'>, 'onChange'> {
  items: GlideNavItem[];
  value: string;
  onChange: (id: string, event?: MouseEvent<HTMLElement>) => void;
  /** Accessible name of the nav landmark. */
  label: string;
}

export function GlideNav({
  items,
  value,
  onChange,
  label,
  className,
  onPointerLeave,
  onBlur,
  ...props
}: GlideNavProps) {
  const barRef = useRef<HTMLSpanElement>(null);
  const hoverRef = useRef<HTMLSpanElement>(null);
  const placed = useRef(false);
  const activeIndex = items.findIndex((item) => item.id === value);

  // biome-ignore lint/correctness/useExhaustiveDependencies: a changed item count moves the active item.
  useLayoutEffect(() => {
    const bar = barRef.current;
    if (!bar) return;
    const nav = bar.parentElement;
    const el = nav?.querySelectorAll<HTMLElement>('.motiv-glide-nav__item')[activeIndex];
    if (!el) {
      bar.style.opacity = '0';
      return;
    }
    bar.style.transform = `translateY(${el.offsetTop + (el.offsetHeight - bar.offsetHeight) / 2}px)`;
    if (!placed.current) {
      // The first placement jumps there instead of sliding in from the top.
      // Shown before the reflow, so the handoff from the CSS bar does not fade.
      bar.style.transition = 'none';
      bar.style.opacity = '1';
      void bar.offsetWidth;
      bar.style.transition = '';
      placed.current = true;
      // Retires the CSS bar drawn before hydration; React never writes this attribute.
      nav?.setAttribute('data-placed', '');
    }
    bar.style.opacity = '1';
  }, [activeIndex, items.length]);

  function showHover(event: SyntheticEvent<HTMLElement>) {
    const hover = hoverRef.current;
    if (!hover) return;
    const { offsetTop, offsetHeight } = event.currentTarget;
    hover.style.transform = `translateY(${offsetTop}px)`;
    if (hover.offsetHeight !== offsetHeight) hover.style.height = `${offsetHeight}px`;
    hover.style.opacity = '1';
  }

  function hideHover() {
    if (hoverRef.current) hoverRef.current.style.opacity = '0';
  }

  return (
    <nav
      {...props}
      aria-label={label}
      className={cx('motiv-glide-nav', className)}
      onPointerLeave={(event) => {
        onPointerLeave?.(event);
        hideHover();
      }}
      onBlur={(event: FocusEvent<HTMLElement>) => {
        onBlur?.(event);
        if (!event.currentTarget.contains(event.relatedTarget)) hideHover();
      }}
    >
      <span ref={hoverRef} className="motiv-glide-nav__hover" aria-hidden="true" />
      <span ref={barRef} className="motiv-glide-nav__bar" aria-hidden="true" />
      {items.map((item) => {
        const common = {
          className: 'motiv-glide-nav__item',
          'aria-current': item.id === value ? ('page' as const) : undefined,
          onPointerEnter: showHover,
          onFocus: showHover,
          onClick: (event: MouseEvent<HTMLElement>) => onChange(item.id, event),
        };
        const content = (
          <>
            {item.icon}
            <span className="motiv-glide-nav__label">{item.label}</span>
            {item.count != null && (
              <span className="motiv-glide-nav__count">
                <span className="motiv-visually-hidden">, </span>
                {item.count}
              </span>
            )}
          </>
        );
        return item.href !== undefined ? (
          <a key={item.id} href={item.href} {...common}>
            {content}
          </a>
        ) : (
          <button key={item.id} type="button" {...common}>
            {content}
          </button>
        );
      })}
    </nav>
  );
}
