/// <reference types="vite/client" />
import { describe, expect, it } from 'vitest';

const componentCss = import.meta.glob<string>(
  '../{components,drawn,matrix,markdown,data-table}/**/*.css',
  { query: '?raw', import: 'default', eager: true },
);

// Literal sizes that do not size text, a control or a row, keyed by file and declaration.
const allowed: Record<string, string> = {
  'components/Accordion/Accordion.css height: 18px': 'icon',
  'components/BadgeButton/BadgeButton.css height: 24px': 'icon',
  'components/BellButton/BellButton.css height: 24px': 'icon',
  'components/Button/Button.css height: 1.15em': 'icon, follows its text in em',
  'components/Button/Button.css height: 1em': 'spinner, follows its text in em',
  'components/Carousel/Carousel.css height: 20px': 'icon',
  'components/Carousel/Carousel.css height: 8px': 'marker',
  'components/Carousel/Carousel.css min-height: 152px': 'slide area',
  'components/CommandMenu/CommandMenu.css height: 16px': 'icon',
  'components/CommandMenu/CommandMenu.css height: 20px': 'icon',
  'components/CopyField/CopyField.css height: 16px': 'icon',
  'components/DrillStack/DrillStack.css height: 20px': 'icon',
  'components/ElasticTabs/ElasticTabs.css height: 2px': 'stroke',
  'components/ExpandingSearch/ExpandingSearch.css height: 14px': 'icon',
  'components/ExpandingSearch/ExpandingSearch.css height: 20px': 'icon',
  'components/FilterChips/FilterChips.css height: 16px': 'icon',
  'components/FloatingField/FloatingField.css min-height: max(calc(var(--motiv-control-height) * 1.8125), 3rem)':
    'floor that keeps the floating label readable',
  'components/FloatingField/FloatingField.css padding: 1px calc(var(--motiv-space) * 11) calc(var(--motiv-space) * 2) calc(var(--motiv-space) * 3.5)':
    'optical nudge',
  'components/GlideNav/GlideNav.css height: 18px': 'icon',
  'components/GlideNav/GlideNav.css height: 24px': 'marker',
  'components/LikeButton/LikeButton.css height: 22px': 'icon',
  'components/LikeButton/LikeButton.css height: 6px': 'decorative burst',
  'components/Link/Link.css height: 1.1em': 'icon, follows its text in em',
  'components/Link/Link.css padding-bottom: 2px': 'underline offset',
  'components/MagneticButton/MagneticButton.css height: 6px': 'marker',
  'components/MenuButton/MenuButton.css height: 2px': 'stroke',
  'components/MomentumSlider/MomentumSlider.css height: 16px': 'tick marks',
  'components/MomentumSlider/MomentumSlider.css height: 8px': 'caret',
  'components/MorphSubmitButton/MorphSubmitButton.css height: 18px': 'icon',
  'components/MorphSubmitButton/MorphSubmitButton.css height: 20px': 'spinner',
  'components/MuteToggle/MuteToggle.css height: 22px': 'icon',
  'components/Odometer/Odometer.css height: 1.2em': 'digit line box, follows its text in em',
  'components/Progress/Progress.css height: 8px': 'track',
  'components/RadialMenu/RadialMenu.css height: 20px': 'icon',
  'components/RadialMenu/RadialMenu.css height: 24px': 'icon',
  'components/RadialMenu/RadialMenu.css height: 56px':
    'radial geometry: the items orbit this fixed trigger',
  'components/RadialMenu/RadialMenu.css height: calc(var(--_r) + 76px)': 'radial geometry',
  'components/Radio/Radio.css height: 22px': 'marker',
  'components/Select/Select.css height: 18px': 'icon',
  'components/SlipCard/SlipCard.css height: 15px': 'card illustration',
  'components/SlipCard/SlipCard.css height: 19px': 'card illustration',
  'components/SlipCard/SlipCard.css height: 219px': 'card illustration',
  'components/SlipCard/SlipCard.css height: 23px': 'card illustration',
  'components/SlipCard/SlipCard.css height: 26px': 'card illustration',
  'components/SlipCard/SlipCard.css height: 310px': 'card illustration',
  'components/SlipCard/SlipCard.css padding: 22px': 'card illustration',
  'components/SlipCard/SlipCard.css padding: 24px': 'card illustration',
  'components/SpringCheckbox/SpringCheckbox.css height: 16px': 'marker',
  'components/SpringCheckbox/SpringCheckbox.css height: 2.6px': 'stroke',
  'components/SpringCheckbox/SpringCheckbox.css height: 24px': 'marker',
  'components/Stepper/Stepper.css height: 20px': 'icon',
  'components/StepProgress/StepProgress.css height: 16px': 'icon',
  'components/StepProgress/StepProgress.css height: 1px': 'stroke',
  'components/ThemeToggle/ThemeToggle.css height: 22px': 'icon',
  'components/Tooltip/Tooltip.css height: calc(var(--_gap) + 2px)': 'hover bridge',
  'drawn/Accordion/Accordion.css height: 22px': 'icon',
  'drawn/Button/Button.css height: 1.15em': 'icon, follows its text in em',
  'drawn/Button/Button.css height: 6px': 'stroke',
  'drawn/Carousel/Carousel.css height: 11px': 'marker',
  'drawn/Carousel/Carousel.css height: 22px': 'icon',
  'drawn/Carousel/Carousel.css min-height: 152px': 'slide area',
  'drawn/Checkbox/Checkbox.css height: 26px': 'marker',
  'drawn/Checkbox/Checkbox.css height: 36px': 'marker',
  'drawn/Chips/Chips.css height: 18px': 'icon',
  'drawn/CommandMenu/CommandMenu.css height: 20px': 'icon',
  'drawn/CommandMenu/CommandMenu.css height: 22px': 'icon',
  'drawn/HoldToConfirmButton/HoldToConfirmButton.css height: 1.15em':
    'icon, follows its text in em',
  'drawn/IconButton/IconButton.css height: 26px': 'icon',
  'drawn/IconButton/IconButton.css height: calc(100% + 4px)': 'decorative ring',
  'drawn/InkSplatterButton/InkSplatterButton.css height: 1.15em': 'icon, follows its text in em',
  'drawn/Link/Link.css height: 1.25em': 'icon, follows its text in em',
  'drawn/MultiSelect/MultiSelect.css height: 16px': 'icon',
  'drawn/MultiSelect/MultiSelect.css height: 20px': 'marker',
  'drawn/MultiSelect/MultiSelect.css height: 24px': 'caret',
  'drawn/NavItem/NavItem.css height: 16px': 'caret',
  'drawn/NavItem/NavItem.css height: 22px': 'icon',
  'drawn/NavItem/NavItem.css height: calc(100% + 10px)': 'decorative ring',
  'drawn/OrbitalThemeToggle/OrbitalThemeToggle.css font-size: 0.92em':
    'follows the container-clamped note',
  'drawn/OrbitalThemeToggle/OrbitalThemeToggle.css font-size: clamp(10px, 2.95cqi, 13px)':
    'container clamp',
  'drawn/OrbitalThemeToggle/OrbitalThemeToggle.css height: clamp(44px, 26.8cqi, 118px)':
    'container clamp',
  'drawn/Progress/Progress.css height: 20px': 'track',
  'drawn/Radio/Radio.css height: 26px': 'marker',
  'drawn/Select/Select.css height: 24px': 'caret',
  'drawn/Slider/Slider.css height: 12px': 'track',
  'drawn/Stepper/Stepper.css height: 22px': 'icon',
  'drawn/Tabs/Tabs.css height: 1px': 'stroke',
  'drawn/Tabs/Tabs.css height: 9px': 'stroke',
  'drawn/Textarea/Textarea.css height: 12px': 'stroke',
  'drawn/TextField/TextField.css height: 12px': 'stroke',
  'drawn/ThemeToggle/ThemeToggle.css height: 10px': 'illustration',
  'drawn/ThemeToggle/ThemeToggle.css height: 3px': 'illustration',
  'drawn/ThemeToggle/ThemeToggle.css height: 44px': 'illustration',
  'drawn/ThemeToggle/ThemeToggle.css height: 4px': 'illustration',
  'drawn/ThemeToggle/ThemeToggle.css height: 80px': 'illustration',
  'drawn/Tooltip/Tooltip.css height: 9px': 'caret',
  'drawn/Tooltip/Tooltip.css height: calc(var(--_gap) + 4px)': 'hover bridge',
  'matrix/Button/Button.css height: 1.25em': 'icon, follows its text in em',
  'matrix/Button/Button.css height: 1em': 'spinner, follows its text in em',
  'matrix/Button/Button.css height: 8px': 'marker',
  'matrix/Card/Card.css height: 12px': 'marker',
  'matrix/Carousel/Carousel.css height: 6px': 'marker',
  'matrix/Carousel/Carousel.css min-height: 152px': 'slide area',
  'matrix/ChevronNav/ChevronNav.css height: 16px': 'caret',
  'matrix/ChevronNav/ChevronNav.css height: 22px': 'icon',
  'matrix/CommandMenu/CommandMenu.css height: 2px': 'caret',
  'matrix/DecodeSecretField/DecodeSecretField.css height: 24px': 'icon',
  'matrix/GlitchThemeToggle/GlitchThemeToggle.css height: 16px': 'illustration',
  'matrix/GlitchThemeToggle/GlitchThemeToggle.css height: 40px': 'illustration',
  'matrix/GlitchThemeToggle/GlitchThemeToggle.css height: 76px': 'illustration',
  'matrix/HudTabs/HudTabs.css height: 8px': 'marker',
  'matrix/IconButton/IconButton.css height: 24px': 'icon',
  'matrix/IconButton/IconButton.css height: 8px': 'marker',
  'matrix/Link/Link.css height: 1.1em': 'icon, follows its text in em',
  'matrix/MultiSelect/MultiSelect.css height: 18px': 'caret',
  'matrix/Progress/Progress.css height: 12px': 'track',
  'matrix/ScanButton/ScanButton.css height: 11px': 'marker',
  'matrix/ScanButton/ScanButton.css height: 18px': 'icon',
  'matrix/SegmentedControl/SegmentedControl.css height: 8px': 'marker',
  'matrix/SignalBurger/SignalBurger.css height: 10px': 'illustration',
  'matrix/SignalBurger/SignalBurger.css height: 4px': 'stroke',
  'matrix/SignalBurger/SignalBurger.css height: 72px': 'illustration',
  'matrix/Slider/Slider.css height: 12px': 'track',
  'matrix/Slider/Slider.css height: 24px': 'marker',
  'matrix/TerminalSelect/TerminalSelect.css height: 10px': 'marker',
  'matrix/TerminalSelect/TerminalSelect.css height: 17px': 'caret',
  'matrix/TerminalSelect/TerminalSelect.css height: 18px': 'icon',
  'matrix/Tooltip/Tooltip.css height: calc(var(--_gap) + 2px)': 'hover bridge',
};

