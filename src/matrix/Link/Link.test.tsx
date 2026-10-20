import { render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it } from 'vitest';
import { Link } from './Link';

describe('Link', () => {
  it('renders an internal link with a decorative arrow by default', () => {
    const { container } = render(<Link href="/docs">Docs</Link>);
    const link = screen.getByRole('link', { name: 'Docs' });
    expect(link).toHaveClass('motiv-matrix-link');
    expect(link).toHaveAttribute('href', '/docs');
    expect(link).not.toHaveAttribute('target');
    expect(link).not.toHaveAttribute('rel');
    expect(container.querySelector('svg')).toHaveAttribute('aria-hidden', 'true');
  });

  it('hides the arrow when arrow is false', () => {
    const { container } = render(
      <Link href="/" arrow={false}>
        Home
      </Link>,
    );
    expect(container.querySelector('svg')).toBeNull();
  });

  it('external opens a new tab safely and announces it', () => {
    render(
      <Link href="https://example.com" external>
        Example
      </Link>,
    );
    const link = screen.getByRole('link', { name: 'Example (opens in a new tab)' });
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('external keeps target and safe rel over native props', () => {
    render(
      <Link href="https://example.com" external target="_self" rel="nofollow">
        Example
      </Link>,
    );
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'nofollow noopener noreferrer');
  });

  it('takes a custom externalLabel', () => {
    render(
      <Link href="https://example.com" external externalLabel="(new window)">
        Example
      </Link>,
    );
    expect(screen.getByRole('link', { name: 'Example (new window)' })).toBeInTheDocument();
  });

  it('merges className and passes native props and ref through', () => {
    const ref = createRef<HTMLAnchorElement>();
    render(
      <Link ref={ref} href="/" className="extra" aria-current="page">
        Home
      </Link>,
    );
    const link = screen.getByRole('link');
    expect(link).toHaveClass('motiv-matrix-link', 'extra');
    expect(link).toHaveAttribute('aria-current', 'page');
    expect(ref.current).toBe(link);
  });
});
