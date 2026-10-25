import { readdirSync, statSync } from 'node:fs';

// Bytes, about 15% above the sizes measured when the budget was set; raise them on purpose.
const pages = {
  'index.html': 13_000,
  'kinetic/index.html': 260_000,
  'drawn/index.html': 205_000,
  'matrix/index.html': 215_000,
};
const totalCss = 346_000;
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
