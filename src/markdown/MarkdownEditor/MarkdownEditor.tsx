import { Textarea } from '../../components/Textarea';
import { MarkdownEditorBase, type MarkdownEditorProps } from './MarkdownEditorBase';

export type { MarkdownEditorProps };

export function MarkdownEditor(props: MarkdownEditorProps) {
  return (
    <MarkdownEditorBase {...props} Textarea={Textarea} labelClassName="motiv-textarea__label" />
  );
}
