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
    <div {...props} className={cx('motiv-matrix-accordion', className)}>
      {items.map((item) => {
        const isOpen = openIds.includes(item.id);
        const triggerId = `${baseId}-${item.id}-t`;
        const panelId = `${baseId}-${item.id}-p`;
        return (
          <div key={item.id} className="motiv-matrix-accordion__item">
            <Heading className="motiv-matrix-accordion__heading">
              <button
                id={triggerId}
                type="button"
                className="motiv-matrix-accordion__trigger"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => toggle(item.id)}
              >
                {item.title}
                <span className="motiv-matrix-accordion__glyph" aria-hidden="true">
                  {isOpen ? '[-]' : '[+]'}
                </span>
              </button>
            </Heading>
            <section
              id={panelId}
              aria-labelledby={triggerId}
              className="motiv-matrix-accordion__panel"
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
