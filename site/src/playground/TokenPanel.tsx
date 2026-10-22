import { type ReactNode, useEffect, useState } from 'react';

// Component tokens are unset by default, so until edited they show the token they fall back to.
const colors = [
  { token: '--motiv-color-primary', label: 'Primary' },
  { token: '--motiv-color-text', label: 'Text' },
  { token: '--motiv-button-border-color', label: 'Button border', from: '--motiv-color-primary' },
  { token: '--motiv-text-field-bg', label: 'Text field background', from: '--motiv-color-surface' },
  { token: '--motiv-card-bg', label: 'Card background', from: '--motiv-color-surface' },
];
const radius = '--motiv-radius';

type Tokens = Record<string, string>;

function readTokens(fallback: string): Tokens {
  const style = getComputedStyle(document.documentElement);
  const read = (token: string) => style.getPropertyValue(token).trim();
  // A color input takes only #rrggbb; canvas turns #fff or rgb() into it and ignores invalid values.
  const paint = document.createElement('canvas').getContext('2d');
  const tokens: Tokens = { [radius]: read(radius) };
  for (const { token, from } of colors) {
    let value = read(token) || read(from ?? token);
    if (paint) {
      paint.fillStyle = fallback;
      paint.fillStyle = value;
      value = String(paint.fillStyle);
    }
    tokens[token] = /^#[0-9a-f]{6}$/i.test(value) ? value : fallback;
  }
  return tokens;
}

export function TokenPanel({ fallback, children }: { fallback: string; children: ReactNode }) {
  const [edited, setEdited] = useState<Tokens>({});
  const [current, setCurrent] = useState<Tokens>({});
  const [copied, setCopied] = useState('');

  // Overrides go on <html>, where the derived tokens (primary-subtle, focus ring) are declared.
  useEffect(() => {
    const root = document.documentElement;
    for (const token of [radius, ...colors.map((color) => color.token)]) {
      if (edited[token]) root.style.setProperty(token, edited[token]);
      else root.style.removeProperty(token);
    }
    const sync = () => setCurrent(readTokens(fallback));
    sync();
    const observer = new MutationObserver(sync);
    observer.observe(root, { attributes: true, attributeFilter: ['data-theme'] });
    return () => observer.disconnect();
  }, [edited, fallback]);

  const value = (token: string) => edited[token] ?? current[token] ?? fallback;
  const edit = (token: string, next: string) => setEdited({ ...edited, [token]: next });
  const lines = Object.entries(edited).map(([token, next]) => `  ${token}: ${next};`);
  const css = `:root {\n${lines.join('\n') || '  /* change a token */'}\n}`;

  return (
    <div className="site-tokens">
      <fieldset className="site-tokens__controls">
        <legend className="site-tokens__legend">Tokens</legend>
        {colors.map(({ token, label }) => (
          <label key={token} className="site-tokens__field">
            {label}
            <input
              type="color"
              value={value(token)}
              onChange={(e) => edit(token, e.target.value)}
            />
          </label>
        ))}
        <label className="site-tokens__field">
          Radius
          <input
            type="range"
            min={0}
            max={1.5}
            step={0.125}
            value={Number.parseFloat(value(radius)) || 0}
            onChange={(e) => edit(radius, `${e.target.value}rem`)}
          />
        </label>
      </fieldset>
      <div className="site-tokens__samples">{children}</div>
      <div className="site-tokens__snippet">
        <pre className="site-tokens__code">
          <code>{css}</code>
        </pre>
        <div className="site-tokens__actions">
          <button
            type="button"
            className="site-tokens__action"
            onClick={() => navigator.clipboard.writeText(css).then(() => setCopied(css))}
          >
            {copied === css ? 'Copied' : 'Copy CSS'}
          </button>
          <button type="button" className="site-tokens__action" onClick={() => setEdited({})}>
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}
