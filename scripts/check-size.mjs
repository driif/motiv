import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { gzipSync } from 'node:zlib';

// Gzip budget per published JS/CSS file. `--update` rewrites it at current size + 10%.
const dist = new URL('../dist/', import.meta.url);
const budgetFile = new URL('size-budget.json', import.meta.url);

const sizes = Object.fromEntries(
  readdirSync(dist, { recursive: true })
    .filter((path) => /\.(js|css)$/.test(path))
    .sort()
    .map((path) => [path, gzipSync(readFileSync(new URL(path, dist)), { level: 9 }).length]),
);

if (process.argv.includes('--update')) {
  const budget = Object.fromEntries(
    Object.entries(sizes).map(([path, size]) => [path, Math.ceil((size * 1.1) / 50) * 50]),
  );
  writeFileSync(budgetFile, `${JSON.stringify(budget, null, 2)}\n`);
  console.log(`size budget written for ${Object.keys(budget).length} files`);
  process.exit(0);
}

const budget = JSON.parse(readFileSync(budgetFile, 'utf8'));
const rows = [];
for (const path of new Set([...Object.keys(sizes), ...Object.keys(budget)])) {
  const size = sizes[path];
  const max = budget[path];
  if (max === undefined) rows.push({ path, size, max, problem: 'no budget' });
  else if (size === undefined) rows.push({ path, size, max, problem: 'file removed' });
  else if (size > max) rows.push({ path, size, max, problem: 'over budget' });
}

if (rows.length) {
  console.table(rows);
  console.error('Run `node scripts/check-size.mjs --update` after an intended size change.');
  process.exit(1);
}
console.log(`package size ok (${Object.keys(sizes).length} files)`);
