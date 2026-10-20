import { fireEvent, render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { Button, buttonClassName } from './Button';

describe('Button', () => {
  it('renders primary md by default with type="button"', () => {
    render(<Button>Save</Button>);
    const button = screen.getByRole('button', { name: 'Save' });
    expect(button).toHaveClass(
      'motiv-matrix-btn',
      'motiv-matrix-btn--primary',
      'motiv-matrix-btn--md',
    );
    expect(button).toHaveAttribute('type', 'button');
  });

  it('applies variant and size classes', () => {
    render(
      <Button variant="ghost" size="sm">
        Go
      </Button>,
    );
    expect(screen.getByRole('button')).toHaveClass(
      'motiv-matrix-btn--ghost',
      'motiv-matrix-btn--sm',
    );
  });

  it('merges className and passes native props and ref through', () => {
    const ref = createRef<HTMLButtonElement>();
    render(
      <Button ref={ref} className="extra" data-testid="b" type="submit">
        x
      </Button>,
    );
    const button = screen.getByTestId('b');
    expect(button).toHaveClass('motiv-matrix-btn', 'extra');
    expect(button).toHaveAttribute('type', 'submit');
    expect(ref.current).toBe(button);
  });

  it('loading disables the button, sets aria-busy and blocks onClick', () => {
    const onClick = vi.fn();
    render(
      <Button loading onClick={onClick}>
        Save
      </Button>,
    );
    const button = screen.getByRole('button', { name: 'Save' });
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute('aria-busy', 'true');
    fireEvent.click(button);
    expect(onClick).not.toHaveBeenCalled();
    expect(button.querySelector('.motiv-matrix-btn__spinner')).toHaveClass(
      'motiv-matrix-btn__spinner--overlay',
    );
  });

  it('loading replaces iconLeft with the spinner and keeps iconRight', () => {
    render(
      <Button loading iconLeft={<svg data-testid="l" />} iconRight={<svg data-testid="r" />}>
        Save
      </Button>,
    );
    expect(screen.queryByTestId('l')).toBeNull();
    expect(screen.getByTestId('r')).toBeInTheDocument();
    const spinner = screen.getByRole('button').querySelector('.motiv-matrix-btn__spinner');
    expect(spinner).not.toHaveClass('motiv-matrix-btn__spinner--overlay');
  });
});

describe('buttonClassName', () => {
  it('builds the same classes for non-button elements', () => {
    expect(buttonClassName({ variant: 'outline', size: 'lg', className: 'x' })).toBe(
      'motiv-matrix-btn motiv-matrix-btn--outline motiv-matrix-btn--lg x',
    );
    expect(buttonClassName()).toBe(
      'motiv-matrix-btn motiv-matrix-btn--primary motiv-matrix-btn--md',
    );
  });
});
