import { type ComponentProps, type ReactNode, useId, useState } from 'react';
import { cx } from '../../utils/cx';
import { Icon } from '../../utils/Icon';

export interface AccordionItem {
  id: string;
  title: ReactNode;
  content: ReactNode;
}

export interface AccordionProps extends ComponentProps<'div'> {
  items: AccordionItem[];
  multiple?: boolean;
  defaultOpen?: string[];
  open?: string[];
  onOpenChange?: (open: string[]) => void;
  headingLevel?: 2 | 3 | 4 | 5 | 6;
}

export function Accordion({
  items,
  multiple = false,
  defaultOpen = [],
  open,
  onOpenChange,
  headingLevel = 3,
  className,
  ...props
}: AccordionProps) {
  const baseId = useId();
  const [inner, setInner] = useState(defaultOpen);
  const openIds = open ?? inner;
  const Heading = `h${headingLevel}` as const;

  function toggle(id: string) {
    const next = openIds.includes(id)
      ? openIds.filter((x) => x !== id)
      : multiple
        ? [...openIds, id]
        : [id];
    if (open === undefined) setInner(next);
    onOpenChange?.(next);
  }

  return (
    <div {...props} className={cx('motiv-accordion', className)}>
      {items.map((item) => {
        const isOpen = openIds.includes(item.id);
        const triggerId = `${baseId}-${item.id}-t`;
        const panelId = `${baseId}-${item.id}-p`;
        return (
          <div key={item.id} className="motiv-accordion__item">
            <Heading className="motiv-accordion__heading">
              <button
                id={triggerId}
                type="button"
                className="motiv-accordion__trigger"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => toggle(item.id)}
              >
                {item.title}
                <Icon className="motiv-accordion__icon">
                  <path d="M12 5v14M5 12h14" />
                </Icon>
              </button>
            </Heading>
            <section
              id={panelId}
              aria-labelledby={triggerId}
              className="motiv-accordion__panel"
              hidden={!isOpen}
            >
              {item.content}
            </section>
          </div>
        );
      })}
    </div>
  );
}
