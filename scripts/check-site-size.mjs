import { readdirSync, statSync } from 'node:fs';
import { pages as componentPages, styles } from '../site/src/catalog.mjs';
import { examples } from '../site/src/examples.mjs';

// Bytes, about 15% above the sizes measured when the budget was set; raise them on purpose.
const pages = {
  // Raised from 23_000 for the home page's example apps section (measured 24_689).
  'index.html': 28_500,
  'kinetic/index.html': 56_000,
  'drawn/index.html': 82_000,
  'matrix/index.html': 83_000,
};
// Every generated component page, /<style>/<slug>/; the largest measured 49_259 (kinetic table),
// raised from 48_500 for the sidebar's Examples group.
const componentPage = 52_000;
// Example app pages, /<style>/examples/<id>/, carry a whole app's highlighted source; the largest
// measured 90_818 (kinetic dashboard).
const examplePage = 105_000;
const totalCss = 550_000;
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
  check(`${style}/examples/index.html`, size(`${style}/examples/index.html`), componentPage);
  for (const { id } of examples) {
    const path = `${style}/examples/${id}/index.html`;
    check(path, size(path), examplePage);
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
