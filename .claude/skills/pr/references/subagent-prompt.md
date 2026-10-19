# Analysis Subagent Prompt

Launch with `subagent_type: "general-purpose"`, filling the placeholders:

```
You are reviewing PR #<number> for <repo>.

**PR metadata:**
- Title: <title>
- Description: <body>
- Files: <file list from Phase 1>
- Discussion summary: <from Phase 1>

**Worktree location:** /tmp/pr-review-<number>
**Repo location:** <repo_path>

**Finding contract (read FIRST):**
Read `<repo_path>/.claude/code-review-contract.md` in full. It defines the severity
taxonomy, the promotion test, the evidence rules, and what is not a finding in this repo.
Every finding is one line shaped `SEVERITY: file:line — description`; untagged = MINOR.
MINOR is the correct home for taste, style and "could be simpler".

**Scope:** what this PR introduces or makes worse. Untouched pre-existing code is out of scope.

**Tasks (do all):**

1. **Read changed files** in full from the worktree. Compare what the code does with what
   the description claims.

2. **Run every gate** from the worktree (deps installed), in order, recording pass/fail and
   the first error: `pnpm check` · `pnpm typecheck` · `pnpm test` · `pnpm build` ·
   `pnpm check:package` · `pnpm build-storybook`. A red gate is MAJOR. Never run
   `pnpm add`/`remove` or edit the lockfile.

3. **Architecture analysis:**
   - Over-engineering (needless abstraction, premature generalization)
   - Pattern violations vs the existing codebase
   - Library contracts (MAJOR list in the contract): public API removed/renamed without a
     breaking changeset (0.x: `minor` + `BREAKING:`; ≥1.0: `major`), missing changeset,
     tree-shaking (module-level side effects, CSS from `.tsx`), SSR safety, new runtime dep
     outside a subpath entry, app coupling (router, i18n, Provider)
   - Accessibility: focus-visible ring, role/ARIA, keyboard, `prefers-reduced-motion`
   - CSS: `motiv-` BEM, every rule in `@layer motiv.*`, values via `--motiv-*` tokens
   - Error handling and security
   - Tests: new behavior without a Vitest + Testing Library test, assertion-free tests,
     missing stories for a new component or variant

4. **Scope creep** — categorize each file: Core / Supporting / Related cleanup / Unrelated.

**Leave the worktree in place.**

**Return:**
- **Functionality**: 3-5 sentences
- **Key decisions**: notable implementation choices
- **Validation results**: gate pass/fail, lint issues, race conditions
- **Findings**: under `### CRITICAL`, `### MAJOR`, `### MINOR` (skip empty), one line each:
  `<lens>: file:line — description`, lens ∈ correctness / architecture / over-engineering /
  scope-creep. Every CRITICAL/MAJOR carries its failure scenario (input → wrong outcome).
- **Total**: `Total: <N> findings (<C> critical, <M> major, <m> minor)`
- **Open questions**: design decisions needing user input

Use file:line references. Problems only, no positives.
```
