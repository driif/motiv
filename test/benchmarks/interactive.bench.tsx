import { fireEvent } from '@testing-library/react';
import { type ComponentType, useState } from 'react';
import { test } from 'vitest';
import { Accordion } from '../../src/components/Accordion';
import { Carousel } from '../../src/components/Carousel';
import { CommandMenu } from '../../src/components/CommandMenu';
import { FilterChips, type FilterChipsProps } from '../../src/components/FilterChips';
import { OtpInput } from '../../src/components/OtpInput';
import { Tabs } from '../../src/components/Tabs';
import { Textarea } from '../../src/components/Textarea';
import { Chips as DrawnChips } from '../../src/drawn/Chips';
import { Nav } from '../../src/drawn/Nav';
import { Chips as MatrixChips } from '../../src/matrix/Chips';
import { interaction, lifecycle, query, runOptions } from './measure';

const range = (n: number) => Array.from({ length: n }, (_, i) => `${i}`);
const noop = () => {};
const options = { timeout: 120_000 };
const focused = () => document.activeElement as HTMLElement;

test('CommandMenu', options, async ({ bench }) => {
  const commands = range(200).map((id) => ({ id, label: `Command ${id}`, onSelect: noop }));
  const ui = () => <CommandMenu commands={commands} />;
  const launcher = (root: HTMLElement) => query(root, '[aria-haspopup="menu"]');
  await bench.compare(
    ...lifecycle(bench, ui),
    interaction(bench, 'open + close', ui, (root) => {
      fireEvent.click(launcher(root));
      fireEvent.click(launcher(root));
    }),
    interaction(
      bench,
      'ArrowDown + ArrowUp',
      ui,
      () => {
        fireEvent.keyDown(focused(), { key: 'ArrowDown' });
        fireEvent.keyDown(focused(), { key: 'ArrowUp' });
      },
      (root) => {
        fireEvent.click(launcher(root));
        query(root, '[role="menuitem"]').focus();
      },
    ),
    runOptions,
  );
});

test('Carousel', options, async ({ bench }) => {
  const slides = range(50).map((id) => ({ id, label: `Slide ${id}`, content: `Slide ${id}` }));
  const ui = () => <Carousel slides={slides} label="Slides" />;
  await bench.compare(
    ...lifecycle(bench, ui),
    interaction(bench, 'ArrowRight', ui, (root) =>
      fireEvent.keyDown(query(root, 'section'), { key: 'ArrowRight' }),
    ),
    runOptions,
  );
});

test('OtpInput', options, async ({ bench }) => {
  function Controlled() {
    const [value, setValue] = useState('');
    return <OtpInput label="Code" value={value} onChange={setValue} />;
  }
  const ui = () => <Controlled />;
  await bench.compare(
    ...lifecycle(bench, ui),
    interaction(bench, 'type + Backspace', ui, (root) => {
      const [first, second] = root.querySelectorAll('input');
      fireEvent.change(first, { target: { value: '4' } });
      fireEvent.keyDown(second, { key: 'Backspace' });
    }),
    runOptions,
  );
});

test('Accordion', options, async ({ bench }) => {
  const items = range(100).map((id) => ({ id, title: `Item ${id}`, content: `Content ${id}` }));
  const ui = () => <Accordion items={items} />;
  await bench.compare(
    ...lifecycle(bench, ui),
    interaction(bench, 'open + close', ui, (root) => {
      fireEvent.click(query(root, 'button'));
      fireEvent.click(query(root, 'button'));
    }),
    runOptions,
  );
});

test('Textarea', options, async ({ bench }) => {
  const text = 'A line of text\n'.repeat(20);
  function Controlled() {
    const [value, setValue] = useState(text);
    return <Textarea label="Message" value={value} onChange={(e) => setValue(e.target.value)} />;
  }
  const ui = () => <Controlled />;
  await bench.compare(
    ...lifecycle(bench, ui),
    interaction(bench, 'type + undo', ui, (root) => {
      const textarea = query(root, 'textarea');
      fireEvent.change(textarea, { target: { value: `${text}x` } });
      fireEvent.change(textarea, { target: { value: text } });
    }),
    runOptions,
  );
});

const chips: [string, ComponentType<FilterChipsProps>][] = [
  ['kinetic FilterChips', FilterChips],
  ['drawn Chips', DrawnChips],
  ['matrix Chips', MatrixChips],
];

for (const [name, Chips] of chips) {
  test(`${name}, 250 of 500 selected`, options, async ({ bench }) => {
    const all = range(500).map((value) => ({ value, label: `Chip ${value}` }));
    function Controlled() {
      const [value, setValue] = useState(range(250));
      return <Chips label="Filters" options={all} value={value} onChange={setValue} />;
    }
    const ui = () => <Controlled />;
    await bench.compare(
      ...lifecycle(bench, ui),
      interaction(bench, 'toggle twice', ui, (root) => {
        const last = query(root, '[aria-pressed]:last-of-type');
        fireEvent.click(last);
        fireEvent.click(last);
      }),
      runOptions,
    );
  });
}

test('Tabs', options, async ({ bench }) => {
  const items = range(50).map((value) => ({
    value,
    label: `Tab ${value}`,
    panel: `Panel ${value}`,
  }));
  function Controlled() {
    const [value, setValue] = useState('0');
    return <Tabs label="Sections" items={items} value={value} onChange={setValue} />;
  }
  const ui = () => <Controlled />;
  await bench.compare(
    ...lifecycle(bench, ui),
    interaction(bench, 'ArrowRight + ArrowLeft', ui, (root) => {
      fireEvent.keyDown(query(root, '[aria-selected="true"]'), { key: 'ArrowRight' });
      fireEvent.keyDown(query(root, '[aria-selected="true"]'), { key: 'ArrowLeft' });
    }),
    runOptions,
  );
});

test('Nav', options, async ({ bench }) => {
  const items = range(100).map((id) => ({ id, label: `Page ${id}` }));
  function Controlled() {
    const [value, setValue] = useState('0');
    return <Nav label="Pages" items={items} value={value} onChange={setValue} />;
  }
  const ui = () => <Controlled />;
  await bench.compare(
    ...lifecycle(bench, ui),
    interaction(bench, 'click away + back', ui, (root) => {
      const [first, second] = root.querySelectorAll('button');
      fireEvent.click(second);
      fireEvent.click(first);
    }),
    runOptions,
  );
});
