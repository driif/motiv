# motiv-site

The demo site for `@driif/motiv` at <https://motiv.fedorchuk.me>: a static Astro build with
React islands, one page per style (`/drawn/`, `/matrix/`, `/motiv/`). Each page imports only its
own stylesheet; `drawn.css` and `styles.css` never load together.

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
3. Render it in `src/pages/<style>/index.astro` as `<Section style="…" id="…">` with
   `client:visible`.

## Version

The header shows `version` from `@driif/motiv/package.json`. The site deploys only when a release
publishes, so it always matches the package on npm.

## Cloudflare

Deployed by `.github/workflows/release.yml` after changesets publishes: `pnpm build:site`, then
`wrangler deploy`. `wrangler.jsonc` at the repo root serves `site/dist` as static assets.
Workers Builds (the Cloudflare Git integration) stays disconnected, or it would deploy every push.

Repository secrets: `CLOUDFLARE_API_TOKEN` (template "Edit Cloudflare Workers"),
`CLOUDFLARE_ACCOUNT_ID`.

Custom domain: `motiv.fedorchuk.me`.
