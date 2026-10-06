# motiv — Codex

Read `CLAUDE.md` before working. It is the shared source for layout, constraints, gates, key
files and release policy; its instructions also apply to Codex. Read
`docs/codex-compatibility.md` when using a shared skill.

Investigate and verify autonomously. Before implementing an unresolved public-API choice — a new
component, prop, class, token, default, `exports` entry or runtime dependency — present concrete
options and a recommendation and wait for the user's decision. Continue an accepted approach
without re-asking. Tool execution approval is separate from design agreement.

Use the skills discovered under `.agents/skills`. Their entrypoints load the `.claude/skills`
sources with Codex-specific adaptations. Load only skills relevant to the task. For reviews,
read `.claude/code-review-contract.md` before reporting findings.

Close every task that changes what a consuming app sees with a changeset (`pnpm changeset`,
English, consumer wording). Never bump the version by hand. Commit subjects are Conventional
Commits. See the `releasing` skill.

Keep reports concise: outcome, gates actually run, any remaining limitation. English for code,
docs and UI defaults. Keep commits and GitHub text free of agent co-author trailers and
generated-by signatures, including Codex/OpenAI.
