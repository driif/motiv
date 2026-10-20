import { type ComponentProps, type ReactNode, useEffect, useRef, useState } from 'react';
import { cx } from '../../utils/cx';
import { Icon } from '../../utils/Icon';

async function copyText(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // Permission denied or unfocused document: fall back to the legacy path.
  }
  const area = document.createElement('textarea');
  area.value = text;
  area.setAttribute('readonly', '');
  area.style.position = 'fixed';
  area.style.opacity = '0';
  document.body.appendChild(area);
  area.select();
  const ok = document.execCommand('copy');
  area.remove();
  return ok;
}

export interface CopyFieldProps extends Omit<ComponentProps<'div'>, 'onCopy' | 'children'> {
  value: string;
  /** Shown instead of the raw value, e.g. a masked token. */
  display?: ReactNode;
  label?: string;
  copiedLabel?: string;
  resetMs?: number;
  onCopy?: () => void;
}

export function CopyField({
  value,
  display,
  label = 'Copy',
  copiedLabel = 'Copied',
  resetMs = 1600,
  onCopy,
  className,
  ...props
}: CopyFieldProps) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const copy = async () => {
    if (!(await copyText(value))) return;
    setCopied(true);
    onCopy?.();
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setCopied(false), resetMs);
  };

  return (
    <div {...props} className={cx('motiv-copy', className)}>
      <code className="motiv-copy__value">{display ?? value}</code>
      <button
        type="button"
        className="motiv-copy__button"
        data-copied={copied}
        aria-label={copied ? copiedLabel : display === undefined ? `${label}: ${value}` : label}
        onClick={copy}
      >
        <span className="motiv-copy__roll" aria-hidden="true">
          <span className="motiv-copy__strip">
            <span>
              <Icon>
                <rect x="8" y="8" width="12" height="12" rx="2" />
                <path d="M16 8V5a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h3" />
              </Icon>
              {label}
            </span>
            <span>
              <Icon>
                <path d="M5 12.5l4.5 4.5L19 7.5" />
              </Icon>
              {copiedLabel}
            </span>
          </span>
        </span>
      </button>
      <span className="motiv-visually-hidden" aria-live="polite">
        {copied ? copiedLabel : ''}
      </span>
    </div>
  );
}
