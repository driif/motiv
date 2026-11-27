import {
  Badge,
  Button,
  Carousel,
  Dialog,
  FilterChips,
  IconButton,
  Link,
  Splitter,
  Stepper,
  TextField,
  Toaster,
  toast,
} from '@driif/motiv';
import { ActionMenu } from '@driif/motiv/action-menu';
import { Markdown, MarkdownEditor } from '@driif/motiv/markdown';
import { type CSSProperties, useState } from 'react';

const more = (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <circle cx="5" cy="12" r="1.6" />
    <circle cx="12" cy="12" r="1.6" />
    <circle cx="19" cy="12" r="1.6" />
  </svg>
);

const back = (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.65}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M15 5l-7 7 7 7" />
  </svg>
);

type Message = {
  id: string;
  from: string;
  subject: string;
  time: string;
  unread: boolean;
  label?: string;
  body: string;
  photos?: string[];
};

const initialMessages: Message[] = [
  {
    id: 'm1',
    from: 'Grace Hopper',
    subject: 'Offsite photos',
    time: '09:14',
    unread: true,
    label: 'Team',
    body: 'Here are the best shots from **Lisbon**. The full album is in the shared drive.\n\n- Day one: the tram ride\n- Day two: the workshop\n\nPick your favourite for the newsletter.',
    photos: ['Tram 28 at sunrise', 'Workshop whiteboard', 'Dinner at the harbour'],
  },
  {
    id: 'm2',
    from: 'Alan Turing',
    subject: 'Review: search ranking',
    time: '08:02',
    unread: true,
    label: 'Review',
    body: 'I left comments on the ranking change. Two things:\n\n1. The `boost` weight looks too high for titles.\n2. We need a test for empty queries.\n\n> Otherwise it reads well.',
  },
  {
    id: 'm3',
    from: 'Margaret Hamilton',
    subject: 'Launch checklist',
    time: 'Yesterday',
    unread: false,
    body: 'The checklist for Thursday is final. Everything is green except **load testing**, which runs tonight.',
  },
  {
    id: 'm4',
    from: 'Billing',
    subject: 'Your November invoice',
    time: 'Mon',
    unread: false,
    label: 'Billing',
    body: 'Invoice **#2026-11** for €240.00 is ready. It will be charged to the card ending in 4242 on 1 December.',
  },
];

const folders = [
  { value: 'unread', label: 'Unread' },
  { value: 'labelled', label: 'Labelled' },
];

