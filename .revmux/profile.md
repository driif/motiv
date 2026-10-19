# motiv — review profile

- **What it is:** `@driif/motiv`, a React 19 component library published to npm. Consumed by React
  SPAs (Rsbuild/Vite) and Astro sites (server-rendered islands) this repo cannot see.
- **Severity contract:** `.claude/code-review-contract.md` is binding — read it first. CRITICAL /
  MAJOR / MINOR mean what it says, including the realistic-trigger test.
- **Blast radius:** every export, prop, prop default, `motiv-*` class, `--motiv-*` token and
  `package.json#exports` entry is public API used by unseen apps. A broken or renamed one in a
  published version breaks consumers.
- **Real failures here:**
  - public API removed/renamed without a breaking changeset (0.x: `minor` + `BREAKING:`)
  - consumer-visible change with no changeset
  - tree-shaking broken: module-level side effects, executing barrels, CSS imported from `.tsx`
  - SSR-unsafe: `window`/`document`/`localStorage` at module level or during render
  - new runtime dependency, or a heavy one outside its own subpath export
  - a11y: missing focus-visible ring, wrong roles/ARIA, label not associated, motion ignoring
    `prefers-reduced-motion`, contrast below WCAG AA
  - CSS outside `@layer motiv.*`, hard-coded colors/sizes instead of `--motiv-*` tokens
  - a red gate: `pnpm check`, `typecheck`, `test`, `build`, `check:package`, `build-storybook`
- **Deliberate conventions (not findings):**
  - plain CSS + BEM `motiv-*`; no Tailwind, CSS-in-JS or CSS modules
  - function components, named exports, ref as a prop (no `forwardRef`)
  - minimal code: no speculative props or variants; comments only for subtle mechanisms
  - user-visible strings are props with English defaults; no router/i18n/auth inside components
  - styles (e.g. `@driif/motiv/drawn`) are separate build-time entries with their own component
    sets and stylesheet; components of different styles are not expected to share markup
- **Reporting bar:** only what a consuming app or its users would hit. Taste, naming and "could be
  simpler" without a deletable unit are MINOR.
