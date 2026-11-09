import { type RefCallback, useEffect, useId, useRef, useState } from 'react';
import { Textarea, type TextareaProps } from '../../components/Textarea';
import { cx } from '../../utils/cx';
import { Markdown } from '../Markdown';

export interface MarkdownEditorProps
  extends Omit<
    TextareaProps,
    'children' | 'dangerouslySetInnerHTML' | 'value' | 'defaultValue' | 'label'
  > {
  value?: string;
  defaultValue?: string;
  label?: string;
  previewLabel?: string;
}

export function MarkdownEditor({
  value,
  defaultValue = '',
  label = 'Markdown',
  previewLabel = 'Preview',
  onChange,
  ref,
  className,
  style,
  ...props
}: MarkdownEditorProps) {
  const [draft, setDraft] = useState(defaultValue);
  const input = useRef<HTMLTextAreaElement>(null);
  const previewId = useId();

  useEffect(() => {
    const node = input.current;
    const form = node?.form;
    if (value !== undefined || !node || !form) return;
    const reset = (event: Event) => {
      // A task, not a microtask: a user's reset click runs microtasks before the form is restored.
      setTimeout(() => {
        if (event.defaultPrevented) return;
        const restored = node.value;
        node.value = restored;
        setDraft(restored);
      }, 0);
    };
    form.addEventListener('reset', reset);
    return () => form.removeEventListener('reset', reset);
  });

  const inputRef: RefCallback<HTMLTextAreaElement> = (node) => {
    input.current = node;
    if (typeof ref === 'function') return ref(node);
    if (ref) ref.current = node;
  };

  return (
    <div className={cx('motiv-markdown-editor', className)} style={style}>
      <Textarea
        {...props}
        label={label}
        ref={inputRef}
        value={value}
        defaultValue={value === undefined ? defaultValue : undefined}
        onChange={(event) => {
          if (value === undefined) setDraft(event.currentTarget.value);
          onChange?.(event);
        }}
      />
      <section className="motiv-markdown-editor__preview" aria-labelledby={previewId}>
        <span id={previewId} className="motiv-textarea__label">
          {previewLabel}
        </span>
        <Markdown>{value ?? draft}</Markdown>
      </section>
    </div>
  );
}
