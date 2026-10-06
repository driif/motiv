---
name: handoff
description: Compact the current conversation into a handoff document for another agent to pick up.
argument-hint: "What will the next session be used for?"
disable-model-invocation: true
---

Write a handoff document summarising the current conversation so a fresh agent can continue the work. Save it to this session's scratchpad directory (`/private/tmp/claude-501/.../scratchpad`, the established convention here) — not into the motiv repo tree.

Capture the state most likely to be lost across sessions:

- **Where the work lives** — the current git branch, the components/subpath entries it touches, and whether it changes public API (props, `motiv-*` classes, `--motiv-*` tokens, `exports`) and so needs a changeset. That context is the first thing a successor loses.
- **What's done, what's next, what's blocked.**
- **A "suggested skills" section** naming the skills the next agent should invoke (e.g. `/grilling`, `/domain-modeling`, `/frontend-design`, `/writing-simple-code`, `/pr`).

Do not duplicate content already captured in other artifacts (plans in `docs/plans/`, ADRs, specs in `docs/specs/`, changesets, commits, diffs). Reference them by path or URL instead.

Redact anything sensitive — tokens, passwords, PII (npm tokens, etc.).

If the user passed arguments, treat them as what the next session will focus on and tailor the document to that.
