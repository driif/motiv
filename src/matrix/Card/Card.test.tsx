import { render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it } from 'vitest';
import { Card, CardBody, CardFooter, CardHeader } from './Card';

describe('Card', () => {
  it('renders an elevated md div by default', () => {
    render(<Card data-testid="c">x</Card>);
    const card = screen.getByTestId('c');
    expect(card.tagName).toBe('DIV');
    expect(card).toHaveClass(
      'motiv-matrix-card',
      'motiv-matrix-card--elevated',
      'motiv-matrix-card--p-md',
    );
    expect(card).not.toHaveClass('motiv-matrix-card--interactive');
  });

  it('applies variant, padding, interactive, as and className', () => {
    render(
      <ul>
        <Card
          as="li"
          variant="outlined"
          padding="none"
          interactive
          className="mine"
          data-testid="c"
        >
          x
        </Card>
      </ul>,
    );
    const card = screen.getByTestId('c');
    expect(card.tagName).toBe('LI');
    expect(card).toHaveClass(
      'motiv-matrix-card--outlined',
      'motiv-matrix-card--p-none',
      'motiv-matrix-card--interactive',
      'mine',
    );
  });

  it('forwards ref to the rendered element', () => {
    const ref = createRef<HTMLElement>();
    render(<Card as="section" ref={ref} />);
    expect(ref.current?.tagName).toBe('SECTION');
  });

  it('CardHeader renders title as h3 by default, description and actions', () => {
    render(
      <CardHeader
        title="Users"
        description="Active"
        actions={<button type="button">Add</button>}
      />,
    );
    expect(screen.getByRole('heading', { level: 3, name: 'Users' })).toHaveClass(
      'motiv-matrix-card__title',
    );
    expect(screen.getByText('Active')).toHaveClass('motiv-matrix-card__description');
    expect(screen.getByRole('button', { name: 'Add' }).parentElement).toHaveClass(
      'motiv-matrix-card__actions',
    );
  });

  it('CardHeader titleAs changes the heading element and omits empty slots', () => {
    const { container } = render(<CardHeader title="T" titleAs="h2" />);
    expect(screen.getByRole('heading', { level: 2 })).toBeInTheDocument();
    expect(container.querySelector('.motiv-matrix-card__description')).toBeNull();
    expect(container.querySelector('.motiv-matrix-card__actions')).toBeNull();
  });

  it('CardBody and CardFooter merge className', () => {
    render(
      <>
        <CardBody className="b" data-testid="body" />
        <CardFooter className="f" data-testid="footer" />
      </>,
    );
    expect(screen.getByTestId('body')).toHaveClass('motiv-matrix-card__body', 'b');
    expect(screen.getByTestId('footer')).toHaveClass('motiv-matrix-card__footer', 'f');
  });
});
