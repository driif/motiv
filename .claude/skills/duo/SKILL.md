---
name: duo
description: Run a task through both frontier models — opus and sol draft plans blind, exchange messages until they agree on one plan and one implementer, that one writes it, the other reviews the diff, the implementer revises, then both sign off and revmux checks from outside. Use when the user says "duo", "/duo <task>", "have them decide who implements", "run this through both models", or asks for a task to be implemented and re-reviewed automatically. Changes land uncommitted on a duo/<slug> branch for the user to review; the round record stays on disk under docs/tasks/.
---

# duo — two models plan together, one writes, both sign off

A task goes to both `claude/opus:xhigh` and `codex/gpt-6-sol:xhigh`. They draft plans blind, then
**exchange messages** until they agree on one plan and one implementer. That one writes it; the other
reviews the diff; the implementer revises; then both read the whole change independently and say
whether it ships.

Seven stages, and the model calls are roughly 2 + 2×turns + 1 + 1 + 1 + 2 — about eleven at the
default two turns.

| stage | who | access |
|---|---|---|
| `plan` | both, blind | read-only |
| `exchange` | both, seeing everything said so far | read-only |
| `tiebreak` | opus, only if they did not converge | read-only |
| `implement` | the agreed implementer | **write** |
| `crossreview` | the other one | read-only |
| `revise` | the implementer, only if the review said `revise` | **write** |
| `final review` | both, independently | read-only |

## The one invariant

**The opening drafts are written blind.** Everything after that is a conversation — that is the
point — but neither model sees the other's first plan before writing its own. A first draft that
already hedges toward an imagined counter-argument is worth nothing to the exchange.

The final review is blind again for the same reason: two independent reads of the finished change
agree or they do not, and that only means something if neither saw the other's answer.

The exchange was chosen over sealed bidding knowing what it costs: more calls and more wall time, in
return for one plan both models have argued over instead of one picked from two.

## What may be written where

| location | agents may | enforced by |
|---|---|---|
| this repo's working tree | edit files; **never** commit, stage or push | opus: `.claude/hooks/duo-no-commit.sh` · sol: codex's sandbox keeps `.git` read-only |
| the inspiration apps in `CLAUDE.md` | read only | `.claude/settings.json` deny rules, plus the prompts |

The hook is a `PreToolUse(Bash)` guard registered in `.claude/settings.json`. It blocks git history
and index writes only while `DUO_ROUND` is set — `duo-round.sh` exports it before starting any
agent — and returns the reason to the model. The orchestrator (this session) does not commit either:
changes sit uncommitted so the user reviews them with `git diff` and commits them.

## Procedure

### 1. Open the task

Slug the task — short, kebab-case, no dates. Then:

```bash
mkdir -p docs/tasks/<slug>
git checkout -b duo/<slug>
```

Write `docs/tasks/<slug>/task.md`: what is being asked for, any constraint the code cannot state, and
what "done" means — the gates it must pass (`pnpm check`, `pnpm typecheck`, `pnpm test`,
`pnpm build`, `pnpm check:package`, `pnpm build-storybook`, whichever the change can affect) and
whether it needs a changeset. Both models read this file and nothing else of yours, so a task.md that assumes
context from the chat produces two plans that miss the point — and an exchange that converges
confidently on the wrong thing.

**Ask the user before writing it if the ask is ambiguous.** A headless model cannot ask, and a wrong
task.md costs the whole run. A new component, prop, class, token, export or runtime dependency is
public API — settle it with the user here, not in the exchange.

**Install every dependency the task needs before running the round.** codex's write sandbox has no
network, so nothing can be installed inside it; a missing package comes back as an unknown or in
`missing_dependencies`, not as an install.

**Every decision in task.md carries its provenance, in one of two separately headed sections.**

| section | holds | models treat it as |
|---|---|---|
| *Asked for* | the user's own words and constraints, and the accepted spec or plan it comes from | non-negotiable |
| *Chosen here* | anything you inferred, recommended or got a yes to, naming what it was inferred from | open to challenge in the exchange |

A surface neither the user's words nor the accepted spec mention belongs in *Chosen here* even when
the user approved it, because what they approved was your recommendation. Put it in the wrong section and both models
build it without question — that is how a round ships a screen nobody asked for, and the exchange,
which exists to catch exactly this, is the thing you disabled.

### 2. Run the round

```bash
.claude/skills/duo/scripts/duo-round.sh <slug> 01-initial
```

Takes 20-50 minutes — eleven calls at xhigh, several of them sequential by construction. **Run it in the background and wait for the notification** — do not poll. Follow
progress with a `Monitor` over the round's own event log:

