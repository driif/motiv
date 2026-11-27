import {
  Badge,
  Button,
  Carousel,
  Dialog,
  GlitchThemeToggle,
  IconButton,
  Link,
  Splitter,
  TextField,
  Toaster,
  toast,
} from '@driif/motiv/matrix';
import { ActionMenu } from '@driif/motiv/matrix/action-menu';
import { Markdown, MarkdownEditor } from '@driif/motiv/matrix/markdown';
import { type CSSProperties, useState } from 'react';
import { useTheme } from '../../useTheme';

const more = (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <circle cx="5" cy="12" r="1.6" />
    <circle cx="12" cy="12" r="1.6" />
    <circle cx="19" cy="12" r="1.6" />
  </svg>
);

type Message = {
  id: string;
  from: string;
  subject: string;
  time: string;
  label?: { text: string; tone: 'success' | 'warning' | 'danger' };
  body: string;
  unread?: boolean;
  slides?: boolean;
};

const initial: Message[] = [
  {
    id: 'm1',
    from: 'Grace Hopper',
    subject: 'Postmortem: mailer outage',
    time: '09:42',
    label: { text: 'incident', tone: 'danger' },
    unread: true,
    body: `## Summary

The SMTP relay rejected **214 connections** between 08:51 and 09:20 after a certificate rotated early.

- Detected by the \`mailer-5xx\` alert after 4 minutes
- Mitigated by pinning the previous certificate
- No messages were lost; the queue drained by 09:31

> Action item: alert on certificates that expire within 14 days.

\`\`\`sh
ops cert pin mailer --version 41
\`\`\``,
  },
  {
    id: 'm2',
    from: 'Release bot',
    subject: 'v2.15.0 is ready to ship',
    time: '08:10',
    label: { text: 'release', tone: 'success' },
    unread: true,
    slides: true,
    body: `## What changed

Three highlights below. Full notes live in the *changelog*.

1. Faster cold starts on the gateway
2. Audit export as JSON
3. Per-region rate limits`,
  },
  {
    id: 'm3',
    from: 'Alan Turing',
    subject: 'Billing latency, one more idea',
    time: 'Yesterday',
    label: { text: 'review', tone: 'warning' },
    body: `p95 on **billing** is still over 300 ms. I suspect the currency lookup: it runs once per line item.

Could we cache it per invoice? Happy to pair on it tomorrow.`,
  },
  {
    id: 'm4',
    from: 'Margaret Hamilton',
    subject: 'On-call handover',
    time: 'Mon',
    body: `Handing over to you at 18:00. Two things to watch:

- \`edge-cache\` purges are slow in us-east
- the job queue spikes around midnight UTC; it recovers on its own`,
  },
  {
    id: 'm5',
    from: 'Ada Lovelace',
    subject: 'Notes from the planning call',
    time: 'Sun',
    body: `We agreed on **two** goals for the quarter: halve deploy time and retire the old auth service.`,
  },
];

const highlights = [
  { id: 'cold', label: 'Cold starts', content: <strong>Gateway cold start: 1.8 s → 0.6 s</strong> },
  { id: 'audit', label: 'Audit export', content: <strong>Audit log exports as JSON</strong> },
  { id: 'limits', label: 'Rate limits', content: <strong>Rate limits per region</strong> },
];

