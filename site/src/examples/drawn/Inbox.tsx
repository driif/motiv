import {
  Badge,
  Button,
  Carousel,
  Dialog,
  IconButton,
  InkSplatterButton,
  Link,
  Splitter,
  Stepper,
  TextField,
  ThemeToggle,
  Toaster,
  toast,
} from '@driif/motiv/drawn';
import { ActionMenu } from '@driif/motiv/drawn/action-menu';
import { Markdown, MarkdownEditor } from '@driif/motiv/drawn/markdown';
import { type CSSProperties, useState } from 'react';
import { useTheme } from '../../useTheme';

function Icon({ d }: { d: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} aria-hidden="true">
      <path d={d} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

type Message = {
  id: string;
  from: string;
  subject: string;
  time: string;
  unread: boolean;
  body: string;
  proofs?: boolean;
};

const initialMessages: Message[] = [
  {
    id: 'm1',
    from: 'Grace Hopper',
    subject: 'Poster proofs, round two',
    time: '09:12',
    unread: true,
    proofs: true,
    body: `Hi Ada,

The **matte stock** looks much better. Three things before we print:

1. Move the date up by a line
2. Darken the green a little
3. Keep the hand-drawn arrow

> Ship it once these are in.

Grace`,
  },
  {
    id: 'm2',
    from: 'Alan Turing',
    subject: 'Reprint of the dot grid notebooks',
    time: 'Yesterday',
    unread: true,
    body: `The paper is back in stock. How many copies should we reprint?

Specs are in the [order sheet](#orders).`,
  },
  {
    id: 'm3',
    from: 'Hedy Lamarr',
    subject: 'Postcard set shipped',
    time: 'Mon',
    unread: false,
    body: 'All **400 sets** went out today. Tracking codes are in the shared folder.',
  },
  {
    id: 'm4',
    from: 'Joan Clarke',
    subject: 'November invoice',
    time: 'Nov 20',
    unread: false,
    body: 'Invoice `INV-2026-11` is attached. Due in 14 days.',
  },
];

const proofs = [
  { id: 'front', label: 'Front', content: <strong>Front, matte, 170 gsm</strong> },
  { id: 'back', label: 'Back', content: <strong>Back with the hand-drawn arrow</strong> },
  { id: 'detail', label: 'Detail', content: <strong>Green, two steps darker</strong> },
];

const more = (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <circle cx="5" cy="12" r="1.6" />
    <circle cx="12" cy="12" r="1.6" />
    <circle cx="19" cy="12" r="1.6" />
  </svg>
);

export function Inbox() {
  const { dark, toggle } = useTheme();
  const [messages, setMessages] = useState(initialMessages);
  const [openId, setOpenId] = useState('m1');
  const [listWidth, setListWidth] = useState(300);
  const [composing, setComposing] = useState(false);
  const [copies, setCopies] = useState(250);

  const open = messages.find((message) => message.id === openId) ?? messages[0];

  function remove(message: Message, verb: string) {
    const before = messages;
    setMessages(messages.filter((item) => item.id !== message.id));
    toast({
      title: `${verb} “${message.subject}”`,
      action: { label: 'Undo', onClick: () => setMessages(before) },
    });
  }

  function setUnread(id: string, unread: boolean) {
    setMessages(messages.map((item) => (item.id === id ? { ...item, unread } : item)));
  }

  return (
    <div className="ex-drawn ex-inbox">
      <header className="ex-drawn__bar">
        <strong className="ex-drawn__brand">inkwell mail</strong>
        <Button size="sm" onClick={() => setComposing(true)}>
          Compose
        </Button>
        <ThemeToggle dark={dark} onToggle={toggle} />
      </header>

      <div className="ex-inbox__split" style={{ '--ex-list': `${listWidth}px` } as CSSProperties}>
        <ul className="ex-inbox__list" aria-label="Messages">
          {messages.map((message) => (
            <li key={message.id} className="ex-inbox__item" data-active={message.id === open?.id}>
              <button
                type="button"
                className="ex-inbox__open"
                aria-current={message.id === open?.id || undefined}
                onClick={() => {
                  setOpenId(message.id);
                  setUnread(message.id, false);
                }}
              >
                <span className="ex-inbox__from">
                  {message.from}
                  {message.unread && <Badge tone="success">New</Badge>}
                </span>
                <span className="ex-inbox__subject">{message.subject}</span>
                <span className="ex-inbox__time">{message.time}</span>
              </button>
              <ActionMenu
                trigger={
                  <IconButton size="sm" icon={more} label={`Actions for ${message.subject}`} />
                }
                items={[
                  {
                    label: message.unread ? 'Mark as read' : 'Mark as unread',
                    onSelect: () => setUnread(message.id, !message.unread),
                  },
                  {
                    label: 'Move to',
                    submenu: [
                      { label: 'Orders', onSelect: () => remove(message, 'Moved to Orders:') },
                      { label: 'Invoices', onSelect: () => remove(message, 'Moved to Invoices:') },
                    ],
                  },
                  { label: 'Archive', onSelect: () => remove(message, 'Archived') },
                  { label: 'Delete', onSelect: () => remove(message, 'Deleted') },
                ]}
              />
            </li>
          ))}
          {messages.length === 0 && <li className="ex-inbox__empty">Inbox zero. Time for tea.</li>}
        </ul>
        <Splitter
          className="ex-inbox__splitter"
          label="Message list width"
          aria-valuetext={`${listWidth} pixels`}
          value={listWidth}
          min={240}
          max={460}
          onChange={setListWidth}
        />
        <article className="ex-inbox__reader" aria-label="Message">
          {open ? (
            <>
              <header className="ex-inbox__reader-head">
                <h2>{open.subject}</h2>
                <p>
                  From {open.from} · {open.time}
                </p>
              </header>
              <Markdown>{open.body}</Markdown>
              {open.proofs && <Carousel label="Proofs" slides={proofs} />}
              {open.id === 'm2' && (
                <div className="ex-inbox__row">
                  <span>Copies to reprint</span>
                  <Stepper
                    label="Copies to reprint"
                    value={copies}
                    onChange={setCopies}
                    min={50}
                    max={1000}
                    step={50}
                  />
                </div>
              )}
              <div className="ex-inbox__row">
                <Button variant="outline" size="sm" onClick={() => setComposing(true)}>
                  Reply
                </Button>
                <InkSplatterButton
                  successLabel="Thanked"
                  icon={
                    <Icon d="M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.5A4 4 0 0 1 19 10c0 5.5-7 10-7 10z" />
                  }
                >
                  Thank
                </InkSplatterButton>
                <Link href="#settings">Mail settings</Link>
              </div>
            </>
          ) : (
            <p className="ex-inbox__empty">Nothing selected.</p>
          )}
        </article>
      </div>

      <Dialog open={composing} title="New message" onClose={() => setComposing(false)} size="wide">
        <form
          key={open?.id}
          className="ex-inbox__compose"
          onSubmit={(event) => {
            event.preventDefault();
            setComposing(false);
            toast({ tone: 'success', title: 'Message sent' });
          }}
        >
          <TextField label="To" defaultValue={open?.from ?? ''} />
          <TextField label="Subject" defaultValue={open ? `Re: ${open.subject}` : ''} />
          <MarkdownEditor
            label="Message"
            rows={6}
            defaultValue={'Thanks!\n\n- [ ] Move the date\n- [ ] Darken the green'}
          />
          <div className="ex-inbox__row ex-inbox__row--end">
            <Button type="button" variant="ghost" onClick={() => setComposing(false)}>
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
