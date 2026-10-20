import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Checkbox,
  ChevronNav,
  type ChevronNavSection,
  DecodeSecretField,
  GlitchThemeToggle,
  HudTabs,
  IconButton,
  IconButtonGroup,
  Link,
  Progress,
  RadioGroup,
  ScanButton,
  SignalBurger,
  TerminalSelect,
  TextField,
} from '@driif/motiv/matrix';
import { useState } from 'react';
import { useTheme } from '../useTheme';

function Icon({ d }: { d: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} aria-hidden="true">
      <path d={d} strokeLinecap="square" />
    </svg>
  );
}

const sections: ChevronNavSection[] = [
  {
    title: 'Vault',
    items: [
      {
        id: 'secrets',
        label: 'Secrets',
        icon: <Icon d="M6 10V7a6 6 0 0 1 12 0v3M5 10h14v10H5z" />,
        expandable: true,
      },
      {
        id: 'policies',
        label: 'Policies',
        icon: <Icon d="M12 3l8 3v6c0 5-4 8-8 9-4-1-8-4-8-9V6z" />,
      },
      { id: 'audit', label: 'Audit log', icon: <Icon d="M5 4h14v16H5zM9 9h6M9 13h6" /> },
    ],
  },
];

const engines = [
  { value: 'kv', label: 'Key/value', code: 'KV-V2', hint: 'Versioned secrets, ten versions kept.' },
  { value: 'pki', label: 'PKI', code: 'PKI', hint: 'Short-lived certificates.' },
  { value: 'transit', label: 'Transit', code: 'TRANSIT', hint: 'Encryption as a service.' },
];

const levels = [
  { value: 'read', label: 'Read' },
  { value: 'write', label: 'Read and write' },
  { value: 'admin', label: 'Admin' },
];

const tabs = [
  { value: 'secret', label: 'Secret' },
  { value: 'access', label: 'Access' },
  { value: 'sync', label: 'Sync' },
];

export function MatrixConsole() {
  const { dark, toggle } = useTheme();
  const [menu, setMenu] = useState(false);
  const [page, setPage] = useState('secrets');
  const [tab, setTab] = useState('secret');
  const [engine, setEngine] = useState('kv');
  const [secret, setSecret] = useState('hvs.CAESIJ3x9QmZkT2pL');
  const [rotate, setRotate] = useState(true);
  const [level, setLevel] = useState('read');
  const [sealing, setSealing] = useState(false);

  return (
    <div className="site-console" data-menu={menu}>
      <header className="site-console__bar">
        <SignalBurger
          className="site-console__menu"
          open={menu}
          onToggle={() => setMenu(!menu)}
          aria-controls="console-nav"
        />
        <strong className="site-console__brand">vault://prod</strong>
        <GlitchThemeToggle dark={dark} onToggle={toggle} />
      </header>
      <ChevronNav
        id="console-nav"
        className="site-console__nav"
        label="Console"
        sections={sections}
        value={page}
        onChange={setPage}
      />
      <Card as="section" className="site-console__main" aria-label="Secret app/db">
        <CardHeader
          title="app/db"
          titleAs="h2"
          description="Database credentials for the billing service."
          actions={
            <IconButtonGroup label="Secret">
              <IconButton icon={<Icon d="M8 8h11v11H8zM5 16V5h11" />} label="Copy path" />
              <IconButton icon={<Icon d="M5 7h14M9 7V4h6v3M7 7l1 13h8l1-13" />} label="Destroy" />
            </IconButtonGroup>
          }
        />
        <CardBody>
          <HudTabs
            label="Secret"
            tabs={tabs}
            value={tab}
            onChange={setTab}
            panels={{
              secret: (
                <div className="site-console__panel">
                  <TerminalSelect
                    label="Engine"
                    prefix="mount://"
                    options={engines}
                    value={engine}
                    onChange={setEngine}
                  />
                  <TextField label="Path" defaultValue="app/db" />
                  <DecodeSecretField label="Password" value={secret} onChange={setSecret} />
                  <Checkbox
                    label="Rotate every 30 days"
                    checked={rotate}
                    onChange={(event) => setRotate(event.target.checked)}
                  />
                </div>
              ),
              access: (
                <div className="site-console__panel">
                  <RadioGroup
                    name="level"
                    legend="Billing service may"
                    options={levels}
                    value={level}
                    onChange={setLevel}
                  />
                  <p className="site-console__note">
                    Policies are checked on every read. <Link href="#hud-tabs">How tabs work</Link>
                  </p>
                </div>
              ),
              sync: (
                <div className="site-console__panel">
                  <Progress value={100} label="Frankfurt" />
                  <Progress value={64} label="Zürich" />
                  <Progress value={12} label="Kyiv" />
                </div>
              ),
            }}
          />
        </CardBody>
        <CardFooter>
          <Button variant="ghost">Discard</Button>
          <ScanButton
            disabled={sealing}
            onClick={() => {
              setSealing(true);
              setTimeout(() => setSealing(false), 1200);
            }}
          >
            {sealing ? 'Sealing' : 'Seal changes'}
          </ScanButton>
        </CardFooter>
      </Card>
    </div>
  );
}
