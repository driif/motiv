import {
  Badge,
  Card,
  CardBody,
  CardHeader,
  Chips,
  CommandMenu,
  GlitchThemeToggle,
  IconButton,
  Nav,
  type NotificationItem,
  NotificationList,
  Progress,
  ScanButton,
  SignalBurger,
  Table,
  type TableColumn,
  TableColumnsMenu,
  Toaster,
  toast,
} from '@driif/motiv/matrix';
import { useState } from 'react';
import { useTheme } from '../../useTheme';

function Icon({ d }: { d: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} aria-hidden="true">
      <path d={d} strokeLinecap="square" />
    </svg>
  );
}

type Service = {
  id: string;
  name: string;
  region: string;
  status: 'healthy' | 'degraded' | 'down';
  latency: number;
  version: string;
};

const services: Service[] = [
  {
    id: 'api',
    name: 'api-gateway',
    region: 'eu-central',
    status: 'healthy',
    latency: 42,
    version: 'v2.14.0',
  },
  {
    id: 'auth',
    name: 'auth',
    region: 'eu-central',
    status: 'healthy',
    latency: 18,
    version: 'v1.9.3',
  },
  {
    id: 'billing',
    name: 'billing',
    region: 'eu-west',
    status: 'degraded',
    latency: 310,
    version: 'v3.2.1',
  },
  {
    id: 'search',
    name: 'search',
    region: 'us-east',
    status: 'healthy',
    latency: 67,
    version: 'v0.31.0',
  },
  {
    id: 'mailer',
    name: 'mailer',
    region: 'eu-west',
    status: 'down',
    latency: 0,
    version: 'v1.4.8',
  },
  {
    id: 'files',
    name: 'file-store',
    region: 'us-east',
    status: 'healthy',
    latency: 55,
    version: 'v2.0.2',
  },
  {
    id: 'queue',
    name: 'job-queue',
    region: 'eu-central',
    status: 'healthy',
    latency: 9,
    version: 'v4.1.0',
  },
  {
    id: 'cdn',
    name: 'edge-cache',
    region: 'global',
    status: 'degraded',
    latency: 140,
    version: 'v5.0.0',
  },
];

const tone = { healthy: 'success', degraded: 'warning', down: 'danger' } as const;

const columns: TableColumn<Service>[] = [
  { id: 'name', label: 'Service', cell: (s) => s.name },
  {
    id: 'status',
    label: 'Status',
    cell: (s) => <Badge tone={tone[s.status]}>{s.status}</Badge>,
    width: 130,
  },
  { id: 'region', label: 'Region', cell: (s) => s.region, width: 130 },
  { id: 'latency', label: 'p95', cell: (s) => (s.latency ? `${s.latency} ms` : '—'), width: 100 },
  { id: 'version', label: 'Version', cell: (s) => s.version, width: 110 },
];

const statuses = [
  { value: 'healthy', label: 'Healthy' },
  { value: 'degraded', label: 'Degraded' },
  { value: 'down', label: 'Down' },
];

const pages = [
  {
    id: 'overview',
    label: 'Overview',
    icon: <Icon d="M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z" />,
  },
  { id: 'services', label: 'Services', icon: <Icon d="M4 6h16M4 12h16M4 18h16" />, count: 8 },
  {
    id: 'incidents',
    label: 'Incidents',
    icon: <Icon d="M12 3l9 17H3zM12 10v4M12 17v1" />,
    count: 2,
  },
  { id: 'deploys', label: 'Deploys', icon: <Icon d="M12 20V4M5 11l7-7 7 7" /> },
];

const alerts: NotificationItem[] = [
  {
    id: 'n1',
    title: 'mailer is down',
    text: 'SMTP relay refused 214 connections.',
    time: '3 min ago',
    tone: 'danger',
  },
  { id: 'n2', title: 'billing p95 over 300 ms', time: '12 min ago', tone: 'warning' },
  {
    id: 'n3',
    title: 'Deploy v2.14.0 finished',
    text: 'api-gateway, eu-central.',
    time: '1 h ago',
    tone: 'success',
  },
];

const pageSize = 5;

