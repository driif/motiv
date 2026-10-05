# motiv foundation (v0.1) Implementation Plan

> **For agentic workers:** executed through the `duo` skill. Task 1 is done by the orchestrator
> before the round starts (it needs network for `pnpm install`). Duo implements Tasks 2–7.
> Agents never commit — changes stay in the working tree for the user's review.
> Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship the `@driif/motiv` package skeleton — tokens, build, Button, Card, Storybook, tests,
package checks and release workflow — so apps can install it and import only what they use.

**Architecture:** Plain-CSS components (`motiv-*` BEM classes inside `@layer motiv`) themed by
CSS custom properties; React components only map props to classes. tsdown builds unbundled ESM
(one file per module) for tree-shaking; Lightning CSS bundles one `styles.css`.

**Tech Stack:** React 19, TypeScript, tsdown, Lightning CSS, Vitest + Testing Library, Storybook 10
(react-vite), Biome, Changesets, pnpm.

**Spec:** `docs/specs/2026-10-05-motiv-foundation-design.md`

## Global Constraints

- Package name `@driif/motiv`; ESM only; `"sideEffects": ["**/*.css"]`.
- `react` and `react-dom` are `peerDependencies` `>=19`; **no runtime `dependencies`** in v0.1.
- React 19 ref-as-prop; no `forwardRef`; function components only; named exports only.
- Every class starts with `motiv-`; every library rule lives in `@layer motiv.tokens`,
  `motiv.base` or `motiv.components`.
- Every custom property starts with `--motiv-`; component-private ones start with `--_`.
- Component `.css` files are never imported from `.tsx`.
- No hooks and no `window`/`document` access in Button or Card (must render on the server).
- Browser targets: Chrome/Edge 111, Firefox 113, Safari 16.2 (`color-mix()` support).
- Code, comments and docs in English. Comments only for non-obvious mechanisms.

## Review Focus

1. Clicking a `loading` button must not call `onClick` — tested in Task 3.
2. A `<Button>` inside a `<form>` with no `type` must not submit the form — tested in Task 3.
3. Consumer `className`, `aria-*`, `data-*` and `ref` must merge/pass through, never be dropped — tested in Tasks 3 and 4.
4. Components must render with `react-dom/server` in a Node environment (Astro SSR) — tested in Task 5.
5. Overriding `--motiv-color-primary` on a subtree (not `:root`) must also change hover shades — component hover colors are derived inside the component rule, checked in the Storybook "Subtree override" story (Task 6).

---

### Task 1: Tooling scaffold (orchestrator, before duo)

**Files:**
- Create: `package.json`, `tsconfig.json`, `biome.json`, `vitest.config.ts`, `vitest.setup.ts`,
  `.gitignore`, `src/utils/cx.ts`, `src/utils/cx.test.ts`

**Interfaces:**
- Produces: `cx(...parts: Array<string | false | null | undefined>): string` in `src/utils/cx.ts`;
  scripts `check`, `format`, `typecheck`, `test`, `build`, `check:package`, `storybook`,
  `build-storybook`, `changeset`, `release`.

- [ ] **Step 1: `package.json`**

```json
{
  "name": "@driif/motiv",
  "version": "0.0.0",
  "description": "React UI components with plain, themeable CSS",
  "license": "MIT",
  "type": "module",
  "sideEffects": ["**/*.css"],
  "files": ["dist"],
  "exports": {
    ".": { "types": "./dist/index.d.ts", "default": "./dist/index.js" },
    "./styles.css": "./dist/styles.css",
    "./tokens.css": "./dist/tokens.css",
    "./base.css": "./dist/base.css",
    "./package.json": "./package.json"
  },
  "scripts": {
    "check": "biome check .",
    "format": "biome check --write .",
    "typecheck": "tsc --noEmit",
    "test": "vitest run",
    "build": "tsdown && node scripts/build-css.mjs",
    "check:package": "publint && attw --pack . --profile esm-only && node scripts/check-treeshake.mjs",
    "storybook": "storybook dev -p 6006",
    "build-storybook": "storybook build",
    "changeset": "changeset",
    "release": "pnpm build && changeset publish"
  },
  "peerDependencies": { "react": ">=19", "react-dom": ">=19" },
  "publishConfig": { "access": "public" }
}
```

Dev dependencies installed with `pnpm add -D`: `@arethetypeswrong/cli @biomejs/biome
@changesets/cli @storybook/addon-docs @storybook/react-vite @testing-library/jest-dom
@testing-library/react @types/react @types/react-dom @vitejs/plugin-react jsdom lightningcss
publint react react-dom rolldown storybook tsdown typescript vite vitest`.

