# Code Review Contract

The shared severity taxonomy and evidence rules for every review path in motiv: the `pr` skill,
the `duo` skill's review stages (crossreview and final review), and revmux runs over this repo.
Read it before reporting findings so that one severity word means the same thing in all of them.

`CRITICAL`, `MAJOR`, and `MINOR` are severity labels throughout this document and in the review
prompts. They are never emphasis.

## Report everything, filter later

Report every real problem you find, each with a severity label. Do not suppress low-severity
findings at the reporting stage — a reviewer told to report only serious issues reports less of
everything, including the serious ones. The filter belongs downstream, and each consumer applies
its own:

- The `duo` review stages treat CRITICAL and MAJOR as blocking (crossreview `revise`, final review
  `blocking`), and MINOR as non-blocking (a finding the implementer may defer, final review
  `residual`).
- revmux reports all three; the caller fixes CRITICAL and MAJOR and lists MINOR as deferred.
- The `pr` skill posts CRITICAL and MAJOR to GitHub, and shows MINOR in the terminal only.

So a MINOR finding costs a line of output, never a wasted fix. Label it and move on.

The one exception is a finding that cannot actually happen — see **The realistic-trigger
test**. Those are dropped, not labelled.

## Severity

Each finding is one line:

```
SEVERITY: file:line — description — evidence
```

A finding with no severity label is treated as MINOR. Label deliberately.

**CRITICAL** — a crash, data loss, a security hole, or a published release that breaks consuming
apps. Reserved for harm that outlives the session: a wrong render in one story is not CRITICAL, a
broken `exports` map or a missing `dist/` file in a version that reaches npm is.

**MAJOR** — any of:

- A failure scenario that reaches: a concrete prop combination, user action or consumer setup
  leading to a wrong result, an exception, or broken UI. Name the input and the outcome.
- A whole unit shipped with no consumer, where the fix is to delete that unit: a prop threaded
  through several files and discarded at the leaf, an abstraction with one implementation,
  plumbing behind a TODO that did not ship, CSS for a modifier no component sets, a second code
  path with no callers.
- A red gate — `pnpm check`, `pnpm typecheck`, `pnpm test`, `pnpm build`, `pnpm check:package` or
  `pnpm build-storybook` failing. MAJOR regardless of which branch introduced it, because it
  blocks everyone.
- A library contract broken. Each of these reaches every consuming app, so the trigger is the
  consumer, not a click path:
  - **Breaking public API without a breaking changeset** (0.x: `minor` + `BREAKING:` summary; ≥1.0: `major`) — an export, prop, `motiv-*` class,
    `--motiv-*` token, prop default or `package.json#exports` entry removed or renamed.
  - **Tree-shaking broken** — a module-level side effect, a barrel that executes code, a CSS
    import from a `.tsx` file.
  - **SSR-unsafe browser access** — `window`, `document`, `localStorage` or similar read at module
    level or during render, which throws when Astro renders the component on the server.
  - **A new runtime dependency outside a subpath entry** — every app pays for it whether or not
    it imports the component.
  - **Missing accessibility basics on an interactive component** — no focus-visible ring, a wrong
    or missing role, a keyboard trap, an element that cannot be reached or operated by keyboard.
  - **Missing changeset for a consumer-visible change** — MAJOR because the release workflow
    reads changesets to version and publish; without one the change ships silently or not at
    all.
- Missing tests for new or changed component behavior — a new prop, state, keyboard interaction
  or variant with no Vitest + Testing Library test exercising it.

**MINOR** — everything smaller: a one-line collapse, a droppable `useMemo` or options object, a
naming or local-shape preference, anything whose entire fix is a rename, a comment, or an
extraction. Most findings land here, and that is the expected distribution, not a sign the review
was shallow.

### The promotion test

A finding is MAJOR only if you can attach one of these to it:

1. A failure scenario that reaches — concrete input or action → wrong output, crash, or broken UI.
2. A whole deletable unit with no consumer.
3. A red gate, one of the library contracts listed under MAJOR, or new component behavior with no
   test — named specifically (which gate, which contract, which behavior).

If none attaches, it is MINOR. Test quality beyond that — an assertion you would phrase
differently, a test that could be split — is MINOR. In particular: "this is confusing", "this could be simpler",
"this should be extracted", and "this name is wrong" are MINOR however strongly you feel about
them. Severity tracks consequence, not conviction.

### The realistic-trigger test

A CRITICAL or MAJOR finding also has to be reachable through the public API. Name the trigger
concretely: the props a consumer passes, the key a user presses, the environment the component
renders in (server render in Astro, an island with no Provider, a React SPA). If the trigger only
exists in principle, drop the finding — this is the one place where a finding is not reported at
all rather than labelled MINOR, because a hypothetical has no consequence to track.

Triggers that do not count:

