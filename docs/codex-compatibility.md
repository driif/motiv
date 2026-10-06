# Shared skills in Codex

`CLAUDE.md` and `.claude/skills/` remain authoritative shared content. The Codex entrypoints
under `.agents/skills/` load those files rather than copying their workflows. Resolve supporting
links relative to the original Claude skill directory. The adaptations below apply in Codex;
they do not change Claude's configuration.

## Tools and invocation

- `/skill-name`, `Skill` and `$ARGUMENTS` mean the corresponding Codex skill and the user's
  supplied arguments. Read its entrypoint and referenced instructions; no Claude process is needed.
- `Bash`, `Read`, `Grep`, `Glob` and `Write` mean available shell, search and file-edit tools.
  Claude `allowed-tools` metadata does not grant Codex permissions.
- `AskUserQuestion` means an available Codex question tool for clarification, or a concise
  direct question when a reply is required. Wait for decisions; existing authorization persists.
  Show the complete proposed GitHub comment/review before obtaining any missing posting approval.
- `Task` / `Agent` means native Codex subagents when available and permitted. Pass the absolute
  repo root, relevant skill paths and the review contract (`.claude/code-review-contract.md`).
  Follow the workflow's delegation threshold. Without subagents, perform the same analysis
  locally and disclose that it was sequential. A Claude plugin name does not imply an installed
  Codex tool.
- Explicit-only skills use `agents/openai.yaml` with `allow_implicit_invocation: false`.
  Skills switched off in this machine's Claude settings are explicit-only in Codex, so they
  remain available by name without being selected automatically.

## Decisions and tool approvals

The working agreement is in `AGENTS.md` and `CLAUDE.md`; it applies without invoking a skill.
Skills guide task-specific execution. A coding-style skill does not settle a public-API question,
and a grilling session is not required to ask one consequential design question.

Reading `CLAUDE.md` does not import `.claude/settings.json`, its permission rules or its plugins.
Codex's actual session permissions govern tool access. Distinguish a required tool escalation
from a request for a product decision, and give the concrete sandbox reason in an escalation.
If even read-only commands fail during sandbox construction, identify the configuration defect
and prepare a scoped repair; do not treat a stream of per-command approvals as the normal workflow.

Keep `workspace-write` and the existing approval policy. `.codex`, `.agents` and `.git` remain
protected; network and protected-path operations can still require tool approval. Changing
approval routing or granting broader access is a separate decision.

## Paths and environment

- A Claude scratchpad path means a fresh directory created with
  `mktemp -d "${TMPDIR:-/tmp}/motiv-codex-XXXXXX"`. Return the absolute artifact path.
- Resolve personal skill references through the available Codex skill catalog first. Do not
  assume `~/.claude`, Superpowers or Claude plugins exist on a fresh machine.
- Open generated reports with a platform-appropriate tool when available. Without a GUI,
  return the artifact path. CDN-dependent reports require network access in the viewing browser.

## Verification and dependencies

- Codex's `workspace-write` sandbox has no network. Dependency installs and changes
  (`pnpm install`, `pnpm add`, `pnpm remove`, lockfile regeneration) are done by the user or the
  orchestrator, not inside the sandbox. Running package scripts (`pnpm check`, `pnpm typecheck`,
  `pnpm test`, `pnpm build`, `pnpm check:package`, `pnpm build-storybook`) is always fine.
- Missing dependencies or tools are a limitation, never a passed check; report them, do not work
  around them.
- In PR reviews, run the gates in the reviewed worktree, not the main checkout
  (`pnpm -C <worktree> check`, `pnpm -C <worktree> typecheck`, …). Use `gh --repo <owner/repo>`
  or run gh from the intended checkout.
- Clean up only worktrees and branches created by this review. Check for edits first; avoid
  unconditional `--force`, `branch -D` and swallowed cleanup errors.
- Architecture exploration can use native subagents for the design-it-twice briefs without
  installing `superpowers:dispatching-parallel-agents`. Sequential alternatives are the fallback.
- For Codex skill authoring, use the bundled `skill-creator` guidance for metadata and invocation;
  the shared `writing-great-skills` prose remains useful, but its Claude frontmatter is not
  Codex invocation configuration.
