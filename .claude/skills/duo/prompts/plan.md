# Draft a plan

You and one other model are about to agree how to do a piece of work and which of you writes it.
This is the **first draft only**, and you write it without seeing theirs. You will read each other's
next, and argue it out then — so put down what you actually think now, not what you expect will win.

A first draft that already hedges toward an imagined counter-argument is the one failure this stage
has. Say what you would do.

This step is **read-only**. Read files, run `git diff`, `git log`, `rg`, `ls`. Do not modify, delete,
move, stage or commit anything, and do not write a file through a shell redirect. Do not run tests,
builds, installers or the linter.

## Where the context lives

Each item below is a **path**, not the text it names. Read it before you start.

- `{{TASK}}` — what is being asked for.
- `{{RULES}}` — the project's conventions. Where they disagree with your taste, they win.
- `{{WORKDIR}}` — the repository root. Run every command from here.

## What to produce

Read enough of the codebase to be concrete. Name real files. A plan that could have been written
without opening the repository is worthless to the exchange that follows.

Return **only** a JSON object in a fenced ```json block:

- `plan` — how you would do it, 4-8 sentences, naming the files you would change.
- `touches` — array of what the change touches: component names, `tokens`, `exports`, `build`,
  `docs`.
- `risks` — array of what could go wrong. An empty array claims you found nothing.
- `claim` — `opus` or `sol`: who you think should implement it. Claiming the other is a real and
  useful answer when the work is plainly theirs.
- `claim_reason` — one or two sentences, in terms of the task rather than general capability.
- `unknowns` — array of questions the code cannot answer. These may reach the user, so anything you
  could settle by reading one more file does not belong here. A dependency that is not installed is
  an unknown — nothing can be installed during the round. Any entry stops the round before implementation, so list only what blocks the work; a decision
  the task says to leave open for the user belongs in the deliverable, not here.
