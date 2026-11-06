import { Button, Toaster, toast } from '@driif/motiv/matrix';

export function ToastDemo() {
  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignContent: 'flex-start',
        gap: '1rem',
        minHeight: '28rem',
      }}
    >
      <Button onClick={() => toast({ tone: 'success', title: 'Changes saved' })}>Success</Button>
      <Button variant="outline" onClick={() => toast({ title: 'Sync started' })}>
        Info
      </Button>
      <Button
        variant="danger"
        onClick={() =>
          toast({ tone: 'error', title: 'Could not save', description: 'Stays until dismissed.' })
        }
      >
        Persistent error
      </Button>
      <Toaster />
    </div>
  );
}
