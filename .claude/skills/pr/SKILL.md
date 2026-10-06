---
name: pr
description: Review a GitHub PR or issue — analyzes architecture, verification, test coverage, and scope creep, weighs discussion history, then drafts a review or issue comment. Use when the user wants to review or check a PR, or comment on an issue.
argument-hint: '<pr-or-issue-number>'
allowed-tools: Bash, Read, Grep, Glob, Write, Skill, AskUserQuestion, Task
---

# PR Review Skill

Comprehensive pull request review that analyzes code quality, architecture, test coverage, and identifies scope creep (unrelated changes mixed into the PR).

## Workflow

```
1. Fetch PR metadata + discussion history + merge status
1.5. Ask review mode: Full (default) or Quick
--- Full path ---
2. Setup worktree, launch subagent for deep analysis (read files, validate, architecture, scope creep, cleanup)
3. Verify critical/major, present findings grouped by severity, ask to proceed
4. Resolve open questions (if any)
5. Draft review comment from CRITICAL/MAJOR only
--- Quick path ---
Q1. Read diff inline, summarize what/why/size
Q2. Flag obvious issues from diff, tagged by severity
Q3. Draft review comment from CRITICAL/MAJOR only
```

## Finding Severity (read this before reviewing)

Every finding carries a severity, and severity decides what gets posted. Read
`.claude/code-review-contract.md` — it holds the taxonomy (CRITICAL / MAJOR / MINOR), the promotion
test, the evidence rules, and the list of things that are not findings in this repo. Apply it in
both review modes.

The two rules that matter most here:

- **Only CRITICAL and MAJOR reach the posted comment.** MINOR findings are shown to the user in
  the terminal and stop there. A clean-but-nitty PR gets "LGTM", not a nit list.
- **A finding with no severity prefix is MINOR**, so an untagged pile of observations posts
  nothing. Tag deliberately.

Never add Claude or Anthropic attribution to anything posted — no "Generated with Claude Code",
no `Co-Authored-By` naming either, in reviews, issue comments or merge commits. The posted text
reads as the user's own. `.claude/hooks/no-ai-attribution.sh` enforces it.

## Phase 0: Detect PR vs Issue

Determine if the target is a PR or an issue. If a URL is provided, check if it contains `/pull/` or `/issues/`. If just a number, detect type:
```bash
gh pr view <number> --json number 2>/dev/null && echo "PR" || echo "ISSUE"
```

- **PR** → proceed with full PR review workflow (Phase 1 onwards)
- **Issue** → use the **Issue Comment Flow** below, skip all PR-specific phases

### Issue Comment Flow

For issues, skip worktree/diff/architecture analysis. Focus on understanding the issue and drafting a helpful comment.

1. **Fetch issue details and discussion**:
```bash
gh issue view <number> --json title,body,author,state,labels,comments,createdAt
```

2. **Read the full discussion** - understand what was reported, what others said, whether there are linked PRs

3. **Investigate the codebase** if the issue references specific code, files, or behavior:
   - search for relevant files, read them
   - understand the reported problem in context

4. **Draft a comment** addressing the issue - could be: analysis of root cause, a proposed approach, questions for clarification, or acknowledgment with next steps

5. **Post as a regular comment** (not a review):
```bash
cat > /tmp/issue-comment.md << 'COMMENT_END'
<comment content>
COMMENT_END
gh issue comment <number> --body-file /tmp/issue-comment.md
```

Use AskUserQuestion before posting:
```
question: "Post this comment to issue #<number>?"
header: "Comment"
options:
  - Post (post as shown above)
  - Edit (tell me what to change)
  - Cancel (discard draft)
```

After posting → done. No worktree cleanup needed for issues.

---

## Phase 1: Fetch PR Metadata and Discussion History

Get PR number from $ARGUMENTS. If not provided, list recent PRs and ask user to select:

```bash
# if no PR number provided, list recent PRs
gh pr list --limit 5 --state all

# get PR details
gh pr view <number> --json title,body,additions,deletions,changedFiles,files,author,state,headRefName

# get all comments (PR comments and review comments)
gh pr view <number> --json comments,reviews
```

