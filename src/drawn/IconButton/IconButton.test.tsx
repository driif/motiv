import { fireEvent, render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { IconButton, IconButtonGroup } from './IconButton';

describe('IconButton', () => {
  it('is a button named by label with a hidden icon', () => {
    const { container } = render(<IconButton icon={<svg />} label="Edit" className="x" />);
    const button = screen.getByRole('button', { name: 'Edit' });
    expect(button).toHaveClass('motiv-icon-button', 'x');
    expect(button).toHaveAttribute('type', 'button');
    expect(button).toHaveAttribute('title', 'Edit');
    expect(container.querySelector('.motiv-icon-button__icon')).toHaveAttribute(
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
});

describe('IconButtonGroup', () => {
  it('is a labelled group', () => {
    render(
      <IconButtonGroup label="Tools" className="x">
        <IconButton icon="✎" label="Edit" />
      </IconButtonGroup>,
    );
    const group = screen.getByRole('group', { name: 'Tools' });
    expect(group).toHaveClass('motiv-icon-button-group', 'x');
    expect(group).toContainElement(screen.getByRole('button', { name: 'Edit' }));
  });
});
