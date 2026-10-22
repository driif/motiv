import type { CSSProperties } from 'react';
import type { CarouselProps } from '../../components/Carousel';
import { cx } from '../../utils/cx';
import { useCarousel } from '../../utils/useCarousel';

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
  const { current, goTo, keyNav, swipe } = useCarousel({
    count: n,
    index,
    defaultIndex,
    onIndexChange,
    loop,
  });

  return (
    <section
      {...props}
      aria-roledescription="carousel"
      aria-label={label}
      className={cx('motiv-sketch-carousel', className)}
      style={{ ...style, '--_index': current } as CSSProperties}
      onKeyDown={(event) => {
        onKeyDown?.(event);
        keyNav(event);
      }}
    >
      <div className="motiv-sketch-carousel__view" aria-live="polite" {...swipe}>
        <div className="motiv-sketch-carousel__track">
          {slides.map((slide, i) => (
            <div
              key={slide.id}
              role="group"
              aria-roledescription="slide"
              aria-label={slide.label}
              aria-hidden={i !== current}
              data-current={i === current}
              className="motiv-sketch-carousel__slide"
            >
              {slide.content}
            </div>
          ))}
        </div>
      </div>
      <div className="motiv-sketch-carousel__controls">
        <button
          type="button"
          className="motiv-sketch-carousel__arrow"
          aria-label={previousLabel}
          disabled={!loop && current === 0}
          onClick={() => goTo(current - 1)}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M19 12.3c-4.6-.4-9.3-.4-13.8.1M10.4 6.6c-1.8 2-3.5 3.7-5.4 5.7 1.9 1.7 3.6 3.4 5.2 5.3" />
          </svg>
        </button>
        <div className="motiv-sketch-carousel__dots">
          {slides.map((slide, i) => (
            <button
              key={slide.id}
              type="button"
              className="motiv-sketch-carousel__dot"
              aria-label={slide.label}
              aria-current={i === current ? 'true' : undefined}
              onClick={() => goTo(i)}
            />
          ))}
        </div>
        <button
          type="button"
          className="motiv-sketch-carousel__arrow"
          aria-label={nextLabel}
          disabled={!loop && current === n - 1}
          onClick={() => goTo(current + 1)}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M5 12.3c4.6-.4 9.3-.4 13.8.1M13.6 6.6c1.8 2 3.5 3.7 5.4 5.7-1.9 1.7-3.6 3.4-5.2 5.3" />
          </svg>
        </button>
      </div>
    </section>
  );
}
