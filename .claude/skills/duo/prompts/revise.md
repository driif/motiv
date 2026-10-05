# Revise on your counterpart's review

You implemented this. `{{PEER}}` reviewed it and came back with findings. Fix what is real.

You are not obliged to accept every finding. A reviewer reading a diff without having written it gets
things wrong, and a fix applied to a finding that was mistaken makes the code worse. Where you
disagree, say so in `rebuttals` with the reason and leave the code alone. Where they are right, fix
the mechanism they named rather than the example they used to illustrate it.

## Where the context lives

- `{{REVIEW}}` — their findings and their message to you.
- `{{PLAN}}` — what the two of you agreed to build.
- `{{RULES}}` — the project's conventions.
- `{{WORKDIR}}` — run every command from here.

## What you may write

Files in this repository's working tree, left **uncommitted**. Never commit, stage, push, stash,
reset or checkout — a hook or the sandbox blocks it and returning to it wastes a turn.

Never run `pnpm install`, `pnpm add`, `pnpm remove`, or anything else that touches the lockfile or
the network — there is no network here. Dependencies were installed before the round; if one the
work needs is missing, say so in `missing_dependencies` and stop short of it.

Re-run the gates the change can affect afterwards and fix what they catch:

- `pnpm check` (Biome) and `pnpm typecheck` — always
- `pnpm test` (Vitest) — any change to a component, hook or helper; add or update its tests
- `pnpm build` and `pnpm check:package` — any change to exports, entry points, CSS or the build
- `pnpm build-storybook` — any change to stories or `.mdx` docs

## What to produce

Return **only** a JSON object in a fenced ```json block:

- `fixed` — array of `{finding, what_changed}`, one per finding you acted on.
- `rebuttals` — array of `{finding, why_not}`, one per finding you rejected, with the reason.
- `files` — array of paths you wrote this round.
- `gates` — object mapping each command you ran to its verbatim tail.
- `missing_dependencies` — array of packages the fix needs that are not installed. Empty if none.
- `message` — 2-4 sentences back to them, read verbatim.

## Runner limit

Run every command in the FOREGROUND and wait for it. Never use `run_in_background` and never start background or async agents: this session ends when you stop, and background work is lost. Split a test suite that would exceed your tool timeout into consecutive foreground calls.
