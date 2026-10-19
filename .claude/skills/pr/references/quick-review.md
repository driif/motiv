# Quick Review Path

Diff and metadata only. No worktree, no subagent, no gates run.

## Q1. Summarize

```bash
gh pr diff <number>
```

- **What**: 2-3 sentences on what the PR does
- **Why**: from the body, linked issues, or inferred
- **Size**: +/- across N files — small/medium/large
- **Files**: grouped (code, tests, config, docs)

## Q2. Flag obvious issues

Detectable without full file context:

- Obvious bugs (null access, off-by-one), missing error handling in new code
- TODO/FIXME/HACK added
- New prop, state or interaction without a `*.test.tsx` change
- Missing changeset (`.changeset/*.md`) for a consumer-visible change, or a mismatched bump level
- Public API removed/renamed in `src/index.ts`, a subpath entry, `package.json#exports`, a
  `motiv-*` class or a `--motiv-*` token
- `window`/`document`/`localStorage` at module level or in render; CSS import in a `.tsx`
- New entry under `dependencies`
- Unrelated changes mixed in

Tag each per `.claude/code-review-contract.md`. Quick mode reads hunks, not files, so anything
not backed by surrounding code is MINOR. If nothing CRITICAL/MAJOR turns up, say so.

## Q3. Draft

Go to Phase 5 in `SKILL.md`; all its rules apply.
