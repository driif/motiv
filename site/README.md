# motiv-site

The demo site for `@driif/motiv` at <https://motiv.fedorchuk.me>: a static Astro build with
React islands. The home page groups components by use case. Each style has an overview page
(`/kinetic/`, `/drawn/`, `/matrix/`: showcase, token playground, getting started) and one page per
component at `/<style>/<slug>/`, generated from `src/catalog.mjs` by `src/pages/[style]/[slug].astro`.
A category's sections in one style stack on its page as variants. The sidebar groups pages by use
case and filters them as you type (⌘K / Ctrl+K focuses it); on narrow screens it opens from the
menu button. Each demo has Preview and Code tabs and a copy button. Old `/<style>/#<section-id>`
links redirect to the component page, and `/motiv/` redirects to `/kinetic/`.

Demos render in bare, noindex preview pages (`src/pages/preview/<style>/<id>.astro`) with that
style's stylesheet, inside iframes, because styles override `:root` tokens and share class names.
Previews read the saved theme before paint, follow theme changes through storage events and report
their height with `ResizeObserver` so the iframe fits its content.

It consumes the library through `workspace:*`, so it demos the built `dist/` of this repo. Build
the library first:

```sh
pnpm build        # library → dist/
pnpm check:site   # every runtime export has a section, every section a page
pnpm build:site   # site → site/dist/
pnpm --filter motiv-site dev
```

## Adding or changing a component

1. Write a short demo in `src/demos/<style>/<Name>.tsx`. The Code tab shows this file.
2. Add a preview page `src/pages/preview/<style>/<id>.astro` rendering it with `client:load`.
3. Add its section to `src/catalog.mjs` with every exported symbol it covers and its `category`, or
   `category: null` plus a use-case `group` for a style-specific component. The page and sidebar
   entry follow. `pnpm check:site` checks coverage; `pnpm check:site-size` budgets every page.

## Version

The header shows `version` from `@driif/motiv/package.json`. The site deploys only when a release
publishes, so it always matches the package on npm.

## Cloudflare

Workers Builds (Git integration). After changesets publishes, `.github/workflows/release.yml`
pushes the released commit to the `site` branch; Cloudflare builds and deploys only that branch.
`wrangler.jsonc` at the repo root serves `site/dist` as static assets.

| Setting                      | Value                           |
| ---------------------------- | ------------------------------- |
| Production branch            | `site`                          |
| Non-production branch builds | off                             |
| Root directory               | `/`                             |
| Build command                | `pnpm build && pnpm build:site` |
| Deploy command               | `npx wrangler deploy`           |
| Environment variable         | `NODE_VERSION=24`               |

Custom domain: `motiv.fedorchuk.me`.
