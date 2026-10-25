import { Button, dismissToast, Toaster, toast } from '@driif/motiv';
import { useState } from 'react';

export function ToastDemo() {
  const [latest, setLatest] = useState('');
  return (
    <div style={{ minHeight: '28rem' }}>
      <p>
        Mouse hover or focus pauses timers. After touch dismissal, remaining timers resume
        immediately. Long stacks scroll within the viewport.
      </p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
        <Button
          onClick={() =>
            setLatest(
              toast({
                tone: 'success',
                title: 'Changes saved',
                description: 'Your project is up to date.',
              }),
            )
          }
        >
          Success
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            setLatest(toast({ title: 'Sync started', description: 'You can keep working.' }))
          }
        >
          Info
        </Button>
        <Button
          variant="danger"
          onClick={() =>
            setLatest(
              toast({
                tone: 'error',
                title: 'Could not save',
                description: 'Please try again. This message stays until dismissed.',
              }),
            )
          }
        >
          Persistent error
        </Button>
        <Button variant="ghost" disabled={!latest} onClick={() => dismissToast(latest)}>
          Dismiss latest
        </Button>
      </div>
      <Toaster />
    </div>
  );
}
