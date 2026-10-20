import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Odometer } from './Odometer';

describe('Odometer', () => {
  it('renders one rolling column per digit, padded and hidden from assistive tech', () => {
    const { container } = render(
      <Odometer value={7} minDigits={3} dimLeadingZeros className="x" />,
    );
    const root = container.firstChild as HTMLElement;
    expect(root).toHaveClass('motiv-odometer', 'x');
    expect(root).toHaveAttribute('aria-hidden', 'true');
    const cols = root.querySelectorAll('.motiv-odometer__col');
    expect(cols).toHaveLength(3);
    expect(cols[0]).toHaveClass('motiv-odometer__col--dim');
    expect(cols[2]).not.toHaveClass('motiv-odometer__col--dim');
    const strip = cols[2].querySelector<HTMLElement>('.motiv-odometer__strip');
    expect(strip?.style.translate).toBe('0 -70%');
  });

  it('shows the sign and fraction digits as they are', () => {
    const { container, rerender } = render(
      <Odometer value={-3.75} minDigits={2} dimLeadingZeros />,
    );
    expect(container.textContent?.replace(/0123456789/g, '#')).toBe('-##.##');
    const cols = container.querySelectorAll('.motiv-odometer__col');
    expect(cols[0]).toHaveTextContent('-');
    expect(cols[1]).toHaveClass('motiv-odometer__col--dim');
    expect(cols[2]).not.toHaveClass('motiv-odometer__col--dim');
    const strips = container.querySelectorAll<HTMLElement>('.motiv-odometer__strip');
    expect([...strips].map((s) => s.style.translate)).toEqual([
      '0 0%',
      '0 -30%',
      '0 -70%',
      '0 -50%',
    ]);
    rerender(<Odometer value={0.5} decimals={2} dimLeadingZeros />);
    expect(container.textContent?.replace(/0123456789/g, '#')).toBe('#.##');
    expect(container.querySelector('.motiv-odometer__col--dim')).toBeNull();
  });
});