- [ ] **Step 2: configs** — `tsconfig.json` (strict, `jsx: react-jsx`, `moduleResolution: bundler`,
  `verbatimModuleSyntax`, `noEmit`, `types: ["vitest/globals"]` not used — tests import from
  `vitest`), `biome.json` (single quotes, space indent, organize imports, ignore `dist`,
  `storybook-static`), `vitest.config.ts` (`@vitejs/plugin-react`, `environment: 'jsdom'`,
  `setupFiles: ['./vitest.setup.ts']`), `vitest.setup.ts` (`import '@testing-library/jest-dom/vitest'`),
  `.gitignore` (`node_modules`, `dist`, `storybook-static`, `docs/tasks/`, `.revmux/tasks/`).

- [ ] **Step 3: failing test** `src/utils/cx.test.ts`

```ts
import { describe, expect, it } from 'vitest';
import { cx } from './cx';

describe('cx', () => {
  it('joins truthy parts with a space', () => {
    expect(cx('a', false, null, undefined, '', 'b')).toBe('a b');
  });
});
```

- [ ] **Step 4: implement** `src/utils/cx.ts`

```ts
export function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(' ');
}
```

- [ ] **Step 5:** `pnpm test && pnpm check && pnpm typecheck` all pass. Orchestrator commits.

---

### Task 2: Tokens, base styles, stylesheet entry and CSS build

**Files:**
- Create: `src/styles/tokens.css`, `src/styles/base.css`, `src/styles/index.css`, `scripts/build-css.mjs`

**Interfaces:**
- Consumes: nothing.
- Produces (tokens later tasks use): `--motiv-color-{primary,secondary,danger,success,warning}`,
  `--motiv-color-on-{primary,secondary,danger}`, `--motiv-color-{bg,surface,text,border}`,
  `--motiv-shadow-color`, `--motiv-radius`, `--motiv-space`, `--motiv-font-body`,
  `--motiv-font-title`, `--motiv-font-size`, `--motiv-duration`, `--motiv-ease`;
  derived `--motiv-color-primary-subtle`, `--motiv-color-text-muted`,
  `--motiv-color-surface-hover`, `--motiv-radius-{sm,md,lg,full}`, `--motiv-shadow-{sm,md,lg}`,
  `--motiv-focus-ring`. `src/styles/index.css` is the stylesheet Storybook imports.

- [ ] **Step 1: `src/styles/tokens.css`**

```css
@layer motiv.tokens {
  :root {
    color-scheme: light;
    --motiv-color-primary: #22c55e;
    --motiv-color-on-primary: #052e16;
    --motiv-color-secondary: #f97316;
    --motiv-color-on-secondary: #431407;
    --motiv-color-danger: #dc2626;
    --motiv-color-on-danger: #ffffff;
    --motiv-color-success: #16a34a;
    --motiv-color-warning: #f59e0b;

    --motiv-color-bg: #ffffff;
    --motiv-color-surface: #f8fafc;
    --motiv-color-text: #0f172a;
    --motiv-color-border: #e2e8f0;
    --motiv-shadow-color: rgb(15 23 42);

    --motiv-radius: 0.75rem;
    --motiv-space: 0.25rem;
    --motiv-font-body: system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
    --motiv-font-title: var(--motiv-font-body);
    --motiv-font-size: 1rem;
    --motiv-duration: 200ms;
    --motiv-ease: cubic-bezier(0.2, 0, 0, 1);
  }

  [data-theme='dark'] {
    color-scheme: dark;
    --motiv-color-bg: #0b1120;
    --motiv-color-surface: #111827;
    --motiv-color-text: #e5e7eb;
    --motiv-color-border: #1f2937;
    --motiv-shadow-color: rgb(0 0 0);
  }

  @media (prefers-color-scheme: dark) {
    :root:not([data-theme]) {
      color-scheme: dark;
      --motiv-color-bg: #0b1120;
      --motiv-color-surface: #111827;
      --motiv-color-text: #e5e7eb;
      --motiv-color-border: #1f2937;
      --motiv-shadow-color: rgb(0 0 0);
    }
  }

  /* Derived tokens resolve where they are declared, so they are re-declared on every
     [data-theme] element: a subtree with its own data-theme gets its own derivations. */
  :where(:root, [data-theme]) {
    --motiv-color-primary-subtle: color-mix(in oklch, var(--motiv-color-primary) 14%, transparent);
    --motiv-color-text-muted: color-mix(in oklch, var(--motiv-color-text) 65%, var(--motiv-color-bg));
    --motiv-color-surface-hover: color-mix(in oklch, var(--motiv-color-surface), var(--motiv-color-text) 6%);
    --motiv-radius-sm: calc(var(--motiv-radius) * 0.5);
    --motiv-radius-md: var(--motiv-radius);
    --motiv-radius-lg: calc(var(--motiv-radius) * 1.5);
    --motiv-radius-full: 9999px;
    --motiv-shadow-sm: 0 1px 2px color-mix(in oklch, var(--motiv-shadow-color) 8%, transparent);
    --motiv-shadow-md: 0 4px 14px color-mix(in oklch, var(--motiv-shadow-color) 12%, transparent);
    --motiv-shadow-lg: 0 10px 30px color-mix(in oklch, var(--motiv-shadow-color) 16%, transparent);
    --motiv-focus-ring: 0 0 0 2px var(--motiv-color-bg), 0 0 0 4px var(--motiv-color-primary);
  }
}
```

