/// <reference types="vite/client" />
import { expect, it } from 'vitest';
import css from './Badge.css?raw';

it('takes the trailing letter-spacing off the end padding in every size', () => {
  const spacing = css.match(/letter-spacing:\s*([^;]+);/)?.[1];
  const rules = [
    ...css.matchAll(/padding: [^;]+ (calc\([^;]+\));\s*padding-inline-end: ([^;]+);/g),
  ];
  expect(rules).toHaveLength(2);
  for (const [, side, end] of rules) {
    expect(end).toBe(`${side.slice(0, -1)} - ${spacing})`);
  }
});
