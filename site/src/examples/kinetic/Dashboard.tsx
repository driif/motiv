import {
  Badge,
  Button,
  Card,
  CardBody,
  CardHeader,
  CommandMenu,
  FilterChips,
  IconButton,
  MagneticButton,
  MenuButton,
  Nav,
  type NotificationItem,
  NotificationList,
  Odometer,
  Progress,
  SegmentedControl,
  Table,
  type TableColumn,
  TableColumnsMenu,
  ThemeToggle,
  Toaster,
  toast,
} from '@driif/motiv';
import { useState } from 'react';
import { useTheme } from '../../useTheme';

function Icon({ d }: { d: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.65}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={d} />
    </svg>
  );
}

type Deploy = {
  id: number;
  service: string;
  branch: string;
  author: string;
  status: 'live' | 'building' | 'failed';
  time: string;
};

const deploys: Deploy[] = [
  { id: 1, service: 'checkout', branch: 'main', author: 'Ada', status: 'live', time: '4 min ago' },
  {
    id: 2,
    service: 'search',
    branch: 'fix/typo',
    author: 'Grace',
    status: 'building',
    time: '9 min ago',
  },
  {
    id: 3,
    service: 'billing',
    branch: 'main',
    author: 'Alan',
    status: 'failed',
    time: '22 min ago',
  },
  { id: 4, service: 'auth', branch: 'main', author: 'Margaret', status: 'live', time: '1 h ago' },
  {
    id: 5,
    service: 'emails',
    branch: 'feat/digest',
    author: 'Ada',
    status: 'live',
    time: '2 h ago',
  },
  { id: 6, service: 'search', branch: 'main', author: 'Grace', status: 'live', time: '3 h ago' },
  {
    id: 7,
    service: 'checkout',
    branch: 'feat/apple-pay',
    author: 'Linus',
    status: 'failed',
    time: '5 h ago',
  },
  {
    id: 8,
    service: 'auth',
    branch: 'chore/deps',
    author: 'Alan',
    status: 'building',
    time: '6 h ago',
  },
];

const tones = { live: 'success', building: 'warning', failed: 'danger' } as const;

const statuses = [
  { value: 'live', label: 'Live' },
  { value: 'building', label: 'Building' },
  { value: 'failed', label: 'Failed' },
];

const ranges = [
  { value: 'day', label: 'Day' },
  { value: 'week', label: 'Week' },
  { value: 'month', label: 'Month' },
];

const stats = {
  day: { visitors: 1284, deploys: 12, uptime: 99 },
  week: { visitors: 9120, deploys: 64, uptime: 98 },
  month: { visitors: 38410, deploys: 251, uptime: 97 },
};

const pages = [
  { id: 'overview', label: 'Overview', icon: <Icon d="M4 11l8-7 8 7v9h-5v-6H9v6H4z" /> },
  { id: 'deploys', label: 'Deploys', icon: <Icon d="M12 4v12M7 11l5 5 5-5M5 20h14" />, count: 3 },
  {
    id: 'team',
    label: 'Team',
    icon: (
      <Icon d="M9 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM3 20a6 6 0 0 1 12 0M16 5a3 3 0 0 1 0 6M21 20a6 6 0 0 0-4-5.6" />
    ),
  },
];

const initialNotifications: NotificationItem[] = [
  {
    id: '1',
    title: 'billing failed to deploy',
    text: 'Exit code 1 in step "migrate".',
    time: '22 min ago',
    tone: 'danger',
  },
  {
    id: '2',
    title: 'Grace mentioned you',
    text: 'Can you look at the search index?',
    time: '1 h ago',
  },
  { id: '3', title: 'Build minutes at 80%', time: 'Yesterday', tone: 'warning' },
];

const PAGE_SIZE = 5;

