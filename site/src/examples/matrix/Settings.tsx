import {
  Accordion,
  Button,
  Checkbox,
  Confirm,
  DatePicker,
  DecodeSecretField,
  FileUpload,
  MultiSelect,
  OtpInput,
  RadioGroup,
  SegmentedControl,
  Select,
  Slider,
  Switch,
  Tabs,
  Textarea,
  TextField,
  Toaster,
  Tooltip,
  toast,
} from '@driif/motiv/matrix';
import { SplitButton } from '@driif/motiv/matrix/action-menu';
import { useState } from 'react';

const timezones = [
  { value: 'utc', label: 'UTC', code: 'UTC' },
  { value: 'berlin', label: 'Berlin', code: 'CET', hint: 'UTC+1' },
  { value: 'kyiv', label: 'Kyiv', code: 'EET', hint: 'UTC+2' },
  { value: 'new-york', label: 'New York', code: 'EST', hint: 'UTC−5' },
];

const channels = [
  { value: 'email', label: 'Email' },
  { value: 'slack', label: 'Slack', hint: '#ops-alerts' },
  { value: 'sms', label: 'SMS', hint: 'Critical only' },
  { value: 'push', label: 'Push' },
];

const topics = [
  { id: 'deploys', label: 'Deploys' },
  { id: 'incidents', label: 'Incidents' },
  { id: 'digest', label: 'Weekly digest' },
];

const densities = [
  { value: 'compact', label: 'Compact' },
  { value: 'cozy', label: 'Cozy' },
  { value: 'roomy', label: 'Roomy' },
];

const landings = [
  { value: 'overview', label: 'Overview' },
  { value: 'services', label: 'Services' },
  { value: 'inbox', label: 'Inbox' },
];

const sessions = [
  { id: 'mac', title: 'MacBook Pro · Berlin', content: 'Firefox 141, active now. This device.' },
  { id: 'phone', title: 'Pixel 9 · Berlin', content: 'Last seen 2 hours ago from 10.0.4.21.' },
  {
    id: 'ci',
    title: 'CI runner · eu-central',
    content: 'Token login, last used yesterday at 23:14.',
  },
];

