import type { ComponentProps } from 'react';
import { cx } from '../../utils/cx';
import { toSafeHtml } from '../toSafeHtml';

export interface MarkdownProps
  extends Omit<ComponentProps<'div'>, 'children' | 'dangerouslySetInnerHTML'> {
  children?: string;
}

export function Markdown({ children = '', className, ...props }: MarkdownProps) {
  return (
    <div
      {...props}
      className={cx('motiv-markdown', className)}
      dangerouslySetInnerHTML={{ __html: toSafeHtml(children) }}
    />
  );
}
