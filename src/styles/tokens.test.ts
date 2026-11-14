/// <reference types="vite/client" />
import { describe, expect, it } from 'vitest';
import tokens from './tokens.css?raw';

const componentCss = import.meta.glob<string>('../{components,drawn,matrix,markdown}/**/*.css', {
  query: '?raw',
  import: 'default',
  eager: true,
});

describe('text scale and density tokens', () => {
  it('re-declares the derived steps and heights on every motiv element', () => {
    const start = tokens.indexOf(':where(:root, [data-theme], [data-density], [class^="motiv-"]');
    const block = tokens.slice(start, tokens.indexOf('}', start));
    for (const token of [
      '--motiv-font-size-xs',
      '--motiv-font-size-sm',
      '--motiv-font-size-lg',
      '--motiv-font-size-xl',
      '--motiv-control-height',
      '--motiv-row-height',
    ]) {
      expect(block, token).toContain(`${token}:`);
    }
    expect(tokens).toMatch(/\[data-density="compact"\] \{\s*--motiv-space: 0\.1875rem;/);
  });

  it('keeps component font sizes on the text scale', () => {
    for (const [file, css] of Object.entries(componentCss)) {
      expect(css.match(/font-size:\s*[\d.]+rem/g), file).toBeNull();
    }
  });
});
