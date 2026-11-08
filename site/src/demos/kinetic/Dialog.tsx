import { Button, Dialog, TextField } from '@driif/motiv';
import { useState } from 'react';

export function DialogDemo() {
  const [open, setOpen] = useState<'md' | 'wide' | null>(null);
  const close = () => setOpen(null);

  return (
    <div style={{ minHeight: '28rem' }}>
      <Button onClick={() => setOpen('md')}>Edit question</Button>
      <Button variant="outline" onClick={() => setOpen('wide')}>
        Edit table rows
      </Button>
      <Dialog open={open === 'md'} title="Edit question" onClose={close}>
        <div style={{ display: 'grid', gap: '1rem' }}>
          <TextField label="Label" defaultValue="Date of birth" />
          <TextField label="Hint" />
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
            <Button variant="outline" onClick={close}>
              Cancel
            </Button>
            <Button variant="primary" onClick={close}>
              Save
            </Button>
          </div>
        </div>
      </Dialog>
      <Dialog open={open === 'wide'} size="wide" title="Household members" onClose={close}>
        <ol>
          {Array.from({ length: 24 }, (_, i) => `Member ${i + 1}`).map((member) => (
            <li key={member}>{member}: first name, last name, date of birth and relation</li>
          ))}
        </ol>
      </Dialog>
    </div>
  );
}
