import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Accordion } from './Accordion';

const items = [
  { id: 'a', title: 'Shipping', content: 'Two days' },
  { id: 'b', title: 'Returns', content: 'Thirty days' },
];

describe('Accordion', () => {
  it('opens one panel at a time by default', () => {
    render(<Accordion items={items} className="x" data-testid="acc" />);
    expect(screen.getByTestId('acc')).toHaveClass('motiv-sketch-accordion', 'x');
    const shipping = screen.getByRole('button', { name: 'Shipping' });
    const returns = screen.getByRole('button', { name: 'Returns' });
    expect(shipping).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByRole('region')).toBeNull();
    fireEvent.click(shipping);
    expect(shipping).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('region', { name: 'Shipping' })).toHaveTextContent('Two days');
    fireEvent.click(returns);
    expect(shipping).toHaveAttribute('aria-expanded', 'false');
    expect(returns).toHaveAttribute('aria-expanded', 'true');
  });

  it('allows several with multiple and renders headings at the given level', () => {
    render(<Accordion items={items} multiple defaultOpen={['a']} headingLevel={2} />);
    fireEvent.click(screen.getByRole('button', { name: 'Returns' }));
    expect(screen.getAllByRole('region')).toHaveLength(2);
    expect(screen.getAllByRole('heading', { level: 2 })).toHaveLength(2);
  });

  it('works controlled', () => {
    const onOpenChange = vi.fn();
    render(<Accordion items={items} open={['b']} onOpenChange={onOpenChange} />);
    fireEvent.click(screen.getByRole('button', { name: 'Shipping' }));
    expect(onOpenChange).toHaveBeenCalledWith(['a']);
    expect(screen.getByRole('button', { name: 'Shipping' })).toHaveAttribute(
      'aria-expanded',
      'false',
    );
  });
});
