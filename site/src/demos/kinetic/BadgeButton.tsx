import { BadgeButton, Button } from '@driif/motiv';
import { useState } from 'react';

export function BadgeButtonDemo() {
  const [unread, setUnread] = useState(3);
  return (
    <>
      <BadgeButton count={unread} label="Inbox" onClick={() => setUnread(0)} />
      <Button size="sm" variant="outline" onClick={() => setUnread(unread + 1)}>
        Receive mail
      </Button>
    </>
  );
}
