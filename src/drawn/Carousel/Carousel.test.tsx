import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Carousel } from './Carousel';

const slides = [
  { id: 'a', label: 'Policies', content: 'Policies' },
  { id: 'b', label: 'Secrets', content: 'Secrets' },
  { id: 'c', label: 'Audit', content: 'Audit' },
];

describe('Carousel', () => {
  it('is a labelled carousel with the current slide exposed', () => {
    render(<Carousel slides={slides} label="Features" className="x" />);
    const root = screen.getByRole('region', { name: 'Features' });
    expect(root).toHaveClass('motiv-sketch-carousel', 'x');
    expect(root).toHaveAttribute('aria-roledescription', 'carousel');
    expect(screen.getByRole('group', { name: 'Policies' })).toHaveAttribute(
      'aria-roledescription',
      'slide',
    );
    expect(screen.queryByRole('group', { name: 'Secrets' })).toBeNull();
    expect(screen.getByRole('button', { name: 'Policies' })).toHaveAttribute(
      'aria-current',
      'true',
    );
  });

  it('moves with arrows, dots and keys, looping by default', () => {
    render(<Carousel slides={slides} label="Features" />);
    fireEvent.click(screen.getByRole('button', { name: 'Previous slide' }));
    expect(screen.getByRole('button', { name: 'Audit' })).toHaveAttribute('aria-current', 'true');
    fireEvent.click(screen.getByRole('button', { name: 'Next slide' }));
    expect(screen.getByRole('button', { name: 'Policies' })).toHaveAttribute(
      'aria-current',
      'true',
    );
    fireEvent.click(screen.getByRole('button', { name: 'Secrets' }));
    expect(screen.getByRole('group', { name: 'Secrets' })).toBeInTheDocument();
    fireEvent.keyDown(screen.getByRole('region'), { key: 'ArrowRight' });
    expect(screen.getByRole('group', { name: 'Audit' })).toBeInTheDocument();
  });

  it('ignores moves while it has no slides', () => {
    const onIndexChange = vi.fn();
    const { rerender } = render(
      <Carousel slides={[]} label="Features" onIndexChange={onIndexChange} />,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Next slide' }));
    expect(onIndexChange).not.toHaveBeenCalled();
    rerender(<Carousel slides={slides} label="Features" onIndexChange={onIndexChange} />);
    expect(screen.getByRole('group', { name: 'Policies' })).toBeInTheDocument();
  });

  it('is controllable and disables the ends without loop', () => {
    const onIndexChange = vi.fn();
    render(
      <Carousel
        slides={slides}
        label="Features"
        index={0}
        loop={false}
        onIndexChange={onIndexChange}
      />,
    );
    expect(screen.getByRole('button', { name: 'Previous slide' })).toBeDisabled();
    fireEvent.click(screen.getByRole('button', { name: 'Next slide' }));
    expect(onIndexChange).toHaveBeenCalledWith(1);
    expect(screen.getByRole('button', { name: 'Policies' })).toHaveAttribute(
      'aria-current',
      'true',
    );
  });

  it('swipes and leaves keys from text fields alone', () => {
    render(
      <Carousel
        slides={[...slides, { id: 'd', label: 'Notes', content: <input aria-label="Note" /> }]}
        label="Features"
      />,
    );
    const view = screen.getByRole('group', { name: 'Policies' }).parentElement?.parentElement;
    if (!view) throw new Error('no view');
    fireEvent.pointerDown(view, { clientX: 200 });
    fireEvent.pointerUp(view, { clientX: 100 });
    expect(screen.getByRole('group', { name: 'Secrets' })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Notes' }));
    fireEvent.keyDown(screen.getByRole('textbox', { name: 'Note' }), { key: 'ArrowLeft' });
    expect(screen.getByRole('group', { name: 'Notes' })).toBeInTheDocument();
  });
});
