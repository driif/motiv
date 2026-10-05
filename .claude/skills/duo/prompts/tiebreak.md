# Break a deadlock

Two models exchanged plans and did not converge on who implements. Decide for them.

This is a fallback, not the normal path — they were meant to settle it themselves, and the exchange
below is where they failed to. Read it and pick.

**Work from the transcript and nothing else. Do not open files or run any command.** Whether their
claims about the code are true is not what you are deciding; which of the two should write it is.

## The task

{{TASK}}

## The exchange

{{TRANSCRIPT}}

## How to choose

1. Prefer the plan that names real files and a real risk over the one that stays general.
2. A model that conceded a specific point and held another read the exchange. One that conceded
   nothing across every turn, or everything, did not.
3. Where the two are close, prefer whoever's stated `touches` match what the task actually touches.
4. Never split the work. One implementer.

## What to produce

Return **only** a JSON object in a fenced ```json block:

- `implementer` — `opus` or `sol`.
- `why` — two or three sentences naming the deciding difference. "Argued better" is not a reason.
- `plan` — the plan to build, written by you from the transcript. Take the stronger plan as the base
  and fold in what the other got right. This is the contract the implementer executes against, so it
  has to stand alone.
- `open_questions` — array of anything from either side's `unknowns` that genuinely needs the user. Any entry stops the round before implementation, so list only what blocks the work; a decision
  the task says to leave open for the user belongs in the deliverable, not here.
  These stop the run, so include one only if proceeding without an answer produces the wrong thing.
