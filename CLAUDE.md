# motiv — Claude Code Guidelines

`@driif/motiv` is a personal React component library published to npm and consumed by several
apps (React SPAs built with Rsbuild/Vite, and Astro sites). The code, docs, plans and agent
configuration all live in this one repo.

Spec of the current milestone: `docs/specs/2026-10-05-motiv-foundation-design.md`.
Plan: `docs/plans/2026-10-05-motiv-foundation.md`.

## Gates

`pnpm check` (Biome) · `pnpm typecheck` (tsc) · `pnpm test` (Vitest) · `pnpm build` ·
`pnpm check:package` (publint, attw, tree-shaking) · `pnpm build-storybook`.
A task is done when every gate it can affect is green.

## Collaboration

- **Investigate autonomously; discuss public-API decisions before implementing.** Read code, run
  gates and inspect sibling components without asking. A new component, a new prop, a renamed
  class or token, a changed default, a new `exports` entry or a new runtime dependency is public
  API — every consuming app sees it. Present concrete options, a recommendation and the tradeoff,
  then wait for the decision.
- **Carry an accepted approach through verification.** Routine implementation details and local
  fixes do not need repeated confirmation. Permission to run a tool is not agreement with a design
  choice.
- **Record corrections narrowly.** Preserve the user's distinction and its exceptions.

## Hard Constraints

- When reporting to me, be extremely concise and sacrifice grammar for concision.
- **Public API is a contract.** Exported components, props, `motiv-*` classes, `--motiv-*` tokens
  and `package.json#exports` are used by apps this repo cannot see. Removing or renaming any of
  them is a breaking change and needs a breaking changeset (see Releases).
- **No runtime dependencies without asking.** `react`/`react-dom` are peers. A heavy dependency
  (TanStack Table, dnd-kit, a headless primitives library) goes behind its own subpath export
  (`@driif/motiv/table`) so apps that do not import it never download it.
- **Tree-shaking must hold.** No side effects at module level, no barrel that executes code, no
  CSS import from `.tsx`. `pnpm check:package` proves it.
- **Server-render safe.** No `window`/`document`/`localStorage` at module level or during render —
  only inside effects or event handlers. Astro renders components on the server.
- **Self-contained components.** An interactive component works when dropped alone into an Astro
  island: no required app-level Provider, sensible defaults for every prop.
- **No app coupling.** No router, auth, i18n library or data fetching inside components. Links are
  rendered by the app (`buttonClassName`, `asChild`-style slots); user-visible strings are props
  with English defaults.
- **Plain CSS only.** BEM classes prefixed `motiv-`, every rule inside `@layer motiv.*`, colors and
  sizes only through `--motiv-*` tokens. No Tailwind, no CSS-in-JS, no CSS modules.
- **Accessibility is part of done.** Native elements first; focus-visible ring on every
  interactive element; correct roles and ARIA for custom widgets; `prefers-reduced-motion`
  respected. Overlays (dialog, menu, popover) are built on a headless primitives library — ask
  which one before the first.
- **React 19, function components, named exports.** Ref is a prop; no `forwardRef`, no class
  components, no default exports.
- **Write minimal code** — no premature abstractions, no speculative props or variants. A prop
  added for a hypothetical second app is public API that has to be supported forever. The
  `writing-simple-code` skill makes this operational.
- **Comment sparingly** — default is no comment. Write one only for a *mechanism* too subtle to
  read off the code or an *external constraint* (browser/library gotcha, spec reference). Cap: 2
  lines inline, 3 in a header. Full rule: `.claude/skills/writing-simple-code/references/comments.md`.
- **English everywhere** — code, comments, docs, commit messages, UI default strings.
- **Every component ships with** its `.css`, tests, stories and an entry in `src/index.ts` (or its
  subpath entry) and `src/styles/index.css`.
- **Dependencies:** `pnpm add` / `pnpm remove` change the lockfile and need network — ask first,
  unless the accepted plan names the package. Running scripts is always fine.
- **Never credit Claude/Anthropic** — no `Co-Authored-By` trailers naming Claude or Anthropic, no
  "Generated with Claude Code", no mention of either as co-author, in commits, PRs, reviews or
  issue comments. Enforced by `.claude/hooks/no-ai-attribution.sh`.

## Releases

Changesets drives versions. Close every task that changes what a consuming app sees (component,
prop, class, token, CSS, export, behavior) with a changeset: `pnpm changeset`, one English line
in consumer wording. While the package is 0.x: breaking change (removal/rename/changed default) =
`minor` with a summary starting `BREAKING:`, new API = `minor`, fix = `patch` — `major` would
jump to 1.0.0. From 1.0: breaking = `major`. Tooling, docs, stories and refactors without
visible change get none. Never bump `package.json#version` by hand — the release workflow does.
The `releasing` skill has the mechanics.

Commit subjects are Conventional Commits (`feat(button): …`, `fix(card): …`, `chore`, `docs`,
`test`, `build`, `ci`, `refactor`). Commit bodies at most four lines.

## Key Files

| Purpose | Path |
|---|---|
| Base + derived design tokens, light/dark | `src/styles/tokens.css` |
| Stylesheet entry (layer order, component imports) | `src/styles/index.css` |
| Opt-in reset / typography | `src/styles/base.css` |
| Public JS entry | `src/index.ts` |
| Components (`.tsx`, `.css`, tests, stories) | `src/components/<Name>/` |
| JS build (unbundled ESM + d.ts) | `tsdown.config.ts` |
| CSS build (Lightning CSS) | `scripts/build-css.mjs` |
| Tree-shaking proof | `scripts/check-treeshake.mjs` |
| Theming docs | `src/docs/Theming.mdx` |
| Code review severity contract | `.claude/code-review-contract.md` |
| Specs / plans / ADRs | `docs/specs/`, `docs/plans/`, `docs/adr/` |

## Inspiration (read-only)

Components are often extracted from the user's apps. Read them, never edit them:

- `~/Documents/dev/openbao-dough` — theme toggle, sidebar + menu items (React, plain CSS).
- `~/Documents/dev/komura/duva` — Table (TanStack), Sortable (dnd-kit), Select, MultiSelect,
  IconButton, Badge, HeroCard, Toggle, Pagination, toasts.
- `~/Documents/dev/my/fedorosya/crochet-ui` — Astro app; glass surfaces, token scale.

When extracting: drop router/auth/i18n coupling, replace German strings with English prop
defaults, replace SVGR icon imports with inline SVG or icon props, fix accessibility gaps.

## Project Tooling

- `docs/tasks/` — duo round records (gitignored).
- `.agents/skills/` — Codex entrypoints that load `.claude/skills/` (see `docs/codex-compatibility.md`).
