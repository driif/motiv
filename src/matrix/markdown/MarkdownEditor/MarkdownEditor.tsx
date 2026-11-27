import type { MarkdownEditorProps } from '../../../markdown/MarkdownEditor';
import { MarkdownEditorBase } from '../../../markdown/MarkdownEditor/MarkdownEditorBase';
import { Textarea } from '../../Textarea';

export function MarkdownEditor(props: MarkdownEditorProps) {
  return (
    <MarkdownEditorBase
      {...props}
      Textarea={Textarea}
      labelClassName="motiv-matrix-textarea__label"
    />
  );
}
