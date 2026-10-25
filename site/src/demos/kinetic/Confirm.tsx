import { Button, Confirm } from '@driif/motiv';
import { useState } from 'react';

export function ConfirmDemo() {
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(false);
  const [deleted, setDeleted] = useState(false);

  async function remove() {
    setPending(true);
    await new Promise((resolve) => setTimeout(resolve, 1200));
    setPending(false);
    setOpen(false);
    setDeleted(true);
  }

  return (
    <div style={{ minHeight: '28rem' }}>
      <Button variant="danger" onClick={() => setOpen(true)}>
        Delete project
      </Button>
      {deleted && <p role="status">The demo project was deleted. You can try again.</p>}
      <Confirm
        open={open}
        title="Delete my-project?"
        slug="my-project"
        pending={pending}
        onCancel={() => setOpen(false)}
        onConfirm={remove}
      >
        <p>This also permanently deletes:</p>
        <ul>
          <li>3 bindings</li>
          <li>12 permissions</li>
        </ul>
      </Confirm>
    </div>
  );
}
