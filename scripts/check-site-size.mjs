import { readdirSync, statSync } from 'node:fs';
import { pages as componentPages, styles } from '../site/src/catalog.mjs';

// Bytes, about 15% above the sizes measured when the budget was set; raise them on purpose.
const pages = {
  'index.html': 23_000,
  'kinetic/index.html': 54_000,
  'drawn/index.html': 82_000,
  'matrix/index.html': 83_000,
};
// Every generated component page, /<style>/<slug>/; the largest measured 42_123 (kinetic progress).
const componentPage = 48_500;
const totalCss = 400_000;
const largestJs = 245_000;

const dist = new URL('../site/dist/', import.meta.url);
const size = (path) => statSync(new URL(path, dist)).size;
const assets = readdirSync(new URL('_astro/', dist)).map((name) => ({
  name,
  size: size(`_astro/${name}`),
}));

const problems = [];
const check = (label, actual, budget) => {
  if (actual > budget) problems.push(`${label} is ${actual} bytes, over the ${budget} byte budget`);
};
for (const [path, budget] of Object.entries(pages)) check(path, size(path), budget);
for (const style of styles) {
  for (const { slug } of componentPages(style)) {
    const path = `${style}/${slug}/index.html`;
    check(path, size(path), componentPage);
  }
}
const cssBytes = assets
  .filter(({ name }) => name.endsWith('.css'))
  .reduce((sum, { size }) => sum + size, 0);
check('total CSS', cssBytes, totalCss);
for (const file of assets.filter(({ name }) => name.endsWith('.js'))) {
  check(`_astro/${file.name}`, file.size, largestJs);
}

if (problems.length) {
  console.error(problems.join('\n'));
  process.exit(1);
}
console.log('site size ok');
