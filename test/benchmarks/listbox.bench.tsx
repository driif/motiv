import { fireEvent } from '@testing-library/react';
import { type ComponentType, useState } from 'react';
import { test, vi } from 'vitest';
import { Select } from '../../src/components/Select';
import { Select as DrawnSelect } from '../../src/drawn/Select';
import { TerminalSelect } from '../../src/matrix/TerminalSelect';
import type { MotivOption } from '../../src/types';
import { interaction, lifecycle, query, runOptions } from './measure';

// The last label is the only "Zulu", so typeahead scans every option.
const options = Array.from({ length: 500 }, (_, i) => ({ value: `o${i}`, label: `Option ${i}` }));
options[499] = { value: 'zulu', label: 'Zulu' };

interface ListboxProps {
  label: string;
  options: MotivOption[];
  value: string;
  onChange: (value: string) => void;
}

const selects: [string, ComponentType<ListboxProps>][] = [
  ['kinetic Select', Select],
  ['drawn Select', DrawnSelect],
  ['matrix TerminalSelect', TerminalSelect],
];

for (const [name, Listbox] of selects) {
  test(name, { timeout: 120_000 }, async ({ bench }) => {
    function Controlled() {
      const [value, setValue] = useState('o0');
      return <Listbox label="Pick" options={options} value={value} onChange={setValue} />;
    }
    const ui = () => <Controlled />;
    const combobox = (root: HTMLElement) => query(root, '[role="combobox"]');
    const key = (root: HTMLElement, k: string) => fireEvent.keyDown(combobox(root), { key: k });
    // Typeahead resets its query after 500ms; only timers are faked, not the bench clock.
    vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] });

    await bench.compare(
      ...lifecycle(bench, ui),
      interaction(bench, 'open + close', ui, (root) => {
        fireEvent.click(combobox(root));
        fireEvent.click(combobox(root));
      }),
      interaction(
        bench,
        'ArrowDown + ArrowUp',
        ui,
        (root) => {
          key(root, 'ArrowDown');
          key(root, 'ArrowUp');
        },
        (root) => fireEvent.click(combobox(root)),
      ),
      interaction(bench, '3-char typeahead', ui, (root) => {
        for (const k of 'zul') key(root, k);
        key(root, 'Escape');
        vi.advanceTimersByTime(500);
      }),
      runOptions,
    );
    vi.useRealTimers();
  });
}
