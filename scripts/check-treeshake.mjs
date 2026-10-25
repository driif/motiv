import { rolldown } from 'rolldown';

const checks = [
  {
    input: 'test/fixtures/treeshake-multi-select.js',
    kept: 'motiv-multi-select',
    dropped: ['motiv-picker', 'motiv-filter-chips', 'useListbox', 'useChips', 'useCommandMenu'],
  },
  {
    input: 'test/fixtures/treeshake-button.js',
    kept: 'motiv-btn',
    dropped: ['motiv-card', 'motiv-toast', 'useSyncExternalStore'],
  },
  {
    input: 'test/fixtures/treeshake-drawn-link.js',
    kept: 'motiv-link',
    dropped: ['motiv-checkbox', 'motiv-text-field', 'motiv-btn', 'motiv-card'],
  },
  {
    input: 'test/fixtures/treeshake-matrix-scan-button.js',
    kept: 'motiv-matrix-scan',
    dropped: ['motiv-matrix-term', 'motiv-matrix-decode', 'motiv-matrix-btn', 'motiv-link'],
  },
  {
    input: 'test/fixtures/treeshake-select.js',
    kept: 'motiv-picker',
    dropped: ['motiv-filter-chips', 'motiv-carousel', 'useChips', 'useCommandMenu', 'useCarousel'],
  },
  {
    input: 'test/fixtures/treeshake-drawn-select.js',
    kept: 'motiv-select',
    dropped: [
      'motiv-sketch-chips',
      'motiv-sketch-carousel',
      'useChips',
      'useCommandMenu',
      'useCarousel',
    ],
  },
  {
    input: 'test/fixtures/treeshake-matrix-terminal-select.js',
    kept: 'motiv-matrix-term',
    dropped: [
      'motiv-matrix-chips',
      'motiv-matrix-scan',
      'useChips',
      'useCommandMenu',
      'useCarousel',
    ],
  },
];

const problems = [];
for (const { input, kept, dropped } of checks) {
  const bundle = await rolldown({ input, external: [/^react/] });
  const { output } = await bundle.generate({ format: 'esm' });
  const code = output.map((chunk) => chunk.code ?? '').join('\n');
  if (!code.includes(kept)) problems.push(`${input}: ${kept} missing from bundle`);
  for (const name of dropped) {
    if (code.includes(name)) problems.push(`${input}: ${name} leaked into the bundle`);
  }
}

if (problems.length) {
  console.error(problems.join('\n'));
  process.exit(1);
}
console.log('tree-shaking ok');
