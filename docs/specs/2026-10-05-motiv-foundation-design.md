# motiv foundation (v0.1) — design

## Goal

`@driif/motiv` is a personal React component library shared by several apps (React SPAs and
Astro sites). v0.1 proves the foundation: packaging, theming, tree-shaking, docs and release —
with two components, `Button` and `Card`. Everything else (ThemeToggle, Sidebar, UserMenu, Table,
dnd, overlays) comes in later milestones on top of this.

Success means: an app runs `pnpm add @driif/motiv`, imports `@driif/motiv/styles.css` once,
uses `<Button>`, and its bundle contains Button's code but not Card's.

## Decisions

| topic | decision |
|---|---|
| Framework | React ≥ 19 (peer dependency). Astro consumes the React components directly. |
| Other frameworks | CSS-first: every visual lives in `styles.css` under stable `motiv-*` classes, so Vue/Svelte/plain HTML can use the classes without React. No per-framework wrappers yet. |
| Package | `@driif/motiv`, public npm, ESM only. |
| Build | tsdown with `unbundle: true` (one output file per source module) + `.d.ts`; CSS bundled by Lightning CSS. |
| Styling | Plain CSS, BEM classes prefixed `motiv-`, all inside `@layer motiv`. No Tailwind, no CSS-in-JS, no CSS modules. |
| Theming | Semantic tokens only (no named color ramps); derived shades via `color-mix()`; per-component tokens with fallbacks. |
| Default look | openbao-dough: green primary, orange secondary, clean surfaces, pill buttons. Values only — any app replaces them. |
| Dark mode | `[data-theme="dark"]` on `<html>`; `prefers-color-scheme` applies when no `data-theme` is set. |
| Refs | React 19 ref-as-prop, no `forwardRef`. |
| Lint/format | Biome (single quotes, space indent, organize imports). |
| Tests | Vitest + Testing Library (jsdom); package checks with publint, attw, and a tree-shaking fixture. |
| Docs | Storybook 10 (React + Vite), light/dark toolbar, theming page. |
| Release | Changesets; GitHub Actions CI and release-to-npm workflow. |
| Not in v0.1 | Headless primitives library (Radix / React Aria / Base UI) — chosen when the first overlay component needs one. |

## Package layout

```
src/
  index.ts                     named re-exports only, no side effects
  styles/
    tokens.css                 base + derived tokens, light and dark
    base.css                   opt-in minimal reset / typography (separate export)
    index.css                  @layer order + @import of tokens and every component css
  utils/cx.ts                  class joiner: (...(string | false | null | undefined)[]) => string
  components/
    Button/  Button.tsx  Button.css  Button.test.tsx  Button.stories.tsx  index.ts
    Card/    Card.tsx    Card.css    Card.test.tsx    Card.stories.tsx    index.ts
```

`package.json`:

- `"type": "module"`, `"sideEffects": ["**/*.css"]`, `"files": ["dist"]`
- `exports`: `"."` → `dist/index.js` + `dist/index.d.ts`; `"./styles.css"` → `dist/styles.css`;
  `"./base.css"` → `dist/base.css`; `"./tokens.css"` → `dist/tokens.css`; `"./package.json"`.
- `peerDependencies`: `react`, `react-dom` `>=19`. No runtime dependencies in v0.1.

Later heavy entry points (`./table`, `./dnd`) are added as separate `exports` keys so their
dependencies never reach apps that do not import them.

## Theming

Three override levels; all library CSS lives in `@layer motiv`, so any unlayered app rule wins
without `!important`.

1. **Base tokens** on `:root` — the only color inputs:
   `--motiv-color-{primary,secondary,danger,success,warning}`,
   `--motiv-color-on-{primary,secondary,danger}` (text on filled backgrounds),
   `--motiv-color-{bg,surface,text,border}`, `--motiv-shadow-color`, `--motiv-radius`, `--motiv-space`,
   `--motiv-font-body`, `--motiv-font-title`, `--motiv-duration`, `--motiv-ease`.
   Dark values override only `bg`, `surface`, `text`, `border` (and may adjust accents).
