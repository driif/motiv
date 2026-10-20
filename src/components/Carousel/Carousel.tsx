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
import { EASE_OUT, playOnce } from '../../utils/motion';

const STRETCH: Keyframe[] = [{ scale: '1 1' }, { scale: '3.5 1', offset: 0.35 }, { scale: '1 1' }];
const SWIPE_MIN = 40;

export interface CarouselSlide {
  id: string;
  /** Names the slide and its dot. */
  label: string;
  content: ReactNode;
}

export interface CarouselProps extends ComponentProps<'section'> {
  slides: CarouselSlide[];
  /** Accessible name of the whole carousel. */
  label: string;
  index?: number;
  defaultIndex?: number;
  onIndexChange?: (index: number) => void;
  loop?: boolean;
  previousLabel?: string;
  nextLabel?: string;
}

export function Carousel({
  slides,
  label,
  index,
  defaultIndex = 0,
  onIndexChange,
  loop = true,
  previousLabel = 'Previous slide',
  nextLabel = 'Next slide',
  className,
  style,
  onKeyDown,
  ...props
}: CarouselProps) {
  const n = slides.length;
  const [inner, setInner] = useState(defaultIndex);
  const current = Math.min(Math.max(index ?? inner, 0), Math.max(n - 1, 0));
  const wormRef = useRef<HTMLSpanElement>(null);
  const prev = useRef(current);
  const startX = useRef<number | null>(null);

  useEffect(() => {
    const from = prev.current;
    if (from === current) return;
    prev.current = current;
    const worm = wormRef.current;
    // Anchored at the leading edge, the worm stretches back toward the dot it left.
    if (worm) worm.style.transformOrigin = current > from ? 'right' : 'left';
    playOnce(worm, STRETCH, { duration: 450, easing: EASE_OUT });
  }, [current]);

  function goTo(i: number) {
    if (n === 0) return;
    const next = loop ? (i + n) % n : Math.min(Math.max(i, 0), n - 1);
    if (next === current) return;
    if (index === undefined) setInner(next);
    onIndexChange?.(next);
  }

  return (
    <section
      {...props}
      aria-roledescription="carousel"
      aria-label={label}
      className={cx('motiv-carousel', className)}
      style={{ ...style, '--_index': current } as CSSProperties}
      onKeyDown={(event) => {
        onKeyDown?.(event);
        if (event.defaultPrevented) return;
        if ((event.target as HTMLElement).closest('input, textarea, select, [contenteditable]'))
          return;
        if (event.key === 'ArrowLeft') goTo(current - 1);
        else if (event.key === 'ArrowRight') goTo(current + 1);
      }}
    >
      <div
        className="motiv-carousel__view"
        aria-live="polite"
        onPointerDown={(event) => {
          startX.current = event.clientX;
        }}
        onPointerCancel={() => {
          startX.current = null;
        }}
        onPointerUp={(event) => {
          if (startX.current === null) return;
          const dx = event.clientX - startX.current;
          startX.current = null;
          if (Math.abs(dx) > SWIPE_MIN) goTo(current + (dx < 0 ? 1 : -1));
        }}
      >
        <div className="motiv-carousel__track">
          {slides.map((slide, i) => (
            <div
              key={slide.id}
              role="group"
              aria-roledescription="slide"
              aria-label={slide.label}
              aria-hidden={i !== current}
              data-current={i === current}
              className="motiv-carousel__slide"
            >
              {slide.content}
            </div>
          ))}
        </div>
      </div>
      <div className="motiv-carousel__controls">
        <button
          type="button"
          className="motiv-carousel__arrow"
          aria-label={previousLabel}
          disabled={!loop && current === 0}
          onClick={() => goTo(current - 1)}
        >
          <Icon>
            <path d="M15 6l-6 6 6 6" />
          </Icon>
        </button>
        <div className="motiv-carousel__dots">
          {slides.map((slide, i) => (
            <button
              key={slide.id}
              type="button"
              className="motiv-carousel__dot"
              aria-label={slide.label}
              aria-current={i === current ? 'true' : undefined}
              onClick={() => goTo(i)}
            />
          ))}
          <span className="motiv-carousel__worm-track" aria-hidden="true">
            <span ref={wormRef} className="motiv-carousel__worm" />
          </span>
        </div>
        <button
          type="button"
          className="motiv-carousel__arrow"
          aria-label={nextLabel}
          disabled={!loop && current === n - 1}
          onClick={() => goTo(current + 1)}
        >
          <Icon>
            <path d="M9 6l6 6-6 6" />
          </Icon>
        </button>
      </div>
    </section>
  );
}
