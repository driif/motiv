/// <reference types="vite/client" />
import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { cssCascade } from '../../test/cssCascade';
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

const { declared, px } = cssCascade([
  tokens,
  button,
  floatingField,
  multiSelect,
  segmented,
  select,
]);

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
