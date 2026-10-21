import { Textarea } from '@driif/motiv';
import { useState } from 'react';

export function TextareaDemo() {
  const [draft, setDraft] = useState('');
  const [sent, setSent] = useState<string[]>([]);
  return (
    <>
      <Textarea
        label="Message"
        hint="Enter sends, Shift+Enter adds a line."
        placeholder="Write a message"
        rows={1}
        maxRows={5}
        value={draft}
        onChange={(event) => setDraft(event.target.value)}
        onKeyDown={(event) => {
          if (event.key !== 'Enter' || event.shiftKey || event.nativeEvent.isComposing) return;
          event.preventDefault();
          if (draft.trim()) setSent([...sent, draft]);
          setDraft('');
        }}
      />
      {sent.length > 0 && <p>Sent: {sent.length}</p>}
    </>
  );
}
