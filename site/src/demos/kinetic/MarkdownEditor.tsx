import { Button } from '@driif/motiv';
import { MarkdownEditor } from '@driif/motiv/markdown';

export function MarkdownEditorDemo() {
  return (
    <form style={{ width: '100%', display: 'grid', gap: '1rem' }}>
      <MarkdownEditor
        label="Release notes"
        name="notes"
        rows={8}
        defaultValue={
          '## Ready to share\n\nWrite **Markdown** and see the preview as you type.\n\n- Clear updates\n- Small changes'
        }
      />
      <Button type="reset" variant="outline" style={{ justifySelf: 'start' }}>
        Reset notes
      </Button>
    </form>
  );
}
