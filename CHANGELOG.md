# @driif/motiv

## 0.10.0

### Minor Changes

- 7f293d5: Add `Nav` to `@driif/motiv/drawn` and `Nav` and `Tabs` to `@driif/motiv/matrix`, and `Tabs` to kinetic: `Nav` takes the `GlideNav` props, `Tabs` the drawn `Tabs` props; kinetic also exports `GlideNav` as `Nav`, and drawn `NavItem` now accepts any `label` content and drops the icon circle when no `icon` is given.

## 0.9.0

### Minor Changes

- e0e770c: Add `Switch`, `Slider` and `Textarea` to `@driif/motiv/drawn` and `@driif/motiv/matrix`, with the same props as kinetic `LiquidSwitch`, `MomentumSlider` and `Textarea`; kinetic now also exports `LiquidSwitch` as `Switch` and `MomentumSlider` as `Slider`.

## 0.8.0

### Minor Changes

- c192d95: BREAKING: `--motiv-btn-*` tokens are renamed to `--motiv-button-*`; component tokens (`--motiv-button-*`, `--motiv-card-*`, `--motiv-text-field-*`, `--motiv-checkbox-*`, …) now work the same in kinetic, drawn and matrix.

## 0.7.0

### Minor Changes

- 5879ce2: Add `Textarea` component: a labelled native textarea that grows with its content up to `maxRows`, then scrolls; props `label`, `hideLabel`, `hint`, `maxRows` plus all native textarea props.

## 0.6.0

### Minor Changes

- 9ade155: drawn Button: pencil outlines that boil and hatch on hover instead of the brush fill, ghost draws a pencil line under the label, and the loading spinner is a hand-drawn loop.

### Patch Changes

- 9ade155: kinetic: components size with border-box, fixing FloatingField's focus ring, CommandMenu's launcher and ElasticTabs' indicator; MorphSubmitButton keeps its background behind the label and spinner.
- 9ade155: kinetic Radio previews the dot on hover and pops in with a ripple when checked; matrix Link highlights faster and smoothly.

## 0.5.1

### Patch Changes

- 507c794: matrix: TerminalSelect opens fast on a solid, readable panel (no CRT beam or option flicker), HudTabs drops the scan line and slides its target smoothly, and ChevronNav shows one static chevron on expandable items instead of an animated triple.

## 0.5.0

### Minor Changes

- 64f8c9d: Add the matrix style: `@driif/motiv/matrix` and `matrix.css`, a phosphor-green terminal look with GlitchThemeToggle, ScanButton, TerminalSelect, DecodeSecretField, SignalBurger, HudTabs, ChevronNav, and Button, IconButton, Card, TextField, Checkbox, Radio, Progress and Link with the same props as their drawn counterparts.

## 0.4.0

### Minor Changes

- 0eb35e8: Give the default kinetic style its lilac palette and add the kinetic component set (MagneticButton, MorphSubmitButton, BellButton, BadgeButton, CopyField, RadialMenu, IconButton, MenuButton, ThemeToggle, SegmentedControl, ElasticTabs, FilterChips, RadioGroup, Stepper, CommandMenu, FloatingField, OtpInput, ExpandingSearch, FrequencySlider, MomentumSlider, LiquidSwitch, SpringCheckbox, LikeButton, MuteToggle, SlipCard, Accordion, Carousel, GlideNav, StepProgress, DrillStack, ProgressRing, Odometer).

## 0.3.0

### Minor Changes

- 1af03be: Add drawn `HoldToConfirmButton`: calls `onConfirm` only after a press-and-hold with pointer, Space or Enter.
- 1af03be: Add drawn `InkSplatterButton`: a button that splashes ink on click, with an optional `successLabel` shown for a moment.
- 1af03be: Add drawn `Tooltip`: an "i" button with a paper note shown on hover, focus or click and dismissed with Escape.

### Patch Changes

- 1af03be: Drawn: TextField drops the box focus ring for its drawn underline, Button gets hand-cut corners and a wavy ghost hover stroke, Card gets tighter hand-cut corners and a softer offset shadow.

## 0.2.0

### Minor Changes

- f507de0: Drawn style: new `OrbitalThemeToggle` in `@driif/motiv/drawn`, an illustrated sun/moon toggle with orbits, an ink wash and optional `figure`, `note` and `hint` captions.
- cc6fdee: Drawn style: new `Tabs`, `SegmentedControl` and `Select` components in `@driif/motiv/drawn`.
- 58c6894: Drawn style: new `NavItem`, `IconButton`, `IconButtonGroup`, `MenuButton`, `ThemeToggle` and `Progress` components in `@driif/motiv/drawn`.
- 894779c: Drawn style: new `Button`, `buttonClassName`, `Card`, `CardHeader`, `CardBody` and `CardFooter` in `@driif/motiv/drawn` with the same props as the default entry; drawn light `secondary` is darker (`#b83c0c`, white text), which also deepens the Link swipe and IconButton ring, and drawn sets its own `danger`/`on-danger`.
- f3f53ab: New hand-drawn style: import `Link`, `TextField`, `Checkbox`, `Radio` and `RadioGroup` from `@driif/motiv/drawn` and its self-contained stylesheet `@driif/motiv/drawn.css` (bundled Caveat font) instead of `styles.css`.

## 0.1.0

### Minor Changes

- 0c8d5a1: First release: Button, Card, design tokens with light/dark themes, and the motiv stylesheet.
