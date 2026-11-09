import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Progress } from './Progress';

describe('Progress', () => {
  it('exposes a labelled progressbar and a hidden visible value', () => {
    const { container } = render(<Progress value={42.4} label="Upload" className="x" />);
    const bar = screen.getByRole('progressbar', { name: 'Upload' });
    expect(bar).toHaveAttribute('aria-valuemin', '0');
    expect(bar).toHaveAttribute('aria-valuemax', '100');
    expect(bar).toHaveAttribute('aria-valuenow', '42');
    const root = container.firstElementChild as HTMLElement;
    expect(root).toHaveClass('motiv-bar', 'x');
    expect(root.style.getPropertyValue('--_value')).toBe('42');
    expect(screen.getByText('42%')).toHaveAttribute('aria-hidden', 'true');
  });

  it('clamps to 0..100', () => {
    const { rerender } = render(<Progress value={-5} label="Upload" />);
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '0');
    rerender(<Progress value={140} label="Upload" />);
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '100');
  });

  it('hides the value with showValue false', () => {
    render(<Progress value={10} label="Upload" showValue={false} />);
    expect(screen.queryByText('10%')).toBeNull();
  });

  it.each([
    ['omitted', <Progress key="a" label="Preparing" />],
    ['undefined', <Progress key="b" value={undefined} label="Preparing" />],
  ])('is indeterminate with value %s', (_, element) => {
    const { container } = render(element);
    const bar = screen.getByRole('progressbar', { name: 'Preparing' });
    expect(bar).not.toHaveAttribute('aria-valuenow');
    expect(bar).not.toHaveAttribute('aria-valuemin');
    expect(container).not.toHaveTextContent('%');
    const root = container.firstElementChild as HTMLElement;
    expect(root).toHaveAttribute('data-indeterminate');
    expect(root.style.getPropertyValue('--_value')).toBe('');
  });

  it('stays determinate at 0', () => {
    const { container } = render(<Progress value={0} label="Upload" />);
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '0');
    expect(screen.getByText('0%')).toBeInTheDocument();
    expect(container.firstElementChild).not.toHaveAttribute('data-indeterminate');
  });

  it('switches from indeterminate to a value', () => {
    const { container, rerender } = render(<Progress label="Upload" />);
    const root = container.firstElementChild as HTMLElement;
    rerender(<Progress value={30} label="Upload" />);
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '30');
    expect(root).not.toHaveAttribute('data-indeterminate');
    rerender(<Progress value={100} label="Upload" />);
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '100');
  });
});
