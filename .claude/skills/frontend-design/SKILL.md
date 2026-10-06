---
name: frontend-design
description: Visual and interaction design for motiv's components. Use when designing, styling or restyling a component (`.css`, variants, sizes, states), adding or deriving `--motiv-*` tokens, working on light/dark or re-theming, choosing motion, or reviewing a component or its Storybook stories for visual, state, contrast, motion, density or responsive issues.
---

motiv is a component library, not an app. Its default look is openbao-dough — clean surfaces,
green primary, orange secondary, pill buttons, subtle motion — but that look is only the default
token values. Every app re-themes it. Design decisions must survive a different palette, a
different radius, dark mode and an ancestor that overrides component tokens.

## Use the Foundations — Do Not Re-Invent

| Foundation | Location |
|---|---|
| Base + derived tokens, light/dark | `src/styles/tokens.css` |
| Layer order, component imports | `src/styles/index.css` |
| Opt-in reset / typography | `src/styles/base.css` |
| Theming docs (what apps may override) | `src/docs/Theming.mdx` |
| Sibling components to match | `src/components/<Name>/<Name>.css` |

**Rules:**
- **Token-only values.** Colors, radii, spacing, shadows, fonts, durations and easings come from
  `--motiv-*` tokens. No hex, no `rgba()`, no ad-hoc `font-size` in a component stylesheet. Size
  steps for `sm`/`md`/`lg` may be `rem` values or `calc()` on `--motiv-space`, set once per size
  class as a private `--_*` variable.
- **Semantic tokens only.** No named ramps (`--motiv-green-500`). A new color need is either a
  derivation of an existing base token or a new semantic base token — the latter is public API,
  ask first.
- **Derive, don't add.** Hover, subtle, muted and border shades come from `color-mix(in oklch, …)`
  against current `--motiv-color-bg`/`--motiv-color-text`, so one overridden base token rebrands
  everything and dark mode keeps working.
- **Component tokens with fallbacks.** Every themable property reads
  `var(--motiv-<comp>-<prop>, var(--motiv-<base-token>))`, e.g.
  `background: var(--motiv-btn-bg, var(--motiv-color-primary))`. Derived per-component shades
  (hover) are computed inside the component from the resolved `--_bg`, so a subtree override of
  `--motiv-btn-bg` also changes hover. Each new `--motiv-<comp>-*` is public API — add only the
  ones an app needs to override.
- **Everything in `@layer motiv.*`.** An unlayered app rule must win without `!important`. Keep
  specificity flat: one BEM class per selector, modifiers as `.motiv-x--mod`, no IDs, no element
  chains.
- **Match siblings.** A new component uses the same radius family, focus ring, border width,
  duration and density steps as existing ones. Read their `.css` first.

---

## State Contract

Every interactive component visibly and semantically covers each state that applies:

| State | How |
|---|---|
| hover | `@media (hover: hover)` + `:hover:not(:disabled)`; distinct from default, not just cursor |
| active | `:active` — slightly darker/pressed, no layout shift |
| focus-visible | `:focus-visible` with `--motiv-focus-ring`; never removed, never on mouse click |
| disabled | `:disabled` **and** `[aria-disabled="true"]`; reduced emphasis, no hover response |
| loading | spinner, `aria-busy="true"`, disabled; width does not jump |
| empty | a designed empty state with a prop-supplied English default string |
| error | text + icon/position, never color alone; linked via `aria-describedby` |

Selected/checked/expanded states read from ARIA attributes (`[aria-pressed="true"]`,
`[aria-expanded="true"]`) so style and semantics cannot disagree.

Write only states the component has (`writing-simple-code` Rule 11) — no `.is-loading` on a
component without a loading prop.

---

## Light, Dark and Re-theming

- Check every variant in both themes: `[data-theme="dark"]` on `<html>` and
  `prefers-color-scheme` with no attribute.
- Surfaces separate by subtle contrast and `--motiv-shadow-*`, not by hard borders everywhere.
  Shadows use `--motiv-shadow-color` via `color-mix`, never black.
- **Contrast of on-\* colors.** Text on filled backgrounds uses `--motiv-color-on-{primary,…}`.
  Verify ≥ 4.5:1 for label text (3:1 for large text and non-text UI like borders and focus rings)
  for the default palette in both themes, and for hover/active shades too — a 15% mix can drop
  below the threshold. Orange with white text is the usual failure.