- [ ] **Step 2: `src/styles/base.css`** (opt-in; components do not depend on it)

```css
@layer motiv.base {
  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }

  body {
    margin: 0;
    font-family: var(--motiv-font-body);
    font-size: var(--motiv-font-size);
    line-height: 1.5;
    color: var(--motiv-color-text);
    background: var(--motiv-color-bg);
    -webkit-font-smoothing: antialiased;
  }

  h1, h2, h3, h4, h5, h6 {
    font-family: var(--motiv-font-title);
    line-height: 1.2;
  }
}
```

- [ ] **Step 3: `src/styles/index.css`** — layer order first, then imports. Component files are
  added by Tasks 3 and 4.

```css
@layer motiv.tokens, motiv.base, motiv.components;

@import './tokens.css';
```

- [ ] **Step 4: `scripts/build-css.mjs`**

```js
import { mkdirSync, writeFileSync } from 'node:fs';
import { bundle } from 'lightningcss';

const targets = {
  chrome: 111 << 16,
  edge: 111 << 16,
  firefox: 113 << 16,
  safari: (16 << 16) | (2 << 8),
};

const files = [
  ['src/styles/index.css', 'dist/styles.css'],
  ['src/styles/tokens.css', 'dist/tokens.css'],
  ['src/styles/base.css', 'dist/base.css'],
];

mkdirSync('dist', { recursive: true });
for (const [filename, out] of files) {
  const { code } = bundle({ filename, minify: true, targets });
  writeFileSync(out, code);
}
```

- [ ] **Step 5: verify** — `node scripts/build-css.mjs` exits 0; `dist/styles.css` starts with the
  `@layer motiv.tokens,motiv.base,motiv.components` statement and contains `--motiv-color-primary`.
  `pnpm check` passes.

---

### Task 3: Button

**Files:**
- Create: `src/components/Button/Button.tsx`, `Button.css`, `Button.test.tsx`, `index.ts`
- Modify: `src/styles/index.css` (add `@import '../components/Button/Button.css';`)

**Interfaces:**
- Consumes: `cx` from `src/utils/cx.ts`; tokens from Task 2.
- Produces: `Button`, `buttonClassName`, types `ButtonProps`, `ButtonVariant`, `ButtonSize`,
  `ButtonClassNameOptions`, re-exported from `src/components/Button/index.ts`.

- [ ] **Step 1: failing tests** `src/components/Button/Button.test.tsx`

```tsx
import { fireEvent, render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { Button, buttonClassName } from './Button';

describe('Button', () => {
  it('renders primary md by default with type="button"', () => {
    render(<Button>Save</Button>);
    const button = screen.getByRole('button', { name: 'Save' });
    expect(button).toHaveClass('motiv-btn', 'motiv-btn--primary', 'motiv-btn--md');
    expect(button).toHaveAttribute('type', 'button');
  });

  it('applies variant and size classes', () => {
    render(<Button variant="ghost" size="sm">Go</Button>);
    expect(screen.getByRole('button')).toHaveClass('motiv-btn--ghost', 'motiv-btn--sm');
  });

  it('merges className and passes native props and ref through', () => {
    const ref = createRef<HTMLButtonElement>();
    render(
      <Button ref={ref} className="extra" aria-label="Close" data-testid="b" type="submit">
        x
      </Button>,
    );
    const button = screen.getByTestId('b');
    expect(button).toHaveClass('motiv-btn', 'extra');
    expect(button).toHaveAttribute('aria-label', 'Close');
    expect(button).toHaveAttribute('type', 'submit');
    expect(ref.current).toBe(button);
  });

  it('does not submit a surrounding form without an explicit type', () => {
    const onSubmit = vi.fn((e: { preventDefault(): void }) => e.preventDefault());
    render(
      <form onSubmit={onSubmit}>
        <Button>Inside</Button>
      </form>,
    );
    fireEvent.click(screen.getByRole('button'));
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('loading disables the button, sets aria-busy and blocks onClick', () => {
    const onClick = vi.fn();
    render(
      <Button loading disabled={false} onClick={onClick}>
        Save
      </Button>,
    );
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute('aria-busy', 'true');
    fireEvent.click(button);
    expect(onClick).not.toHaveBeenCalled();
  });

  it('renders icons on both sides', () => {
    render(
      <Button iconLeft={<svg data-testid="l" />} iconRight={<svg data-testid="r" />}>
        Go
      </Button>,
    );
    expect(screen.getByTestId('l')).toBeInTheDocument();
    expect(screen.getByTestId('r')).toBeInTheDocument();
  });
});

describe('buttonClassName', () => {
  it('builds the same classes for non-button elements', () => {
    expect(buttonClassName({ variant: 'outline', size: 'lg', className: 'x' })).toBe(
      'motiv-btn motiv-btn--outline motiv-btn--lg x',
    );
    expect(buttonClassName()).toBe('motiv-btn motiv-btn--primary motiv-btn--md');
  });
});
```

