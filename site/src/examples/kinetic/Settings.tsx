import {
  Accordion,
  Button,
  Checkbox,
  Confirm,
  DatePicker,
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
  ThemeToggle,
  Toaster,
  Tooltip,
  toast,
} from '@driif/motiv';
import { SplitButton } from '@driif/motiv/action-menu';
import { useState } from 'react';
import { useTheme } from '../../useTheme';

const languages = [
  { value: 'en', label: 'English', code: 'EN' },
  { value: 'de', label: 'Deutsch', code: 'DE' },
  { value: 'uk', label: 'Українська', code: 'UK' },
];

const teams = [
  { value: 'design', label: 'Design' },
  { value: 'platform', label: 'Platform' },
  { value: 'growth', label: 'Growth' },
  { value: 'support', label: 'Support' },
  { value: 'security', label: 'Security' },
];

const plans = [
  { value: 'hobby', label: 'Hobby' },
  { value: 'team', label: 'Team' },
  { value: 'enterprise', label: 'Enterprise' },
];

const densities = [
  { value: 'cozy', label: 'Cozy' },
  { value: 'compact', label: 'Compact' },
];

const events = [
  { id: 'mentions', label: 'Mentions and replies' },
  { id: 'deploys', label: 'Failed deploys' },
  { id: 'billing', label: 'Invoices and receipts' },
];

const faq = [
  {
    id: 'codes',
    title: 'What if I lose my phone?',
    content: 'Use one of the ten recovery codes you saved when you turned on two-step sign-in.',
  },
  {
    id: 'sessions',
    title: 'Where am I signed in?',
    content: 'MacBook in Berlin (this device) and an iPhone in Kyiv, last seen yesterday.',
  },
];

function fakeUpload(
  _file: File,
  { signal, onProgress }: { signal: AbortSignal; onProgress: (percent: number) => void },
) {
  return new Promise<void>((resolve, reject) => {
    let progress = 0;
    const timer = window.setInterval(() => {
      progress += 20;
      onProgress(progress);
      if (progress === 100) {
        window.clearInterval(timer);
        resolve();
      }
    }, 200);
    signal.addEventListener(
      'abort',
      () => {
        window.clearInterval(timer);
        reject(new DOMException('Upload aborted', 'AbortError'));
      },
      { once: true },
    );
  });
}