Capture:
- **title**: what the PR claims to do
- **body**: detailed description, linked issues
- **files**: list of changed files with additions/deletions per file
- **scope**: total additions/deletions, number of files
- **discussion history**: all comments and reviews with authors and timestamps

### 1.1 Analyze Discussion History

Understand what has already been discussed before reviewing:

```bash
# get PR comments (general discussion)
gh api repos/{owner}/{repo}/issues/<number>/comments --jq '.[] | "[\(.user.login)] \(.body)"'

# get review comments (inline code comments)
gh api repos/{owner}/{repo}/pulls/<number>/comments --jq '.[] | "[\(.user.login) on \(.path):\(.line)] \(.body)"'

# get reviews with their state (approved, changes_requested, commented)
gh api repos/{owner}/{repo}/pulls/<number>/reviews --jq '.[] | "[\(.user.login) - \(.state)] \(.body)"'
```

Summarize discussion:
- What issues were raised by reviewers?
- What was the PR author's response?
- Are there unresolved threads or pending questions?
- What has already been addressed vs still open?

**Check automated reviews (Copilot, etc.)**: automated review comments can carry valuable findings. Verify what Copilot or other bots flagged and include the valid ones in your review.

**Check for inline suggestions** — this is where the actual suggestions live:
```bash
# get inline review comments (where actual suggestions live)
gh api repos/{owner}/{repo}/pulls/<number>/comments --jq '.[] | "[\(.user.login) on \(.path):\(.line // .original_line)]\n\(.body)\n---"'
```

Look specifically for:
- **Suggested changes** - code blocks with `suggestion` tags containing proposed fixes
- **Inline comments** - specific line-by-line feedback
- **Security/bug warnings** - automated tools often catch real issues

The review body is often just a summary. The **inline comments** are where the real feedback is.

**Important**: Focus on new findings or unaddressed concerns; leave issues that were already discussed and resolved out of the draft.

### 1.2 Check Merge Status

Check if PR is mergeable and CI status:

```bash
gh pr view <number> --json mergeable,mergeStateStatus,statusCheckRollup
```

Report:
- **mergeable**: MERGEABLE (no conflicts) or CONFLICTING (needs rebase)
- **mergeStateStatus**: CLEAN (ready), BLOCKED (checks failing), BEHIND (needs update)
- **statusCheckRollup**: CI check results (build, tests, lint)

If PR has conflicts or is behind, note this early - it may explain "deletions" in the diff that are actually just missing commits from the base branch.

Print summary:
```
PR #<number>: <title>
Author: <author> | State: <state>
+<additions>/-<deletions> across <changedFiles> files
Merge status: <mergeable> | <mergeStateStatus>
CI: <pass/fail summary>

Discussion: <N> comments, <M> reviews
- Resolved: <list of addressed issues>
- Open: <list of unresolved questions>
```

## Phase 1.5: Select Review Mode

After presenting the Phase 1 summary, ask the user to choose review depth:

```
question: "Review mode for PR #<number>?"
header: "Mode"
options:
  - Full review (Recommended) — clone, run verification, architecture analysis, scope creep detection
  - Quick review — diff-only, summarize what/why/size, flag obvious issues
```

- **Full review** → continue to Phase 2 (existing deep analysis)
- **Quick review** → jump to Quick Review path below

## Quick Review Path

Lightweight review based on diff and metadata only. No worktree, no subagent, no verification execution.

### Q1. Read and Summarize Diff

```bash
gh pr diff <number>
```

From the diff and Phase 1 metadata, present:

- **What**: 2-3 sentence summary of what the PR does
- **Why**: purpose/motivation (from PR body, linked issues, or inferred from changes)
- **Size**: +additions/-deletions across N files - small/medium/large assessment
- **Files changed**: grouped list (code, tests, config, docs)

### Q2. Flag Obvious Issues

Scan the diff for issues detectable without full file context:

