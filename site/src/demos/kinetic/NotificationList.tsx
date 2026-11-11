import { type NotificationItem, NotificationList } from '@driif/motiv';
import { useState } from 'react';

const initial: NotificationItem[] = [
  {
    id: '1',
    title: 'Deploy finished',
    text: 'The site is live.',
    time: '2 min ago',
    tone: 'success',
  },
  { id: '2', title: 'Ada mentioned you', text: 'Can you review the menu?', time: '10 min ago' },
  { id: '3', title: 'Quota at 90%', time: '1 h ago', tone: 'warning' },
  {
    id: '4',
    title: 'Payment failed',
    text: 'Update the card on file.',
    time: 'Yesterday',
    tone: 'danger',
  },
];

export function NotificationListDemo() {
  const [items, setItems] = useState(initial);
  const remove = (id: string) => setItems(items.filter((item) => item.id !== id));
  return (
    <NotificationList
      items={items}
      onDismiss={remove}
      onDismissAll={() => setItems([])}
      onOpen={remove}
    />
  );
}
