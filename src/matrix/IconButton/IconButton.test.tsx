import { fireEvent, render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { IconButton, IconButtonGroup } from './IconButton';

describe('IconButton', () => {
  it('is a button named by label with a hidden icon', () => {
    const { container } = render(<IconButton icon={<svg />} label="Edit" className="x" />);
    const button = screen.getByRole('button', { name: 'Edit' });
    expect(button).toHaveClass('motiv-matrix-icon-button', 'x');
    expect(button).toHaveAttribute('type', 'button');
    expect(button).toHaveAttribute('title', 'Edit');
    expect(container.querySelector('.motiv-matrix-icon-button__icon')).toHaveAttribute(
      'aria-hidden',
      'true',
    );
  });

  it('passes native props, handlers and ref through', () => {
    const onClick = vi.fn();
    const ref = createRef<HTMLButtonElement>();
    render(<IconButton ref={ref} icon="✎" label="Edit" type="submit" onClick={onClick} />);
    const button = screen.getByRole('button');
    fireEvent.click(button);
    expect(onClick).toHaveBeenCalled();
    expect(button).toHaveAttribute('type', 'submit');
    expect(ref.current).toBe(button);
  });

  it('adds the sm modifier only for size sm and keeps size off the DOM', () => {
    const { rerender } = render(<IconButton icon="✎" label="Edit" size="sm" />);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('motiv-matrix-icon-button--sm');
    expect(button).not.toHaveAttribute('size');
    rerender(<IconButton icon="✎" label="Edit" size="md" />);
    expect(button).not.toHaveClass('motiv-matrix-icon-button--sm');
    rerender(<IconButton icon="✎" label="Edit" />);
    expect(button).not.toHaveClass('motiv-matrix-icon-button--sm');
  });

  it('adds the xs modifier for the row-height size', () => {
    render(<IconButton icon="✎" label="Edit" size="xs" />);
    expect(screen.getByRole('button')).toHaveClass('motiv-matrix-icon-button--xs');
  });
});

describe('IconButtonGroup', () => {
  it('is a labelled group', () => {
    render(
      <IconButtonGroup label="Tools" className="x">
        <IconButton icon="✎" label="Edit" />
      </IconButtonGroup>,
    );
    const group = screen.getByRole('group', { name: 'Tools' });
    expect(group).toHaveClass('motiv-matrix-icon-button-group', 'x');
    expect(group).toContainElement(screen.getByRole('button', { name: 'Edit' }));
  });

  it('makes a small group with size sm', () => {
    render(<IconButtonGroup label="Tools" size="sm" />);
    const group = screen.getByRole('group', { name: 'Tools' });
    expect(group).toHaveClass('motiv-matrix-icon-button-group--sm');
    expect(group).not.toHaveAttribute('size');
  });

  it('adds the round modifier only for shape round', () => {
    const { rerender } = render(<IconButton icon="✎" label="Edit" shape="round" />);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('motiv-matrix-icon-button--round');
    expect(button).not.toHaveAttribute('shape');
    rerender(<IconButton icon="✎" label="Edit" />);
    expect(button).not.toHaveClass('motiv-matrix-icon-button--round');
  });
});
