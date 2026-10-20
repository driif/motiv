import { fireEvent, render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { MagneticButton } from './MagneticButton';

describe('MagneticButton', () => {
  it('is a type="button" named by its children that reports clicks', () => {
    const onClick = vi.fn();
    render(<MagneticButton onClick={onClick}>Get started</MagneticButton>);
    const button = screen.getByRole('button', { name: 'Get started' });
    expect(button).toHaveAttribute('type', 'button');
    fireEvent.click(button);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('puts className on the field and ref and native props on the button', () => {
    const ref = createRef<HTMLButtonElement>();
    const { container } = render(
      <MagneticButton ref={ref} className="x" type="submit" disabled>
        Go
      </MagneticButton>,
    );
    expect(container.firstChild).toHaveClass('motiv-magnet', 'x');
    expect(ref.current).toBe(screen.getByRole('button'));
    expect(ref.current).toHaveAttribute('type', 'submit');
    expect(ref.current).toBeDisabled();
  });

  it('follows a mouse pointer while a consumer ref is attached', () => {
    vi.stubGlobal('requestAnimationFrame', (cb: FrameRequestCallback) => {
      cb(0);
      return 1;
    });
    const ref = createRef<HTMLButtonElement>();
    const { container } = render(<MagneticButton ref={ref}>Go</MagneticButton>);
    const field = container.firstChild as HTMLElement;
    fireEvent.pointerEnter(field, { pointerType: 'mouse' });
    fireEvent.pointerMove(field, { clientX: 50, clientY: 50 });
    expect(ref.current?.style.translate).not.toBe('');
    vi.unstubAllGlobals();
  });

  it('ignores touch pointers', () => {
    const { container } = render(<MagneticButton>Go</MagneticButton>);
    const field = container.firstChild as HTMLElement;
    fireEvent.pointerEnter(field, { pointerType: 'touch' });
    fireEvent.pointerMove(field, { clientX: 50, clientY: 50 });
    expect(screen.getByRole('button').style.translate).toBe('');
  });
});
