import { rolldown } from 'rolldown';

const checks = [
  { input: 'test/fixtures/treeshake-button.js', kept: 'motiv-btn', dropped: ['motiv-card'] },
  {
    input: 'test/fixtures/treeshake-drawn-link.js',
    kept: 'motiv-link',
    dropped: ['motiv-checkbox', 'motiv-text-field', 'motiv-btn', 'motiv-card'],
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
