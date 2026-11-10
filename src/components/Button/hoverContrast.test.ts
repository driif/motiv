/// <reference types="vite/client" />
import { describe, expect, it } from 'vitest';
import tokens from '../../styles/tokens.css?raw';
import button from './Button.css?raw';

function block(selector: string) {
  const start = tokens.indexOf(`${selector} {`);
  const body = tokens.slice(start, tokens.indexOf('}', start));
  return Object.fromEntries(
    [...body.matchAll(/(--motiv-[\w-]+):\s*([^;]+);/g)].map((m) => [m[1], m[2].trim()]),
  );
}

const named: Record<string, string> = { white: '#ffffff', black: '#000000' };

function linear(hex: string) {
  const value = named[hex] ?? hex;
  return [1, 3, 5].map((i) => {
    const c = Number.parseInt(value.slice(i, i + 2), 16) / 255;
    return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
}

function oklch(hex: string) {
  const [r, g, b] = linear(hex);
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  const a = 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s;
  const bb = 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s;
  return {
    L: 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
    C: Math.hypot(a, bb),
    H: Math.atan2(bb, a),
  };
}

function toLinear({ L, C, H }: { L: number; C: number; H: number }) {
  const a = C * Math.cos(H);
  const b = C * Math.sin(H);
  const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const s = (L - 0.0894841775 * a - 1.291485548 * b) ** 3;
  return [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  ].map((c) => Math.min(1, Math.max(0, c)));
}

function luminance(rgb: number[]) {
  return 0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2];
}

// color-mix(in oklch, fill, mix 15%): white and black have no hue, so the fill keeps its own.
function hover(fill: string, mix: string) {
  const f = oklch(fill);
  if (mix !== 'white' && mix !== 'black') throw new Error(`unsupported hover mix ${mix}`);
  const target = mix === 'white' ? 1 : 0;
  return toLinear({ L: f.L * 0.85 + target * 0.15, C: f.C * 0.85, H: f.H });
}

function contrast(a: number[], b: number[]) {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

describe.each([
  ['light', block(':root,\n  [data-theme="light"]')],
  ['dark', block('[data-theme="dark"]')],
  ['system dark', block(':root:not([data-theme])')],
])('%s theme', (_, theme) => {
  it.each(['primary', 'secondary', 'danger'])('keeps %s label readable on hover', (variant) => {
    const mix = theme[`--motiv-color-${variant}-hover-mix`] ?? 'white';
    const fill = hover(theme[`--motiv-color-${variant}`], mix);
    expect(contrast(fill, linear(theme[`--motiv-color-on-${variant}`]))).toBeGreaterThanOrEqual(
      4.5,
    );
  });
});

it('uses the theme hover-mix tokens for primary and danger', () => {
  expect(button).toContain('--_hover-mix: var(--motiv-color-primary-hover-mix)');
  expect(button).toContain('--_hover-mix: var(--motiv-color-danger-hover-mix)');
});
