/// <reference types="vite/client" />
import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import tokens from '../styles/tokens.css?raw';
import { Button } from './Button';
import button from './Button/Button.css?raw';
import floatingField from './FloatingField/FloatingField.css?raw';
import { MultiSelect } from './MultiSelect';
import multiSelect from './MultiSelect/MultiSelect.css?raw';
import { SegmentedControl } from './SegmentedControl';
import segmented from './SegmentedControl/SegmentedControl.css?raw';
import { Select } from './Select';
import select from './Select/Select.css?raw';
import { TextField } from './TextField';

// jsdom has no layout, so the test resolves each declared size through the custom-property
// cascade: rules directly inside @layer, matched with element.matches, later rules win.
type Rule = { selector: string; declarations: [string, string][] };

function parseRules(css: string): Rule[] {
  const text = css.replace(/\/\*[\s\S]*?\*\//g, '');
  const rules: Rule[] = [];
  const stack: { head: string; start: number }[] = [];
  let boundary = 0;
  for (let i = 0; i < text.length; i++) {
    if (text[i] === '{') {
      stack.push({ head: text.slice(boundary, i).trim(), start: i + 1 });
      boundary = i + 1;
    } else if (text[i] === '}') {
      const block = stack.pop();
      if (block && !block.head.startsWith('@') && stack.every((s) => s.head.startsWith('@layer'))) {
        let body = text.slice(block.start, i);
        while (/\{[^{}]*\}/.test(body)) body = body.replace(/[^;{}]*\{[^{}]*\}/g, '');
        const declarations = body
          .split(';')
          .map((d) => d.split(/:(.*)/s).map((part) => part.trim()))
          .filter(([property, value]) => property && value) as [string, string][];
        rules.push({ selector: block.head, declarations });
      }
      boundary = i + 1;
    } else if (text[i] === ';') {
      boundary = i + 1;
    }
  }
  return rules;
}

const rules = [tokens, button, floatingField, multiSelect, segmented, select].flatMap(parseRules);

function declared(element: Element, property: string) {
  let value: string | undefined;
  for (const rule of rules) {
    if (!element.matches(rule.selector)) continue;
    for (const [p, v] of rule.declarations) if (p === property) value = v;
  }
  return value;
}

function customProperty(element: Element | null, name: string): string | undefined {
  if (!element) return undefined;
  const value = declared(element, name);
  return value === undefined
    ? customProperty(element.parentElement, name)
    : substitute(element, value);
}

function substitute(element: Element, value: string): string {
  const start = value.indexOf('var(');
  if (start < 0) return value;
  let depth = 0;
  let comma = -1;
  let end = start + 4;
  for (; end < value.length; end++) {
    if (value[end] === '(') depth++;
    if (value[end] === ')' && depth-- === 0) break;
    if (value[end] === ',' && depth === 0 && comma < 0) comma = end;
  }
  const name = value.slice(start + 4, comma < 0 ? end : comma).trim();
  const fallback = comma < 0 ? undefined : value.slice(comma + 1, end).trim();
  const resolved = customProperty(element, name) ?? (fallback && substitute(element, fallback));
  if (resolved === undefined) throw new Error(`${name} is not set`);
  return substitute(element, value.slice(0, start) + resolved + value.slice(end + 1));
}

function px(element: Element, property: string) {
  const value = declared(element, property);
  if (value === undefined) throw new Error(`${property} is not set`);
  const expression = substitute(element, value)
    .replace(/calc\(/g, '(')
    .replace(/max\(/g, 'Math.max(')
    .replace(/(-?[\d.]+)rem/g, '($1*16)')
    .replace(/(-?[\d.]+)px/g, '$1');
  return Number(new Function(`return ${expression}`)());
}

const options = [
  { value: 'a', label: 'A' },
  { value: 'b', label: 'B' },
];

function renderRow(density?: 'compact') {
  const { container } = render(
    <div data-density={density} style={{ display: 'flex', alignItems: 'flex-end' }}>
      <TextField label="Name" labelPosition="above" />
      <Select label="Kind" options={options} value="" onChange={() => {}} />
      <MultiSelect label="Tags" options={options} value={[]} onChange={() => {}} />
      <Button>Save</Button>
      <SegmentedControl label="View" options={options} value="a" onChange={() => {}} />
    </div>,
  );
  const find = (selector: string) => container.querySelector(selector) as Element;
  return [
    { box: find('.motiv-float__control'), text: find('.motiv-float__input') },
    { box: find('.motiv-picker__trigger'), text: find('.motiv-picker__trigger') },
    { box: find('.motiv-multi-select__field'), text: find('.motiv-multi-select') },
    { box: find('.motiv-btn'), text: find('.motiv-btn') },
    { box: find('.motiv-segmented__track'), text: find('.motiv-segmented__option') },
  ];
}

describe('a row of fields', () => {
  it.each([
    [undefined, 40],
    ['compact' as const, 30],
  ])('has one height and one text size in %s density', (density, height) => {
    for (const { box, text } of renderRow(density)) {
      expect(declared(box, 'box-sizing'), box.className).toBe('border-box');
      expect(px(box, 'min-height'), box.className).toBe(height);
      expect(px(text, 'font-size'), text.className).toBe(16);
    }
  });
});
