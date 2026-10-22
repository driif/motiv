import type { CSSProperties } from 'react';
import type { CarouselProps } from '../../components/Carousel';
import { cx } from '../../utils/cx';
import { useCarousel } from '../../utils/useCarousel';

const pad = (i: number) => String(i).padStart(2, '0');

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
      className={cx('motiv-matrix-carousel', className)}
      style={{ ...style, '--_index': current } as CSSProperties}
      onKeyDown={(event) => {
        onKeyDown?.(event);
        keyNav(event);
      }}
    >
      <div className="motiv-matrix-carousel__view" aria-live="polite" {...swipe}>
        <div className="motiv-matrix-carousel__track">
          {slides.map((slide, i) => (
            <div
              key={slide.id}
              role="group"
              aria-roledescription="slide"
              aria-label={slide.label}
              aria-hidden={i !== current}
              data-current={i === current}
              className="motiv-matrix-carousel__slide"
            >
              {slide.content}
            </div>
          ))}
        </div>
      </div>
      <div className="motiv-matrix-carousel__controls">
        <button
          type="button"
          className="motiv-matrix-carousel__arrow"
          aria-label={previousLabel}
          disabled={!loop && current === 0}
          onClick={() => goTo(current - 1)}
        >
          <span aria-hidden="true">&lt;</span>
        </button>
        <div className="motiv-matrix-carousel__dots">
          {slides.map((slide, i) => (
            <button
              key={slide.id}
              type="button"
              className="motiv-matrix-carousel__dot"
              aria-label={slide.label}
              aria-current={i === current ? 'true' : undefined}
              onClick={() => goTo(i)}
            />
          ))}
        </div>
        <span className="motiv-matrix-carousel__count" aria-hidden="true">
          [{pad(n && current + 1)}/{pad(n)}]
        </span>
        <button
          type="button"
          className="motiv-matrix-carousel__arrow"
          aria-label={nextLabel}
          disabled={!loop && current === n - 1}
          onClick={() => goTo(current + 1)}
        >
          <span aria-hidden="true">&gt;</span>
        </button>
      </div>
    </section>
  );
}