- Obvious bugs (nil dereference, unchecked errors, off-by-one)
- Missing error handling in new code
- Hardcoded values that should be configurable
- TODO/FIXME/HACK comments added
- Missing tests for new component behavior (no `*.test.tsx` change next to a new prop, state or interaction)
- Missing changeset (`.changeset/*.md`) for a consumer-visible change, or a bump level that does not match it
- Public API removed or renamed in `src/index.ts`, a subpath entry, `package.json#exports`, a `motiv-*` class or a `--motiv-*` token
- `window`/`document`/`localStorage` at module level or in render; a CSS import in a `.tsx`
- New entry under `dependencies` in `package.json`
- Unrelated changes mixed in (files that don't match PR purpose)

Tag each one per `.claude/code-review-contract.md` and apply the promotion test — quick mode reads
hunks, not files, so anything you cannot back with the surrounding code is MINOR. If nothing
CRITICAL or MAJOR turns up, say so explicitly.

### Q3. Proceed to Draft

After presenting the summary and any flagged issues, skip directly to Phase 5 (Draft Review Comment). All Phase 5 rules apply: check previous comments, filter to CRITICAL/MAJOR, keep the tone casual and brief, don't restate what the PR does.

**No worktree cleanup needed** since quick review never creates one.

## Phase 2: Deep Analysis via Subagent

Delegate the file reading, validation, and architecture analysis to **one** subagent when the PR is
big enough to be worth it — roughly 15+ changed files, or a diff you would not want to pull into
this conversation whole. The subagent does the heavy lifting and returns a condensed report, which
keeps the raw file contents out of the main context window.

For a smaller PR, read the files and run the checks directly. A handful of tool calls does not
justify the round trip, and one subagent is always enough here — never a second one to re-check the
first.

### 2.1 Setup Worktree (in main conversation)

Create the worktree before launching the subagent:

```bash
# fetch the PR ref directly (does NOT affect current checkout)
git fetch origin pull/<number>/head:pr-<number>

# create worktree from the fetched ref
git worktree add "/tmp/pr-review-<number>" pr-<number>

# install from the PR's lockfile so the gates can run (never changes the lockfile)
pnpm -C "/tmp/pr-review-<number>" install --frozen-lockfile --prefer-offline
```

Use `git fetch` + worktree so the main repo's branch stays put. (`gh pr checkout` switches the main repo's branch, which is disruptive mid-review.) If the install fails because the PR's lockfile is out of sync with `package.json`, that is itself a MAJOR finding — record it and skip the gates that need dependencies.

### 2.2 Launch Analysis Subagent

Use the **Task tool** with `subagent_type: "general-purpose"` to run the full analysis. Pass all context the subagent needs in the prompt:

