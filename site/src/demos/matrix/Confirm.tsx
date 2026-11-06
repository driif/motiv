import { Button, Confirm } from '@driif/motiv/matrix';
import { useState } from 'react';

export function ConfirmDemo() {
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(false);

  async function remove() {
    setPending(true);
    await new Promise((resolve) => setTimeout(resolve, 1200));
    setPending(false);
    setOpen(false);
  }

  return (
    <div style={{ minHeight: '28rem' }}>
      <Button variant="danger" onClick={() => setOpen(true)}>
        Delete project
      </Button>
      <Confirm
        open={open}
        title="Delete my-project?"
        slug="my-project"
        pending={pending}
        onCancel={() => setOpen(false)}
        onConfirm={remove}
      >
        <p>This also permanently deletes 3 bindings and 12 permissions.</p>
      </Confirm>
    </div>
  );
}
