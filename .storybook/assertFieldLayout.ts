import { expect, userEvent } from 'storybook/test';

export const longLabel = 'Required name with a long label for responsive entry';
export const wideLabel = `${longLabel}, wide enough to fill a desktop row`;
export const longValue = 'Synthetic record 00';

function expectContained(label: Element, control: Element, where: string) {
  const box = control.getBoundingClientRect();
  const text = label.getBoundingClientRect();
  expect(text.top, `label top, ${where}`).toBeGreaterThanOrEqual(box.top - 0.5);
  expect(text.bottom, `label bottom, ${where}`).toBeLessThanOrEqual(box.bottom + 0.5);
  expect(text.left, `label left, ${where}`).toBeGreaterThanOrEqual(box.left - 0.5);
  expect(text.right, `label right, ${where}`).toBeLessThanOrEqual(box.right + 0.5);
}

async function expectLabelClear(input: HTMLInputElement, state: string) {
  const label = input.labels?.[0];
  const control = input.parentElement;
  if (!label || !control) throw new Error('The input needs a label and a control.');
  const where = `${state} at ${window.innerWidth}px`;
  // Checked on every frame until the transitions finish, so spring overshoot counts too.
  do {
    await new Promise(requestAnimationFrame);
    expectContained(label, control, where);
  } while (control.getAnimations({ subtree: true }).length > 0);
  const text = label.getBoundingClientRect();
  // A resting label sits on the empty value line by design.
  if (!input.matches(':focus, :not(:placeholder-shown)')) return;
  const value =
    input.getBoundingClientRect().top + Number.parseFloat(getComputedStyle(input).paddingTop);
  expect(text.bottom, `label above the value, ${where}`).toBeLessThanOrEqual(value + 0.5);
}

/** Checks every labelled input in the story empty or prefilled, focused, then filled with `value`. */
export async function assertFieldLayout(canvasElement: HTMLElement, value?: string) {
  await document.fonts.ready;
  for (const input of canvasElement.querySelectorAll('input')) {
    await expectLabelClear(input, input.value ? 'prefilled' : 'empty');
    input.focus();
    await expectLabelClear(input, 'focused');
    if (value && !input.value) await userEvent.type(input, value);
    input.blur();
    await expectLabelClear(input, 'filled');
  }
}
