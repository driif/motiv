import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { StepProgress } from './StepProgress';

const steps = [
  { id: 'cart', label: 'Cart', description: 'Check your items' },
  { id: 'ship', label: 'Shipping', description: 'Where should it go?' },
  { id: 'pay', label: 'Payment' },
];

describe('StepProgress', () => {
  it('lists steps, marks the current one and announces finished ones', () => {
    render(<StepProgress steps={steps} current={1} className="x" />);
    const list = screen.getByRole('list', { name: 'Progress' });
    const items = screen.getAllByRole('listitem');
    expect(list.parentElement?.parentElement).toHaveClass('motiv-steps', 'x');
    expect(items[0]).toHaveTextContent('Cart (done)');
    expect(items[1]).toHaveAttribute('aria-current', 'step');
    expect(items[2]).not.toHaveAttribute('aria-current');
    expect(screen.getByText('Where should it go?')).toHaveAttribute('data-on');
  });

  it('marks every step done when completed and takes custom strings', () => {
    render(
      <StepProgress
        steps={steps}
        current={2}
        completed
        completedText="All set"
        label="Checkout"
        doneText="finished"
      />,
    );
    expect(screen.getByRole('list', { name: 'Checkout' })).toBeInTheDocument();
    for (const item of screen.getAllByRole('listitem')) {
      expect(item).toHaveTextContent('(finished)');
      expect(item).not.toHaveAttribute('aria-current');
    }
    expect(screen.getByText('All set')).toHaveAttribute('data-on');
  });
});
