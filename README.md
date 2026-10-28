# @driif/motiv

React components with plain, themeable CSS. ESM only, tree-shakeable, server-render safe.

## Install

```sh
pnpm add @driif/motiv
```

`react` and `react-dom` 19+ are peer dependencies.

## Styles

motiv comes in styles that share one component API. **kinetic** is the default: the root
exports with `styles.css`. **drawn** is the hand-drawn style under `@driif/motiv/drawn` (see
[Drawn style](#drawn-style)). **matrix** is the phosphor-green terminal style under
`@driif/motiv/matrix` (see [Matrix style](#matrix-style)).

Import the stylesheet once, at the app's entry or base layout:

```ts
import '@driif/motiv/styles.css';
```

- `@driif/motiv/base.css` — optional minimal reset and typography (`box-sizing`, body font and
  colors, heading font).
- `@driif/motiv/tokens.css` — the design tokens alone, for apps that only want the variables.

## Usage

```tsx
import { Button, Card, CardBody, CardFooter, CardHeader } from '@driif/motiv';

<Card>
  <CardHeader title="Users" description="Active this week" />
  <CardBody>128 people signed in.</CardBody>
  <CardFooter>
    <Button variant="outline">Export</Button>
    <Button>View all</Button>
  </CardFooter>
</Card>;
```

`Button` takes `variant` (`primary` · `secondary` · `outline` · `ghost` · `danger`), `size`
(`sm` · `md` · `lg`), `iconLeft`, `iconRight`, `loading` and every native `<button>` prop. It
defaults to `type="button"`.

Links stay the app's own — style them with `buttonClassName`:

```tsx
import { buttonClassName } from '@driif/motiv';
import { Link } from 'react-router';

<Link to="/settings" className={buttonClassName({ variant: 'outline' })}>
  Settings
</Link>;
```

## Kinetic components

Besides `Button` and `Card`, the root entry ships the kinetic set: `MagneticButton`,
`MorphSubmitButton`, `BellButton`, `BadgeButton`, `CopyField`, `RadialMenu`, `IconButton`,
`IconButtonGroup`, `MenuButton`, `ThemeToggle`, `SegmentedControl`, `ElasticTabs`, `FilterChips`,
`Radio`, `RadioGroup`, `Stepper`, `CommandMenu`, `FloatingField`, `OtpInput`, `ExpandingSearch`,
`FrequencySlider`, `MomentumSlider`, `LiquidSwitch`, `SpringCheckbox`, `LikeButton`, `MuteToggle`,
`SlipCard`, `Accordion`, `Carousel`, `GlideNav`, `StepProgress`, `DrillStack`, `ProgressRing` and
`Odometer`, plus the native `Confirm` dialog, `FileUpload`, `DatePicker`, `Table` with
`TableColumnsMenu`, and `MultiSelect`, a searchable multiple choice whose `name` posts one hidden
input per value. Every animation moves only `transform` and `opacity`; `prefers-reduced-motion` stills
them. `IconButton`, `MenuButton`, `ThemeToggle`, `Radio`, `RadioGroup` and `SegmentedControl` take
the same props as their drawn namesakes, so switching styles only changes the import.
`GlideNav` items take an optional `href` and then render as `<a>`; `onChange(id, event)` lets a
router `preventDefault()`. Server-rendered, the active item already shows its accent bar.

```tsx
import { LiquidSwitch, SegmentedControl } from '@driif/motiv';

<SegmentedControl label="Range" options={ranges} value={range} onChange={setRange} />;
<LiquidSwitch label="Wi-Fi" checked={wifi} onChange={setWifi} />;
```

## Confirm

`Confirm` is a controlled native modal `<dialog>` for destructive actions. Impact counts and
errors go in `children`.

```tsx
import { Button, Confirm } from '@driif/motiv';
import { useState } from 'react';

function DeleteProject({ slug, deleteProject }: { slug: string; deleteProject: () => Promise<void> }) {
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState('');

  async function remove() {
    setPending(true);
    setError('');
    try {
      await deleteProject();
      setOpen(false);
    } catch {
      setError('Could not delete the project. Please try again.');
    } finally {
      setPending(false);
    }
  }

  return (
    <>
      <Button variant="danger" onClick={() => { setError(''); setOpen(true); }}>
        Delete project
      </Button>
      <Confirm
        open={open}
        title="Delete project?"
        slug={slug}
        pending={pending}
        onConfirm={remove}
        onCancel={() => setOpen(false)}
      >
        <p>This action cannot be undone.</p>
        <ul><li>3 bindings will also be deleted.</li></ul>
        {error && <p role="alert">{error}</p>}
      </Confirm>
    </>
  );
}
```

With `slug`, Delete stays disabled until the field matches exactly; the slug shows as the field's
hint. `confirmLabel` (`Delete`), `cancelLabel` (`Cancel`) and `slugLabel`
(`Type the slug to confirm`) take translated strings. `pending` locks both buttons, the field and
Escape. The dialog never closes itself: Cancel and Escape call `onCancel`, the backdrop does
nothing, and your app sets `open={false}`. Focus starts on Cancel or the field and returns to the
opener on close.

## Toast

Mount exactly one `<Toaster />` per app (or one shared Astro island), then call `toast()` from
any browser callback. No Provider is needed; a second host duplicates the same notifications.
This API is available in the kinetic style only, with `@driif/motiv/styles.css`.

```tsx
import { dismissToast, toast, Toaster } from '@driif/motiv';

<Toaster label="Notifications" dismissLabel="Dismiss" />;

toast({ tone: 'success', title: 'Changes saved', description: 'Your project is up to date.' });
const id = toast({ tone: 'error', title: 'Could not save', description: 'Please try again.' });
dismissToast(id);
```

`tone` defaults to `info`. Success and info dismiss after 5000 ms; errors stay until dismissed.
`duration` overrides the time in milliseconds, with `Infinity` for persistence. Up to three
toasts appear in arrival order, newest at the bottom; long stacks scroll within the viewport.
Others wait until a slot opens after an exit; their timers start when shown. Mouse hover over
the stack or focus inside pauses every visible timer, preserving the remaining time until
both end. Touch pointers do not pause on hover. `dismissToast(id)` is safe to repeat.

Success and info use polite announcements; errors use an alert. New notifications never move
focus. Dismissing a toast with keyboard-visible focus moves focus to another dismiss button,
or back outside the stack. Pointer dismissal clears focus; remaining timers resume when the
mouse no longer hovers the stack, or immediately after touch dismissal. `label` and
`dismissLabel` accept translated strings; native section props and `ref` pass through. Server
calls to `toast()` do nothing and return an empty string; server rendering produces an empty stack.

The stack uses fixed positioning below native modal dialogs. While `Confirm` is open, show
errors that need attention in its existing `children` slot (for example, `<p role="alert">`),
because the modal makes the rest of the page inert.

## File uploads

The app supplies `upload` and obtains its own presigned URL. `putFile` sends the file body by
XHR, reports progress as a percentage (0–100), and uses `file.type` for `Content-Type` unless
`contentType` is supplied. Its headers must match those used when signing the URL.

```tsx
import { FileUpload, putFile } from '@driif/motiv';

function Attachments({
  getUploadUrl,
}: {
  getUploadUrl: (file: File, signal: AbortSignal) => Promise<string>;
}) {
  return (
    <FileUpload
      multiple
      upload={async (file, { signal, onProgress }) => {
        const url = await getUploadUrl(file, signal);
        await putFile(url, file, { signal, onProgress });
      }}
    />
  );
}
```

Single selection replaces the previous entry; `multiple` appends. `onUploaded(file)` runs on
success. `onRemove(file)` runs when a completed entry is removed or replaced; cancelling an
upload only aborts its signal. Removing a failed entry does not call `onRemove`.

Customize the picker, statuses and actions with `label`, `uploadingLabel`, `uploadedLabel`,
`errorLabel`, `retryLabel`, `removeLabel` and `cancelLabel`. `errorMessage` supplies the fallback
when a rejection has no message; `formatSize(bytes)`, `formatUploadedMessage(name)` and
`formatErrorMessage(name)` customize sizes and live announcements. Native input props and `ref`
reach the file input; `className` and `style` apply to the wrapper.

`putFile` rejects with English `Error` messages that take precedence over `errorMessage`; wrap
the call in `upload` and rethrow with a localized message, or `new Error('')` to use the fallback.

The picker resets after each selection, so native `required` validation is unsupported; validate
required attachments in the app using `onUploaded` and `onRemove`.

## Dates

`DatePicker` wraps a native `<input type="date">` or `type="datetime-local"` in the `TextField`
look and adds a clear button while it holds a value. Values are the native strings, `YYYY-MM-DD`,
`YYYY-MM-DDTHH:mm` (plus `:ss` for non-zero seconds) or `''`, and reach `onChange`, `FormData`
and `min`/`max` unchanged.

```tsx
import { DatePicker } from '@driif/motiv';

<DatePicker label="Due date" value={due} onChange={(event) => setDue(event.target.value)} />;
<DatePicker label="Starts" type="datetime-local" name="starts" min="2026-11-02T09:00" required />;
```

The browser draws the date format, the picker and its indicator; they follow the browser locale
and differ between browsers. motiv uses no `Date` objects and converts no timezones: a
`datetime-local` value is wall-clock time, and the app turns it into an instant.

Clearing calls `onChange` once with `''` and focuses the input; the button is named
`clearLabel` (default `"Clear"`) plus the label. A partly typed date is still `''`, so the button
appears once the date is complete. Errors work as on `TextField`: pass `aria-invalid` and show the
message in `hint` or link it with `aria-describedby`. An empty `required` date turns red only after
the user has interacted with it.

## Tables

`Table` renders a native `<table>` from `columns` and `rows`. Each column has an `id`, a plain-text
`label` (also the resize handle's name), an optional `header` node that replaces the label, for
example a sort button, and a `cell(row)` renderer. Columns start at `width` (default 200px) and
resize between `minWidth` (default 80px) and 800px by dragging a header edge or with the arrow
keys; a double-click or Enter resets one. `onColumnWidthsChange` fires once per finished drag, key
press or reset, never while dragging, so it can save to a server. Without `columnWidths` the table
keeps the widths itself.

`TableColumnsMenu` only lists the columns: the app keeps `hiddenColumns` and filters `columns`
before passing them to `Table`. Storing the hidden ids means columns added later show up.

```tsx
import { Table, TableColumnsMenu } from '@driif/motiv';

<TableColumnsMenu columns={columns} hiddenColumns={hidden} onHiddenColumnsChange={setHidden} />;
<Table
  caption="Submitted forms"
  columns={columns.filter((column) => !hidden.includes(column.id))}
  rows={entries}
  getRowKey={(entry) => entry.id}
  columnWidths={widths}
  onColumnWidthsChange={setWidths}
  style={{ maxHeight: '32rem' }}
/>;
```

The table scrolls inside its wrapper. The header row only sticks once the wrapper has a `height`
or `max-height`, as above. Cells stay on one line and end in an ellipsis.

## Drawn style

`@driif/motiv/drawn` is a hand-drawn style: `Link`, `TextField`, `Checkbox`, `Radio`,
`RadioGroup`, `Tabs`, `SegmentedControl`, `Select`, `NavItem`, `IconButton`, `IconButtonGroup`,
`MenuButton`, `ThemeToggle`, `OrbitalThemeToggle` and `Progress`. Its stylesheet is self-contained (tokens, base, drawn components and the bundled
Caveat font), so a drawn app imports it **instead of** `styles.css`, never alongside it:

```tsx
import '@driif/motiv/drawn.css';
import { Checkbox, Link, TextField } from '@driif/motiv/drawn';

<TextField label="Email" type="email" hint="We only use it to reply." />;
<Checkbox label="Send me the newsletter" />;
<Link href="https://example.com" external>
  Read the guide
</Link>;
```

`Link` takes `arrow` (default `true`), `external` (adds `target="_blank"` and
`rel="noopener noreferrer"`) and `externalLabel` (screen-reader text, default
`'(opens in a new tab)'`). `RadioGroup` takes `name`, `legend`, `options`, `value` and `onChange`.

`NavItem` renders an `<a>` when given `href` (pass a router's `onClick` alongside), otherwise a
`<button>`; `active` sets `aria-current="page"`. `MenuButton` (`open`, `onToggle`) and
`ThemeToggle` (`dark`, `onToggle`) are controlled; `ThemeToggle` never sets `data-theme` itself.
Icons are app-supplied `ReactNode`s.

## Matrix style

`@driif/motiv/matrix` is a monospace, phosphor-green terminal style: `GlitchThemeToggle`,
`ScanButton`, `TerminalSelect`, `DecodeSecretField`, `SignalBurger`, `HudTabs` and `ChevronNav`,
plus `Button`, `buttonClassName`, `IconButton`, `IconButtonGroup`, `Card`, `CardHeader`,
`CardBody`, `CardFooter`, `TextField`, `Checkbox`, `Radio`, `RadioGroup`, `Progress` and `Link`
with the same props as their drawn namesakes. Its stylesheet is self-contained, so a matrix app
imports it **instead of** `styles.css`:

```tsx
import '@driif/motiv/matrix.css';
import { DecodeSecretField, TerminalSelect } from '@driif/motiv/matrix';

<TerminalSelect label="Auth method" prefix="auth://" options={methods} value={method} onChange={setMethod} />;
<DecodeSecretField label="Root token" value={token} onChange={setToken} />;
```

`TerminalSelect` is a select-only combobox (arrows, Home, End, Enter, Space, Escape, letters);
options take `value`, `label`, `hint` and an optional `code` shown in the trigger.
`DecodeSecretField` and `TerminalSelect` report plain values through `onChange(value)`;
`ChevronNav` reports `onChange(id, event)`, so a router can `preventDefault()` on `href` items.
`GlitchThemeToggle` (`dark`, `onToggle`) and `SignalBurger` (`open`, `onToggle`) are controlled.
Every visible string is a prop with an English default.

## Theming

Everything is driven by `--motiv-*` custom properties, and all library CSS sits in
`@layer motiv.*`, so unlayered app CSS wins without `!important`.

```css
:root {
  --motiv-color-primary: #2563eb;
  --motiv-color-on-primary: #ffffff;
}
```

Dark mode: `<html data-theme="dark">`. Without `data-theme`, `prefers-color-scheme` applies.
The Storybook [**Docs/Theming**](src/docs/Theming.mdx) page lists every token and the component-level overrides.

## Small layouts

Use `40rem` as the small breakpoint. Below it, stack multi-column layouts. Use the same value in
viewport or container queries:

```css
@media (width < 40rem) {
  .layout {
    grid-template-columns: 1fr;
  }
}

@container (width < 40rem) {
  .layout {
    grid-template-columns: 1fr;
  }
}
```

## Astro

Components render to static HTML, no client directive needed unless you attach handlers:

```astro
---
import '@driif/motiv/styles.css';
import { Button } from '@driif/motiv';
---
<Button variant="secondary">Static button</Button>
```

Import the stylesheet in the base layout so every page gets it.

## Other frameworks

The look lives entirely in `styles.css`, so plain HTML, Vue or Svelte can use the classes directly:

```html
<button type="button" class="motiv-btn motiv-btn--primary motiv-btn--md">
  <span class="motiv-btn__label">Save</span>
</button>
```

## Development

```sh
pnpm check            # Biome
pnpm typecheck        # tsc
pnpm test             # Vitest
pnpm build            # dist/ (JS, d.ts, CSS)
pnpm check:package    # publint, attw, tree-shaking check
pnpm storybook        # docs on http://localhost:6006
```

## Releasing

Every change a consuming app can see gets a changeset: run `pnpm changeset` and describe it in
one line. On `main`, the release workflow opens a "Version Packages" PR; merging it publishes to
npm.
