import { existsSync, readFileSync } from 'node:fs';
import { catalog, categories } from '../site/src/catalog.mjs';

const entries = {
  kinetic: '../dist/index.js',
  drawn: '../dist/drawn/index.js',
  matrix: '../dist/matrix/index.js',
};

const problems = [];
for (const [style, entry] of Object.entries(entries)) {
  const exported = Object.keys(await import(entry));
  const sections = catalog[style];
  const claimed = sections.flatMap((section) => section.symbols);
  for (const name of exported) {
    // cx is a helper, shown in the kinetic getting-started steps instead of a demo.
    if (!claimed.includes(name) && !(style === 'kinetic' && name === 'cx'))
      problems.push(`${style}: ${name} is exported but not on the site`);
  }
  for (const [index, name] of claimed.entries()) {
    if (claimed.indexOf(name) !== index) problems.push(`${style}: ${name} is claimed twice`);
    if (!exported.includes(name))
      problems.push(`${style}: ${name} is on the site but not exported`);
  }
  const page = readFileSync(new URL(`../site/src/pages/${style}/index.astro`, import.meta.url));
  if (style === 'kinetic' && !String(page).includes('cx(')) {
    problems.push('kinetic: cx is neither on the site nor in the getting-started snippet');
  }
  // The page renders the catalog by category, so every section is on it.
  if (!page.includes(`<Sections style="${style}" />`)) {
    problems.push(`${style}: the page does not render <Sections style="${style}" />`);
  }
  for (const category of categories) {
    if (!sections.some((section) => section.category === category)) {
      problems.push(`${style}: no section for category ${category}`);
    }
  }
  for (const { id, demo, category } of sections) {
    if (category !== null && !categories.includes(category)) {
      problems.push(`${style}: section #${id} has unknown category ${category}`);
    }
    if (!existsSync(new URL(`../site/src/demos/${style}/${demo}.tsx`, import.meta.url))) {
      problems.push(`${style}: demo site/src/demos/${style}/${demo}.tsx is missing`);
    }
    // Each style overrides :root tokens and shares class names, so demos render in iframes.
    if (!existsSync(new URL(`../site/src/pages/preview/${style}/${id}.astro`, import.meta.url))) {
      problems.push(`${style}: preview site/src/pages/preview/${style}/${id}.astro is missing`);
    }
  }
}

if (problems.length) {
  console.error(problems.join('\n'));
  process.exit(1);
}
console.log('site coverage ok');
