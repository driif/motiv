import { fireEvent, render, screen } from '@testing-library/react';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { OtpInput } from './OtpInput';

function Controlled({ onComplete }: { onComplete?: (v: string) => void }) {
  const [code, setCode] = useState('');
  return (
    <OtpInput value={code} onChange={setCode} label="Code" length={4} onComplete={onComplete} />
  );
}

describe('OtpInput', () => {
  it('is a group of labelled digit boxes', () => {
    const { container } = render(
      <OtpInput value="12" onChange={vi.fn()} label="Code" className="x" />,
    );
    expect(container.firstChild).toHaveClass('motiv-matrix-otp', 'x');
    expect(screen.getByRole('group', { name: 'Code' })).toBeInTheDocument();
    const boxes = screen.getAllByRole('textbox');
    expect(boxes).toHaveLength(6);
    expect(boxes[0]).toHaveAccessibleName('Digit 1 of 6');
    expect(boxes[0]).toHaveValue('1');
    expect(boxes[1]).toHaveValue('2');
    expect(boxes[2]).toHaveValue('');
  });

  it('moves focus forward while typing and reports completion', () => {
    const onComplete = vi.fn();
    render(<Controlled onComplete={onComplete} />);
    const boxes = screen.getAllByRole('textbox');
    boxes[0].focus();
    fireEvent.change(boxes[0], { target: { value: '4' } });
    expect(boxes[1]).toHaveFocus();
    fireEvent.change(boxes[1], { target: { value: '2' } });
    fireEvent.keyDown(boxes[2], { key: 'Backspace' });
    expect(boxes[1]).toHaveFocus();
    expect(boxes[1]).toHaveValue('');
    fireEvent.paste(boxes[1], { clipboardData: { getData: () => '9-8-7' } });
    expect(boxes.map((b) => (b as HTMLInputElement).value).join('')).toBe('4987');
    expect(onComplete).toHaveBeenCalledWith('4987');
  });

  it('takes a custom digit label and reflects status', () => {
    const { container } = render(
      <OtpInput
        value=""
        onChange={vi.fn()}
        label="PIN"
        length={2}
        status="error"
        digitLabel={(i) => `Box ${i + 1}`}
      />,
    );
    expect(screen.getAllByRole('textbox')[1]).toHaveAccessibleName('Box 2');
    expect(container.firstChild).toHaveAttribute('data-status', 'error');
  });

  it('reflects success after the code is verified', () => {
    const { container } = render(
      <OtpInput value="1234" onChange={vi.fn()} label="Code" length={4} status="success" />,
    );
    expect(container.firstChild).toHaveAttribute('data-status', 'success');
  });
});
