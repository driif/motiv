import { useId } from 'react';
import type { AccordionProps } from '../../components/Accordion';
import { cx } from '../../utils/cx';
import { useDisclosure } from '../../utils/useDisclosure';

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
    <div {...props} className={cx('motiv-sketch-accordion', className)}>
      {items.map((item) => {
        const isOpen = openIds.includes(item.id);
        const triggerId = `${baseId}-${item.id}-t`;
        const panelId = `${baseId}-${item.id}-p`;
        return (
          <div key={item.id} className="motiv-sketch-accordion__item">
            <Heading className="motiv-sketch-accordion__heading">
              <button
                id={triggerId}
                type="button"
                className="motiv-sketch-accordion__trigger"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => toggle(item.id)}
              >
                {item.title}
                <svg
                  className="motiv-sketch-accordion__chevron"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M5 9.5c2.4 1.6 4.6 3.6 7.1 5.6 2.2-2.1 4.3-4.1 6.9-6.1" />
                </svg>
              </button>
            </Heading>
            <section
              id={panelId}
              aria-labelledby={triggerId}
              className="motiv-sketch-accordion__panel"
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