```bash
tail -n +1 -F docs/tasks/<slug>/01-initial/events.jsonl
```

Relay a folded line at most once a minute. A `walkover`, `agent_degraded` or `stopped` event goes out
when it arrives — each changes what the user would do next.

Exit codes: **0** done · **2** tool error, read `*.err` in the round dir · **3** stopped on open
questions neither model could settle. On `3`, put them to the user with AskUserQuestion,
fold the answers into `task.md`, and run again under a **new round name**. A completed round is
refused outright; a round stopped at `3` wrote no manifest, so its name would silently be reused and
its transcript overwritten — keep the stopped one as the record of what was asked.

### 3. Report what they decided, and what they said

Read `transcript.md` and report the exchange, not just its outcome: who conceded what, and on what
grounds the implementer was chosen. That is the part the user cannot get anywhere else, and it is
the whole reason the exchange costs what it does.

Then `manifest.json`: `implementer`, `crossreview_verdict`, `ship` and `ship_basis`. A non-empty
`degraded` leads — a walkover means one model never planned, so nothing was agreed and the
assignment carries no information.

`ship` is true only when **both** final reviewers reported and both said so; `ship_basis` says which
it was. One reviewer on a degraded run is not a verdict.

### 4. Re-review with revmux — the outside check

The two models have now agreed with each other twice, which is exactly when a shared blind spot
survives. revmux is the only reader that was not part of the conversation.

Invoke the `revmux:revmux` skill against the uncommitted changes. Use `--profile final` — this is
fix-confirmation, and `final` reports nothing below major. `docs/tasks/<slug>/<round>/plan.md` is the
goal.

**Run revmux from the repo root** (`--workdir .`, or omit it). revmux resolves `.revmux/` from the
process cwd, not from `--workdir`, so running it from a subdirectory creates a second archive there
and misses `.revmux/profile.md` — the calibration every round depends on.

### 5. One fix pass, then stop

If revmux returns `critical` or `major` — after both models already signed off — hand them to the
**same** implementer and let it fix them. Then one confirming round. Then report, whatever it says.

**Do not loop further.** Convergence is about two thirds a round, so a third round mostly finds new
minors while the user has seen nothing. `minor`, `immaterial`, `pre_existing` and `open_questions`
never gate.

### 6. Leave it uncommitted, report

`docs/tasks/` and `.revmux/tasks/` are gitignored: the round record stays on disk only. Do not
commit, push or open a PR unless the user asks — the change stays uncommitted on `duo/<slug>` for
them to review with `git diff`.

Tell the user, in this order: what was built and which files changed, who implemented it and why,
what the review said, any `missing_dependencies`, and that `duo/<slug>` holds the uncommitted change.

## The round directory

```
docs/tasks/<slug>/
├── task.md                     the brief both models read
└── <round>/
    ├── transcript.md           the whole conversation, in order — read this first
    ├── turns/plan-*.{raw,json} the blind opening drafts
    ├── turns/t<n>-*.{raw,json} each exchange turn
    ├── tiebreak.json           only when they failed to converge
    ├── plan.md                 the plan the implementer executed against
    ├── implementation.json     summary, files, gates, deviations
    ├── crossreview.json        the other model's findings and verdict
    ├── revision.json           what was fixed, what was rebutted
    ├── final-{opus,sol}.json  two independent reads of the whole change
    ├── history.md              review + revision, given to the final reviewers
    ├── events.jsonl            stages, stalls, degrades, convergence
    └── manifest.json           implementer, verdicts, ship, ship_basis
```

Kept so a bad run can be read afterwards: which prompt each model got, what it actually said, and
where the pipeline made a call. When a run surprises you, read `events.jsonl` first.

## Knobs

`DUO_TURNS` (2 exchange turns before a tiebreak), `DUO_IDLE_TIMEOUT` (600s with no output before a
kill), `DUO_HARD_TIMEOUT` (1800s for one attempt), `DUO_STAGGER` (10s before the second model in a
parallel stage). Raising the timeouts makes a stuck run take longer to fail, not likelier to succeed.
`DUO_TURNS=1` roughly halves the exchange cost and sends more rounds to the tiebreak.

## Degrading

A model that stalls or returns no JSON at the planning stage is marked degraded and the run
continues; the survivor takes the work by **walkover**, recorded in `events.jsonl` and
`manifest.json`. Both failing is a tool error, not an empty result. Never present a walkover as an
agreement — nothing was exchanged.

A model that drops out mid-exchange leaves that turn unanswered in the transcript; the run continues
and ends at the tiebreak. A final reviewer that fails withholds `ship`, and `ship_basis` says so.
