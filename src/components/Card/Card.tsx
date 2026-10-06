import type { ComponentProps, ElementType, HTMLAttributes, ReactNode, RefAttributes } from 'react';
import { cx } from '../../utils/cx';

export type CardVariant = 'elevated' | 'outlined' | 'subtle';
export type CardPadding = 'none' | 'sm' | 'md' | 'lg';

export interface CardProps extends HTMLAttributes<HTMLElement>, RefAttributes<HTMLElement> {
  as?: 'div' | 'section' | 'article' | 'li';
  variant?: CardVariant;
  padding?: CardPadding;
  interactive?: boolean;
}

export function Card({
  as = 'div',
  variant = 'elevated',
  padding = 'md',
  interactive = false,
  className,
  ...props
}: CardProps) {
  // A union of intrinsic tags makes TS intersect their ref types; every option is an HTMLElement.
  const Tag = as as ElementType;
  return (
    <Tag
      className={cx(
        'motiv-card',
        `motiv-card--${variant}`,
        `motiv-card--p-${padding}`,
        interactive && 'motiv-card--interactive',
        className,
      )}
      {...props}
    />
  );
}

export interface CardHeaderProps extends Omit<ComponentProps<'div'>, 'title'> {
  title: ReactNode;
  titleAs?: 'h2' | 'h3' | 'h4' | 'p';
  description?: ReactNode;
  actions?: ReactNode;
}

export function CardHeader({
  title,
  titleAs: Title = 'h3',
  description,
  actions,
  className,
  ...props
}: CardHeaderProps) {
  return (
    <div className={cx('motiv-card__header', className)} {...props}>
      <div className="motiv-card__heading">
        <Title className="motiv-card__title">{title}</Title>
        {description && <p className="motiv-card__description">{description}</p>}
      </div>
      {actions && <div className="motiv-card__actions">{actions}</div>}
    </div>
  );
}

export function CardBody({ className, ...props }: ComponentProps<'div'>) {
  return <div className={cx('motiv-card__body', className)} {...props} />;
}

export function CardFooter({ className, ...props }: ComponentProps<'div'>) {
  return <div className={cx('motiv-card__footer', className)} {...props} />;
}
