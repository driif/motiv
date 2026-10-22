import { cleanup, render } from '@testing-library/react';
import type { ReactElement } from 'react';
import type { TestContext } from 'vitest';

type Bench = TestContext['bench'];

export const runOptions = { time: 500, iterations: 20, warmupTime: 100 };

/** Mount + unmount, and a rerender of a mounted tree with the same props. */
export function lifecycle(bench: Bench, ui: () => ReactElement) {
  let rerender: (ui: ReactElement) => void;
  return [
    bench('mount', () => {
      render(ui());
      cleanup();
    }),
    bench(
      'rerender',
      {
        beforeAll() {
          ({ rerender } = render(ui()));
        },
        afterAll: cleanup,
      },
      () => rerender(ui()),
    ),
  ];
}

/** Repeats `step` on one mounted tree; `step` must leave the tree as it found it. */
export function interaction(
  bench: Bench,
  name: string,
  ui: () => ReactElement,
  step: (root: HTMLElement) => void,
  prepare?: (root: HTMLElement) => void,
) {
  let root: HTMLElement;
  return bench(
    name,
    {
      beforeAll() {
        root = render(ui()).container;
        prepare?.(root);
      },
      afterAll: cleanup,
    },
    () => step(root),
  );
}

export function query(root: HTMLElement, selector: string) {
  const element = root.querySelector<HTMLElement>(selector);
  if (!element) throw new Error(`${selector} not found`);
  return element;
}
