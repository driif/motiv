# Comments

The default is **no comment**. Code that needs a paragraph to justify itself usually needs a better name or a smaller function. Reach for a comment only when one of the two tests below passes, and keep it short.

## The two tests

**1. Mechanism.** A reader who understands the language still cannot work out *how this works* or *what invariant holds it together*. Why a private `--_bg` variable must be resolved before the hover mix, why an effect must run before another, why two values must be keyed the same way.

**2. External constraint.** The reason lives outside this repo or outside this file, so no amount of reading the code recovers it. A browser bug, a library default that bites, a WAI-ARIA pattern or spec section, an ADR number, a consumer environment (Astro server render) that forbids something.

If neither test passes, delete it. If you are unsure, delete it — git history and the PR discussion are where reasoning belongs.

## Public API docs are different

JSDoc on an **exported** prop or component is consumer documentation and shows up in editor hovers and Storybook. Keep it to one line that says what a caller can't infer from the name and type — the default if non-obvious, or a behavioral effect (`/** Shows a spinner, sets aria-busy and disables the button. */`). Don't JSDoc a prop whose name and type already say everything (`variant`, `size`, `className`).

## Delete on sight

| Pattern | Example |
|---|---|
| **Decision journal** — why this shape was chosen over another | `// Spread rest instead of picking props because apps pass data-* attributes` |
| **Counterfactual** — what would break without the line | `// Without this the hover color ignores a subtree --motiv-btn-bg override` |
| **Per-guard justification** — a paragraph defending each condition | `// !loading: a loading button is already disabled, but we also check here so…` |
| **Restatement** — the next line already says it | `// Merge class names`, `// Render the icon` |
| **JSDoc echoing the signature** | `/** The button variant */` above `variant?: ButtonVariant` |
| **Change narration** | `// now uses color-mix`, `// previously forwardRef`, `// removed: size xl` |
| **Option-name echo** | `enableSorting: true, // enable sorting` |
| **Defensive hedging** | `// belt and braces`, `// just in case` |

## Length

- Inline: **1 line**, 2 if the mechanism genuinely needs it.
- Function or module header: **3 lines** max.
- A comment longer than the code it describes is a design smell, not documentation.

Prefer a link to the durable source over an inline retelling: `// ADR 0002` or a spec URL beats four lines paraphrasing it.

## Worked example

Before — a decision journal for one CSS line:

```css
/* We compute the hover color here instead of using --motiv-color-primary-hover
   from tokens.css, because an app may set --motiv-btn-bg on a wrapper to make
   a subtree of buttons a different color, and in that case the global hover
   token would still be the primary hover and the button would flash green on
   hover. Computing from --_bg makes hover follow whatever the bg resolved to. */
--_bg-hover: color-mix(in oklch, var(--_bg), var(--motiv-color-text) 15%);
```

After — the mechanism, once:

```css
/* Derived from the resolved --_bg so subtree --motiv-btn-bg overrides also shift hover. */
--_bg-hover: color-mix(in oklch, var(--_bg), var(--motiv-color-text) 15%);
```

## Where the deleted reasoning goes

Not nowhere — somewhere durable:

- **Commit body** for why this shape over another.
- **ADR** under `docs/adr/` for a decision that outlives the diff.
- **PR description** for review context.
- **A test** for a counterfactual worth protecting — better than a comment claiming it.
- **A story** for a visual behavior worth protecting (subtree re-theme, long label).
