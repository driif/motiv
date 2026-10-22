import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Checkbox,
  IconButton,
  IconButtonGroup,
  Link,
  MenuButton,
  Nav,
  Progress,
  RadioGroup,
  SegmentedControl,
  Select,
  Slider,
  Switch,
  Tabs,
  Textarea,
  TextField,
  ThemeToggle,
} from '@driif/motiv/drawn';
import { useState } from 'react';
import { useTheme } from '../useTheme';

function Icon({ d }: { d: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} aria-hidden="true">
      <path d={d} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const pages = [
  { id: 'home', label: 'Home', icon: <Icon d="M4 11l8-7 8 7v9h-5v-6H9v6H4z" /> },
  { id: 'inbox', label: 'Inbox', icon: <Icon d="M4 6h16v12H4zM4 6l8 7 8-7" />, count: 2 },
  { id: 'settings', label: 'Settings', icon: <Icon d="M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8z" /> },
];

const languages = [
  { value: 'en', label: 'English', code: 'EN' },
  { value: 'de', label: 'Deutsch', code: 'DE' },
  { value: 'uk', label: 'Українська', code: 'UK' },
];

const digests = [
  { value: 'daily', label: 'Every morning' },
  { value: 'weekly', label: 'Once a week' },
  { value: 'never', label: 'Never, thanks' },
];

const densities = [
  { value: 'cozy', label: 'Cozy' },
  { value: 'compact', label: 'Compact' },
];

export function DrawnSettings() {
  const { dark, toggle } = useTheme();
  const [menu, setMenu] = useState(false);
  const [page, setPage] = useState('settings');
  const [tab, setTab] = useState('profile');
  const [language, setLanguage] = useState('en');
  const [digest, setDigest] = useState('weekly');
  const [density, setDensity] = useState('cozy');
  const [name, setName] = useState('Ada Lovelace');
  const [newsletter, setNewsletter] = useState(false);
  const [replies, setReplies] = useState(true);
  const [textSize, setTextSize] = useState(100);
  const [saving, setSaving] = useState(false);

  const done = [name, language, newsletter, digest !== 'never'].filter(Boolean).length;

  return (
    <div className="site-app" data-menu={menu}>
      <header className="site-app__bar">
        <MenuButton className="site-app__menu" open={menu} onToggle={() => setMenu(!menu)} />
        <strong className="site-app__brand">sketchbook</strong>
        <ThemeToggle dark={dark} onToggle={toggle} />
      </header>
      <Nav
        className="site-app__nav"
        label="Sketchbook"
        items={pages}
        value={page}
        onChange={setPage}
      />
      <Card as="section" className="site-app__main" aria-label="Account settings">
        <CardHeader
          title="Account"
          titleAs="h2"
          description="Make this sketchbook yours."
          actions={
            <IconButtonGroup label="Avatar">
              <IconButton icon={<Icon d="M4 20l4-1 11-11-3-3L5 16l-1 4z" />} label="Edit avatar" />
              <IconButton
                icon={<Icon d="M5 7h14M9 7V4h6v3M7 7l1 13h8l1-13" />}
                label="Remove avatar"
              />
            </IconButtonGroup>
          }
        />
        <CardBody>
          <Progress className="site-app__progress" value={done * 25} label="Profile complete" />
          <Tabs
            label="Settings"
            value={tab}
            onChange={setTab}
            items={[
              {
                value: 'profile',
                label: 'Profile',
                panel: (
                  <div className="site-app__panel">
                    <TextField
                      label="Your name"
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                    />
                    <TextField label="Email" type="email" hint="We only use it to reply." />
                    <Textarea label="About you" rows={2} maxRows={5} />
                    <Select
                      label="Language"
                      options={languages}
                      value={language}
                      onChange={setLanguage}
                    />
                  </div>
                ),
              },
              {
                value: 'letters',
                label: 'Letters',
                panel: (
                  <div className="site-app__panel">
                    <Checkbox
                      label="Send me the newsletter"
                      checked={newsletter}
                      onChange={(event) => setNewsletter(event.target.checked)}
                    />
                    <Switch checked={replies} onChange={setReplies} label="Tell me about replies" />
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
                  <div className="site-app__panel">
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
                      max={140}
                      step={10}
                      format={(v) => `${v}%`}
                    />
                    <p className="site-app__note">
                      Dark mode lives in the top bar. <Link href="#theme-toggle">How it works</Link>
                    </p>
                  </div>
                ),
              },
            ]}
          />
        </CardBody>
        <CardFooter>
          <Button variant="ghost">Cancel</Button>
          <Button
            loading={saving}
            onClick={() => {
              setSaving(true);
              setTimeout(() => setSaving(false), 1200);
            }}
          >
            Save changes
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