- [ ] **Step 2:** `pnpm test src/components/Button` → FAIL (module not found).

- [ ] **Step 3: implement** `src/components/Button/Button.tsx`

```tsx
import type { ComponentProps, ReactNode } from 'react';
import { cx } from '../../utils/cx';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonClassNameOptions {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
}

export function buttonClassName({
  variant = 'primary',
  size = 'md',
  className,
}: ButtonClassNameOptions = {}): string {
  return cx('motiv-btn', `motiv-btn--${variant}`, `motiv-btn--${size}`, className);
}

export interface ButtonProps extends ComponentProps<'button'> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
  loading?: boolean;
}

export function Button({
  variant,
  size,
  iconLeft,
  iconRight,
  loading = false,
  disabled,
  type = 'button',
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={buttonClassName({ variant, size, className })}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...props}
    >
      {loading ? (
        <span className="motiv-btn__spinner" aria-hidden="true" />
      ) : (
        iconLeft && (
          <span className="motiv-btn__icon" aria-hidden="true">
            {iconLeft}
          </span>
        )
      )}
      <span className="motiv-btn__label">{children}</span>
      {iconRight && (
        <span className="motiv-btn__icon" aria-hidden="true">
          {iconRight}
        </span>
      )}
    </button>
  );
}
```

`src/components/Button/index.ts`:

```ts
export { Button, buttonClassName } from './Button';
export type { ButtonClassNameOptions, ButtonProps, ButtonSize, ButtonVariant } from './Button';
```

- [ ] **Step 4: `src/components/Button/Button.css`** — variant colors are resolved on the button
  itself so a subtree override of `--motiv-color-*` or `--motiv-btn-*` also changes hover.

```css
@layer motiv.components {
  .motiv-btn {
    --_bg: var(--motiv-btn-bg, var(--motiv-color-primary));
    --_color: var(--motiv-btn-color, var(--motiv-color-on-primary));
    --_border: var(--motiv-btn-border-color, var(--_bg));
    --_bg-hover: color-mix(in oklch, var(--_bg), var(--motiv-color-text) 15%);

    box-sizing: border-box;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: calc(var(--motiv-space) * 2);
    min-height: var(--motiv-btn-height, var(--_height));
    padding: 0 var(--motiv-btn-px, var(--_px));
    font-family: var(--motiv-btn-font, var(--motiv-font-body));
    font-size: var(--_font-size);
    font-weight: 600;
    line-height: 1;
    color: var(--_color);
    background: var(--_bg);
    border: var(--motiv-btn-border-width, 2px) solid var(--_border);
    border-radius: var(--motiv-btn-radius, var(--motiv-radius-full));
    cursor: pointer;
    text-decoration: none;
    white-space: nowrap;
    user-select: none;
    transition:
      background-color var(--motiv-duration) var(--motiv-ease),
      border-color var(--motiv-duration) var(--motiv-ease),
      color var(--motiv-duration) var(--motiv-ease),
      box-shadow var(--motiv-duration) var(--motiv-ease),
      transform var(--motiv-duration) var(--motiv-ease);

    &:hover:not(:disabled, [aria-disabled='true']) {
      background: var(--motiv-btn-bg-hover, var(--_bg-hover));
      border-color: var(--motiv-btn-border-color-hover, var(--_border-hover, var(--_bg-hover)));
    }

    &:active:not(:disabled, [aria-disabled='true']) {
      transform: translateY(1px);
    }

    &:focus-visible {
      outline: none;
      box-shadow: var(--motiv-focus-ring);
    }

    &:disabled,
    &[aria-disabled='true'] {
      opacity: 0.5;
      cursor: not-allowed;
    }

    &[aria-busy='true'] {
      cursor: progress;
    }
  }

  .motiv-btn--sm { --_height: 2rem; --_px: calc(var(--motiv-space) * 3); --_font-size: 0.875rem; }
  .motiv-btn--md { --_height: 2.5rem; --_px: calc(var(--motiv-space) * 5); --_font-size: 0.9375rem; }
  .motiv-btn--lg { --_height: 3rem; --_px: calc(var(--motiv-space) * 6); --_font-size: 1rem; }

  .motiv-btn--secondary {
    --_bg: var(--motiv-btn-bg, var(--motiv-color-secondary));
    --_color: var(--motiv-btn-color, var(--motiv-color-on-secondary));
  }

  .motiv-btn--danger {
    --_bg: var(--motiv-btn-bg, var(--motiv-color-danger));
    --_color: var(--motiv-btn-color, var(--motiv-color-on-danger));
  }

  .motiv-btn--outline {
    --_bg: var(--motiv-btn-bg, transparent);
    --_color: var(--motiv-btn-color, var(--motiv-color-text));
    --_border: var(--motiv-btn-border-color, var(--motiv-color-primary));
    --_bg-hover: color-mix(in oklch, var(--motiv-color-primary) 14%, transparent);
    --_border-hover: var(--_border);
  }

  .motiv-btn--ghost {
    --_bg: var(--motiv-btn-bg, transparent);
    --_color: var(--motiv-btn-color, var(--motiv-color-text));
    --_border: var(--motiv-btn-border-color, transparent);
    --_bg-hover: color-mix(in oklch, var(--motiv-color-text) 8%, transparent);
    --_border-hover: transparent;
  }

  .motiv-btn__icon {
    display: inline-flex;

    & > svg {
      width: 1.15em;
      height: 1.15em;
    }
  }

  .motiv-btn__spinner {
    width: 1em;
    height: 1em;
    border: 2px solid currentColor;
    border-right-color: transparent;
    border-radius: 50%;
    animation: motiv-spin 0.7s linear infinite;
  }

  @keyframes motiv-spin {
    to { transform: rotate(360deg); }
  }

  @media (prefers-reduced-motion: reduce) {
    .motiv-btn { transition: none; }
    .motiv-btn:active:not(:disabled) { transform: none; }
    .motiv-btn__spinner { animation-duration: 1.6s; }
  }
}
```