```
prompt: |
  You are reviewing PR #<number> for <repo>.

  **PR metadata:**
  - Title: <title>
  - Description: <body>
  - Files: <file list from Phase 1>
  - Discussion summary: <from Phase 1.1>

  **Worktree location:** /tmp/pr-review-<number>
  **Repo location:** <repo_path>

  **Finding contract (read FIRST, before any analysis):**
  Read `<repo_path>/.claude/code-review-contract.md` in full. It defines the severity
  taxonomy, the promotion test, the evidence rules, and the list of things that are
  not findings in this repo. Every finding you report must be a single line shaped
  `SEVERITY: file:line — description`, and untagged findings are treated as MINOR.
  Do not soften the contract because a finding feels worth mentioning: MINOR is the
  correct home for taste, style, and "could be simpler".

  **Scope:** report what this PR introduces or makes worse. Pre-existing code the PR
  does not touch is out of scope.

  **Your tasks (do all of these):**

  1. **Read changed files** - read each changed file in full from the worktree
     to understand context, not just the diff. Focus on what the code actually
     does vs what the PR description claims.

  2. **Run verification** from the worktree (dependencies are already installed).
     Run every gate, in this order, and record each pass/fail with the first error:
     `pnpm check` (Biome) · `pnpm typecheck` · `pnpm test` (Vitest) · `pnpm build` ·
     `pnpm check:package` (publint, attw, tree-shaking) · `pnpm build-storybook`.
     A red gate is MAJOR. Do NOT run `pnpm add`/`remove` or edit the lockfile.

  3. **Architecture analysis** - check for:
     - Over-engineering (unnecessary abstractions, premature generalization)
     - Pattern violations (inconsistent with existing codebase)
     - Library contracts (see the MAJOR list in the contract): public API removed or
       renamed without a breaking changeset (0.x: `minor` + `BREAKING:`; ≥1.0: `major`), missing changeset for a consumer-visible
       change, tree-shaking (module-level side effects, CSS imported from `.tsx`),
       SSR safety (browser globals at module level or in render), new runtime
       dependency outside a subpath entry, app coupling (router, i18n, Provider)
     - Accessibility of interactive components: focus-visible ring, role/ARIA,
       keyboard operation, `prefers-reduced-motion`
     - CSS rules: `motiv-` BEM classes, every rule inside `@layer motiv.*`, values
       through `--motiv-*` tokens
     - Error handling and security concerns
     - Test quality: new component behavior without a Vitest + Testing Library test,
       tests that assert nothing, stories missing for a new component or variant

  4. **Scope creep detection** - categorize each file as:
     - Core (implements PR purpose)
     - Supporting (tests, config for core changes)
     - Related cleanup (minor fixes in touched files)
     - Unrelated (doesn't connect to PR purpose)

  **Leave the worktree in place.** The main conversation handles cleanup after all review phases complete.

  **Return a structured report in this shape:**
  - **Functionality**: 3-5 sentence explanation of what the PR does
  - **Key decisions**: notable implementation choices
  - **Validation results**: verification pass/fail, linter issues, race conditions
  - **Findings**: grouped under `### CRITICAL`, `### MAJOR`, `### MINOR` headings, in that
    order, one line per finding shaped `<lens>: file:line — description`, where lens is
    `correctness` / `architecture` / `over-engineering` / `scope-creep`. Skip a heading with
    zero findings. For every CRITICAL and MAJOR, include the failure scenario (input → wrong
    outcome) on the same line; that is what the promotion test demands.
  - **Total**: one line — `Total: <N> findings (<C> critical, <M> major, <m> minor)`
  - **Open questions**: design decisions that need user input

  Be specific - use file:line references. Omit positives; report problems only.
```

### 2.3 Receive Report

The subagent returns a condensed report. This is what enters the main conversation context - not the raw file contents or diff.

## Phase 3: Present Findings, Ask to Proceed

### 3.1 Confirm Every CRITICAL and MAJOR

These are the ones that get posted to GitHub under your name, where a wrong call is public and
awkward to walk back. So before the draft: read the code at each file:line and check that the
stated failure scenario actually reaches. Then keep it, downgrade it to MINOR, or drop it as a
false positive, and say which ones you downgraded and why.

MINOR findings need no confirming — they are shown to the user as-is and never posted.

### 3.2 Present

Show the report grouped by severity, ending with the `Total:` line, so the user sees the split at
a glance. Then use AskUserQuestion to confirm next step:

```
question: "How would you like to proceed?"
header: "Continue?"
options:
  - Draft review comment (proceed to Phase 5)
  - Investigate specific finding (ask subagent for details)
  - Done (end review without posting)
```

If user selects "Investigate specific finding", launch another targeted subagent to dig into the specific area, then ask again.

## Phase 4: Resolve Open Questions

If the subagent report contains open questions (design decisions needing user input), ask about EACH one specifically before proceeding:

```
question: "Select onChange: (event) → (value, event). Accept value-first signature (breaking, needs a BREAKING changeset)?"
header: "Decision"
options:
  - Accept (keep value-first signature)
  - Reject (revert to event-based)
  - Need more context