export function Inbox() {
  const { dark, toggle } = useTheme();
  const [messages, setMessages] = useState(initial);
  const [openId, setOpenId] = useState('m1');
  const [listWidth, setListWidth] = useState(320);
  const [compose, setCompose] = useState<{ to: string; subject: string } | null>(null);

  const open = messages.find((m) => m.id === openId);

  const update = (id: string, patch: Partial<Message>) =>
    setMessages((current) => current.map((m) => (m.id === id ? { ...m, ...patch } : m)));

  const archive = (message: Message) => {
    const snapshot = messages;
    setMessages(messages.filter((m) => m.id !== message.id));
    toast({
      title: 'Conversation archived',
      description: message.subject,
      action: { label: 'Undo', onClick: () => setMessages(snapshot) },
    });
  };

  return (
    <div className="mx-app mx-inbox">
      <header className="mx-bar">
        <strong className="mx-brand">mail://ada</strong>
        <Button size="sm" onClick={() => setCompose({ to: '', subject: '' })}>
          Compose
        </Button>
        <GlitchThemeToggle dark={dark} onToggle={toggle} />
      </header>

      <div className="mx-inbox__split" style={{ '--_list': `${listWidth}px` } as CSSProperties}>
        <ul className="mx-inbox__list" aria-label="Messages">
          {messages.map((message) => (
            <li
              key={message.id}
              className="mx-message"
              aria-current={message.id === openId}
              data-unread={message.unread === true}
            >
              <button
                type="button"
                className="mx-message__open"
                onClick={() => {
                  setOpenId(message.id);
                  update(message.id, { unread: false });
                }}
              >
                <span className="mx-message__line">
                  <span className="mx-message__from">{message.from}</span>
                  <span>{message.time}</span>
                </span>
                <span className="mx-message__subject">{message.subject}</span>
              </button>
              <ActionMenu
                trigger={
                  <IconButton size="sm" icon={more} label={`Actions for ${message.subject}`} />
                }
                items={[
                  { label: 'Archive', onSelect: () => archive(message) },
                  {
                    label: message.unread ? 'Mark as read' : 'Mark as unread',
                    onSelect: () => update(message.id, { unread: !message.unread }),
                  },
                  {
                    label: 'Label as',
                    submenu: [
                      {
                        label: 'Review',
                        onSelect: () =>
                          update(message.id, { label: { text: 'review', tone: 'warning' } }),
                      },
                      {
                        label: 'Incident',
                        onSelect: () =>
                          update(message.id, { label: { text: 'incident', tone: 'danger' } }),
                      },
                    ],
                  },
                ]}
              />
            </li>
          ))}
        </ul>
        <Splitter
          className="mx-inbox__splitter"
          label="Message list width"
          aria-valuetext={`${listWidth} pixels`}
          value={listWidth}
          min={240}
          max={520}
          onChange={setListWidth}
          onDoubleClick={() => setListWidth(320)}
        />
        <article className="mx-inbox__pane" aria-label="Reading pane">
          {open ? (
            <>
              <header className="mx-row mx-spread">
                <div>
                  <h1 className="mx-title">{open.subject}</h1>
                  <p className="mx-muted">
                    {open.from} · {open.time}
                  </p>
                </div>
                {open.label && <Badge tone={open.label.tone}>{open.label.text}</Badge>}
              </header>
              <Markdown>{open.body}</Markdown>
              {open.slides && <Carousel label="Release highlights" slides={highlights} />}
              <div className="mx-row mx-spread">
                <Link href="https://github.com/driif/motiv" external>
                  Open in tracker
                </Link>
                <div className="mx-row">
                  <Button variant="outline" size="sm" onClick={() => archive(open)}>
                    Archive
                  </Button>
                  <Button
                    size="sm"
                    onClick={() =>
                      setCompose({ to: 'team@example.com', subject: `Re: ${open.subject}` })
                    }
                  >
                    Reply
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <p className="mx-inbox__empty">Pick a conversation.</p>
          )}
        </article>
      </div>

      <Dialog
        open={compose !== null}
        title="New message"
        size="wide"
        onClose={() => setCompose(null)}
      >
        <form
          key={compose?.subject}
          className="mx-compose"
          onSubmit={(event) => {
            event.preventDefault();
            setCompose(null);
            toast({ tone: 'success', title: 'Message sent' });
          }}
        >
          <TextField label="To" type="email" defaultValue={compose?.to} required />
          <TextField label="Subject" defaultValue={compose?.subject} />
          <MarkdownEditor
            label="Message"
            name="body"
            maxRows={10}
            placeholder="Write in Markdown: **bold**, - lists, `code`"
          />
          <div className="mx-row" style={{ justifyContent: 'flex-end' }}>
            <Button type="button" variant="ghost" onClick={() => setCompose(null)}>
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