- **Simultaneity.** A component unmounting between two statements, two state updates resolving
  in an order React does not produce. A race is a finding only where the code itself sequences
  two operations wrongly and one user hits it.
- **Props the types forbid.** `null` for a prop typed non-nullable, a string outside a union the
  TypeScript types declare. The exported types are the contract; a consumer that casts around
  them owns the result.
- **States the component cannot reach.** A combination no prop path produces, a branch reachable
  only by editing React state in the devtools.
- **Volume and environment.** Ten thousand rows, a 4 KB label, a browser outside the supported
  range, a missing API every supported browser has — unless the spec or an ADR names that scale.

The heuristic: if the fix is a guard whose only purpose is to make the hypothetical safe, you found
a hypothetical. One reachable bug is worth twenty of them.

## Evidence

Every claim that something is unused — "no callers", "never triggers", "dead", "unreachable" —
must cite what you searched and what you read, in the finding line. Grep counts alone are not
evidence; open the nearest consumer and read it. A claim with no citation does not get reported.

"Unused inside this repo" is not "unused": anything exported from `src/index.ts` or a subpath
entry, every `motiv-*` class and every `--motiv-*` token is consumed by apps this repo cannot see.
Only internal, non-exported code can be called dead from a repo search.

Read changed files in full rather than judging from diff hunks. A default-only prop cannot be
identified from a hunk — it needs the leaf that consumes it.

Related files are evidence, not review targets. A file the branch did not change becomes a
finding only if the branch made it worse: the branch added the prop you now want deleted, or left
the old path dead.

## Scope

Report only what this branch introduces or makes worse. Pre-existing clutter in files the branch
does not touch is a separate cleanup task, however tempting.

Report problems only. No positive observations, no summary of what the branch does well — the
author knows what they built.

Complexity a plan explicitly requires is not a finding. Neither is a decision recorded in
a spec under `docs/specs/`, a plan under `docs/plans/` or an ADR under `docs/adr/`; those were
settled deliberately and a review is not the place to re-litigate them.

## Not a finding in this repo

- **Build output.** `dist/` and `storybook-static/` regenerate from source. Flag the source file,
  never the output.
- **Formatting and lint that Biome owns.** If `pnpm check` passes, the formatting is correct by
  definition. A per-line `// biome-ignore` is a finding, because project policy is to fix the code
  or adjust `biome.json` globally.
- **New abstractions you would prefer.** Do not propose layout wrappers, shared hooks, or
  configurable primitives. Do not propose an extraction unless the same 5–10 line block appears
  byte-identical at three or more sites. **One exception: presentational primitives** — see
  "One element, two implementations" below, which is a finding at two sites, not three.
- **Speculative props or variants.** Do not ask for a prop, variant or option "an app might
  need". New public API is a decision for the user, not a review fix.
- **Lockfile and dependency changes.** `pnpm add` / `remove` belong to the user; a review does
  not ask for them. A dependency the branch added without the plan naming it is a finding
  (see MAJOR); asking for a new one is not.

## One element, two implementations

A reportable finding, at **two** sites rather than three, and the one case where proposing an
extraction is in scope. It fires when two components render the same design-system element — a
list row, a toolbar, a card surface, a focus ring — each with its own markup and its own CSS, and
their padding, gap, border, hover or type have drifted apart. Name both files, both values and the
`--motiv-*` token the unified one should use.

```
MINOR: src/components/Select/Select.css:18 — option row padding is var(--motiv-space-2) here and
a literal 0.75rem in MultiSelect.css:24 — same element, two stylesheets, visibly different row
heights between the two components
```

Severity is MINOR by default, because the fix is an extraction. Promote to MAJOR only when the two
copies are visible at once and disagree, since that ships an inconsistency the user sees.

Not this finding: two components that merely resemble each other while representing different
concepts, and a second call site that reuses the shared element correctly.

## Comments the branch added

A comment that passes neither test in `.claude/skills/writing-simple-code/references/comments.md`
— mechanism, or a constraint that lives outside this file — is deleted, not reported. It is not a
finding at any severity: a severity buys a place in the fix queue, and a comment deletion does not
need one.

- A reviewer that can edit (the `duo` implementer acting on a review, a revmux caller applying
  fixes) sweeps the comments this branch added in the same change as its fixes, and says how many
  it deleted in one line.
- A reviewer that only reports (the `pr` skill, the `duo` review stages, revmux reviewers) lists
  them as one grouped MINOR line naming the files, never one line per comment.

The same rule binds the reviewer's own output: a fix does not get a comment explaining itself. What
changed and why goes in the commit body, the changeset, an ADR, or the PR description.

## Product questions

An unfinished feature is a decision, not dead code. When the fix depends on what the library
should offer — ship this prop or delete the plumbing, keep a default or change it in a major —
label the line `PRODUCT-QUESTION` and put it to the user. Do not silently pick a side.
