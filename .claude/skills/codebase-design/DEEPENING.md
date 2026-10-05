# Deepening

How to deepen a cluster of shallow modules safely, given its dependencies. Assumes the vocabulary in [SKILL.md](SKILL.md) — **module**, **interface**, **seam**, **adapter**.

## Dependency categories

When assessing a candidate for deepening, classify its dependencies. The category determines how the deepened module is verified across its seam.

### 1. In-process

Pure computation, in-memory state, no I/O — reducers, selectors, formatters, `sortRows`-style transforms, token-to-class mapping. Always deepenable: merge the modules and verify through the new interface directly (feed inputs, read outputs). No adapter needed.

### 2. Framework-substitutable

Dependencies with a first-class stand-in the framework already provides. In motiv the two big ones are:

- **The DOM / browser APIs** — jsdom (under Vitest + Testing Library) stands in for the browser: `matchMedia`, `localStorage`, focus and events. A component that touches them inside effects or handlers stays deep; tests stub the API, not a hand-rolled port. The seam is the browser's, not yours.
- **Headless libraries behind subpath exports** — TanStack Table, dnd-kit, the overlay primitives. They already run fine in jsdom; drive the wrapping component through its props and assert on the rendered result rather than injecting the library.

Deepenable when the stand-in exists. The seam is internal; don't add a port at the module's external interface just to reach it.

### 3. Remote but owned (Ports & Adapters)

Your own services across a network boundary. Define a **port** (interface) at the seam; the deep module owns the logic, the transport is an injected **adapter**. A test adapter is in-memory, production is HTTP/gRPC/queue.

This shape is **app-flavoured** — motiv components do no data fetching (CLAUDE.md: no app coupling), so a port here is the component's props: the app passes data and callbacks (`onSortChange`, `renderLink`), tests pass fakes. Reach for anything beyond props only when the props really can't express it.

Recommendation shape: *"Define a port at the seam, implement an HTTP adapter for production and an in-memory adapter for tests, so the logic sits in one deep module even though it's deployed across a network."*

### 4. True external (Mock)

Third-party services you don't control (the consuming app's router, auth, i18n or data layer). The deepened module takes the external dependency as an injected port — in a component library, a prop or slot — and the exercising code provides a mock/fake adapter.

## Seam discipline

- **One adapter means a hypothetical seam. Two adapters means a real one.** Don't introduce a port unless at least two adapters are justified (typically production + test-or-mock). A single-adapter seam is just indirection — the same over-abstraction `/writing-simple-code` warns against.
- **Internal seams vs external seams.** A deep module can have internal seams (private to its implementation) as well as the external seam at its interface. Don't expose an internal seam through the interface just because a check reaches for it.

## Verification strategy: replace, don't layer

"Verify" in motiv means: `pnpm typecheck` for the type-level contract, `pnpm check` (Biome) for lint/format, `pnpm test` (Vitest + Testing Library in jsdom) rendering the component through its public props, stories in Storybook for the visual states, and `pnpm check:package` when the change touches exports or module-level code.

Whatever the mechanism:

- Verify at the deepened module's interface. The **interface is the verification surface**.
- Assert on observable outcomes across the interface — the returned value, the rendered result, the mutation the user sees — not on internal state.
- When shallow modules are merged into a deep one, the old narrow checks that targeted the removed seams become waste. Replace them with checks at the new interface; don't keep both layers.
- Checks should survive internal refactors — they describe behaviour, not implementation. If a check has to change when the implementation changes, it was reaching past the interface.
