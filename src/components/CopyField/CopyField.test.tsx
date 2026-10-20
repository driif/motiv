import { act, fireEvent, render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { CopyField } from './CopyField';

describe('CopyField', () => {
  afterEach(() => vi.unstubAllGlobals());

  it('copies the value, rolls to the copied label and calls onCopy', async () => {
    const writeText = vi.fn(() => Promise.resolve());
    vi.stubGlobal('navigator', { clipboard: { writeText } });
    vi.stubGlobal('isSecureContext', true);
    const onCopy = vi.fn();
    render(<CopyField value="sk_live_42" display="sk_live_••" onCopy={onCopy} />);
    expect(screen.getByText('sk_live_••')).toBeInTheDocument();
    const button = screen.getByRole('button', { name: 'Copy' });
    await act(async () => fireEvent.click(button));
    expect(writeText).toHaveBeenCalledWith('sk_live_42');
    expect(onCopy).toHaveBeenCalledTimes(1);
    expect(button).toHaveAccessibleName('Copied');
    expect(button).toHaveAttribute('data-copied', 'true');
  });

  it('merges className and passes ref and native props to the root', () => {
    const ref = createRef<HTMLDivElement>();
    const { container } = render(
      <CopyField ref={ref} value="x" className="extra" data-testid="c" label="Kopieren" />,
    );
    expect(container.firstChild).toHaveClass('motiv-copy', 'extra');
    expect(ref.current).toBe(screen.getByTestId('c'));
    expect(screen.getByRole('button', { name: 'Kopieren: x' })).toBeInTheDocument();
  });
});
