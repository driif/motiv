import type { ComponentProps, ElementType } from 'react';
import type { CardHeaderProps, CardProps } from '../../components/Card';
import { cx } from '../../utils/cx';

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
      {...props}
      className={cx(
        'motiv-card',
        `motiv-card--${variant}`,
        `motiv-card--p-${padding}`,
        interactive && 'motiv-card--interactive',
        className,
      )}
    />
  );
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
    <div {...props} className={cx('motiv-card__header', className)}>
      <div className="motiv-card__heading">
        <Title className="motiv-card__title">{title}</Title>
        {description && <p className="motiv-card__description">{description}</p>}
      </div>
      {actions && <div className="motiv-card__actions">{actions}</div>}
    </div>
  );
}

export function CardBody({ className, ...props }: ComponentProps<'div'>) {
  return <div {...props} className={cx('motiv-card__body', className)} />;
}

export function CardFooter({ className, ...props }: ComponentProps<'div'>) {
  return <div {...props} className={cx('motiv-card__footer', className)} />;
}