2. **Derived tokens** computed from the base, e.g.
   `--motiv-color-primary-hover: color-mix(in oklch, var(--motiv-color-primary), var(--motiv-color-text) 15%)`,
   `--motiv-color-primary-subtle`, `--motiv-color-text-muted`, `--motiv-color-on-primary`,
   `--motiv-radius-{sm,md,lg,full}`, `--motiv-shadow-{sm,md}`, `--motiv-focus-ring`.
   Rebranding = overriding one base token; dark mode keeps working because derivations mix
   against current `bg`/`text`.
3. **Component tokens** read with fallbacks, e.g.
   `background: var(--motiv-btn-bg, var(--motiv-color-primary))`, so an app can restyle all
   buttons or one subtree by setting `--motiv-btn-*` on any ancestor.

Layer order is declared once in `index.css`: `@layer motiv.tokens, motiv.base, motiv.components;`.

## Components

### Button

```tsx
<Button variant="primary" size="md" iconLeft={<Icon />} iconRight={…} loading={false}>Save</Button>
```

- `ButtonProps extends ComponentProps<'button'>`; native props and `ref` pass through.
- `variant`: `primary` (default) · `secondary` · `outline` · `ghost` · `danger`.
- `size`: `sm` · `md` (default) · `lg`.
- `type` defaults to `"button"`.
- `loading`: renders a spinner, sets `aria-busy="true"` and `disabled`.
- Classes: `motiv-btn motiv-btn--{variant} motiv-btn--{size}` plus `className`.
- `buttonClassName({ variant?, size?, className? })` is exported so router links (or Astro/Vue
  markup) can look like buttons. No `to`/`href` prop, no router coupling.
- Focus-visible ring; disabled state uses `:disabled` and `[aria-disabled="true"]`;
  `prefers-reduced-motion` disables transitions.

### Card

```tsx
<Card variant="elevated" padding="md" interactive as="article">
  <CardHeader title="Users" description="Active this week" actions={<Button size="sm">…</Button>} />
  <CardBody>…</CardBody>
  <CardFooter>…</CardFooter>
</Card>
```

- `variant`: `elevated` (default) · `outlined` · `subtle`.
- `padding`: `none` · `sm` · `md` (default) · `lg`.
- `interactive`: hover lift + focus-visible ring.
- `as`: `'div'` (default) · `'section'` · `'article'` · `'li'`.
- `CardHeader` props: `title` (ReactNode), `titleAs?` (`h2`·`h3` default·`h4`·`p`),
  `description?`, `actions?`, plus div props.
  `CardBody` and `CardFooter` are div wrappers with classes.
- Classes: `motiv-card`, `motiv-card--{variant}`, `motiv-card--p-{padding}`,
  `motiv-card--interactive`, `motiv-card__header|__title|__description|__actions|__body|__footer`.

Both components are pure (no hooks, no browser APIs), so Astro renders them as static HTML.

## CSS build

- Lightning CSS bundles `src/styles/index.css` (resolving `@import`) → `dist/styles.css`,
  and copies `tokens.css` / `base.css` to `dist/`. Targets: last 2 years of browsers; native
  nesting allowed in source.
- Component `.css` files are **not** imported from `.tsx` — consumers import the stylesheet once.

## Verification

- `pnpm check` — Biome.
- `pnpm typecheck` — `tsc --noEmit`.
- `pnpm test` — Vitest component tests: variant/size classes, default `type`, `className`
  merge, ref + native prop passthrough, loading → `aria-busy` + disabled, `buttonClassName`
  output, Card `as`/padding/variant classes and header slots.
- `pnpm build` then `pnpm check:package`:
  - `publint` and `attw --pack --profile esm-only` pass;
  - tree-shaking fixture: bundling `import { Button } from '@driif/motiv'` (Rolldown/esbuild
    against `dist`) contains `motiv-btn` and not `motiv-card`.
- `pnpm build-storybook` succeeds.

## Release

- Changesets (`.changeset/`), `pnpm changeset` per user-visible change.
- `.github/workflows/ci.yml`: install, check, typecheck, test, build, check:package.
- `.github/workflows/release.yml`: changesets/action → version PR or `pnpm publish`
  (needs `NPM_TOKEN` or npm trusted publishing; set up by the user).
- `README.md`: install, import stylesheet, theming override examples, Astro usage.
