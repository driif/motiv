import { fireEvent, render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it } from 'vitest';
import { SlipCard } from './SlipCard';

describe('SlipCard', () => {
  it('slides the note out and back', () => {
    render(<SlipCard title="Morning pages" description="Three pages" note="Write by hand." />);
    expect(screen.getByRole('heading', { name: 'Morning pages' })).toBeInTheDocument();
    expect(screen.queryByText('Write by hand.')).toBeNull();
    const tab = screen.getByRole('button', { name: 'Pull a little thought' });
    expect(tab).toHaveAttribute('aria-expanded', 'false');
    fireEvent.click(tab);
    expect(tab).toHaveAttribute('aria-expanded', 'true');
    expect(tab).toHaveAccessibleName('Slip it back');
    expect(screen.getByText('Write by hand.')).toBeInTheDocument();
    expect(document.getElementById(tab.getAttribute('aria-controls') ?? '')).toHaveAttribute(
      'aria-hidden',
      'false',
    );
  });

  it('takes custom labels, merges className and passes ref through', () => {
    const ref = createRef<HTMLElement>();
    render(
      <SlipCard
        ref={ref}
        className="x"
        title="T"
        description="D"
        note="N"
        openLabel="More"
        closeLabel="Less"
      />,
    );
    expect(ref.current).toHaveClass('motiv-slip-card', 'x');
    fireEvent.click(screen.getByRole('button', { name: 'More' }));
    expect(screen.getByRole('button', { name: 'Less' })).toBeInTheDocument();
  });
});
