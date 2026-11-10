import { rolldown } from 'rolldown';

const checks = [
  {
    input: 'dist/index.js',
    kept: 'motiv-btn',
    dropped: ['motiv-markdown', 'motiv-data-table'],
    droppedModules: /node_modules\/(?:micromark[^/]*|hast-util-[^/]+|parse5|@tanstack)\//,
  },
  {
    input: 'test/fixtures/treeshake-data-table.js',
    kept: 'motiv-data-table',
    dropped: ['motiv-markdown', 'motiv-btn'],
  },
  {
    input: 'test/fixtures/treeshake-markdown.js',
    kept: 'motiv-markdown',
    dropped: ['motiv-markdown-editor', 'motiv-textarea', 'fitHeight', 'useState'],
  },
  {
    input: 'test/fixtures/treeshake-multi-select.js',
    kept: 'motiv-multi-select',
    dropped: ['motiv-picker', 'motiv-filter-chips', 'useListbox', 'useChips', 'useCommandMenu'],
  },
  {
    input: 'test/fixtures/treeshake-table.js',
    kept: 'motiv-table__resize',
    dropped: ['motiv-table-menu', 'motiv-check', 'motiv-btn', 'motiv-multi-select'],
  },
  {
    input: 'test/fixtures/treeshake-button.js',
    kept: 'motiv-btn',
    dropped: [
      'motiv-card',
      'motiv-toast',
      'useSyncExternalStore',
      'motiv-action-menu',
      '@radix-ui',
    ],
  },
  {
    input: 'test/fixtures/treeshake-action-menu.js',
    kept: 'motiv-action-menu__item',
    dropped: ['motiv-card', 'motiv-toast', 'motiv-picker', 'useListbox'],
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
  {
    input: 'test/fixtures/treeshake-drawn-multi-select.js',
    kept: 'motiv-sketch-multi-select',
    dropped: ['motiv-multi-select', 'motiv-select', 'useListbox', 'useChips', 'useCommandMenu'],
  },
  {
    input: 'test/fixtures/treeshake-matrix-multi-select.js',
    kept: 'motiv-matrix-multi-select',
    dropped: ['motiv-multi-select', 'motiv-matrix-term', 'useListbox', 'useChips'],
  },
  {
    input: 'test/fixtures/treeshake-drawn-file-upload.js',
    kept: 'motiv-sketch-file-upload',
    dropped: ['motiv-file-upload', 'motiv-bar', 'motiv-sketch-multi-select', 'useMultiSelect'],
  },
  {
    input: 'test/fixtures/treeshake-matrix-put-file.js',
    kept: 'XMLHttpRequest',
    dropped: ['motiv-file-upload', 'motiv-matrix-file-upload', 'motiv-matrix-btn', 'useFileUpload'],
  },
  {
    input: 'test/fixtures/treeshake-drawn-toaster.js',
    kept: 'motiv-sketch-toast',
    dropped: ['motiv-toast', 'motiv-matrix-toast', 'useConfirm', 'useColumnResize'],
  },
  {
    input: 'test/fixtures/treeshake-matrix-toast.js',
    kept: 'Infinity',
    dropped: [
      'motiv-toast',
      'motiv-sketch-toast',
      'motiv-matrix-toast',
      'useSyncExternalStore',
      'useToastItem',
    ],
  },
  {
    input: 'test/fixtures/treeshake-drawn-table.js',
    kept: 'motiv-sketch-table__resize',
    dropped: ['motiv-table__', 'motiv-sketch-table-menu', 'motiv-checkbox', 'motiv-btn'],
  },
  {
    input: 'test/fixtures/treeshake-matrix-confirm.js',
    kept: 'motiv-matrix-confirm',
    dropped: ['motiv-confirm', 'motiv-sketch-confirm', 'motiv-text-field', 'motiv-btn'],
  },
];

const problems = [];
for (const { input, kept, dropped, droppedModules } of checks) {
  const bundle = await rolldown({ input, external: [/^react/, /^@radix-ui\//] });
  const { output } = await bundle.generate({ format: 'esm' });
  const code = output.map((chunk) => chunk.code ?? '').join('\n');
  for (const chunk of output) {
    if (chunk.type !== 'chunk') continue;
    for (const id of chunk.moduleIds) {
      if (droppedModules?.test(id)) problems.push(`${input}: ${id} leaked into the bundle`);
    }
  }
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