export function Inbox() {
  const [messages, setMessages] = useState(initialMessages);
  const [selected, setSelected] = useState('m1');
  const [reading, setReading] = useState(false);
  const [listWidth, setListWidth] = useState(320);
  const [filter, setFilter] = useState<string[]>([]);
  const [composing, setComposing] = useState(false);
  const [remindIn, setRemindIn] = useState(2);

  const shown = messages.filter(
    (m) => (!filter.includes('unread') || m.unread) && (!filter.includes('labelled') || m.label),
  );
  const message = messages.find((m) => m.id === selected);

  const remove = (target: Message, verb: string) => {
    const index = messages.indexOf(target);
    setMessages(messages.filter((m) => m !== target));
    setReading(false);
    toast({
      title: `${verb}: ${target.subject}`,
      action: {
        label: 'Undo',
        onClick: () =>
          setMessages((current) => [...current.slice(0, index), target, ...current.slice(index)]),
      },
    });
  };

  const open = (m: Message) => {
    setSelected(m.id);
    setReading(true);
    setMessages(messages.map((item) => (item.id === m.id ? { ...item, unread: false } : item)));
  };

  return (
    <div className="ex-inbox" data-reading={reading}>
      <header className="ex-inbox__head">
        <h1 className="ex-app__title">Inbox</h1>
        <FilterChips
          className="ex-inbox__filters"
          label="Show"
          options={folders}
          value={filter}
          onChange={setFilter}
          showSummary={false}
        />
        <Button onClick={() => setComposing(true)}>Compose</Button>
      </header>

      <div
        className="ex-inbox__split"
        style={{ '--ex-list-width': `${listWidth}px` } as CSSProperties}
      >
        <ul className="ex-inbox__list" aria-label="Messages">
          {shown.length === 0 && (
            <li className="ex-muted ex-inbox__empty">Nothing here. Enjoy the quiet.</li>
          )}
          {shown.map((m) => (
            <li
              key={m.id}
              className="ex-mail"
              data-selected={m.id === selected}
              data-unread={m.unread}
            >
              <button type="button" className="ex-mail__open" onClick={() => open(m)}>
                <span className="ex-mail__from">{m.from}</span>
                <span className="ex-mail__time">{m.time}</span>
                <span className="ex-mail__subject">{m.subject}</span>
                {m.label && <Badge className="ex-mail__label">{m.label}</Badge>}
              </button>
              <ActionMenu
                trigger={<IconButton size="sm" icon={more} label={`Actions for ${m.subject}`} />}
                items={[
                  {
                    label: m.unread ? 'Mark as read' : 'Mark as unread',
                    onSelect: () =>
                      setMessages(
                        messages.map((item) =>
                          item.id === m.id ? { ...item, unread: !item.unread } : item,
                        ),
                      ),
                  },
                  { label: 'Archive', onSelect: () => remove(m, 'Archived') },
                  {
                    label: 'Move to',
                    submenu: [
                      { label: 'Team', onSelect: () => remove(m, 'Moved to Team') },
                      { label: 'Receipts', onSelect: () => remove(m, 'Moved to Receipts') },
                    ],
                  },
                  { label: 'Delete', onSelect: () => remove(m, 'Deleted') },
                ]}
              />
            </li>
          ))}
        </ul>
        <Splitter
          className="ex-inbox__splitter"
          label="Message list width"
          aria-valuetext={`${listWidth} pixels`}
          value={listWidth}
          min={240}
          max={480}
          onChange={setListWidth}
          onDoubleClick={() => setListWidth(320)}
        />
        <article className="ex-inbox__reader" aria-label="Message">
          {message ? (
            <>
              <div className="ex-inbox__reader-head">
                <IconButton
                  className="ex-inbox__back"
                  icon={back}
                  label="Back to messages"
                  onClick={() => setReading(false)}
                />
                <div>
                  <h2 className="ex-inbox__subject">{message.subject}</h2>
                  <p className="ex-muted">
                    From {message.from} · {message.time}
                  </p>
                </div>
              </div>
              <Markdown>{message.body}</Markdown>
              {message.photos && (
                <Carousel
                  label="Attached photos"
                  slides={message.photos.map((photo) => ({
                    id: photo,
                    label: photo,
                    content: <div className="ex-photo">{photo}</div>,
                  }))}
                />
              )}
              <p className="ex-muted">
                Sent from the team workspace ·{' '}
                <Link href="/kinetic/examples/settings/">Notification settings</Link>
              </p>
            </>
          ) : (
            <p className="ex-muted">Select a message to read it.</p>
          )}
        </article>
      </div>

      <Dialog open={composing} title="New message" size="wide" onClose={() => setComposing(false)}>
        <form
          className="ex-form ex-compose"
          onSubmit={(event) => {
            event.preventDefault();
            setComposing(false);
            toast({
              tone: 'success',
              title: 'Message sent',
              description: `We will remind you in ${remindIn} days if nobody replies.`,
            });
          }}
        >
          <TextField label="To" type="email" defaultValue="grace@example.com" required />
          <TextField label="Subject" defaultValue="Re: Offsite photos" />
          <MarkdownEditor
            label="Message"
            name="body"
            rows={6}
            defaultValue={'Love the **tram** one.\n\n- Use it for the newsletter'}
          />
          <div className="ex-inline">
            <span>Remind me if nobody replies after (days)</span>
            <Stepper
              label="Reminder delay in days"
              value={remindIn}
              onChange={setRemindIn}
              min={1}
              max={14}
            />
          </div>
          <div className="ex-form__actions">
            <Button type="button" variant="outline" onClick={() => setComposing(false)}>
              Discard
            </Button>
            <Button type="submit">Send</Button>
          </div>
        </form>
      </Dialog>
      <Toaster />
    </div>
  );
}
