# @driif/motiv

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
