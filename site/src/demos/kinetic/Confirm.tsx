import { Button, Confirm } from '@driif/motiv';
import { useState } from 'react';

export function ConfirmDemo() {
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(false);
  const [deleted, setDeleted] = useState(false);
  const [registering, setRegistering] = useState(false);

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
      <Button onClick={() => setRegistering(true)}>Register plugin</Button>
      <Confirm
        open={registering}
        title="Register plugin?"
        confirmLabel="Register"
        confirmVariant="primary"
        onCancel={() => setRegistering(false)}
        onConfirm={() => setRegistering(false)}
      >
        <p>The plugin will be available to this organization.</p>
      </Confirm>
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
