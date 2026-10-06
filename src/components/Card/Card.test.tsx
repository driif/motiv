import { render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it } from 'vitest';
import { Card, CardBody, CardFooter, CardHeader } from './Card';

describe('Card', () => {
  it('renders an elevated md div by default', () => {
    render(<Card data-testid="c">x</Card>);
    const card = screen.getByTestId('c');
    expect(card.tagName).toBe('DIV');
    expect(card).toHaveClass('motiv-card', 'motiv-card--elevated', 'motiv-card--p-md');
    expect(card).not.toHaveClass('motiv-card--interactive');
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
      'motiv-card--outlined',
      'motiv-card--p-none',
      'motiv-card--interactive',
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
      'motiv-card__title',
    );
    expect(screen.getByText('Active')).toHaveClass('motiv-card__description');
    expect(screen.getByRole('button', { name: 'Add' }).parentElement).toHaveClass(
      'motiv-card__actions',
    );
  });

  it('CardHeader titleAs changes the heading element and omits empty slots', () => {
    const { container } = render(<CardHeader title="T" titleAs="h2" />);
    expect(screen.getByRole('heading', { level: 2 })).toBeInTheDocument();
    expect(container.querySelector('.motiv-card__description')).toBeNull();
    expect(container.querySelector('.motiv-card__actions')).toBeNull();
  });

  it('CardBody and CardFooter merge className', () => {
    render(
      <>
        <CardBody className="b" data-testid="body" />
        <CardFooter className="f" data-testid="footer" />
      </>,
    );
    expect(screen.getByTestId('body')).toHaveClass('motiv-card__body', 'b');
    expect(screen.getByTestId('footer')).toHaveClass('motiv-card__footer', 'f');
  });
});
