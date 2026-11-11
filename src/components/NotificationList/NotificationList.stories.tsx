import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { ThemePair } from '../../../.storybook/ThemePair';
import { type NotificationItem, NotificationList } from './NotificationList';

const tones: NotificationItem[] = [
  {
    id: '1',
    title: 'Deploy finished',
    text: 'motiv-site is live.',
    time: '2 min ago',
    tone: 'success',
  },
  {
    id: '2',
    title: 'Ada mentioned you',
    text: 'Can you review the table menu?',
    time: '10 min ago',
    href: '#mention',
  },
  {
    id: '3',
    title: 'Quota at 90%',
    text: 'Storage fills up in about a week.',
    time: '1 h ago',
    tone: 'warning',
  },
  {
    id: '4',
    title: 'Payment failed',
    text: 'Update the card on file.',
    time: 'Yesterday',
    tone: 'danger',
  },
];

const long: NotificationItem[] = [
  {
    id: 'l1',
    title: 'A notification title that is long enough to wrap onto a second line in the panel',
    text: 'The body text goes on as well, with a URL like https://example.com/a/very/long/path/that/never/breaks/on/its/own to check wrapping.',
    time: '3 days ago',
  },
  ...Array.from({ length: 12 }, (_, i) => ({
    id: `n${i}`,
    title: `Build #${120 + i} passed`,
    time: `${i + 1} h ago`,
    tone: 'success' as const,
  })),
];

function Demo({ initial }: { initial: NotificationItem[] }) {
  const [items, setItems] = useState(initial);
  return (
    <NotificationList
      items={items}
      onDismiss={(id) => setItems(items.filter((item) => item.id !== id))}
      onDismissAll={() => setItems([])}
      onOpen={(id) => setItems(items.filter((item) => item.id !== id))}
    />
  );
}

const meta = {
  title: 'Components/NotificationList',
  component: NotificationList,
  args: { items: tones, onDismiss: () => {}, onDismissAll: () => {} },
  render: (args) => <Demo initial={args.items} />,
} satisfies Meta<typeof NotificationList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Empty: Story = { args: { items: [] } };

export const LongContent: Story = { args: { items: long } };

export const Themes: Story = {
  render: () => <ThemePair>{() => <Demo initial={tones} />}</ThemePair>,
};
