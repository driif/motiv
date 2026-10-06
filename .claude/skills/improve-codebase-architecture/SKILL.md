---
name: improve-codebase-architecture
description: Scan the motiv codebase for deepening opportunities, present them as a visual HTML report, then grill through whichever one you pick.
disable-model-invocation: true
---

# Improve Codebase Architecture

Surface architectural friction and propose **deepening opportunities** — refactors that turn shallow modules into deep ones. The aim is AI-navigability and verifiability: a module an agent can reason about in one place, and whose behaviour is confirmable through motiv's real loop (see below).

**Scope one run to one area.** When the library is large, pick an area at the start — one component family under `src/components/`, a subpath entry (`@driif/motiv/table`), or the styles/token layer in `src/styles/` — and stay inside it. The consuming apps are out of scope: their usage is evidence, not a refactor target.

This command is _informed_ by the project's domain model and built on a shared design vocabulary:

- Run the `/codebase-design` skill for the architecture vocabulary (**module**, **interface**, **depth**, **seam**, **adapter**, **leverage**, **locality**) and its principles (the deletion test, "one adapter = hypothetical seam, two = real"). Use these terms exactly in every suggestion — reach for one of them before "component," "service," "API," or "boundary."
- The domain language in `CONTEXT.md` gives names to good seams; ADRs in `docs/adr/` record choices this command should not re-litigate. `/domain-modeling` owns the mechanics of `CONTEXT.md` and ADRs — defer to it.

## motiv's verification loop

"What survives" means:

- **Typecheck** — `pnpm typecheck`. The interface is what the type-checker and the next agent navigate: a deep module has a narrow, well-typed interface over a rich implementation.
- **Biome** — `pnpm check`, lint/format.
- **Tests** — `pnpm test`, Vitest + Testing Library rendering components through their public props.
- **Stories and package checks** — `pnpm build-storybook` for the visual states, `pnpm check:package` (publint, attw, tree-shaking) when exports or module-level code move.

Public API — exported components, props, `motiv-*` classes, `--motiv-*` tokens, `package.json#exports` — is a contract with apps this repo can't see. A deepening that changes it is a breaking change; say so on the card.

## Process

### 1. Explore

Read `CONTEXT.md` and any ADRs in the area you're touching first.

Then walk the scoped area — fan out with the `dispatching-parallel-agents` skill when the surface is large. Explore organically and note where you experience friction:

- Where does understanding one concept require bouncing between many small modules?
- Where are modules **shallow** — interface nearly as complex as the implementation?
- Where have helpers been extracted for tidiness, yet the real bugs hide in how they're called (no **locality**)?
- Where do tightly-coupled modules leak across their seams?
- Which parts are hard to typecheck-verify, hard to exercise in a test or story, or hard for an agent to navigate through their current interface?

Apply the **deletion test** to anything you suspect is shallow: would deleting it concentrate complexity, or just move it? A "yes, concentrates" is the signal you want.

### 2. Present candidates as an HTML report

Write a self-contained HTML file to the OS temp directory so nothing lands in the repo. Resolve the temp dir from `$TMPDIR`, falling back to `/tmp`, and write to `<tmpdir>/architecture-review-<timestamp>.html` so each run gets a fresh file. Open it with `open <path>` and tell the user the absolute path.

The report uses **Tailwind via CDN** for layout and **Mermaid via CDN** for graph-shaped diagrams. This is a throwaway temp report, not product UI — the CDNs and inline scaffold are fine here. (Product UI is a different job: it follows `/frontend-design` and the tokens in `src/styles/tokens.css`.) Mix Mermaid with hand-crafted CSS/SVG — Mermaid when relationships are graph-shaped (call graphs, dependencies, sequences), hand-built divs/SVG when you want something editorial (mass diagrams, cross-sections, collapse animations). Each candidate gets a **before/after visualisation**. Be visual.

Render one card per candidate and end with a **Top recommendation** section (which candidate you'd tackle first, and why). The card's fields, badges, and before/after diagram are specified in [HTML-REPORT.md](HTML-REPORT.md) — follow it there. The wins each card claims are framed in `/codebase-design` terms (locality, leverage) plus how the change tightens motiv's verification loop: a narrower interface to typecheck, one interface for the tests to render, one place for the next agent to read.

**Use CONTEXT.md vocabulary for the domain, and the `/codebase-design` vocabulary for the architecture.** If `CONTEXT.md` defines "Variant," talk about "the Variant resolution module" — not "the FooBarHandler," and not "the Variant service."

**ADR conflicts**: if a candidate contradicts an existing ADR in `docs/adr/`, surface it only when the friction is real enough to warrant revisiting the decision. Mark it clearly in the card (an amber warning callout: _"contradicts ADR-0007 — but worth reopening because…"_). Don't list every theoretical refactor an ADR forbids.

See [HTML-REPORT.md](HTML-REPORT.md) for the full HTML scaffold, diagram patterns, and styling guidance.

Hold interface proposals until step 3. After the file is written, ask the user: "Which of these would you like to explore?"

### 3. Grilling loop

Once the user picks a candidate, run the `/grilling` skill to walk the design tree with them — constraints, dependencies, the shape of the deepened module, what sits behind the seam, and how you'd confirm it (which typecheck/Biome/test/story checks survive the change).

Side effects happen inline as decisions crystallize — run the `/domain-modeling` skill to keep the domain model current as you go:

- **Naming a deepened module after a concept not in `CONTEXT.md`?** Add the term via `/domain-modeling`.
- **Sharpening a fuzzy term during the conversation?** Update `CONTEXT.md` right there via `/domain-modeling`.
- **User rejects the candidate with a load-bearing reason?** Offer an ADR, framed as: _"Want me to record this as an ADR in docs/adr/ so future architecture reviews don't re-suggest it?"_ Offer only when the reason would actually be needed by a future explorer to avoid re-suggesting the same thing — skip ephemeral reasons ("not worth it right now") and self-evident ones. `/domain-modeling` owns the format.
- **Want to explore alternative interfaces for the deepened module?** Run the `/codebase-design` skill and use its design-it-twice parallel sub-agent pattern.