Add `@import '../components/Button/Button.css';` to `src/styles/index.css`.

- [ ] **Step 5:** `pnpm test src/components/Button` → PASS; `pnpm check && pnpm typecheck` pass.

---

### Task 4: Card

**Files:**
- Create: `src/components/Card/Card.tsx`, `Card.css`, `Card.test.tsx`, `index.ts`
- Modify: `src/styles/index.css` (add `@import '../components/Card/Card.css';`)

**Interfaces:**
- Consumes: `cx`; tokens from Task 2.
- Produces: `Card`, `CardHeader`, `CardBody`, `CardFooter`, types `CardProps`, `CardVariant`,
  `CardPadding`, `CardHeaderProps`, re-exported from `src/components/Card/index.ts`.

- [ ] **Step 1: failing tests** `src/components/Card/Card.test.tsx`

```tsx
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Card, CardBody, CardFooter, CardHeader } from './Card';

describe('Card', () => {
  it('renders an elevated md div by default', () => {
    render(<Card data-testid="c">x</Card>);
    const card = screen.getByTestId('c');
    expect(card.tagName).toBe('DIV');
    expect(card).toHaveClass('motiv-card', 'motiv-card--elevated', 'motiv-card--p-md');
    expect(card).not.toHaveClass('motiv-card--interactive');
  });

  it('applies variant, padding, interactive, as and className', () => {
    render(
      <ul>
        <Card as="li" variant="outlined" padding="none" interactive className="mine" data-testid="c">
          x
        </Card>
      </ul>,
    );
    const card = screen.getByTestId('c');
    expect(card.tagName).toBe('LI');
    expect(card).toHaveClass(
      'motiv-card--outlined',
      'motiv-card--p-none',
      'motiv-card--interactive',
      'mine',
    );
  });

  it('CardHeader renders title as h3 by default, description and actions', () => {
    render(<CardHeader title="Users" description="Active" actions={<button type="button">Add</button>} />);
    expect(screen.getByRole('heading', { level: 3, name: 'Users' })).toHaveClass('motiv-card__title');
    expect(screen.getByText('Active')).toHaveClass('motiv-card__description');
    expect(screen.getByRole('button', { name: 'Add' }).parentElement).toHaveClass('motiv-card__actions');
  });

  it('CardHeader titleAs changes the heading element and omits empty slots', () => {
    const { container } = render(<CardHeader title="T" titleAs="h2" />);
    expect(screen.getByRole('heading', { level: 2 })).toBeInTheDocument();
    expect(container.querySelector('.motiv-card__description')).toBeNull();
    expect(container.querySelector('.motiv-card__actions')).toBeNull();
  });

  it('CardBody and CardFooter merge className', () => {
    render(
      <>
        <CardBody className="b" data-testid="body" />
        <CardFooter className="f" data-testid="footer" />
      </>,
    );
    expect(screen.getByTestId('body')).toHaveClass('motiv-card__body', 'b');
    expect(screen.getByTestId('footer')).toHaveClass('motiv-card__footer', 'f');
  });
});
```