```

Wait for user response on each open question. If user selects:
- **Accept**: note for review comment
- **Reject**: note objection for review comment
- **Need more context**: launch targeted subagent to investigate, then ask again
- **Other** (custom input): incorporate user's feedback

Repeat for all open questions before proceeding.

## Phase 5: Draft Review Comment

Only proceed when user explicitly asks to draft/post the review.

### 5.1 Check Previous Comments

Do not repeat a point the user already made in their own previous comments — restating it reads as
though you did not read the thread. Before drafting, review the discussion history from Phase 1.1
and identify what the user (not other reviewers) already covered:
- What issues did the USER already raise?
- What recommendations did the USER already make?
- What questions did the USER already ask?

**Exclude from draft**:
- Architecture assessments the user already posted
- Issues the user already pointed out
- Questions the user already asked
- Any point the user already made, even if phrased differently

**Include in draft only**:
- NEW findings not mentioned by the user before, and only if CRITICAL or MAJOR
- Updates on issues (e.g., "tests still failing after fix attempt")
- Responses to contributor's questions to the user
- User's decision on open questions from Phase 4
- Valid issues from automated reviews (Copilot, etc.) that weren't addressed

If user already covered everything and there's nothing new → say "no new findings to add" and don't draft.

### 5.2 Filter by Severity

The posted comment carries **CRITICAL and MAJOR findings only**. MINOR findings were already
shown to the user in Phase 3 — that is their whole audience. Do not append them as a "nits"
section, do not fold them into a sentence, do not mention there were others.

If the confirmed findings are all MINOR, the review is "LGTM" (plus any open-question answers from
Phase 4). Say so plainly rather than manufacturing something to report.

### 5.3 Draft Comment

**Don't restate what the PR does.** The author knows what they built. Focus only on:
- Issues that need fixing
- Questions about unclear decisions
- LGTM if everything is fine

**Keep it casual and brief.** Examples of good review comments:

```markdown
LGTM
```

```markdown
couple issues:

1. `pnpm typecheck` fails - unused param in `Select.tsx:42`
2. `size` prop was renamed to `scale` but the changeset has no `BREAKING:` note (0.x) - apps passing `size` break silently

otherwise looks good
```

```markdown
I don't get why we need `createButtonVariants()` here - there's only one variant map. could inline it into `Button.tsx`?
```

**Only add sections if there are CRITICAL/MAJOR findings:**

- **Issues** - verification failures, bugs (numbered list)
- **Questions** - unclear design decisions, missing context
- **Complexity concerns** - structure the PR adds with no consumer; name what to delete

**Omit sections with no findings.** For PRs whose findings are all MINOR, just "LGTM" is fine.

**Code examples**: keep snippets in the repo's shape — React 19 function components, named exports, plain CSS with `--motiv-*` tokens.

## Output

### Display Draft First

Always display the complete draft review as a text block before asking:

```
--- Draft Review Comment ---
**Overall impression**

<actual review content here>

**Issues to address**
...
--- End Draft ---
```

### Ask User via AskUserQuestion

Use AskUserQuestion tool with these options:

```
question: "Post this review to PR #<number>?"
header: "Review"
options:
  - Approve (post review and approve)
  - Comment (post as review comment, no approval)
  - Request changes (post review requesting changes)
  - Edit (tell me what to change)
  - Cancel (discard draft)
```

### Handle Response

**Approve / Comment / Request changes**: Check the draft has no Claude/Anthropic attribution, then write to temp file and post as a formal PR review (not a regular comment). This ensures GitHub marks the review as done and it appears in `latestReviews`:
```bash
# write to temp file to avoid escaping issues
cat > /tmp/pr-review.md << 'REVIEW_END'
<review content>
REVIEW_END
# use --approve, --comment, or --request-changes based on user's choice
gh pr review <number> --body-file /tmp/pr-review.md --comment
```

**After Approve - offer to merge**:

When the user selected "Approve" and the approval was posted successfully, analyze the PR commits to recommend a merge strategy:

```bash
# check commit history for the PR
gh pr view <number> --json commits --jq '.commits[] | "\(.oid[:8]) \(.messageHeadline)"'
```

**Strategy recommendation logic:**
- **Rebase and merge (recommended)** when: commits are clean, well-structured, each with a meaningful message, no "fix typo" / "wip" / "fixup" noise
- **Squash and merge (recommended)** when: multiple messy commits (wip, fixup, typo fixes, "address review"), or a single logical change spread across noisy commits
- **Merge commit** when: branch has meaningful merge history worth preserving (rare)

Present the recommendation with reasoning:

```
# example for clean commits:
question: "PR #<number> approved. Merge strategy? (3 clean commits: 'feat(toggle): add Toggle', 'test(toggle): keyboard tests', 'docs: toggle stories')"
header: "Merge"
options:
  - Rebase and merge (Recommended) — preserves clean commit history
  - Squash and merge — collapse into single commit
  - Merge commit — creates merge commit
  - Skip — don't merge

