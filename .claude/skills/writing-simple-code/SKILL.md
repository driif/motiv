---
name: writing-simple-code
description: Apply at write time when adding or modifying React/TS/CSS in motiv. Use before creating any new component, prop, variant, size, `motiv-*` class, `--motiv-*` token, export, generic, useMemo/useCallback, helper, runtime guard, comment or CSS rule — in a published library each of these is public API or maintenance forever. Triggers on any code-writing task in this repo.
---

CLAUDE.md says **"Write minimal code — no premature abstractions, no speculative props or
variants."** This skill makes that operational. In a library the stakes are higher than in an
app: every exported component, prop, variant value, `motiv-*` class, `--motiv-*` token and
`exports` entry is used by apps this repo cannot see. Adding one is cheap; removing one is a
breaking change.

These rules prevent clutter at write time. A separate cleanup/audit pass (e.g. a user-level
simplification skill, if installed) is the reactive form; this skill is the proactive one.

---

## The Rules

| # | Rule at write time |
|---|---|
| 1 | **No speculative props.** A prop exists because a consuming app needs it now, or the accepted spec names it. "An app might want to…" is not a caller. New props are public API — discuss before adding (CLAUDE.md). |
| 1a | **No speculative variants or sizes.** Each value of `variant`/`size` is a class and a contract. Ship the ones the spec lists. |
| 1b | **No generic type parameter without a second concrete use.** `Table<TData>` is fine (the caller's row type is real); `Badge<T>` is not. |
| 2 | **Prefer native props via spread.** `Props extends ComponentProps<'button'>` and `{...rest}` on the element. Don't re-declare `onClick`, `id`, `aria-*`, `disabled` or `title` as custom props, and don't invent `onPress` when `onClick` exists. `ref` is a prop in React 19 — no `forwardRef`. |
| 3 | **Merge, don't swallow.** `className` merges with `cx`; `style` and `...rest` pass through. A component that drops `className` or `aria-*` forces apps to fork it. |
| 4 | **No `useMemo`/`useCallback` without a measured reason or a reference consumer.** A consumer is a `[deps]` array, a `memo`'d child, or an effect that must not re-run. Library users' render cost matters, but a closure and a deps compare per render is also cost. |
| 5 | **Don't restate library defaults.** Options passed to a dependency (TanStack Table, dnd-kit, a primitives library) that equal its documented default are omitted. Read the docs, not other code. |
| 6 | **Inline first; abstract on the third identical copy.** Two similar components stay separate. Shared *visual* pieces (focus ring, spinner, size steps) unify via tokens or a shared class on the second copy — one stylesheet owns them. |
| 7 | **Branches sharing a wrapper collapse to one.** Two `return`s with the same element and classes and a different child become one return with a conditional child. |
| 8 | **Stacked `case` labels for identical bodies;** never copy a `switch` arm. |
| 9 | **One-call-site helpers stay inline.** Name a function when it has 2+ call sites or clearly clears the call site. |
| 10 | **Trust types; no guards against impossible states.** If the prop type says `string`, don't `if (!label)`. Validate only at true boundaries. No `console.warn` dev checks for misuse the types already prevent. |
| 11 | **CSS only for states that exist.** No `.motiv-x--loading` without a `loading` prop; no `prefers-reduced-motion` block on a component with no transition; no `@media print` without a reason. Add the rule in the commit that adds the state. |
| 12 | **Values from tokens.** Colors, radii, spacing, shadows, fonts, durations come from `--motiv-*` tokens; per-size steps live once on the size modifier as private `--_*` variables. A literal is how two components drift. |
| 13 | **New tokens and classes are API.** A `--motiv-<comp>-*` token or a `motiv-*` element class exists because an app needs to target it. Internal-only knobs use `--_*` private variables, which are not API. |
| 14 | **No module-level side effects, no browser globals in render.** Tree-shaking and server rendering depend on it. `window`/`document` only in effects and handlers. |
| 15 | **No TODOs.** Ship the feature in this change or delete the plumbing. |
| 16 | **Comment only what the code cannot say** — see `references/comments.md`. Default is no comment. |
| 17 | **Rename at the source; alias at the consumer on collision.** Don't wrap a value in `useMemo` just to rename it. |

---

## Example

Before — speculative API:

```tsx
type BadgeProps = {
  label: string;
  tone?: 'neutral' | 'info' | 'success' | 'warning' | 'danger' | 'brand';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  onBadgeClick?: () => void;
  testId?: string;
};
```

After — what the spec and one app need, native props for the rest:

```tsx
type BadgeProps = ComponentProps<'span'> & {
  tone?: 'neutral' | 'success' | 'danger';
};
```

`children` replaces `label`, `data-testid` and `onClick` arrive via `...rest`, and `size` waits
until an app needs a second one.

---

## Anti-Rationalizations

| Excuse | Reality |
|---|---|
| "Another app will probably need this prop" | Then it will ask, with the real signature. Until then it is a contract you support for nothing. |
| "A full `xs`–`xl` scale is more complete" | Each value is a class, a test, a story and a breaking change to remove. |
| "A custom `onPress` reads nicer" | Apps already know `onClick`. Spread native props. |
| "useMemo can't hurt in a library" | It costs every render. Measure, or have a reference consumer. |
| "I'll add the loading CSS now, the prop comes later" | Dead CSS ships to every app. Add it with the prop. |
| "I'll expose a token for every property" | Each token is API. Expose what apps override; keep the rest `--_*`. |
| "A defensive null check is cheap" | It lies about the type. Fix the type or delete the check. |
| "I'll leave a TODO" | Shipped TODOs are unshipped features in a published package. |
| "Future readers will want to know why" | Commit body or ADR. Not in the code. |

---

## Review Checklist (before saying "done")

- [ ] Every new prop, variant value, size, class, token and export is named in the spec or requested by a real app — and was discussed
- [ ] Props extend the native element's props; `className` merges, `...rest` and `ref` pass through
- [ ] No generic without two concrete uses
- [ ] Every `useMemo`/`useCallback` has a reference consumer or a measured reason
- [ ] No library options equal to the library default
- [ ] No CSS for states the component doesn't have
- [ ] All values are tokens or private `--_*` variables derived from them
- [ ] No module-level side effects; no browser globals during render
- [ ] No single-use helpers, duplicate branches or impossible-state guards
- [ ] Every comment passes the mechanism-or-external-constraint test (`references/comments.md`)
- [ ] No TODOs

If a box can't be checked, fix it or justify the exception in the commit body.

---

## When the Rules Don't Apply

- **The spec names it.** An API in the accepted spec/plan has its caller — that's the decision.
- **A dependency contract requires it** (e.g. a generic tied to TanStack's `TData`).
- **Tests and stories** may repeat setup and carry "what" comments; they are read serially.

---

## Cross-Reference

- Visual and state design: the sibling `frontend-design` skill
- Hard constraints and public-API rules: `CLAUDE.md`
- Release impact of API changes: the sibling `releasing` skill
