# motiv

`@driif/motiv`: personal React component library on npm, consumed by React SPAs and Astro sites
this repo cannot see. Current spec: `docs/specs/2026-10-05-motiv-foundation-design.md`, plan:
`docs/plans/2026-10-05-motiv-foundation.md`.

## Working agreement

- Done = every gate the task can affect is green: `pnpm check`, `typecheck`, `test`, `build`,
  `check:package`, `build-storybook`.
- Investigate and verify autonomously. **Public API** (component, prop, `motiv-*` class,
  `--motiv-*` token, default, `exports` entry, runtime dep) → present options + recommendation,
  wait for the decision. Continue an accepted approach without re-asking. Tool approval ≠ design
  agreement.
- Record corrections narrowly; keep the user's distinctions and exceptions.
- Reports: extremely concise, grammar optional.
- English everywhere: code, comments, docs, commits, UI default strings.

## Hard constraints

- Removing/renaming public API is breaking → breaking changeset.
- No runtime deps without asking; `pnpm add`/`remove` need approval unless the plan names the
  package. Heavy deps (TanStack Table, dnd-kit, headless primitives) go behind a subpath export.
- Tree-shakable: no module-level side effects, no executing barrels, no CSS import from `.tsx`.
- SSR safe: no `window`/`document`/`localStorage` at module level or in render.
- Self-contained: works alone in an Astro island, no required Provider, defaults for every prop.
- No app coupling: no router/auth/i18n/data fetching; links via `buttonClassName`/`asChild`
  slots; user-visible strings are props with English defaults.
- Plain CSS: BEM `motiv-*`, every rule in `@layer motiv.*`, colors/sizes only via `--motiv-*`.
  No Tailwind, CSS-in-JS or CSS modules.
- Accessibility is part of done: native elements first, focus-visible ring, correct ARIA,
  `prefers-reduced-motion`. Overlays use a headless primitives library — ask which before the first.
- React 19 function components, named exports, ref as prop. No `forwardRef`, classes, default
  exports.
- Minimal code, no speculative props/variants — see `writing-simple-code` skill. Comments only
  for subtle mechanisms or external constraints, ≤2 lines inline
  (`.claude/skills/writing-simple-code/references/comments.md`).
- Every component ships `.css`, tests, stories, and entries in `src/index.ts` (or subpath entry)
  and `src/styles/index.css`.
- Never credit any AI agent (Claude, Anthropic, Codex, OpenAI) in commits, PRs, reviews or
  comments — no co-author trailers, no "generated with".

## Releases

Consumer-visible change → `pnpm changeset`, one English line in consumer wording. Pre-1.0:
breaking = `minor` with `BREAKING:` summary, new API = `minor`, fix = `patch`. Never bump
`version` by hand. Conventional Commit subjects, body ≤4 lines. Details: `releasing` skill.

## Inspiration (read-only, never edit)

- `~/Documents/dev/openbao-dough` — theme toggle, sidebar + menu items.
- `~/Documents/dev/komura/duva` — Table, Sortable, Select, MultiSelect, IconButton, Badge,
  HeroCard, Toggle, Pagination, toasts.
- `~/Documents/dev/my/fedorosya/crochet-ui` — Astro; glass surfaces, token scale.

When extracting: drop router/auth/i18n, German strings → English prop defaults, SVGR imports →
inline SVG or icon props, fix a11y gaps.

## Agent tooling

- Skills: `.claude/skills/` (Codex entrypoints in `.agents/skills/`, adaptations in
  `docs/codex-compatibility.md`).
- Reviews: read `.claude/code-review-contract.md` before reporting findings.
- `docs/tasks/` — duo round records (gitignored).