- [ ] **Step 2:** `pnpm test src/components/Card` → FAIL.

- [ ] **Step 3: implement** `src/components/Card/Card.tsx`

```tsx
import type { ComponentProps, HTMLAttributes, ReactNode } from 'react';
import { cx } from '../../utils/cx';

export type CardVariant = 'elevated' | 'outlined' | 'subtle';
export type CardPadding = 'none' | 'sm' | 'md' | 'lg';

export interface CardProps extends HTMLAttributes<HTMLElement> {
  as?: 'div' | 'section' | 'article' | 'li';
  variant?: CardVariant;
  padding?: CardPadding;
  interactive?: boolean;
}

export function Card({
  as: Tag = 'div',
  variant = 'elevated',
  padding = 'md',
  interactive = false,
  className,
  ...props
}: CardProps) {
  return (
    <Tag
      className={cx(
        'motiv-card',
        `motiv-card--${variant}`,
        `motiv-card--p-${padding}`,
        interactive && 'motiv-card--interactive',
        className,
      )}
      {...props}
    />
  );
}

export interface CardHeaderProps extends Omit<ComponentProps<'div'>, 'title'> {
  title: ReactNode;
  titleAs?: 'h2' | 'h3' | 'h4' | 'p';
  description?: ReactNode;
  actions?: ReactNode;
}

export function CardHeader({
  title,
  titleAs: Title = 'h3',
  description,
  actions,
  className,
  ...props
}: CardHeaderProps) {
  return (
    <div className={cx('motiv-card__header', className)} {...props}>
      <div className="motiv-card__heading">
        <Title className="motiv-card__title">{title}</Title>
        {description && <p className="motiv-card__description">{description}</p>}
      </div>
      {actions && <div className="motiv-card__actions">{actions}</div>}
    </div>
  );
}

export function CardBody({ className, ...props }: ComponentProps<'div'>) {
  return <div className={cx('motiv-card__body', className)} {...props} />;
}

export function CardFooter({ className, ...props }: ComponentProps<'div'>) {
  return <div className={cx('motiv-card__footer', className)} {...props} />;
}
```

`src/components/Card/index.ts`:

```ts
export { Card, CardBody, CardFooter, CardHeader } from './Card';
export type { CardHeaderProps, CardPadding, CardProps, CardVariant } from './Card';
```

- [ ] **Step 4: `src/components/Card/Card.css`**

```css
@layer motiv.components {
  .motiv-card {
    --_bg: var(--motiv-color-surface);
    --_border: color-mix(in oklch, var(--motiv-color-border) 60%, transparent);
    --_shadow: var(--motiv-shadow-md);

    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    gap: var(--motiv-card-gap, calc(var(--motiv-space) * 4));
    padding: var(--motiv-card-padding, var(--_pad));
    color: var(--motiv-color-text);
    background: var(--motiv-card-bg, var(--_bg));
    border: 1px solid var(--motiv-card-border-color, var(--_border));
    border-radius: var(--motiv-card-radius, var(--motiv-radius-lg));
    box-shadow: var(--motiv-card-shadow, var(--_shadow));
    transition:
      box-shadow var(--motiv-duration) var(--motiv-ease),
      transform var(--motiv-duration) var(--motiv-ease),
      border-color var(--motiv-duration) var(--motiv-ease);
  }

  .motiv-card--outlined {
    --_bg: var(--motiv-color-bg);
    --_border: var(--motiv-color-border);
    --_shadow: none;
  }

  .motiv-card--subtle {
    --_bg: var(--motiv-color-primary-subtle);
    --_border: transparent;
    --_shadow: none;
  }

  .motiv-card--p-none { --_pad: 0; }
  .motiv-card--p-sm { --_pad: calc(var(--motiv-space) * 3); }
  .motiv-card--p-md { --_pad: calc(var(--motiv-space) * 5); }
  .motiv-card--p-lg { --_pad: calc(var(--motiv-space) * 8); }

  .motiv-card--interactive {
    cursor: pointer;

    &:hover {
      transform: translateY(-2px);
      box-shadow: var(--motiv-card-shadow-hover, var(--motiv-shadow-lg));
    }

    &:focus-visible {
      outline: none;
      box-shadow: var(--motiv-focus-ring);
    }
  }

  .motiv-card__header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: calc(var(--motiv-space) * 4);
  }

  .motiv-card__title {
    margin: 0;
    font-family: var(--motiv-font-title);
    font-size: 1.125rem;
    font-weight: 600;
    line-height: 1.3;
  }

  .motiv-card__description {
    margin: var(--motiv-space) 0 0;
    font-size: 0.875rem;
    color: var(--motiv-color-text-muted);
  }

  .motiv-card__actions {
    display: flex;
    flex-shrink: 0;
    gap: calc(var(--motiv-space) * 2);
  }

  .motiv-card__body {
    flex: 1;
  }

  .motiv-card__footer {
    display: flex;
    justify-content: flex-end;
    gap: calc(var(--motiv-space) * 2);
  }

  @media (prefers-reduced-motion: reduce) {
    .motiv-card { transition: none; }
    .motiv-card--interactive:hover { transform: none; }
  }
}
```

