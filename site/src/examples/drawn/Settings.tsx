import {
  Accordion,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
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
} from '@driif/motiv/drawn';
import { SplitButton } from '@driif/motiv/drawn/action-menu';
import { type CSSProperties, useState } from 'react';
import { useTheme } from '../../useTheme';

const languages = [
  { value: 'en', label: 'English', code: 'EN' },
  { value: 'de', label: 'Deutsch', code: 'DE' },
  { value: 'uk', label: 'Українська', code: 'UK' },
];

const channels = [
  { id: 'email', label: 'Email' },
  { id: 'push', label: 'Push' },
  { id: 'sms', label: 'Text message' },
];

const digests = [
  { value: 'daily', label: 'Every morning' },
  { value: 'weekly', label: 'Once a week' },
  { value: 'never', label: 'Never' },
];

const densities = [
  { value: 'cozy', label: 'Cozy' },
  { value: 'compact', label: 'Compact' },
];

const people = [
  { value: 'grace', label: 'Grace Hopper', hint: 'Editor' },
  { value: 'alan', label: 'Alan Turing', hint: 'Printer' },
  { value: 'hedy', label: 'Hedy Lamarr', hint: 'Designer' },
  { value: 'joan', label: 'Joan Clarke', hint: 'Accounts' },
];

const faq = [
  {
    id: 'export',
    title: 'Can I export my data?',
    content: 'Yes, as CSV or JSON, any time from this page.',
  },
  {
    id: 'delete',
    title: 'What happens when I delete the studio?',
    content: 'Orders and files go after 30 days. Invoices stay for tax reasons.',
  },
];

const fakeUpload = (_file: File, { onProgress }: { onProgress: (percent: number) => void }) =>
  new Promise<void>((resolve) => {
    let progress = 0;
    const timer = window.setInterval(() => {
      progress += 20;
      onProgress(progress);
      if (progress === 100) {
        window.clearInterval(timer);
        resolve();
      }
    }, 150);
  });

