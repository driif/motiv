/// <reference types="vite/client" />
import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { cssCascade } from '../../test/cssCascade';
import tokens from '../styles/tokens.css?raw';
import { Button } from './Button';
import button from './Button/Button.css?raw';
import { MultiSelect } from './MultiSelect';
import multiSelect from './MultiSelect/MultiSelect.css?raw';
import { SegmentedControl } from './SegmentedControl';
import segmented from './SegmentedControl/SegmentedControl.css?raw';
import { Select } from './Select';
import select from './Select/Select.css?raw';
import { TextField } from './TextField';
import textField from './TextField/TextField.css?raw';

const { declared, px } = cssCascade([tokens, button, multiSelect, segmented, select, textField]);

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
  return [
    '.motiv-text-field__input',
    '.motiv-select__trigger',
    '.motiv-sketch-multi-select__field',
    '.motiv-btn',
    '.motiv-segmented__track',
  ].map((selector) => container.querySelector(selector) as Element);
}

describe('a row of drawn fields', () => {
  it.each([
    [undefined, 40],
    ['compact' as const, 30],
  ])('has one height in %s density', (density, height) => {
    for (const box of renderRow(density)) {
      expect(declared(box, 'box-sizing'), box.className).toBe('border-box');
      expect(px(box, 'min-height'), box.className).toBe(height);
    }
  });
});
