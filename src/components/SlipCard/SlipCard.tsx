import { type ComponentProps, type ReactNode, useId, useState } from 'react';
import { cx } from '../../utils/cx';
import { Icon } from '../../utils/Icon';

export interface SlipCardProps extends Omit<ComponentProps<'article'>, 'title'> {
  title: ReactNode;
  description: ReactNode;
  /** Revealed on the sheet that slides out from under the card. */
  note: ReactNode;
  eyebrow?: ReactNode;
  noteEyebrow?: ReactNode;
  openLabel?: string;
  closeLabel?: string;
}

export function SlipCard({
  title,
  description,
  note,
  eyebrow = 'A note under the surface',
  noteEyebrow = 'A little more to the story',
  openLabel = 'Pull a little thought',
  closeLabel = 'Slip it back',
  className,
  ...props
}: SlipCardProps) {
  const [open, setOpen] = useState(false);
  const noteId = useId();

  return (
    <article {...props} className={cx('motiv-slip-card', className)} data-open={open}>
      <div className="motiv-slip-card__back" id={noteId} aria-hidden={!open}>
        <span className="motiv-slip-card__note">
          <span className="motiv-slip-card__eyebrow">{noteEyebrow}</span>
          {open && note}
        </span>
      </div>
      <div className="motiv-slip-card__front">
        <span className="motiv-slip-card__lines" aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
        <span className="motiv-slip-card__eyebrow">{eyebrow}</span>
        <h3 className="motiv-slip-card__title">{title}</h3>
        <p className="motiv-slip-card__description">{description}</p>
        <button
          type="button"
          className="motiv-slip-card__tab"
          aria-expanded={open}
          aria-controls={noteId}
          onClick={() => setOpen(!open)}
        >
          {open ? closeLabel : openLabel}
          <Icon>{open ? <path d="M5 12h14" /> : <path d="M5 12h14M13 6l6 6-6 6" />}</Icon>
        </button>
      </div>
    </article>
  );
}
