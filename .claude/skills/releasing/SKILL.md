---
name: releasing
description: Use when finishing a task in motiv (deciding whether it needs a changeset, choosing major/minor/patch, writing the changeset summary and the Conventional Commit subject), when a breaking change is being made pre-1.0, or when the npm release did not come out as expected (no "Version Packages" PR, publish failed, a change shipped without a changeset). Triggers on "changeset", "release", "publish", "npm", "version", "bump", "breaking", "semver", "conventional commit", "Version Packages".
---

Changesets drives versions and the changelog of `@driif/motiv`. Each consumer-visible change
carries a `.changeset/*.md` file; the release workflow turns accumulated changesets into a
version bump, a `CHANGELOG.md` entry and an npm publish.

## Closing a task

Two artefacts:

1. **A changeset** — if, and only if, a consuming app can see the change.
2. **A Conventional Commit subject** — always. English, scoped to the component or area:
   `feat(button): …`, `fix(card): …`, `refactor`, `docs`, `test`, `build`, `ci`, `chore`.
   Body at most four lines.

### Needs a changeset?

Yes — anything an app can observe: an exported component/function/type, a prop or its default,
a `motiv-*` class, a `--motiv-*` token or its default value, rendered markup or ARIA, CSS
behavior (layout, states, specificity, layer), `package.json#exports`, peer dependency ranges,
a new runtime dependency.

No — tooling, CI, tests, stories, Storybook docs, internal refactors with identical output,
`--_*` private CSS variables.

### Which bump

| Change | Semver meaning |
|---|---|
| Removal, rename or changed default of an export, prop, prop value, class, token; changed CSS behavior an app may rely on; removed/renamed `exports` entry; raised peer range | **breaking** |
| New component, prop, variant value, class, token, export | **feature** |
| Bug fix that makes behavior match the documented intent | **fix** |

### Pre-1.0 policy (current)

Changesets applies plain semver increments and does **not** special-case 0.x: a `major`
changeset on `0.4.2` produces `1.0.0`, `minor` produces `0.5.0`, `patch` produces `0.4.3`.

Policy until 1.0 is cut deliberately:

- **breaking → `minor`**, with the summary starting `BREAKING:` and saying what to change;
- **feature → `minor`**;
- **fix → `patch`**;
- **`major` only when the decision to release 1.0.0 has been made.**

Apps pin `^0.x`, which caret-resolves within the same minor only, so a `minor` bump is already
opt-in for them. (CLAUDE.md's "`major` for any removal" applies from 1.0 on.)

### Writing the changeset

`pnpm changeset` → pick `@driif/motiv` → bump → summary. Or write the file directly:

```md
---
'@driif/motiv': minor
---

BREAKING: `Button` `variant="text"` is renamed to `variant="ghost"`; the class `motiv-btn--text` is now `motiv-btn--ghost`.
```

Summary rules: English, consumer wording, what an app now gets or must change. Name the public
API (component, prop, class, token), not files or internals. One line per change; one changeset
per logical change.

| Change | Changeset | Commit subject |
|---|---|---|
| Card gains `padding="xs"` | `minor` — ``Card accepts `padding="xs"`.`` | `feat(card): add xs padding` |
| Button spinner misaligned in `sm` | `patch` — `Button's loading spinner is centered at size sm.` | `fix(button): center sm spinner` |
| `--motiv-radius` renamed | `minor` (pre-1.0) — ``BREAKING: `--motiv-radius` is now `--motiv-radius-base`; update overrides.`` | `refactor(tokens)!: rename radius base token` |
| story added | none | `docs(button): add re-theme story` |

## Never

- Bump `package.json#version`, edit `CHANGELOG.md`, create tags or run `npm publish` by hand —
  the release workflow does all of it.
- Edit a changeset that already shipped (it was consumed into `CHANGELOG.md` and deleted).

## How a release happens

1. PRs with changesets merge to `main`.
2. `.github/workflows/release.yml` runs `changesets/action` on push to `main`. With pending
   changesets it opens or updates the **"Version Packages"** PR (`pnpm changeset version`:
   bumps `version`, writes `CHANGELOG.md`, deletes the consumed changesets).
3. Merging that PR pushes to `main` again; now no changesets are pending, so the action runs
   `pnpm release` (`pnpm build && changeset publish`), which publishes to npm and pushes the
   version tag.

Publishing requires the `NPM_TOKEN` repo secret (automation token with publish rights) **or**
npm trusted publishing configured for this repo/workflow (`id-token: write`). `access: public`
is set in `.changeset/config.json`.

Check locally what is pending: `pnpm changeset status --verbose`.

## When a release went wrong

| Symptom | Cause | Fix |
|---|---|---|
| no "Version Packages" PR after a merge | no changesets in `.changeset/`, or the action lacks `pull-requests: write` / Actions are not allowed to create PRs (repo setting) | add the changeset in a follow-up PR; check workflow permissions and *Settings → Actions → Allow GitHub Actions to create pull requests* |
| change shipped without a changeset | forgot it | add a changeset in a follow-up PR describing the already-merged change; it goes out with the next release |
| publish step failed `401`/`403`/`ENEEDAUTH` | `NPM_TOKEN` missing, expired, or lacks publish rights for `@driif`; or trusted publishing not configured for this workflow | fix the secret or the npm trusted-publisher config, then re-run the failed job — `changeset publish` skips versions already on npm |
| publish failed `E402` | scoped package published without public access | confirm `access: public` in `.changeset/config.json` |
| version on npm but no tag/GitHub release | publish succeeded, tag push failed (`contents: write` missing) | fix permissions; re-run — already-published versions are skipped and tags are pushed |
| bumped to `1.0.0` unexpectedly | a `major` changeset pre-1.0 | if the Version Packages PR is not merged, change the changeset on `main` to `minor` — the action regenerates the PR; if published, it is out — npm versions cannot be reused; deprecate and continue from there |
| a bad version was published | — | publish a fix (`patch`) or `npm deprecate @driif/motiv@<version> "<reason>"`; never unpublish a version apps may have installed |
