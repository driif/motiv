# motiv-site

The demo site for `@driif/motiv` at <https://motiv.fedorchuk.me>: a static Astro build with
React islands, one page per style (`/drawn/`, `/matrix/`, `/kinetic/`). The site shell and home page
load `drawn.css`; kinetic demos and the release screen live in bare, noindex preview pages that
load `styles.css` in isolated iframes. `/motiv/` redirects to `/kinetic/`.
Previews read the saved theme before paint, follow theme changes through storage events and report
their height with `ResizeObserver` so the iframe fits its content.

It consumes the library through `workspace:*`, so it demos the built `dist/` of this repo. Build
the library first:

```sh
pnpm build        # library → dist/
pnpm check:site   # every runtime export has a section in src/catalog.mjs
pnpm build:site   # site → site/dist/
pnpm --filter motiv-site dev
```

## Adding or changing a component

1. Write a short demo in `src/demos/<style>/<Name>.tsx`. The page shows this file as the snippet.
2. Add its section to `src/catalog.mjs` with every exported symbol it covers.
3. Render drawn demos in `src/pages/drawn/index.astro` as `<Section style="drawn" id="…">`
   with `client:visible`. Add a kinetic preview in `src/pages/preview/kinetic/` and a
   `<Section style="kinetic" id="…" />` on the kinetic page.

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