export function Settings() {
  const { dark, toggle } = useTheme();
  const [tab, setTab] = useState('profile');
  const [language, setLanguage] = useState('en');
  const [team, setTeam] = useState(['design', 'platform']);
  const [plan, setPlan] = useState('team');
  const [density, setDensity] = useState('cozy');
  const [birthday, setBirthday] = useState('1990-12-10');
  const [subscribed, setSubscribed] = useState(['mentions']);
  const [push, setPush] = useState(true);
  const [quietHours, setQuietHours] = useState(22);
  const [code, setCode] = useState('');
  const [codeStatus, setCodeStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [confirming, setConfirming] = useState(false);

  const all = subscribed.length === events.length;
  const some = subscribed.length > 0 && !all;

  const profile = (
    <div className="ex-form">
      <div className="ex-form__row">
        <TextField label="Full name" defaultValue="Ada Lovelace" autoComplete="name" />
        <TextField label="Email" type="email" defaultValue="ada@example.com" autoComplete="email" />
      </div>
      <TextField
        label="Public handle"
        labelPosition="above"
        defaultValue="ada"
        hint="Shown next to your comments."
      />
      <Textarea
        label="Bio"
        rows={2}
        maxRows={6}
        defaultValue="Writes programs for engines that do not exist yet."
      />
      <div className="ex-form__row">
        <Select label="Language" options={languages} value={language} onChange={setLanguage} />
        <DatePicker
          label="Birthday"
          value={birthday}
          onChange={(event) => setBirthday(event.target.value)}
        />
      </div>
      <MultiSelect label="Teams" options={teams} value={team} onChange={setTeam} />
      <FileUpload label="Upload avatar" accept="image/*" upload={fakeUpload} />
    </div>
  );

  const notifications = (
    <div className="ex-form">
      <fieldset className="ex-fieldset">
        <legend className="ex-fieldset__legend">Email me about</legend>
        <Checkbox
          label="Everything"
          checked={all}
          ref={(input) => {
            if (input) input.indeterminate = some;
          }}
          onChange={() => setSubscribed(all ? [] : events.map((event) => event.id))}
        />
        <div className="ex-fieldset__nested">
          {events.map((event) => (
            <Checkbox
              key={event.id}
              label={event.label}
              checked={subscribed.includes(event.id)}
              onChange={(e) =>
                setSubscribed(
                  e.target.checked
                    ? [...subscribed, event.id]
                    : subscribed.filter((id) => id !== event.id),
                )
              }
            />
          ))}
        </div>
      </fieldset>
      <Switch checked={push} onChange={setPush} label="Push notifications on this device" />
      <div className="ex-inline">
        <Slider
          label="Quiet hours start"
          value={quietHours}
          onChange={setQuietHours}
          min={18}
          max={24}
          format={(v) => `${v}:00`}
          marks={[18, 21, 24]}
        />
        <Tooltip
          content="We hold non-urgent notifications until 8:00 the next morning."
          label="About quiet hours"
        />
      </div>
    </div>
  );

  const account = (
    <div className="ex-form">
      <RadioGroup name="plan" legend="Plan" options={plans} value={plan} onChange={setPlan} />
      <div className="ex-inline">
        <span>Density</span>
        <SegmentedControl
          label="Density"
          options={densities}
          value={density}
          onChange={setDensity}
        />
      </div>
      <div className="ex-inline">
        <span>Theme</span>
        <ThemeToggle dark={dark} onToggle={toggle} />
      </div>
      <OtpInput
        label="Two-step sign-in code (try 123456)"
        value={code}
        onChange={(next) => {
          setCode(next);
          setCodeStatus('idle');
        }}
        onComplete={(full) => {
          const ok = full === '123456';
          setCodeStatus(ok ? 'success' : 'error');
          if (ok) toast({ tone: 'success', title: 'Two-step sign-in is on' });
        }}
        status={codeStatus}
      />
      <Accordion items={faq} />
      <section className="ex-danger" aria-labelledby="ex-danger-title">
        <div>
          <h3 id="ex-danger-title" className="ex-danger__title">
            Delete account
          </h3>
          <p className="ex-muted">Removes your profile, projects and invoices. There is no undo.</p>
        </div>
        <Button variant="danger" onClick={() => setConfirming(true)}>
          Delete account
        </Button>
      </section>
    </div>
  );

  return (
    <div className="ex-settings">
      <header className="ex-settings__head">
        <div>
          <h1 className="ex-app__title">Settings</h1>
          <p className="ex-muted">Changes apply to every workspace you belong to.</p>
        </div>
        <SplitButton
          onClick={() => toast({ tone: 'success', title: 'Settings saved' })}
          items={[
            {
              label: 'Save and notify team',
              onSelect: () => toast({ title: 'Saved, team notified' }),
            },
            { label: 'Discard changes', onSelect: () => toast({ title: 'Changes discarded' }) },
          ]}
        >
          Save
        </SplitButton>
      </header>
      <Tabs
        label="Settings sections"
        value={tab}
        onChange={setTab}
        items={[
          { value: 'profile', label: 'Profile', panel: profile },
          { value: 'notifications', label: 'Notifications', panel: notifications },
          { value: 'account', label: 'Account', panel: account },
        ]}
      />
      <Confirm
        open={confirming}
        title="Delete ada?"
        slug="ada"
        onCancel={() => setConfirming(false)}
        onConfirm={() => {
          setConfirming(false);
          toast({ tone: 'error', title: 'Account scheduled for deletion' });
        }}
      >
        <p>This permanently deletes 4 projects and 18 invoices.</p>
      </Confirm>
      <Toaster />
    </div>
  );
}