Add `@import '../components/Card/Card.css';` to `src/styles/index.css`.

- [ ] **Step 5:** `pnpm test && pnpm check && pnpm typecheck` pass.

---

### Task 5: Public entry, JS build and package checks

**Files:**
- Create: `src/index.ts`, `tsdown.config.ts`, `scripts/check-treeshake.mjs`,
  `test/fixtures/treeshake-button.js`, `src/ssr.test.tsx`

**Interfaces:**
- Consumes: everything exported by Tasks 1, 3, 4.
- Produces: `dist/index.js`, `dist/index.d.ts`, `dist/styles.css`, `dist/tokens.css`,
  `dist/base.css`; `pnpm check:package` passes.

- [ ] **Step 1: `src/index.ts`**

```ts
export * from './components/Button';
export * from './components/Card';
export { cx } from './utils/cx';
```

- [ ] **Step 2: failing SSR test** `src/ssr.test.tsx`

```tsx
// @vitest-environment node
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { Button, Card, CardBody, CardHeader } from './index';

describe('server rendering', () => {
  it('renders Button and Card without a DOM', () => {
    const html = renderToStaticMarkup(
      <Card>
        <CardHeader title="T" />
        <CardBody>
          <Button loading>Go</Button>
        </CardBody>
      </Card>,
    );
    expect(html).toContain('class="motiv-card motiv-card--elevated motiv-card--p-md"');
    expect(html).toContain('aria-busy="true"');
  });
});
```

Run `pnpm test src/ssr.test.tsx` → PASS once `src/index.ts` exists (it fails before Step 1).

- [ ] **Step 3: `tsdown.config.ts`**

```ts
import { defineConfig } from 'tsdown';

export default defineConfig({
  entry: ['src/index.ts'],
  format: 'esm',
  platform: 'neutral',
  unbundle: true,
  dts: true,
  fixedExtension: false,
  external: [/^react($|\/)/, /^react-dom($|\/)/],
});
```

Run `pnpm build`. Confirm `dist/index.js`, `dist/index.d.ts` and per-module files such as
`dist/components/Button/Button.js` exist. If tsdown's option names or output names differ in the
installed version, adjust the config (not `package.json#exports`) until those paths exist; no test
files or stories may appear in `dist/`.

- [ ] **Step 4: tree-shaking check** `test/fixtures/treeshake-button.js`

```js
import { Button } from '../../dist/index.js';

export { Button };
```

`scripts/check-treeshake.mjs`

```js
import { rolldown } from 'rolldown';

const bundle = await rolldown({
  input: 'test/fixtures/treeshake-button.js',
  external: [/^react/],
});
const { output } = await bundle.generate({ format: 'esm' });
const code = output.map((chunk) => chunk.code ?? '').join('\n');

const problems = [];
if (!code.includes('motiv-btn')) problems.push('Button code missing from bundle');
if (code.includes('motiv-card')) problems.push('Card code leaked into a Button-only bundle');

if (problems.length) {
  console.error(problems.join('\n'));
  process.exit(1);
}
console.log('tree-shaking ok');
```

- [ ] **Step 5:** `pnpm build && pnpm check:package` → publint clean, attw reports no problems for
  `esm-only`, script prints `tree-shaking ok`. Temporarily importing `Card` in the fixture must make
  the script exit 1 (verify, then revert). `pnpm test && pnpm check && pnpm typecheck` pass.

---

### Task 6: Storybook

**Files:**
- Create: `.storybook/main.ts`, `.storybook/preview.tsx`, `src/components/Button/Button.stories.tsx`,
  `src/components/Card/Card.stories.tsx`, `src/docs/Theming.mdx`

**Interfaces:**
- Consumes: components and `src/styles/index.css`, `src/styles/base.css`.
- Produces: `pnpm build-storybook` → `storybook-static/`.

- [ ] **Step 1: `.storybook/main.ts`**

```ts
import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(ts|tsx)'],
  addons: ['@storybook/addon-docs'],
  framework: '@storybook/react-vite',
};

export default config;
```

