import { type ComponentProps, type ReactNode, useId } from 'react';
import { cx } from '../../utils/cx';
import { Icon } from '../../utils/Icon';
import { useDisclosure } from '../../utils/useDisclosure';

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
  const { openIds, toggle } = useDisclosure({ multiple, defaultOpen, open, onOpenChange });
  const Heading = `h${headingLevel}` as const;

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
