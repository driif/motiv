---
name: resolving-merge-conflicts
description: Resolve an in-progress git merge or rebase conflict, preserving both sides' intent. Use when a merge/rebase has stopped with conflict markers, when the user asks to resolve conflicts, or mentions a conflicting merge/rebase.
---

Resolve the conflict; never `git merge --abort` / `git rebase --abort` to dodge it.

1. **See the current state.** Which operation is in flight (merge or rebase), which branch onto which, and which files conflict. Read the conflicting hunks.

2. **Find the primary source of each conflict.** Understand *why* each side changed — read both sides' commit messages, and the PR/issue behind them. Check whether either side changed public API (props, classes, tokens, `exports`) — the resolution must keep the contract both sides' changesets describe.

3. **Resolve each hunk.** Preserve both intents where they compose. Where they genuinely conflict, keep the side matching the merge's stated goal and note the trade-off. Do not invent new behaviour.

4. **Run the repo's verification loop** and fix anything the merge broke: `pnpm check`, `pnpm typecheck`, `pnpm test`, `pnpm build` — plus `pnpm check:package` if `exports`, entries or module-level code were in the conflict.
   - **Generated output** (`dist/`, `storybook-static/`): never resolve by hand — take either side and rebuild.
   - **`package.json` / `pnpm-lock.yaml`:** resolve `package.json`, then leave the lockfile regeneration (`pnpm install`, needs network) to the user.
   - **`.changeset/*.md`:** keep both sides' changesets; don't merge them into one.
   - **`package.json#version` / `CHANGELOG.md`:** the release workflow owns these — prefer the target branch's side.

5. **Finish the operation.** Stage the resolved files and continue: `git merge --continue` or `git rebase --continue` until every commit is applied. The completing commit carries no Claude/Anthropic co-author trailer.
