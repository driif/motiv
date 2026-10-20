// Every runtime export of a style's entry must be claimed by exactly one section;
// scripts/check-site.mjs enforces it against the built package.
export const catalog = {
  drawn: [
    {
      id: 'button',
      title: 'Button',
      symbols: ['Button', 'buttonClassName'],
      demo: 'Button',
      blurb:
        'The one thing on the page that should be pressed, cut by hand. Ghost buttons get a wavy stroke; links borrow the look.',
    },
    {
      id: 'ink-splatter-button',
      title: 'InkSplatterButton',
      symbols: ['InkSplatterButton'],
      demo: 'InkSplatterButton',
      blurb:
        'A button that splashes ink when pressed, with an optional success label for a moment.',
    },
    {
      id: 'hold-to-confirm-button',
      title: 'HoldToConfirmButton',
      symbols: ['HoldToConfirmButton'],
      demo: 'HoldToConfirmButton',
      blurb:
        'For things that are hard to undo: hold with pointer, Space or Enter until the ink fills; a screen-reader click confirms directly.',
    },
    {
      id: 'card',
      title: 'Card',
      symbols: ['Card', 'CardHeader', 'CardBody', 'CardFooter'],
      demo: 'Card',
      blurb: 'A hand-cut sheet of paper with a heading, some words and a place for actions.',
    },
    {
      id: 'text-field',
      title: 'TextField',
      symbols: ['TextField'],
      demo: 'TextField',
      blurb:
        'A pencil line to write on. Focus draws it in ink, the label floats, the hint stays put.',
    },
    {
      id: 'checkbox',
      title: 'Checkbox',
      symbols: ['Checkbox'],
      demo: 'Checkbox',
      blurb: 'A native checkbox, ticked by hand.',
    },
    {
      id: 'radio',
      title: 'Radio & RadioGroup',
      symbols: ['Radio', 'RadioGroup'],
      demo: 'Radio',
      blurb: 'One choice out of a few. RadioGroup wraps the fieldset and legend for you.',
    },
    {
      id: 'select',
      title: 'Select',
      symbols: ['Select'],
      demo: 'Select',
      blurb: 'A listbox with codes and hints, for when there are too many radios.',
    },
    {
      id: 'segmented-control',
      title: 'SegmentedControl',
      symbols: ['SegmentedControl'],
      demo: 'SegmentedControl',
      blurb: 'Two to four mutually exclusive views, side by side.',
    },
    {
      id: 'tabs',
      title: 'Tabs',
      symbols: ['Tabs'],
      demo: 'Tabs',
      blurb: 'Panels behind labels, with arrow-key navigation.',
    },
    {
      id: 'link',
      title: 'Link',
      symbols: ['Link'],
      demo: 'Link',
      blurb: 'An underline drawn in ink, with an arrow when it leads somewhere.',
    },
    {
      id: 'nav-item',
      title: 'NavItem',
      symbols: ['NavItem'],
      demo: 'NavItem',
      blurb: 'Sidebar entries. An anchor with href, a button without.',
    },
    {
      id: 'icon-button',
      title: 'IconButton & IconButtonGroup',
      symbols: ['IconButton', 'IconButtonGroup'],
      demo: 'IconButton',
      blurb: 'A toolbar of sketched icons, each with a label for screen readers.',
    },
    {
      id: 'menu-button',
      title: 'MenuButton',
      symbols: ['MenuButton'],
      demo: 'MenuButton',
      blurb: 'The hamburger that turns into a cross. You own the menu it opens.',
    },
    {
      id: 'tooltip',
      title: 'Tooltip',
      symbols: ['Tooltip'],
      demo: 'Tooltip',
      blurb: 'A margin note behind an i. Hover, focus or click to read it, Escape to put it away.',
    },
    {
      id: 'progress',
      title: 'Progress',
      symbols: ['Progress'],
      demo: 'Progress',
      blurb: 'How far along something is, filled in with a marker.',
    },
    {
      id: 'theme-toggle',
      title: 'ThemeToggle',
      symbols: ['ThemeToggle'],
      demo: 'ThemeToggle',
      blurb: 'A compact sun and moon. It reports clicks; your app sets data-theme.',
    },
    {
      id: 'orbital-theme-toggle',
      title: 'OrbitalThemeToggle',
      symbols: ['OrbitalThemeToggle'],
      demo: 'OrbitalThemeToggle',
      blurb: 'The theme switch as a small illustration, for a hero or a settings page.',
    },
  ],
  kinetic: [
    {
      id: 'button',
      title: 'Button',
      symbols: ['Button', 'buttonClassName'],
      demo: 'Button',
      blurb:
        'Five variants, three sizes, a loading state, in fine lilac outlines. Links borrow its look.',
    },
    {
      id: 'magnetic-button',
      title: 'MagneticButton',
      symbols: ['MagneticButton'],
      demo: 'MagneticButton',
      blurb:
        'A call to action that leans toward the cursor. Mouse only: touch and reduced motion get a still button.',
    },
    {
      id: 'morph-submit-button',
      title: 'MorphSubmitButton',
      symbols: ['MorphSubmitButton'],
      demo: 'MorphSubmitButton',
      blurb:
        'Runs your async action: the pill folds around a spinner, then confirms. A rejected promise shakes it back.',
    },
    {
      id: 'bell-button',
      title: 'BellButton',
      symbols: ['BellButton'],
      demo: 'BellButton',
      blurb: 'A notification bell that rings and ripples whenever the count goes up.',
    },
    {
      id: 'badge-button',
      title: 'BadgeButton',
      symbols: ['BadgeButton'],
      demo: 'BadgeButton',
      blurb:
        'An icon button with an unread counter that bumps and rolls its digits, and shrinks away at zero.',
    },
    {
      id: 'copy-field',
      title: 'CopyField',
      symbols: ['CopyField'],
      demo: 'CopyField',
      blurb:
        'A value with a copy button whose label rolls to "Copied". Show a masked version if the value is secret.',
    },
    {
      id: 'radial-menu',
      title: 'RadialMenu',
      symbols: ['RadialMenu'],
      demo: 'RadialMenu',
      blurb:
        'A plus button that fans a few quick actions out on an arc. Escape or a click outside folds them away.',
    },
    {
      id: 'icon-button',
      title: 'IconButton & IconButtonGroup',
      symbols: ['IconButton', 'IconButtonGroup'],
      demo: 'IconButton',
      blurb:
        'A toolbar of line icons; hover blooms a soft lilac fill and tips the icon up. Each has a label for screen readers.',
    },
    {
      id: 'menu-button',
      title: 'MenuButton',
      symbols: ['MenuButton'],
      demo: 'MenuButton',
      blurb: 'Three lines that spring into a cross. You own the menu it opens.',
    },
    {
      id: 'theme-toggle',
      title: 'ThemeToggle',
      symbols: ['ThemeToggle'],
      demo: 'ThemeToggle',
      blurb:
        'Sun and moon roll past each other in a half turn. It reports clicks; your app sets data-theme.',
    },
    {
      id: 'segmented-control',
      title: 'SegmentedControl',
      symbols: ['SegmentedControl'],
      demo: 'SegmentedControl',
      blurb:
        'Two to four views side by side. The pill glides over with a little squash, and a hint can slide in underneath.',
    },
    {
      id: 'elastic-tabs',
      title: 'ElasticTabs',
      symbols: ['ElasticTabs'],
      demo: 'ElasticTabs',
      blurb:
        'Tabs with an underline that stretches toward its next tab. Panels slide in from the side you moved toward.',
    },
    {
      id: 'filter-chips',
      title: 'FilterChips',
      symbols: ['FilterChips'],
      demo: 'FilterChips',
      blurb:
        'Toggle chips for filtering a list. A check pops in without the chip changing width, and a summary with a Clear button sits below.',
    },
    {
      id: 'radio',
      title: 'Radio & RadioGroup',
      symbols: ['Radio', 'RadioGroup'],
      demo: 'Radio',
      blurb:
        'One choice out of a few, with a dot that springs in. RadioGroup wraps the fieldset and legend for you.',
    },
    {
      id: 'stepper',
      title: 'Stepper',
      symbols: ['Stepper'],
      demo: 'Stepper',
      blurb:
        'A number you nudge up and down. The digits roll, and a limit answers with a small shake.',
    },
    {
      id: 'command-menu',
      title: 'CommandMenu',
      symbols: ['CommandMenu'],
      demo: 'CommandMenu',
      blurb:
        'A launcher that unfolds into commands. Arrow keys move through them, Escape closes, and ⌘K / Ctrl K works if you ask for it.',
    },
    {
      id: 'floating-field',
      title: 'FloatingField',
      symbols: ['FloatingField'],
      demo: 'FloatingField',
      blurb:
        'A text field whose label lifts on focus; a check pops in once the browser calls the value valid.',
    },
    {
      id: 'otp-input',
      title: 'OtpInput',
      symbols: ['OtpInput'],
      demo: 'OtpInput',
      blurb:
        'One box per digit. Focus hops forward, paste fills them all, and status waves or shakes after you check the code.',
    },
    {
      id: 'expanding-search',
      title: 'ExpandingSearch',
      symbols: ['ExpandingSearch'],
      demo: 'ExpandingSearch',
      blurb:
        'A search icon that stretches into a field over its neighbours, with suggestions dropping in one by one.',
    },
    {
      id: 'frequency-slider',
      title: 'FrequencySlider',
      symbols: ['FrequencySlider'],
      demo: 'FrequencySlider',
      blurb:
        'A native range with an equalizer that swells under the thumb and grows with the value.',
    },
    {
      id: 'momentum-slider',
      title: 'MomentumSlider',
      symbols: ['MomentumSlider'],
      demo: 'MomentumSlider',
      blurb:
        'A range whose value bubble swings with the drag and settles when you let go. Marks label the stops.',
    },
    {
      id: 'liquid-switch',
      title: 'LiquidSwitch',
      symbols: ['LiquidSwitch'],
      demo: 'LiquidSwitch',
      blurb: 'An on/off switch whose thumb stretches mid-travel and wobbles to a stop.',
    },
    {
      id: 'spring-checkbox',
      title: 'SpringCheckbox',
      symbols: ['SpringCheckbox'],
      demo: 'SpringCheckbox',
      blurb:
        'A native checkbox that squashes under the press, fills from the centre and pops its tick.',
    },
    {
      id: 'like-button',
      title: 'LikeButton',
      symbols: ['LikeButton'],
      demo: 'LikeButton',
      blurb: 'A heart that pops and throws sparks when liked, with a count that rolls along.',
    },
    {
      id: 'mute-toggle',
      title: 'MuteToggle',
      symbols: ['MuteToggle'],
      demo: 'MuteToggle',
      blurb:
        'Mute and unmute in one button: the bell is slashed or rings, and the label rolls with it.',
    },
    {
      id: 'card',
      title: 'Card',
      symbols: ['Card', 'CardHeader', 'CardBody', 'CardFooter'],
      demo: 'Card',
      blurb: 'A white sheet with a fine outline: a header, a body and a footer for actions.',
    },
    {
      id: 'slip-card',
      title: 'SlipCard',
      symbols: ['SlipCard'],
      demo: 'SlipCard',
      blurb:
        'A card with a note tucked underneath. Pull the tab and the note slides out from under its cover.',
    },
    {
      id: 'accordion',
      title: 'Accordion',
      symbols: ['Accordion'],
      demo: 'Accordion',
      blurb:
        'Questions with their answers folded away. One open at a time, or several with multiple.',
    },
    {
      id: 'carousel',
      title: 'Carousel',
      symbols: ['Carousel'],
      demo: 'Carousel',
      blurb:
        'A few slides, changed by swipe, arrow keys, buttons or dots. The indicator stretches like a worm on its way.',
    },
    {
      id: 'glide-nav',
      title: 'GlideNav',
      symbols: ['GlideNav'],
      demo: 'GlideNav',
      blurb:
        'Sidebar navigation where a soft highlight follows the pointer and the active bar springs to your choice.',
    },
    {
      id: 'step-progress',
      title: 'StepProgress',
      symbols: ['StepProgress'],
      demo: 'StepProgress',
      blurb:
        'Where a wizard is up to. Finished steps get a check, the current one pulses; your own Back and Next drive it.',
    },
    {
      id: 'drill-stack',
      title: 'DrillStack',
      symbols: ['DrillStack'],
      demo: 'DrillStack',
      blurb:
        'Drill into a hierarchy one level at a time; each level slides onto the stack and breadcrumbs pull you back out.',
    },
    {
      id: 'progress-ring',
      title: 'ProgressRing',
      symbols: ['ProgressRing'],
      demo: 'ProgressRing',
      blurb:
        'A ring that sweeps to the value while the number counts along; 100% turns into a check.',
    },
    {
      id: 'odometer',
      title: 'Odometer',
      symbols: ['Odometer'],
      demo: 'Odometer',
      blurb:
        'Rolling digits for any number that changes. It is decorative, so label whatever holds it.',
    },
    {
      id: 'cx',
      title: 'cx',
      symbols: ['cx'],
      demo: 'Cx',
      blurb: 'The class-name joiner the components use, exported for yours.',
    },
  ],
  matrix: [
    {
      id: 'scan-button',
      title: 'ScanButton',
      symbols: ['ScanButton'],
      demo: 'ScanButton',
      blurb:
        'The call to action: HUD brackets open up and a light bar sweeps across while it is hovered or focused.',
    },
    {
      id: 'button',
      title: 'Button',
      symbols: ['Button', 'buttonClassName'],
      demo: 'Button',
      blurb:
        'Five variants, three sizes, a loading state, square and bracketed. Same props as the drawn Button; links borrow the look.',
    },
    {
      id: 'icon-button',
      title: 'IconButton & IconButtonGroup',
      symbols: ['IconButton', 'IconButtonGroup'],
      demo: 'IconButton',
      blurb:
        'Icon-only buttons named by their label. Brackets lock onto the one under the pointer.',
    },
    {
      id: 'glitch-theme-toggle',
      title: 'GlitchThemeToggle',
      symbols: ['GlitchThemeToggle'],
      demo: 'GlitchThemeToggle',
      blurb:
        'Reports clicks, your app owns the theme. The icon swaps through an RGB-split glitch; reduced motion swaps it plainly.',
    },
    {
      id: 'signal-burger',
      title: 'SignalBurger',
      symbols: ['SignalBurger'],
      demo: 'SignalBurger',
      blurb: 'A menu button whose bars pulse like an equalizer on hover and jump to an X in steps.',
    },
    {
      id: 'card',
      title: 'Card',
      symbols: ['Card', 'CardHeader', 'CardBody', 'CardFooter'],
      demo: 'Card',
      blurb:
        'A bracketed panel with a heading, some words and a place for actions. Same props as the drawn Card.',
    },
    {
      id: 'text-field',
      title: 'TextField',
      symbols: ['TextField'],
      demo: 'TextField',
      blurb: 'A labelled input behind a > prompt, with a hint that stays put.',
    },
    {
      id: 'decode-secret-field',
      title: 'DecodeSecretField',
      symbols: ['DecodeSecretField'],
      demo: 'DecodeSecretField',
      blurb:
        'A secret input whose eye decodes the value character by character, painted over the still-masked field.',
    },
    {
      id: 'terminal-select',
      title: 'TerminalSelect',
      symbols: ['TerminalSelect'],
      demo: 'TerminalSelect',
      blurb:
        'A select-only combobox that opens like an old CRT: one bright line, then the options flicker on. Arrows, Home, End and letters work.',
    },
    {
      id: 'checkbox',
      title: 'Checkbox',
      symbols: ['Checkbox'],
      demo: 'Checkbox',
      blurb: 'A native checkbox, drawn as [ ] and [x].',
    },
    {
      id: 'radio',
      title: 'Radio & RadioGroup',
      symbols: ['Radio', 'RadioGroup'],
      demo: 'Radio',
      blurb:
        'One choice out of a few, drawn as ( ) and (*). RadioGroup wraps the fieldset and legend.',
    },
    {
      id: 'hud-tabs',
      title: 'HudTabs',
      symbols: ['HudTabs'],
      demo: 'HudTabs',
      blurb:
        'A tablist whose bracketed target jumps between tabs in steps; a scan line confirms the lock.',
    },
    {
      id: 'chevron-nav',
      title: 'ChevronNav',
      symbols: ['ChevronNav'],
      demo: 'ChevronNav',
      blurb:
        'Sidebar navigation in sections. The current item streams its chevrons like data flowing in.',
    },
    {
      id: 'progress',
      title: 'Progress',
      symbols: ['Progress'],
      demo: 'Progress',
      blurb: 'A labelled progress bar cut into blocks, filling in steps.',
    },
    {
      id: 'link',
      title: 'Link',
      symbols: ['Link'],
      demo: 'Link',
      blurb: 'A dashed link with a block highlight. External links open in a new tab and say so.',
    },
  ],
};
