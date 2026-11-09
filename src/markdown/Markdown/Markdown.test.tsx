import { render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it } from 'vitest';
import { Markdown } from './Markdown';

describe('Markdown', () => {
  it('renders CommonMark headings, lists, emphasis, code and links', () => {
    const { container } = render(
      <Markdown>
        {
          '# Heading\n\n**Bold** and *emphasis* with `code`.\n\n- One\n- Two\n\n1. First\n2. Second\n\n> A quote\n\n```js\nconst x = 1 < 2;\n```\n\n[Guide](/guide "Read more")'
        }
      </Markdown>,
    );
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Heading');
    expect(screen.getAllByRole('list')).toHaveLength(2);
    expect(screen.getAllByRole('listitem')).toHaveLength(4);
    expect(container.querySelector('strong')).toHaveTextContent('Bold');
    expect(container.querySelector('em')).toHaveTextContent('emphasis');
    expect(container.querySelector('code')).toHaveTextContent('code');
    expect(container.querySelector('blockquote')).toHaveTextContent('A quote');
    expect(container.querySelector('pre > code')).toHaveClass('language-js');
    expect(container.querySelector('pre > code')).toHaveTextContent('const x = 1 < 2;');
    expect(screen.getByRole('link', { name: 'Guide' })).toHaveAttribute('href', '/guide');
    expect(screen.getByRole('link')).toHaveAttribute('title', 'Read more');
  });

  it.each([
    '<script>alert(1)</script>',
    '<img src=x onerror=alert(1)>',
    '<a href="javascript:alert(1)">unsafe</a>',
  ])('keeps raw HTML inert: %s', (source) => {
    const { container } = render(<Markdown>{source}</Markdown>);
    expect(container.querySelector('script, img, a')).toBeNull();
    expect(container.firstChild).toHaveTextContent(source);
  });

  it.each([
    'javascript:alert(1)',
    'JaVaScRiPt:alert(1)',
    '&#x6a;avascript:alert(1)',
    'javascript&#58;alert(1)',
    'java&#x09;script:alert(1)',
    'data:text/html,unsafe',
    'vbscript:unsafe',
    'irc://example.com/channel',
    'ircs://example.com/channel',
  ])('removes unsafe link destinations: %s', (href) => {
    const { container } = render(<Markdown>{`[x](${href})`}</Markdown>);
    const link = container.querySelector('a');
    expect(link).toHaveTextContent('x');
    expect([null, '']).toContain(link?.getAttribute('href'));
  });

  it.each([
    'http://example.com',
    'https://example.com/path?q=1&x=2',
    'mailto:hello@example.com',
    'xmpp:hello@example.com',
    '/guide',
    './guide',
    '../guide',
    'guide',
    '#details',
    '//example.com/guide',
  ])('keeps safe links: %s', (href) => {
    render(<Markdown>{`[Guide](${href})`}</Markdown>);
    expect(screen.getByRole('link')).toHaveAttribute('href', href);
  });

  it('defaults to empty and passes native div props and ref through', () => {
    const ref = createRef<HTMLDivElement>();
    const { container } = render(
      <Markdown
        ref={ref}
        className="custom"
        id="notes"
        aria-label="Notes"
        style={{ width: 200 }}
      />,
    );
    expect(ref.current).toBe(container.firstChild);
    expect(ref.current).toHaveClass('motiv-markdown', 'custom');
    expect(ref.current).toHaveAttribute('id', 'notes');
    expect(ref.current).toHaveAccessibleName('Notes');
    expect(ref.current).toHaveStyle({ width: '200px' });
    expect(ref.current).toBeEmptyDOMElement();
  });
});