# example for messy commits:
question: "PR #<number> approved. Merge strategy? (5 commits including 'wip', 'fix lint', 'address review')"
header: "Merge"
options:
  - Squash and merge (Recommended) — cleans up noisy commit history
  - Rebase and merge — preserves all commits as-is
  - Merge commit — creates merge commit
  - Skip — don't merge
```

If user selects a merge strategy:
```bash
# --rebase, --squash, or --merge based on user's choice
gh pr merge <number> --rebase --delete-branch
```

If merge fails (CI not passing, conflicts, branch protection), report the error and move on to cleanup.

**Edit**: Ask user for specific changes, update draft, display again, and repeat the ask.

**Cancel**: Acknowledge and stop.

### Cleanup Worktree

**After the review is fully complete** (comment posted, user cancelled, or user said "Done"), clean up:

```bash
cd <repo_path>
git worktree remove "/tmp/pr-review-<number>" --force 2>/dev/null || true
git branch -D pr-<number> 2>/dev/null || true
```

Cleanup happens AFTER all phases are done - the worktree is needed for follow-up investigations in Phases 3-4.

## Examples

### Simple review (no issues)
```
User: "review pr 42"
→ Phase 1: fetch metadata, +150/-30, 5 files
→ Phase 2: launch subagent → reads files, verification clean, no issues
→ Phase 3: present condensed report - adds `loading` state to Button with changeset and tests
→ User: "post the review"
→ Phase 5: draft and post "LGTM"
```

### Review with scope creep and questions
```
User: "review pr 58"
→ Phase 1: fetch metadata, +2k/-100, 25 files
→ Phase 2: launch subagent → reads 25 files, `pnpm test` red, `useTableConfig` hook unnecessary,
    unrelated changes in biome.json and Card.css
→ Phase 3: present condensed report
→ User: "why does Table live behind `@driif/motiv/table`?"
  → launch targeted subagent to investigate → keeps TanStack Table out of the main entry
→ User: "draft the review"
→ Phase 5: draft review highlighting issues, post to PR
```

### Review with over-engineering
```
User: "review pr 73"
→ Phase 1: fetch metadata, +800/-50, 12 files
→ Phase 2: launch subagent → reads files, verification clean, OVER-ENGINEERING:
    BadgeContext, BadgeProvider, useBadgeTheme for a component with two variants
→ Phase 3: present condensed report - suggest a plain `variant` prop
→ User: "yeah, way too complex. draft the review"
→ Phase 5: draft review with specific simplification suggestions
```

### Quick review (trusted contributor)
```
User: "review pr 95"
→ Phase 1: fetch metadata, +200/-30, 6 files
→ Phase 1.5: [AskUserQuestion] "Review mode?" → user selects Quick
→ Q1: read diff, summarize: adds `disabled` styling to Pagination
→ Q2: no obvious issues, tests and patch changeset included
→ Q3: draft and post "lgtm"
```

### Review with open questions
```
User: "review pr 89"
→ Phase 1: fetch metadata, +400/-50, 8 files
→ Phase 2: launch subagent → reads files, 2 test failures, open question
    about the `onChange` signature change
→ Phase 3: present condensed report
→ Phase 4: [AskUserQuestion] "onChange change: Accept value-first signature?"
  → User: "Accept"
→ User: "draft the review"
→ Phase 5: draft review noting test failures, user's acceptance of the new signature
```

## Review Principles

- **severity discipline** - `.claude/code-review-contract.md` decides what gets posted; a finding you cannot attach a failure scenario or a deletable unit to is MINOR, and MINOR never reaches the PR
- **simplicity bias** - ask "could this be simpler?" and suggest concrete alternatives; unnecessary abstraction is as much a bug as missing abstraction
- **project patterns matter** - code should look like it belongs in the existing codebase
- **consumers you cannot see** - every export, class, token and default is used by apps outside this repo; judge changes by what they do to those apps
- **explain non-obvious patterns** - spell out clever implementations rather than assuming the reader follows them
- **classify unrelated changes** - "unrelated but acceptable" (linter fixes) vs "unrelated and problematic" (drive-by refactoring)
