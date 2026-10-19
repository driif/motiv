---
name: pr
description: Review a GitHub PR or issue — analyzes architecture, verification, test coverage, and scope creep, weighs discussion history, then drafts a review or issue comment. Use when the user wants to review or check a PR, or comment on an issue.
argument-hint: '<pr-or-issue-number>'
allowed-tools: Bash, Read, Grep, Glob, Write, Skill, AskUserQuestion, Task
---

# PR Review

```
0. PR or issue? Issue → references/issue-flow.md, done
1. Fetch metadata, discussion, merge status → summary
1.5 Ask mode: Full (default) or Quick
Full:  2. worktree + analysis → 3. verify CRITICAL/MAJOR, present → 4. open questions → 5. draft
Quick: references/quick-review.md → 5. draft
```

## Severity

Read `.claude/code-review-contract.md` before reviewing — taxonomy (CRITICAL / MAJOR / MINOR),
promotion test, evidence rules, non-findings. Applies in both modes.

- **Only CRITICAL and MAJOR reach the posted comment.** MINOR is shown in the terminal and stops
  there. A clean-but-nitty PR gets "LGTM".
- **Untagged = MINOR.** Tag deliberately.

## Phase 0: PR or Issue

URL with `/pull/` or `/issues/` decides; for a bare number:
```bash
gh pr view <number> --json number 2>/dev/null && echo "PR" || echo "ISSUE"
```
Issue → follow `references/issue-flow.md` and stop.

## Phase 1: Metadata and Discussion

No number in `$ARGUMENTS` → `gh pr list --limit 5 --state all` and ask.

```bash
gh pr view <number> --json title,body,additions,deletions,changedFiles,files,author,state,headRefName
gh pr view <number> --json mergeable,mergeStateStatus,statusCheckRollup
gh api repos/{owner}/{repo}/issues/<number>/comments --jq '.[] | "[\(.user.login)] \(.body)"'
gh api repos/{owner}/{repo}/pulls/<number>/comments --jq '.[] | "[\(.user.login) on \(.path):\(.line // .original_line)]\n\(.body)\n---"'
gh api repos/{owner}/{repo}/pulls/<number>/reviews --jq '.[] | "[\(.user.login) - \(.state)] \(.body)"'
```

- Inline comments carry the real feedback (incl. `suggestion` blocks); review bodies are often
  just summaries.
- Bot reviews (Copilot etc.) can hold real findings — verify and keep the valid ones.
- Track raised vs addressed vs still open; only new or unaddressed concerns go in the draft.
- CONFLICTING or BEHIND can explain "deletions" that are really missing base commits — note early.

Print:
```
PR #<number>: <title>
Author: <author> | State: <state>
+<additions>/-<deletions> across <changedFiles> files
Merge status: <mergeable> | <mergeStateStatus>
CI: <pass/fail summary>
Discussion: <N> comments, <M> reviews
- Resolved: …
- Open: …
```

## Phase 1.5: Mode

```
question: "Review mode for PR #<number>?"
header: "Mode"
options:
  - Full review (Recommended) — worktree, gates, architecture, scope creep
  - Quick review — diff-only, summarize what/why/size, flag obvious issues
```

## Phase 2: Deep Analysis

Worktree (keeps the main checkout's branch put — never `gh pr checkout`):
```bash
git fetch origin pull/<number>/head:pr-<number>
git worktree add "/tmp/pr-review-<number>" pr-<number>
pnpm -C "/tmp/pr-review-<number>" install --frozen-lockfile --prefer-offline
```
Install fails on an out-of-sync lockfile → MAJOR finding; skip gates needing deps.

~15+ changed files or a diff too big to pull in whole → **one** subagent with
`references/subagent-prompt.md`; only its condensed report enters this context. Smaller PR →
do the same tasks directly. Never a second subagent to re-check the first.

## Phase 3: Verify and Present

Every CRITICAL/MAJOR gets posted under the user's name: read the code at each file:line and
check the failure scenario actually reaches. Keep, downgrade to MINOR, or drop — say which and
why. MINOR needs no confirming.

Present grouped by severity, ending with the `Total:` line, then:
```
question: "How would you like to proceed?"
header: "Continue?"
options:
  - Draft review comment
  - Investigate specific finding
  - Done (end without posting)
```
Investigate → targeted subagent, then ask again.

## Phase 4: Open Questions

Ask about EACH open question separately (Accept / Reject / Need more context), e.g.
`"Select onChange: (event) → (value, event). Accept value-first signature (breaking, needs a BREAKING changeset)?"`.
Need more context → investigate, ask again. Record each answer for the draft.

## Phase 5: Draft

Only when the user asks to draft/post.

- **Skip what the user already said** in their own earlier comments, however phrased —
  repeating it reads as not having read the thread. Include only: new CRITICAL/MAJOR findings,
  status updates ("tests still failing"), replies to the author's questions, Phase 4 decisions,
  valid unaddressed bot findings. Nothing new → "no new findings to add", no draft.
- **CRITICAL and MAJOR only.** No nits section, no "there were others". All MINOR → "LGTM" plus
  any Phase 4 answers.
- **Don't restate what the PR does.** Casual and brief. Sections (Issues, Questions,
  Complexity concerns — name what to delete) only when they have content.
- Code snippets in repo shape: React 19 function components, named exports, plain CSS with
  `--motiv-*` tokens.

```markdown
couple issues:

1. `pnpm typecheck` fails - unused param in `Select.tsx:42`
2. `size` prop was renamed to `scale` but the changeset has no `BREAKING:` note (0.x) - apps passing `size` break silently

otherwise looks good
```

Then display, ask, post, offer merge and clean up per `references/posting.md`.

## Principles

- **Simplicity bias** — unnecessary abstraction is as much a bug as a missing one; suggest the
  concrete simpler alternative.
- **Consumers you cannot see** — judge every export, class, token and default by what it does
  to apps outside this repo.
- **Unrelated changes** — "unrelated but acceptable" (lint fixes) vs "unrelated and
  problematic" (drive-by refactors).