const sized =
  /^\s*(font-size|line-height|height|min-height|padding(?:-block|-top|-bottom)?)\s*:\s*([^;{]+);/gm;
const literal = /(?:^|[\s(,])-?\d*\.?\d+(?:px|rem|em)\b/;

/** Splits a value on top-level spaces, so `calc(a + b)` stays one part. */
function parts(value: string) {
  const out: string[] = [];
  let depth = 0;
  let part = '';
  for (const char of value.trim()) {
    if (char === '(') depth++;
    if (char === ')') depth--;
    if (char === ' ' && depth === 0) {
      out.push(part);
      part = '';
    } else part += char;
  }
  return [...out, part];
}

/** The block-axis values of a declaration: a padding shorthand's top and bottom, else all of it. */
function blockValues(property: string, value: string) {
  if (property !== 'padding') return [value];
  const [top, , bottom = top] = parts(value);
  return [top, bottom];
}

function literals() {
  const found: string[] = [];
  for (const [path, css] of Object.entries(componentCss)) {
    const file = path.replace('../', '');
    for (const [declaration, property, value] of css.matchAll(sized)) {
      // A max() floor is a deliberate fixed minimum, such as the 24px hit area.
      const values = blockValues(property, value).map((v) =>
        v.replace(/max\(\s*[\d.]+(?:px|rem),/g, 'max('),
      );
      if (values.some((v) => literal.test(v)))
        found.push(`${file} ${declaration.replace(/\s+/g, ' ').trim().slice(0, -1)}`);
    }
  }
  return found;
}

describe('text scale and density', () => {
  it('sizes text, controls and rows only from tokens', () => {
    const unexpected = literals().filter((entry) => !(entry in allowed));
    expect(unexpected).toEqual([]);
  });

  it('keeps every allowed literal in use', () => {
    const found = new Set(literals());
    expect(Object.keys(allowed).filter((entry) => !found.has(entry))).toEqual([]);
  });
});
