import { existsSync, readFileSync } from 'node:fs';
import { catalog } from '../site/src/catalog.mjs';

const entries = { kinetic: '../dist/index.js', drawn: '../dist/drawn/index.js' };

const problems = [];
for (const [style, entry] of Object.entries(entries)) {
  const exported = Object.keys(await import(entry));
  const sections = catalog[style];
  const claimed = sections.flatMap((section) => section.symbols);
  for (const name of exported) {
    if (!claimed.includes(name)) problems.push(`${style}: ${name} is exported but not on the site`);
  }
  for (const name of claimed) {
    if (!exported.includes(name))
      problems.push(`${style}: ${name} is on the site but not exported`);
  }
  const page = readFileSync(new URL(`../site/src/pages/${style}/index.astro`, import.meta.url));
  for (const { id, demo } of sections) {
    if (!existsSync(new URL(`../site/src/demos/${style}/${demo}.tsx`, import.meta.url))) {
      problems.push(`${style}: demo site/src/demos/${style}/${demo}.tsx is missing`);
    }
    if (
      style === 'kinetic' &&
      !existsSync(new URL(`../site/src/pages/preview/kinetic/${id}.astro`, import.meta.url))
    ) {
      problems.push(`${style}: preview site/src/pages/preview/kinetic/${id}.astro is missing`);
    }
    if (!page.includes(`id="${id}"`)) problems.push(`${style}: section #${id} is not on the page`);
  }
}

if (problems.length) {
  console.error(problems.join('\n'));
  process.exit(1);
}
console.log('site coverage ok');
