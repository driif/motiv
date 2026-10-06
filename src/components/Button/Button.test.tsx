import { fireEvent, render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { Button, buttonClassName } from './Button';

describe('Button', () => {
  it('renders primary md by default with type="button"', () => {
    render(<Button>Save</Button>);
    const button = screen.getByRole('button', { name: 'Save' });
    expect(button).toHaveClass('motiv-btn', 'motiv-btn--primary', 'motiv-btn--md');
    expect(button).toHaveAttribute('type', 'button');
  });

  it('applies variant and size classes', () => {
    render(
      <Button variant="ghost" size="sm">
        Go
      </Button>,
    );
    expect(screen.getByRole('button')).toHaveClass('motiv-btn--ghost', 'motiv-btn--sm');
  });

  it('merges className and passes native props and ref through', () => {
    const ref = createRef<HTMLButtonElement>();
    render(
      <Button ref={ref} className="extra" aria-label="Close" data-testid="b" type="submit">
        x
      </Button>,
    );
    const button = screen.getByTestId('b');
    expect(button).toHaveClass('motiv-btn', 'extra');
    expect(button).toHaveAttribute('aria-label', 'Close');
    expect(button).toHaveAttribute('type', 'submit');
    expect(ref.current).toBe(button);
  });

  it('does not submit a surrounding form without an explicit type', () => {
    const onSubmit = vi.fn((e: { preventDefault(): void }) => e.preventDefault());
    render(
      <form onSubmit={onSubmit}>
        <Button>Inside</Button>
      </form>,
    );
    fireEvent.click(screen.getByRole('button'));
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('loading disables the button, sets aria-busy and blocks onClick', () => {
    const onClick = vi.fn();
    render(
      <Button loading disabled={false} onClick={onClick}>
        Save
      </Button>,
    );
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute('aria-busy', 'true');
    fireEvent.click(button);
    expect(onClick).not.toHaveBeenCalled();
  });

  it('renders icons on both sides', () => {
    render(
      <Button iconLeft={<svg data-testid="l" />} iconRight={<svg data-testid="r" />}>
        Go
      </Button>,
    );
    expect(screen.getByTestId('l')).toBeInTheDocument();
    expect(screen.getByTestId('r')).toBeInTheDocument();
  });
});

describe('buttonClassName', () => {
  it('builds the same classes for non-button elements', () => {
    expect(buttonClassName({ variant: 'outline', size: 'lg', className: 'x' })).toBe(
      'motiv-btn motiv-btn--outline motiv-btn--lg x',
    );
    expect(buttonClassName()).toBe('motiv-btn motiv-btn--primary motiv-btn--md');
  });
});
