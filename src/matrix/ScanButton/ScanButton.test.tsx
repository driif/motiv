import { fireEvent, render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { ScanButton } from './ScanButton';

describe('ScanButton', () => {
  it('is a type="button" named by its label with decoration hidden', () => {
    const { container } = render(<ScanButton className="x">Deploy</ScanButton>);
    const button = screen.getByRole('button', { name: 'Deploy' });
    expect(button).toHaveAttribute('type', 'button');
    expect(button).toHaveClass('motiv-matrix-scan', 'x');
    expect(container.querySelectorAll('[aria-hidden="true"]')).toHaveLength(6);
  });

  it('drops the arrow with showArrow false', () => {
    const { container } = render(<ScanButton showArrow={false}>Deploy</ScanButton>);
    expect(container.querySelector('svg')).toBeNull();
  });

  it('passes native props, handlers and ref through', () => {
    const onClick = vi.fn();
    const ref = createRef<HTMLButtonElement>();
    render(
      <ScanButton ref={ref} type="submit" onClick={onClick}>
        Go
      </ScanButton>,
    );
    const button = screen.getByRole('button');
    fireEvent.click(button);
    expect(onClick).toHaveBeenCalled();
    expect(button).toHaveAttribute('type', 'submit');
    expect(ref.current).toBe(button);
  });
});
