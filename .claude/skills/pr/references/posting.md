# Posting, Merging, Cleanup

## Display and ask

Show the complete draft first:

```
--- Draft Review Comment ---
<review content>
--- End Draft ---
```

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

- **Approve / Comment / Request changes**: confirm no AI attribution, then post as a formal
  review (so GitHub lists it in `latestReviews`):
  ```bash
  cat > /tmp/pr-review.md << 'REVIEW_END'
  <review content>
  REVIEW_END
  gh pr review <number> --body-file /tmp/pr-review.md --comment   # or --approve / --request-changes
  ```
- **Edit**: apply the change, display again, ask again.
- **Cancel**: stop.

## After Approve — offer to merge

```bash
gh pr view <number> --json commits --jq '.commits[] | "\(.oid[:8]) \(.messageHeadline)"'
```

Recommend:
- **Rebase and merge** — clean, meaningful commits, no wip/fixup/typo noise
- **Squash and merge** — noisy commits (wip, fix lint, address review)
- **Merge commit** — merge history worth preserving (rare)

```
question: "PR #<number> approved. Merge strategy? (<N> commits: <short characterization>)"
header: "Merge"
options:
  - <recommended strategy> (Recommended) — <reason>
  - <other strategies>
  - Skip — don't merge
```

```bash
gh pr merge <number> --rebase --delete-branch   # or --squash / --merge
```

If the merge fails (CI, conflicts, branch protection), report it and go to cleanup.

## Cleanup

Only after the review is fully done (posted, cancelled, or "Done") — the worktree serves
follow-up investigations until then:

```bash
cd <repo_path>
git worktree remove "/tmp/pr-review-<number>" --force 2>/dev/null || true
git branch -D pr-<number> 2>/dev/null || true
```
