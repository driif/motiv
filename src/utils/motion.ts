export const EASE_OUT = 'cubic-bezier(0.2, 0.8, 0.2, 1)';
export const SPRING = 'cubic-bezier(0.34, 1.56, 0.64, 1)';

export const SHAKE: Keyframe[] = [
  { translate: '0' },
  { translate: '-6px', offset: 0.2 },
  { translate: '5px', offset: 0.4 },
  { translate: '-3px', offset: 0.6 },
  { translate: '2px', offset: 0.8 },
  { translate: '0' },
];

export const SWING: Keyframe[] = [
  { rotate: '0deg' },
  { rotate: '18deg', offset: 0.15 },
  { rotate: '-14deg', offset: 0.3 },
  { rotate: '9deg', offset: 0.45 },
  { rotate: '-5deg', offset: 0.6 },
  { rotate: '2deg', offset: 0.78 },
  { rotate: '0deg' },
];

// Call from effects and handlers only: it reads window.
export function prefersReducedMotion(): boolean {
  return window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
}

/** One-shot Web Animation, skipped under reduced motion and where WAAPI is missing. */
export function playOnce(
  el: Element | null | undefined,
  keyframes: Keyframe[],
  options: KeyframeAnimationOptions,
): void {
  if (!el?.animate || prefersReducedMotion()) return;
  el.animate(keyframes, options);
}