export function Settings() {
  const [tab, setTab] = useState('profile');
  const [timezone, setTimezone] = useState('berlin');
  const [away, setAway] = useState('2026-12-24');
  const [avatar, setAvatar] = useState([{ id: 'avatar', name: 'avatar.png', size: 48_210 }]);
  const [density, setDensity] = useState('cozy');
  const [landing, setLanding] = useState('overview');
  const [notify, setNotify] = useState(['deploys', 'incidents']);
  const [via, setVia] = useState(['email', 'slack']);
  const [quiet, setQuiet] = useState(true);
  const [timeout, setTimeoutMinutes] = useState(30);
  const [token, setToken] = useState('ops_sk_7Qf2LmV9xKa31');
  const [code, setCode] = useState('');
  const [codeStatus, setCodeStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [confirming, setConfirming] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const allTopics = notify.length === topics.length;

  const remove = () => {
    setDeleting(true);
    setTimeout(() => {
      setDeleting(false);
      setConfirming(false);
      toast({
        tone: 'error',
        title: 'Workspace scheduled for deletion',
        description: 'You have 7 days to undo this.',
      });
    }, 1200);
  };

  const profile = (
    <div className="mx-form">
      <div className="mx-fields">
        <TextField label="Display name" defaultValue="Ada Lovelace" />
        <TextField label="Handle" defaultValue="ada" hint="Shown in mentions." />
      </div>
      <TextField label="Email" labelPosition="above" type="email" defaultValue="ada@example.com" />
      <Textarea
        label="Bio"
        rows={2}
        maxRows={5}
        defaultValue="On call for billing and the mailer."
      />
      <div className="mx-fields">
        <Select label="Time zone" options={timezones} value={timezone} onChange={setTimezone} />
        <DatePicker
          label="Away until"
          value={away}
          onChange={(event) => setAway(event.target.value)}
        />
      </div>
      <FileUpload
        label="Avatar"
        accept="image/*"
        attachedFiles={avatar.map((file) => ({ ...file, onRemove: () => setAvatar([]) }))}
        onUploaded={(file) => setAvatar([{ id: file.name, name: file.name, size: file.size }])}
        upload={(_file, { onProgress }) =>
          new Promise((resolve) => {
            let progress = 0;
            const timer = setInterval(() => {
              progress += 25;
              onProgress(progress);
              if (progress === 100) {
                clearInterval(timer);
                resolve();
              }
            }, 200);
          })
        }
      />
    </div>
  );

  const preferences = (
    <div className="mx-form">
      <div className="mx-group">
        <span className="mx-group__legend" aria-hidden="true">
          Density
        </span>
        <SegmentedControl
          label="Density"
          options={densities}
          value={density}
          onChange={setDensity}
        />
      </div>
      <RadioGroup
        name="landing"
        legend="Open after sign-in"
        options={landings}
        value={landing}
        onChange={setLanding}
      />
      <fieldset className="mx-group">
        <legend className="mx-group__legend">Email me about</legend>
        <Checkbox
          label="Everything"
          checked={allTopics}
          ref={(input) => {
            if (input) input.indeterminate = notify.length > 0 && !allTopics;
          }}
          onChange={() => setNotify(allTopics ? [] : topics.map((t) => t.id))}
        />
        <div className="mx-group__nested">
          {topics.map((topic) => (
            <Checkbox
              key={topic.id}
              label={topic.label}
              checked={notify.includes(topic.id)}
              onChange={(event) =>
                setNotify(
                  event.target.checked
                    ? [...notify, topic.id]
                    : notify.filter((id) => id !== topic.id),
                )
              }
            />
          ))}
        </div>
      </fieldset>
      <MultiSelect label="Alert channels" options={channels} value={via} onChange={setVia} />
      <Switch checked={quiet} onChange={setQuiet} label="Quiet hours, 22:00–07:00" />
      <Slider
        label="Sign out after"
        value={timeout}
        onChange={setTimeoutMinutes}
        min={5}
        max={120}
        step={5}
        format={(v) => `${v}m`}
        marks={[5, 60, 120]}
      />
    </div>
  );

  const security = (
    <div className="mx-form">
      <DecodeSecretField label="API token" value={token} onChange={setToken} />
      <OtpInput
        label="Confirm two-factor setup (try 123456)"
        value={code}
        onChange={(next) => {
          setCode(next);
          setCodeStatus('idle');
        }}
        onComplete={(full) => setCodeStatus(full === '123456' ? 'success' : 'error')}
        status={codeStatus}
      />
      <section className="mx-group" aria-labelledby="sessions-heading">
        <h2 id="sessions-heading" className="mx-group__legend">
          Active sessions
          <Tooltip
            content="Sign out a session from its device, or rotate the API token."
            label="About sessions"
          />
        </h2>
        <Accordion items={sessions} defaultOpen={['mac']} />
      </section>
      <section className="mx-danger" aria-labelledby="danger-heading">
        <h2 id="danger-heading" className="mx-group__legend">
          Danger zone
        </h2>
        <p className="mx-muted">Deletes the workspace, its 8 services and every audit log entry.</p>
        <Button
          variant="danger"
          onClick={() => setConfirming(true)}
          style={{ justifySelf: 'start' }}
        >
          Delete workspace
        </Button>
      </section>
    </div>
  );

  return (
    <div className="mx-app mx-settings">
      <header className="mx-bar">
        <h1 className="mx-brand">settings://ada</h1>
      </header>
      <Tabs
        label="Settings"
        value={tab}
        onChange={setTab}
        items={[
          { value: 'profile', label: 'Profile', panel: profile },
          { value: 'preferences', label: 'Preferences', panel: preferences },
          { value: 'security', label: 'Security', panel: security },
        ]}
      />
      <footer className="mx-row mx-settings__footer">
        <Button variant="ghost" onClick={() => toast({ title: 'Changes discarded' })}>
          Discard
        </Button>
        <SplitButton
          onClick={() => toast({ tone: 'success', title: 'Settings saved' })}
          items={[
            {
              label: 'Save and sign out other sessions',
              onSelect: () =>
                toast({ tone: 'success', title: 'Saved', description: '2 sessions signed out.' }),
            },
            { label: 'Reset to defaults', onSelect: () => toast({ title: 'Defaults restored' }) },
          ]}
        >
          Save changes
        </SplitButton>
      </footer>
      <Confirm
        open={confirming}
        title="Delete workspace prod?"
        slug="prod"
        pending={deleting}
        onCancel={() => setConfirming(false)}
        onConfirm={remove}
      >
        <p>8 services, 3 tokens and 14 months of audit log go with it.</p>
      </Confirm>
      <Toaster />
    </div>
  );
}