- Try one foreign palette in a story (a blue primary, square radius) — if the component breaks,
  it depended on the default look.

---

## Density and Sizes

- `sm` / `md` (default) / `lg` change height, horizontal padding, font size and gap together;
  radius and border width stay. Size steps live on the modifier class, read via private `--_*`.
- Heights align across components: an `sm` button sits next to an `sm` input at the same height.
- Hit area ≥ 24×24px at every size (WCAG 2.5.8); `md` and up should reach 40–44px for touch.
- Icons scale with the size (`1em`-based), text never wraps inside pills.

---

## Visual Hierarchy

Apply in order; stop when hierarchy is clear:

1. **White space** — padding and gap express grouping.
2. **Weight** — bold vs regular.
3. **Size** — skip steps for meaningful contrast.
4. **Color** — only when 1–3 are insufficient.
5. **Ornament** — borders, backgrounds, shadows — last resort.

Within a component: one emphasized element (title, primary action), the rest recedes. Variants
form a ladder: `primary` (filled) > `secondary` > `outline` > `ghost`; `danger` only for
destructive actions.

---

## Motion

- Purposeful only: confirm a state change (hover, press, open). No decorative motion.
- Duration and easing from `--motiv-duration` / `--motiv-ease`; 100–250ms. No bounce/elastic.
- Transition specific properties (`background-color`, `border-color`, `box-shadow`, `transform`),
  never `all`.
- `@media (prefers-reduced-motion: reduce)` removes transitions and transforms on every component
  that has them. Spinners may keep rotating slowly — they convey state.
- CSS only. No animation library in core components.

---

## Responsive

- Components are fluid by default: they fill or shrink to the container the app gives them; no
  fixed widths, no viewport media queries inside components unless the component's own layout
  demands it. Prefer container queries when a component must adapt to its own width.
- Long labels truncate or wrap by design, decided per component and shown in a story.
- Server-rendered first paint must look right without JS (Astro static HTML).

---

## Avoid Generic AI Tells

- Purple→blue gradients, gradient text, glassmorphism without reason.
- Identical shadow on every elevation level; cards nested in cards.
- Hover effects on non-interactive elements.
- Pure `#000`/`#fff` — use the tokens.

Every visual choice should be traceable to a state or a hierarchy need. If you can't name why,
strip it.

---

## Stories Are the Review Surface

Each component's `.stories.tsx` is where the design is checked:

- one story per variant and per size, plus a matrix story (variants × sizes × states including
  disabled and loading);
- light and dark via the toolbar;
- a re-theme story overriding component tokens on a wrapper;
- long-content and empty-content stories where they apply.

Review in Storybook before calling a visual change done (`pnpm build-storybook` must pass).

---

## Review Checklist

- [ ] Every color/size/radius/shadow/duration is a `--motiv-*` token or a derivation of one
- [ ] Themable properties read component tokens with base-token fallbacks
- [ ] Hover/subtle shades derive via `color-mix` from the resolved value, not a fixed color
- [ ] All applicable states: hover, active, focus-visible, disabled (+ aria-disabled), loading, empty, error
- [ ] Light and dark both checked; on-* contrast ≥ 4.5:1, including hover/active shades
- [ ] `sm`/`md`/`lg` align with sibling components; hit area ≥ 24px
- [ ] Transitions name properties; `prefers-reduced-motion` honored
- [ ] Rules inside `@layer motiv.*`, single-class specificity
- [ ] Stories cover variants, sizes, states, dark, re-theme
- [ ] No new public class or token that no app needs (ask before adding one)

---

## Anti-Rationalizations

| Excuse | Reality |
|---|---|
| "This green is the brand, I'll hardcode it" | It's the default, not the brand. Apps re-theme; use the token. |
| "I'll add `--motiv-color-primary-600`" | Named ramps are not the model. Derive with `color-mix`. |
| "Contrast is fine in light mode" | Check dark and hover shades too. |
| "Focus rings are ugly" | Style it with `--motiv-focus-ring`; don't remove it. |
| "One more component token can't hurt" | It is public API forever. Add the ones apps need. |
| "`transition: all` is shorter" | It animates layout and color-scheme flips. Name properties. |
