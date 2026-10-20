import { render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it } from 'vitest';
import { BadgeButton } from './BadgeButton';

describe('BadgeButton', () => {
  it('names itself with the unread count and hides the badge at zero', () => {
    const { rerender } = render(<BadgeButton count={0} label="Inbox" />);
    const button = screen.getByRole('button', { name: 'Inbox' });
    expect(button.querySelector('.motiv-badge__count')).toHaveAttribute('data-on', 'false');
    rerender(<BadgeButton count={3} label="Inbox" />);
    expect(button).toHaveAccessibleName('Inbox, 3 unread');
    expect(button.querySelector('.motiv-badge__count')).toHaveAttribute('data-on', 'true');
    rerender(<BadgeButton count={250} label="Inbox" unreadText="new" />);
    expect(button).toHaveAccessibleName('Inbox, 99+ new');
  });

  it('takes a custom icon, className, ref and native props', () => {
    const ref = createRef<HTMLButtonElement>();
    render(
      <BadgeButton ref={ref} count={1} label="Cart" icon={<svg data-testid="i" />} className="x" />,
    );
    const button = screen.getByRole('button');
    expect(button).toHaveClass('motiv-badge', 'x');
    expect(button).toHaveAttribute('type', 'button');
    expect(screen.getByTestId('i')).toBeInTheDocument();
    expect(ref.current).toBe(button);
  });
});