export function Dashboard() {
  const { dark, toggle } = useTheme();
  const [menu, setMenu] = useState(false);
  const [page, setPage] = useState('overview');
  const [range, setRange] = useState<keyof typeof stats>('day');
  const [filter, setFilter] = useState(['live', 'building', 'failed']);
  const [hidden, setHidden] = useState(['branch']);
  const [offset, setOffset] = useState(0);
  const [notifications, setNotifications] = useState(initialNotifications);

  const redeploy = (deploy: Deploy) =>
    toast({
      title: `Redeploying ${deploy.service}`,
      description: `From ${deploy.branch}, by you.`,
    });

  const columns: TableColumn<Deploy>[] = [
    { id: 'service', label: 'Service', cell: (d) => <strong>{d.service}</strong> },
    { id: 'branch', label: 'Branch', cell: (d) => <code>{d.branch}</code>, width: 150 },
    { id: 'author', label: 'Author', cell: (d) => d.author, width: 110 },
    {
      id: 'status',
      label: 'Status',
      cell: (d) => <Badge tone={tones[d.status]}>{d.status}</Badge>,
      width: 110,
    },
    { id: 'time', label: 'When', cell: (d) => d.time, width: 110 },
    {
      id: 'actions',
      label: 'Actions',
      header: <span className="motiv-visually-hidden">Actions</span>,
      cell: (d) => (
        <IconButton
          size="sm"
          label={`Redeploy ${d.service}`}
          icon={<Icon d="M20 11a8 8 0 1 0-2.3 5.7M20 4v7h-7" />}
          onClick={() => redeploy(d)}
        />
      ),
      width: 72,
    },
  ];

  const filtered = deploys.filter((d) => filter.includes(d.status));
  const visible = filtered.slice(offset, offset + PAGE_SIZE);
  const current = stats[range];
  const remove = (id: string) => setNotifications(notifications.filter((n) => n.id !== id));

  return (
    <div className="ex-app" data-menu={menu}>
      <header className="ex-app__bar">
        <MenuButton
          className="ex-app__menu"
          open={menu}
          onToggle={() => setMenu(!menu)}
          aria-controls="ex-dashboard-nav"
        />
        <strong className="ex-app__brand">Launchpad</strong>
        <CommandMenu
          className="ex-app__search"
          size="sm"
          hotkey
          commands={[
            {
              id: 'deploy',
              label: 'Deploy main',
              shortcut: 'D',
              onSelect: () => toast({ title: 'Deploy queued' }),
            },
            { id: 'deploys', label: 'Go to deploys', onSelect: () => setPage('deploys') },
            { id: 'team', label: 'Go to team', onSelect: () => setPage('team') },
            { id: 'theme', label: dark ? 'Light theme' : 'Dark theme', onSelect: toggle },
          ]}
        />
        <NotificationList
          items={notifications}
          onDismiss={remove}
          onOpen={remove}
          onDismissAll={() => setNotifications([])}
        />
        <ThemeToggle dark={dark} onToggle={toggle} />
      </header>

      <Nav
        id="ex-dashboard-nav"
        className="ex-app__nav"
        label="Dashboard"
        items={pages}
        value={page}
        onChange={(id) => {
          setPage(id);
          setMenu(false);
        }}
      />

      <main className="ex-app__main">
        <div className="ex-app__heading">
          <h1 className="ex-app__title">{pages.find((p) => p.id === page)?.label}</h1>
          <SegmentedControl
            label="Range"
            options={ranges}
            value={range}
            onChange={(value) => setRange(value as keyof typeof stats)}
          />
          <MagneticButton
            onClick={() =>
              toast({
                tone: 'success',
                title: 'Project created',
                description: 'launchpad-7 is ready.',
              })
            }
          >
            New project
          </MagneticButton>
        </div>

        <div className="ex-stats">
          <Card padding="sm">
            <CardHeader
              titleAs="h2"
              title="Visitors"
              actions={<Badge tone="success">+12%</Badge>}
            />
            <CardBody className="ex-stat">
              <span
                className="ex-stat__value"
                role="img"
                aria-label={`${current.visitors} visitors`}
              >
                <Odometer value={current.visitors} />
              </span>
            </CardBody>
          </Card>
          <Card padding="sm">
            <CardHeader
              titleAs="h2"
              title="Deploys"
              actions={<Badge tone="warning">2 failed</Badge>}
            />
            <CardBody className="ex-stat">
              <span className="ex-stat__value" role="img" aria-label={`${current.deploys} deploys`}>
                <Odometer value={current.deploys} />
              </span>
            </CardBody>
          </Card>
          <Card padding="sm">
            <CardHeader titleAs="h2" title="Uptime" actions={<Badge>SLA 99%</Badge>} />
            <CardBody className="ex-stat">
              <Progress value={current.uptime} label="Checks passing" />
            </CardBody>
          </Card>
        </div>

        <section className="ex-panel" aria-labelledby="ex-deploys">
          <div className="ex-panel__bar">
            <h2 id="ex-deploys" className="ex-panel__title">
              Recent deploys
            </h2>
            <TableColumnsMenu
              columns={columns}
              hiddenColumns={hidden}
              onHiddenColumnsChange={setHidden}
            />
          </div>
          <FilterChips
            label="Status"
            options={statuses}
            value={filter}
            onChange={(value) => {
              setFilter(value);
              setOffset(0);
            }}
          />
          <div className="ex-table">
            <Table
              caption="Recent deploys"
              columns={columns.filter((column) => !hidden.includes(column.id))}
              rows={visible}
              getRowKey={(d) => d.id}
            />
            <nav className="ex-pager" aria-label="Deploy pages">
              <span>
                {filtered.length === 0
                  ? 'No deploys match'
                  : `${offset + 1}–${offset + visible.length} of ${filtered.length}`}
              </span>
              <Button
                size="sm"
                variant="outline"
                disabled={offset === 0}
                onClick={() => setOffset(offset - PAGE_SIZE)}
              >
                Previous
              </Button>
              <Button
                size="sm"
                variant="outline"
                disabled={offset + PAGE_SIZE >= filtered.length}
                onClick={() => setOffset(offset + PAGE_SIZE)}
              >
                Next
              </Button>
            </nav>
          </div>
        </section>
      </main>
      <Toaster />
    </div>
  );
}
