import type { CSSProperties, ReactNode } from 'react';
import { expect, userEvent, waitFor } from 'storybook/test';
import { assertFieldLayout, longValue } from './assertFieldLayout';

const large = 1.25;

const frames = [
  { name: 'Default', density: undefined, style: {} },
  { name: 'Compact', density: 'compact', style: {} },
  {
    name: `--motiv-font-size: ${large}rem`,
    density: undefined,
    style: { '--motiv-font-size': `${large}rem` },
  },
  {
    name: `Compact, --motiv-font-size: ${large}rem`,
    density: 'compact',
    style: { '--motiv-font-size': `${large}rem` },
  },
];

/** A control family: `box` is the element that shrinks in compact density. */
export interface Family {
  name: string;
  render: () => ReactNode;
  box: string;
  /** Measured for font size instead of the first visible text in `box`. */
  text?: string;
  /** Has no visible text, so only its box is measured. */
  boxOnly?: boolean;
  /** Clicked to open a popup before its first `row` is measured. */
  open?: string;
  row?: string;
  /** Floating-label field, checked with assertFieldLayout in every frame. */
  field?: boolean;
}

/** Renders every family in default, compact, scoped-font and combined frames. */
export function ScaleFrames({ families }: { families: Family[] }) {
  return (
    <div
      style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(20rem, 1fr))', gap: '2rem' }}
    >
      {frames.map((frame) => (
        <section
          key={frame.name}
          aria-label={frame.name}
          data-density={frame.density}
          data-scale-frame
          style={
            { display: 'grid', gap: '1rem', alignContent: 'start', ...frame.style } as CSSProperties
          }
        >
          <code style={{ fontSize: '0.75rem', color: 'var(--motiv-color-text-muted)' }}>
            {frame.name}
          </code>
          {families.map((family) => (
            // Room below each family so an open popup does not cover the next one.
            <div
              key={family.name}
              data-family={family.name}
              style={{ paddingBottom: family.open ? '16rem' : 0 }}
            >
              {family.render()}
            </div>
          ))}
        </section>
      ))}
    </div>
  );
}

function find(scope: Element, selector: string) {
  const element = scope.querySelector(selector);
  if (!element)
    throw new Error(
      `No ${selector} in ${scope.closest('[data-scale-frame]')?.getAttribute('aria-label')}.`,
    );
  return element;
}

function visible(element: Element) {
  return (
    element.checkVisibility({ opacityProperty: true, visibilityProperty: true }) &&
    element.getBoundingClientRect().width > 1
  );
}

/** The font size of the first visible text inside `element`. */
function textSize(element: Element) {
  const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
  for (let node = walker.nextNode(); node; node = walker.nextNode()) {
    const parent = node.parentElement;
    if (node.textContent?.trim() && parent && visible(parent))
      return Number.parseFloat(getComputedStyle(parent).fontSize);
  }
  throw new Error(`No visible text in ${element.className}.`);
}

interface Size {
  height: number;
  font: number;
}

// offsetHeight is the laid-out box, unaffected by an opening animation's transform.
function measure(element: Element, text?: Element): Size {
  return { height: (element as HTMLElement).offsetHeight, font: textSize(text ?? element) };
}

function expectScaled(name: string, [normal, compact, scaled, both]: Size[], boxOnly = false) {
  expect(compact.height, `${name} height in compact`).toBeLessThan(normal.height);
  expect(both.height, `${name} height in compact with a larger font`).toBeLessThan(scaled.height);
  if (boxOnly) return;
  expect(scaled.font / normal.font, `${name} font follows --motiv-font-size`).toBeCloseTo(large, 2);
  expect(both.font / compact.font, `${name} font follows --motiv-font-size in compact`).toBeCloseTo(
    large,
    2,
  );
}

async function measureRow(scope: Element, family: Family) {
  const row = () => find(scope, family.row as string);
  await userEvent.click(find(scope, family.open as string));
  await waitFor(() => expect(visible(row()), `${family.name} opens`).toBe(true));
  const size = measure(row());
  await userEvent.keyboard('{Escape}');
  await waitFor(() => {
    const closed = scope.querySelector(family.row as string);
    expect(closed && visible(closed), `${family.name} closes`).toBeFalsy();
  });
  return size;
}

/** Expects every family to shrink in compact density and its visible text to follow --motiv-font-size. */
export async function expectFamiliesScaled(canvasElement: HTMLElement, families: Family[]) {
  await document.fonts.ready;
  const scopes = [...canvasElement.querySelectorAll('[data-scale-frame]')];
  for (const family of families) {
    const inFrames = scopes.map((frame) => find(frame, `[data-family="${family.name}"]`));
    expectScaled(
      family.name,
      inFrames.map((scope) =>
        measure(find(scope, family.box), family.text ? find(scope, family.text) : undefined),
      ),
      family.boxOnly,
    );
    if (family.row) {
      const rows = [];
      for (const scope of inFrames) rows.push(await measureRow(scope, family));
      expectScaled(`${family.name} row`, rows);
    }
    if (family.field)
      for (const scope of inFrames) await assertFieldLayout(scope as HTMLElement, longValue);
  }
}

const noop = () => {};

/** Sample props shared by the three styles' Scale stories. */
export const sample = {
  noop,
  options: [
    { value: 'read', label: 'Read entries' },
    { value: 'write', label: 'Edit entries' },
    { value: 'publish', label: 'Publish forms' },
  ],
  tabs: [
    { value: 'one', label: 'Overview', panel: 'Overview panel' },
    { value: 'two', label: 'Activity', panel: 'Activity panel' },
  ],
  nav: [
    { id: 'inbox', label: 'Inbox', count: 4 },
    { id: 'sent', label: 'Sent' },
  ],
  commands: [
    { id: 'new', label: 'New project', onSelect: noop },
    { id: 'settings', label: 'Settings', onSelect: noop },
  ],
};