- [ ] **Step 2: `.storybook/preview.tsx`** — imports `../src/styles/index.css` and
  `../src/styles/base.css`; a `theme` global (`light` | `dark` | `system`) in the toolbar; a
  decorator sets `document.documentElement.dataset.theme` to the value, or removes the attribute
  for `system`; `tags: ['autodocs']`.

```tsx
import type { Decorator, Preview } from '@storybook/react-vite';
import '../src/styles/index.css';
import '../src/styles/base.css';

const withTheme: Decorator = (Story, context) => {
  const theme = context.globals.theme as string;
  if (theme === 'system') delete document.documentElement.dataset.theme;
  else document.documentElement.dataset.theme = theme;
  return <Story />;
};

const preview: Preview = {
  tags: ['autodocs'],
  decorators: [withTheme],
  globalTypes: {
    theme: {
      description: 'Color theme',
      toolbar: {
        icon: 'mirror',
        items: [
          { value: 'light', title: 'Light' },
          { value: 'dark', title: 'Dark' },
          { value: 'system', title: 'System' },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: { theme: 'light' },
};

export default preview;
```

- [ ] **Step 3: Button stories** — `Primary` (args playground), `Variants` (all five side by side),
  `Sizes`, `WithIcons` (inline SVG), `Loading`, `Disabled`, `AsLink`
  (`<a href="#" className={buttonClassName({ variant: 'outline' })}>`), `SubtreeOverride`
  (a `<div style={{ '--motiv-color-primary': '#7c3aed' } as CSSProperties}>` wrapping primary and
  outline buttons — hover must turn darker purple, not green: Review Focus 5).

- [ ] **Step 4: Card stories** — `Default` (header + body + footer with buttons), `Variants`,
  `Padding`, `Interactive` (`tabIndex={0}`), `AsListItems` (`<ul>` of `as="li"` cards).

- [ ] **Step 5: `src/docs/Theming.mdx`** — explains the three override levels from the spec with
  copy-paste examples: rebrand via `:root { --motiv-color-primary: … }`, dark mode via
  `data-theme`, subtree theme via `data-theme` on a wrapper, component tokens
  (`--motiv-btn-radius`, `--motiv-card-padding`, …), and plain-CSS overrides winning over
  `@layer motiv`. Includes a table of every base token with its default.

- [ ] **Step 6:** `pnpm build-storybook` exits 0. `pnpm check` passes (Biome may need
  `storybook-static` ignored — already in Task 1 config).

---

### Task 7: README, Changesets, CI and release

**Files:**
- Create: `README.md`, `.changeset/config.json`, `.changeset/initial-release.md`,
  `.github/workflows/ci.yml`, `.github/workflows/release.yml`

- [ ] **Step 1: `README.md`** — sections: Install (`pnpm add @driif/motiv`), Styles
  (`import '@driif/motiv/styles.css'` once; optional `base.css`; `tokens.css` alone for
  non-React apps), Usage (Button, Card, `buttonClassName` with a router link), Theming (short,
  links to Storybook Theming page), Astro (`import { Button } from '@driif/motiv'` in `.astro`,
  renders static HTML; stylesheet imported in the base layout), Other frameworks (use the `motiv-*`
  classes directly), Development (scripts), Releasing (Changesets flow).

- [ ] **Step 2: `.changeset/config.json`**

```json
{
  "$schema": "https://unpkg.com/@changesets/config/schema.json",
  "changelog": "@changesets/cli/changelog",
  "commit": false,
  "access": "public",
  "baseBranch": "main",
  "updateInternalDependencies": "patch",
  "ignore": []
}
```

`.changeset/initial-release.md`:

```md
---
'@driif/motiv': minor
---

First release: Button, Card, design tokens with light/dark themes, and the motiv stylesheet.
```

- [ ] **Step 3: `.github/workflows/ci.yml`** — on `pull_request` and `push` to `main`:
  checkout, `pnpm/action-setup` (version from `packageManager`), `actions/setup-node` with Node 24
  and pnpm cache, `pnpm install --frozen-lockfile`, then `pnpm check`, `pnpm typecheck`,
  `pnpm test`, `pnpm build`, `pnpm check:package`, `pnpm build-storybook`.

- [ ] **Step 4: `.github/workflows/release.yml`** — on `push` to `main`: same setup, then
  `changesets/action` with `publish: pnpm release`, `version: pnpm changeset version`;
  `permissions: contents: write, pull-requests: write, id-token: write`; env `GITHUB_TOKEN` and
  `NPM_TOKEN` (`NODE_AUTH_TOKEN`). Comment at top: requires `NPM_TOKEN` secret or npm trusted
  publishing configured for the repo.

- [ ] **Step 5: final gate** — `pnpm check && pnpm typecheck && pnpm test && pnpm build &&
  pnpm check:package && pnpm build-storybook` all exit 0.
