import { existsSync, readFileSync } from 'node:fs';
import { catalog, categories, groups, pages } from '../site/src/catalog.mjs';

const entries = {
  kinetic: ['../dist/index.js', '../dist/action-menu/index.js'],
  drawn: ['../dist/drawn/index.js'],
  matrix: ['../dist/matrix/index.js'],
};

const problems = [];
for (const { name, group } of categories) {
  if (!groups.some((known) => known.name === group)) {
    problems.push(`category ${name} has unknown group ${group}`);
  }
}
for (const [style, paths] of Object.entries(entries)) {
  const modules = await Promise.all(paths.map((path) => import(path)));
  const exported = modules.flatMap((module) => Object.keys(module));
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
  // Component pages and the sidebar come from pages(): every section on exactly one page.
  const placed = pages(style).flatMap((page) => page.sections.map((section) => section.id));
  for (const { id } of sections) {
    const count = placed.filter((placedId) => placedId === id).length;
    if (count !== 1) problems.push(`${style}: section #${id} is on ${count} pages`);
  }
  const slugs = pages(style).map((page) => page.slug);
  for (const [index, slug] of slugs.entries()) {
    if (slugs.indexOf(slug) !== index) problems.push(`${style}: two pages share the slug ${slug}`);
  }
  for (const { name } of categories) {
    if (!sections.some((section) => section.category === name)) {
      problems.push(`${style}: no section for category ${name}`);
    }
  }
  for (const { id, demo, category, group } of sections) {
    if (category !== null && !categories.some(({ name }) => name === category)) {
      problems.push(`${style}: section #${id} has unknown category ${category}`);
    }
    if (category === null && !groups.some(({ name }) => name === group)) {
      problems.push(`${style}: style-specific section #${id} has unknown group ${group}`);
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
