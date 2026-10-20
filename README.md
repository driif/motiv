# @driif/motiv

React components with plain, themeable CSS. ESM only, tree-shakeable, server-render safe.

## Install

```sh
pnpm add @driif/motiv
```

`react` and `react-dom` 19+ are peer dependencies.

## Styles

Import the stylesheet once, at the app's entry or base layout:

```ts
import '@driif/motiv/styles.css';
```

- `@driif/motiv/base.css` — optional minimal reset and typography (`box-sizing`, body font and
  colors, heading font).
- `@driif/motiv/tokens.css` — the design tokens alone, for apps that only want the variables.

## Usage

```tsx
import { Button, Card, CardBody, CardFooter, CardHeader } from '@driif/motiv';

<Card>
  <CardHeader title="Users" description="Active this week" />
  <CardBody>128 people signed in.</CardBody>
  <CardFooter>
    <Button variant="outline">Export</Button>
    <Button>View all</Button>
  </CardFooter>
</Card>;
```

`Button` takes `variant` (`primary` · `secondary` · `outline` · `ghost` · `danger`), `size`
(`sm` · `md` · `lg`), `iconLeft`, `iconRight`, `loading` and every native `<button>` prop. It
defaults to `type="button"`.

Links stay the app's own — style them with `buttonClassName`:

```tsx
import { buttonClassName } from '@driif/motiv';
import { Link } from 'react-router';

<Link to="/settings" className={buttonClassName({ variant: 'outline' })}>
  Settings
</Link>;
```

## Drawn style

`@driif/motiv/drawn` is a hand-drawn style: `Link`, `TextField`, `Checkbox`, `Radio`,
`RadioGroup`, `Tabs`, `SegmentedControl`, `Select`, `NavItem`, `IconButton`, `IconButtonGroup`,
`MenuButton`, `ThemeToggle`, `OrbitalThemeToggle` and `Progress`. Its stylesheet is self-contained (tokens, base, drawn components and the bundled
Caveat font), so a drawn app imports it **instead of** `styles.css`, never alongside it:

```tsx
import '@driif/motiv/drawn.css';
import { Checkbox, Link, TextField } from '@driif/motiv/drawn';

<TextField label="Email" type="email" hint="We only use it to reply." />;
<Checkbox label="Send me the newsletter" />;
<Link href="https://example.com" external>
  Read the guide
</Link>;
```

`Link` takes `arrow` (default `true`), `external` (adds `target="_blank"` and
`rel="noopener noreferrer"`) and `externalLabel` (screen-reader text, default
`'(opens in a new tab)'`). `RadioGroup` takes `name`, `legend`, `options`, `value` and `onChange`.

`NavItem` renders an `<a>` when given `href` (pass a router's `onClick` alongside), otherwise a
`<button>`; `active` sets `aria-current="page"`. `MenuButton` (`open`, `onToggle`) and
`ThemeToggle` (`dark`, `onToggle`) are controlled; `ThemeToggle` never sets `data-theme` itself.
Icons are app-supplied `ReactNode`s.

## Theming

Everything is driven by `--motiv-*` custom properties, and all library CSS sits in
`@layer motiv.*`, so unlayered app CSS wins without `!important`.

```css
:root {
  --motiv-color-primary: #2563eb;
  --motiv-color-on-primary: #ffffff;
}
```

Dark mode: `<html data-theme="dark">`. Without `data-theme`, `prefers-color-scheme` applies.
The Storybook [**Docs/Theming**](src/docs/Theming.mdx) page lists every token and the component-level overrides.

## Astro

Components render to static HTML, no client directive needed unless you attach handlers:

```astro
---
import '@driif/motiv/styles.css';
import { Button } from '@driif/motiv';
---
<Button variant="secondary">Static button</Button>
```

Import the stylesheet in the base layout so every page gets it.

## Other frameworks

The look lives entirely in `styles.css`, so plain HTML, Vue or Svelte can use the classes directly:

```html
<button type="button" class="motiv-btn motiv-btn--primary motiv-btn--md">
  <span class="motiv-btn__label">Save</span>
</button>
```

## Development

```sh
pnpm check            # Biome
pnpm typecheck        # tsc
pnpm test             # Vitest
pnpm build            # dist/ (JS, d.ts, CSS)
pnpm check:package    # publint, attw, tree-shaking check
pnpm storybook        # docs on http://localhost:6006
```

## Releasing

Every change a consuming app can see gets a changeset: run `pnpm changeset` and describe it in
one line. On `main`, the release workflow opens a "Version Packages" PR; merging it publishes to
npm.
