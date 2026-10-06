import { mkdirSync, writeFileSync } from 'node:fs';
import { bundle } from 'lightningcss';

const targets = {
  chrome: 111 << 16,
  edge: 111 << 16,
  firefox: 113 << 16,
  safari: (16 << 16) | (2 << 8),
};

const files = [
  ['src/styles/index.css', 'dist/styles.css'],
  ['src/styles/tokens.css', 'dist/tokens.css'],
  ['src/styles/base.css', 'dist/base.css'],
];

mkdirSync('dist', { recursive: true });
for (const [filename, out] of files) {
  const { code } = bundle({ filename, minify: true, targets });
  writeFileSync(out, code);
}