export function Dashboard() {
  const { dark, toggle } = useTheme();
  const [menu, setMenu] = useState(false);
  const [page, setPage] = useState('overview');
  const [notifications, setNotifications] = useState(alerts);
  const [filter, setFilter] = useState(['healthy', 'degraded', 'down']);
  const [hidden, setHidden] = useState(['version']);
  const [offset, setOffset] = useState(0);
  const [deploying, setDeploying] = useState(false);

  const visible = services.filter((s) => filter.includes(s.status));
  const rows = visible.slice(offset, offset + pageSize);

  const deploy = () => {
    setDeploying(true);
    setTimeout(() => {
      setDeploying(false);
      toast({
        tone: 'success',
        title: 'Deploy queued',
        description: 'api-gateway v2.15.0 to eu-central.',
      });
    }, 1200);
  };

  const commands = [
    { id: 'deploy', label: 'Deploy api-gateway', shortcut: 'D', onSelect: deploy },
    { id: 'services', label: 'Go to services', onSelect: () => setPage('services') },
    { id: 'incidents', label: 'Go to incidents', onSelect: () => setPage('incidents') },
    { id: 'theme', label: dark ? 'Light theme' : 'Dark theme', onSelect: toggle },
    {
      id: 'rollback',
      label: 'Roll back billing',
      onSelect: () => toast({ title: 'Rollback started' }),
      disabled: true,
      disabledReason: 'On-call only',
    },
  ];

  return (
    <div className="mx-app mx-dash" data-menu={menu}>
      <header className="mx-bar">
        <SignalBurger
          className="mx-dash__menu"
          open={menu}
          onToggle={() => setMenu(!menu)}
          aria-controls="dash-nav"
        />
        <strong className="mx-brand">ops://prod</strong>
        <CommandMenu className="mx-dash__search" commands={commands} hotkey size="sm" />
        <NotificationList
          items={notifications}
          onDismiss={(id) => setNotifications(notifications.filter((n) => n.id !== id))}
          onDismissAll={() => setNotifications([])}
        />
        <GlitchThemeToggle dark={dark} onToggle={toggle} />
      </header>

      <Nav
        id="dash-nav"
        className="mx-dash__nav"
        label="Console"
        items={pages}
        value={page}
        onChange={(id) => {
          setPage(id);
          setMenu(false);
        }}
      />

      <div className="mx-dash__main">
        <div className="mx-row mx-spread">
          <div>
            <h1 className="mx-title">{pages.find((p) => p.id === page)?.label}</h1>
            <p className="mx-muted">Last 24 hours · all regions</p>
          </div>
          <ScanButton disabled={deploying} onClick={deploy}>
            {deploying ? 'Deploying' : 'Deploy'}
          </ScanButton>
        </div>

        <section className="mx-stats" aria-label="Key metrics">
          <Card padding="sm">
            <div className="mx-stat">
              <span className="mx-muted">Requests / min</span>
              <p className="mx-stat__value">48.2k</p>
              <Badge tone="success">+6.1%</Badge>
            </div>
          </Card>
          <Card padding="sm">
            <div className="mx-stat">
              <span className="mx-muted">Error rate</span>
              <p className="mx-stat__value">0.42%</p>
              <Badge tone="warning">+0.1 pt</Badge>
            </div>
          </Card>
          <Card padding="sm">
            <div className="mx-stat">
              <span className="mx-muted">Error budget</span>
              <p className="mx-stat__value">71%</p>
              <Progress className="mx-stat__meter" value={71} label="Budget left" />
            </div>
          </Card>
          <Card padding="sm">
            <div className="mx-stat">
              <span className="mx-muted">Open incidents</span>
              <p className="mx-stat__value">2</p>
              <Badge tone="danger">1 critical</Badge>
            </div>
          </Card>
        </section>

        <Card as="section" aria-label="Services">
          <CardHeader
            title="Services"
            titleAs="h2"
            description={`${visible.length} of ${services.length} shown`}
            actions={
              <TableColumnsMenu
                columns={columns}
                hiddenColumns={hidden}
                onHiddenColumnsChange={setHidden}
              />
            }
          />
          <CardBody className="mx-dash__table">
            <Chips
              label="Status"
              options={statuses}
              value={filter}
              onChange={(next) => {
                setFilter(next);
                setOffset(0);
              }}
            />
            <Table
              caption="Services"
              columns={columns.filter((c) => !hidden.includes(c.id))}
              rows={rows}
              getRowKey={(s) => s.id}
            />
            <div className="mx-row mx-spread">
              <span className="mx-muted">
                {visible.length
                  ? `${offset + 1}–${offset + rows.length} of ${visible.length}`
                  : 'No services match'}
              </span>
              <div className="mx-row">
                <IconButton
                  size="sm"
                  icon={<Icon d="M15 5l-7 7 7 7" />}
                  label="Previous page"
                  disabled={offset === 0}
                  onClick={() => setOffset(offset - pageSize)}
                />
                <IconButton
                  size="sm"
                  icon={<Icon d="M9 5l7 7-7 7" />}
                  label="Next page"
                  disabled={offset + pageSize >= visible.length}
                  onClick={() => setOffset(offset + pageSize)}
                />
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
      <Toaster />
    </div>
  );
}
