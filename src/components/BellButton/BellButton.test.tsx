import { render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it } from 'vitest';
import { BellButton } from './BellButton';

describe('BellButton', () => {
  it('announces the count in its name and caps the badge at max', () => {
    const { rerender } = render(<BellButton count={0} />);
    const button = screen.getByRole('button', { name: 'Notifications' });
    expect(button).toHaveAttribute('type', 'button');
    rerender(<BellButton count={120} />);
    expect(button).toHaveAccessibleName('Notifications, 120 new');
    expect(button.querySelector('.motiv-bell__badge')).toHaveTextContent('99+');
    expect(button.querySelector('.motiv-bell__badge')).toHaveAttribute('data-on', 'true');
  });

  it('takes custom strings, className, ref and native props', () => {
    const ref = createRef<HTMLButtonElement>();
    render(
      <BellButton ref={ref} count={2} label="Alerts" newText="unread" className="x" disabled />,
    );
    const button = screen.getByRole('button', { name: 'Alerts, 2 unread' });
    expect(button).toHaveClass('motiv-bell', 'x');
    expect(button).toBeDisabled();
    expect(ref.current).toBe(button);
  });
});
