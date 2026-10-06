import { rolldown } from 'rolldown';

const bundle = await rolldown({
  input: 'test/fixtures/treeshake-button.js',
  external: [/^react/],
});
const { output } = await bundle.generate({ format: 'esm' });
const code = output.map((chunk) => chunk.code ?? '').join('\n');

const problems = [];
if (!code.includes('motiv-btn')) problems.push('Button code missing from bundle');
if (code.includes('motiv-card')) problems.push('Card code leaked into a Button-only bundle');

if (problems.length) {
  console.error(problems.join('\n'));
  process.exit(1);
}
console.log('tree-shaking ok');
