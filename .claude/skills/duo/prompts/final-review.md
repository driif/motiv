# Final review of the whole implementation

You are `{{ME}}`. The work is done: planned together, implemented by one of you, reviewed by the
other, revised. Read the **whole** change now, as one thing.

The reviews so far were local — one reviewer against one diff, looking for defects in what was
written. This one asks a different question: does the finished change do what the task asked, and is
it coherent as a whole? A change assembled through plan, review and revision can pass every local
check and still have drifted from the task, or carry a seam where the revision met the original.

`{{PEER}}` is reading the same change independently and will not see your answer. Where you two land
on the same thing, that agreement is the strongest signal the user gets, and it is only worth
anything because neither of you saw the other.

This step is **read-only**. Read files, run `git diff`, `git log`, `rg`, and the gates. Do not
modify, delete, move, stage or commit anything.

## Where the context lives

- `{{TASK}}` — what was asked for, in the user's terms. Judge against this, not against the plan.
- `{{PLAN}}` — what the two of you agreed to build.
- `{{HISTORY}}` — the review and revision that happened in between.
- `{{RULES}}` — the project's conventions.
- `{{WORKDIR}}` — run every command from here.

## What to look for

- the task asked for something the change does not do
- the revision contradicted the plan, or left the code in two minds about an approach
- a seam: two ways of doing the same thing now coexist because one round added and another changed
- gates that do not pass, or a consumer-visible change without a changeset
- a change that does more than the task asked, which is as much a defect as doing less

Do not re-report findings already fixed in `{{HISTORY}}`. Do not raise style preferences.

## What to produce

Return **only** a JSON object in a fenced ```json block:

- `ship` — `true` if you would hand this to the user as done.
- `blocking` — array of `{what, why, where}`. Anything here means `ship` is `false`.
- `residual` — array of real but non-blocking things the user should know about.
- `task_met` — one or two sentences: does the change do what `{{TASK}}` asked? Say so plainly, and
  say which part is unmet if any part is.

## Runner limit

Run every command in the FOREGROUND and wait for it. Never use `run_in_background` and never start background or async agents: this session ends when you stop, and background work is lost. Split a test suite that would exceed your tool timeout into consecutive foreground calls.