export function Settings() {
  const { dark, toggle } = useTheme();
  const [tab, setTab] = useState('profile');
  const [name, setName] = useState('Ada Lovelace');
  const [language, setLanguage] = useState('en');
  const [birthday, setBirthday] = useState('1815-12-10');
  const [enabled, setEnabled] = useState(['email']);
  const [mentions, setMentions] = useState(true);
  const [digest, setDigest] = useState('weekly');
  const [density, setDensity] = useState('cozy');
  const [textSize, setTextSize] = useState(100);
  const [code, setCode] = useState('');
  const [codeStatus, setCodeStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [editors, setEditors] = useState(['grace']);
  const [confirming, setConfirming] = useState(false);

  const allChannels = enabled.length === channels.length;

  return (
    <div className="ex-drawn ex-settings">
      <header className="ex-drawn__bar">
        <strong className="ex-drawn__brand">inkwell press</strong>
        <ThemeToggle dark={dark} onToggle={toggle} />
      </header>
      <Card
        as="section"
        aria-label="Studio settings"
        style={
          {
            '--motiv-font-size': `${textSize / 100}rem`,
            '--motiv-space': density === 'compact' ? '0.1875rem' : undefined,
          } as CSSProperties
        }
      >
        <CardHeader
          title="Settings"
          titleAs="h1"
          description="Everything about you and your studio."
        />
        <CardBody>
          <Tabs
            label="Settings sections"
            value={tab}
            onChange={setTab}
            items={[
              {
                value: 'profile',
                label: 'Profile',
                panel: (
                  <div className="ex-settings__panel">
                    <TextField
                      label="Your name"
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                    />
                    <TextField
                      label="Studio website"
                      labelPosition="above"
                      type="url"
                      defaultValue="https://inkwell.example"
                    />
                    <Textarea
                      label="Bio"
                      rows={2}
                      maxRows={5}
                      defaultValue="Risograph printer, slow reader."
                    />
                    <Select
                      label="Language"
                      options={languages}
                      value={language}
                      onChange={setLanguage}
                    />
                    <DatePicker
                      label="Birthday"
                      value={birthday}
                      onChange={(event) => setBirthday(event.target.value)}
                    />
                    <FileUpload label="Avatar" accept="image/*" upload={fakeUpload} />
                  </div>
                ),
              },
              {
                value: 'notifications',
                label: 'Alerts',
                panel: (
                  <div className="ex-settings__panel">
                    <fieldset className="ex-settings__group">
                      <legend>Channels</legend>
                      <Checkbox
                        label="All channels"
                        checked={allChannels}
                        ref={(input) => {
                          if (input) input.indeterminate = enabled.length > 0 && !allChannels;
                        }}
                        onChange={() => setEnabled(allChannels ? [] : channels.map((c) => c.id))}
                      />
                      <div className="ex-settings__nested">
                        {channels.map((channel) => (
                          <Checkbox
                            key={channel.id}
                            label={channel.label}
                            checked={enabled.includes(channel.id)}
                            onChange={(event) =>
                              setEnabled(
                                event.target.checked
                                  ? [...enabled, channel.id]
                                  : enabled.filter((id) => id !== channel.id),
                              )
                            }
                          />
                        ))}
                      </div>
                    </fieldset>
                    <Switch
                      checked={mentions}
                      onChange={setMentions}
                      label="Tell me when someone mentions me"
                    />
                    <RadioGroup
                      name="digest"
                      legend="Activity digest"
                      options={digests}
                      value={digest}
                      onChange={setDigest}
                    />
                  </div>
                ),
              },
              {
                value: 'looks',
                label: 'Looks',
                panel: (
                  <div className="ex-settings__panel">
                    <SegmentedControl
                      label="Density"
                      options={densities}
                      value={density}
                      onChange={setDensity}
                    />
                    <Slider
                      label="Text size"
                      value={textSize}
                      onChange={setTextSize}
                      min={80}
                      max={130}
                      step={10}
                      format={(v) => `${v}%`}
                    />
                  </div>
                ),
              },
              {
                value: 'security',
                label: 'Security',
                panel: (
                  <div className="ex-settings__panel">
                    <p className="ex-settings__row">
                      Confirm two-step sign-in
                      <Tooltip
                        content="Use the six digits from your authenticator app. Try 123456."
                        label="About the code"
                      />
                    </p>
                    <OtpInput
                      label="Authenticator code"
                      value={code}
                      onChange={(next) => {
                        setCode(next);
                        setCodeStatus('idle');
                      }}
                      onComplete={(full) => setCodeStatus(full === '123456' ? 'success' : 'error')}
                      status={codeStatus}
                    />
                    <MultiSelect
                      label="Who can edit orders"
                      options={people}
                      value={editors}
                      onChange={setEditors}
                    />
                    <Accordion items={faq} />
                    <div className="ex-settings__danger">
                      <div>
                        <strong>Delete studio</strong>
                        <p>Removes every order, file and teammate.</p>
                      </div>
                      <Button variant="danger" onClick={() => setConfirming(true)}>
                        Delete studio
                      </Button>
                    </div>
                  </div>
                ),
              },
            ]}
          />
        </CardBody>
        <CardFooter>
          <Button variant="ghost" onClick={() => toast({ title: 'Changes discarded' })}>
            Cancel
          </Button>
          <SplitButton
            onClick={() => toast({ tone: 'success', title: 'Settings saved' })}
            items={[
              {
                label: 'Save and notify team',
                onSelect: () => toast({ tone: 'success', title: 'Saved, team notified' }),
              },
              { label: 'Save as template', onSelect: () => toast({ title: 'Template saved' }) },
            ]}
          >
            Save
          </SplitButton>
        </CardFooter>
      </Card>
      <Confirm
        open={confirming}
        title="Delete inkwell-press?"
        slug="inkwell-press"
        onCancel={() => setConfirming(false)}
        onConfirm={() => {
          setConfirming(false);
          toast({
            tone: 'error',
            title: 'Studio deleted',
            description: 'Only in this demo, nothing was lost.',
          });
        }}
      >
        <p>This also deletes 8 orders and 3 teammates.</p>
      </Confirm>
      <Toaster />
    </div>
  );
}
