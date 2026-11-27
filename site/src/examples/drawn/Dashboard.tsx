import {
  Badge,
  Button,
  Card,
  CardBody,
  CardHeader,
  Chips,
  CommandMenu,
  HoldToConfirmButton,
  MenuButton,
  Nav,
  type NotificationItem,
  NotificationList,
  Progress,
  Table,
  type TableColumn,
  TableColumnsMenu,
  ThemeToggle,
  Toaster,
  toast,
} from '@driif/motiv/drawn';
import { useState } from 'react';
import { useTheme } from '../../useTheme';

function Icon({ d }: { d: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} aria-hidden="true">
      <path d={d} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

type Status = 'queued' | 'printing' | 'shipped' | 'late';
type Order = { id: string; customer: string; item: string; copies: number; status: Status };

const statusBadge = {
  queued: { tone: 'neutral', label: 'Queued' },
  printing: { tone: 'warning', label: 'Printing' },
  shipped: { tone: 'success', label: 'Shipped' },
  late: { tone: 'danger', label: 'Late' },
} as const;

const initialOrders: Order[] = [
  {
    id: 'A-1042',
    customer: 'Ada Lovelace',
    item: 'Zine, risograph',
    copies: 120,
    status: 'printing',
  },
  { id: 'A-1041', customer: 'Grace Hopper', item: 'Poster, A2', copies: 30, status: 'queued' },
  {
    id: 'A-1040',
    customer: 'Alan Turing',
    item: 'Notebook, dot grid',
    copies: 250,
    status: 'late',
  },
  {
    id: 'A-1039',
    customer: 'Hedy Lamarr',
    item: 'Postcards, set of 8',
    copies: 400,
    status: 'shipped',
  },
  {
    id: 'A-1038',
    customer: 'Katherine Johnson',
    item: 'Zine, risograph',
    copies: 80,
    status: 'queued',
  },
  {
    id: 'A-1037',
    customer: 'Margaret Hamilton',
    item: 'Sticker sheet',
    copies: 600,
    status: 'shipped',
  },
  { id: 'A-1036', customer: 'Joan Clarke', item: 'Poster, A3', copies: 45, status: 'printing' },
  {
    id: 'A-1035',
    customer: 'Claude Shannon',
    item: 'Notebook, lined',
    copies: 150,
    status: 'shipped',
  },
];

const statusOptions = [
  { value: 'queued', label: 'Queued' },
  { value: 'printing', label: 'Printing' },
  { value: 'late', label: 'Late' },
  { value: 'shipped', label: 'Shipped' },
];

const columns: TableColumn<Order>[] = [
  { id: 'id', label: 'Order', cell: (order) => order.id, width: 96 },
  { id: 'customer', label: 'Customer', cell: (order) => order.customer, width: 180 },
  { id: 'item', label: 'Item', cell: (order) => order.item, width: 180 },
  { id: 'copies', label: 'Copies', cell: (order) => order.copies, width: 88 },
  {
    id: 'status',
    label: 'Status',
    cell: (order) => (
      <Badge tone={statusBadge[order.status].tone}>{statusBadge[order.status].label}</Badge>
    ),
    width: 112,
  },
];

const pages = [
  { id: 'overview', label: 'Overview', icon: <Icon d="M4 11l8-7 8 7v9h-5v-6H9v6H4z" /> },
  { id: 'orders', label: 'Orders', icon: <Icon d="M5 4h14v16H5zM9 9h6M9 13h6" />, count: 3 },
  { id: 'paper', label: 'Paper stock', icon: <Icon d="M6 3h9l3 3v15H6zM15 3v3h3" /> },
];

const initialNotes: NotificationItem[] = [
  {
    id: 'n1',
    title: 'A-1040 is two days late',
    text: 'Dot grid paper is back-ordered.',
    time: '5 min ago',
    tone: 'danger',
  },
  { id: 'n2', title: 'Grace left a note', text: 'Can the poster be matte?', time: '1 h ago' },
  { id: 'n3', title: 'Batch 17 shipped', time: 'Yesterday', tone: 'success' },
];

const pageSize = 4;

export function Dashboard() {
  const { dark, toggle } = useTheme();
  const [menu, setMenu] = useState(false);
  const [page, setPage] = useState('overview');
  const [orders, setOrders] = useState(initialOrders);
  const [notes, setNotes] = useState(initialNotes);
  const [filter, setFilter] = useState(['queued', 'printing', 'late']);
  const [hidden, setHidden] = useState(['item']);
  const [tablePage, setTablePage] = useState(0);

  const visible = orders.filter((order) => filter.includes(order.status));
  const pageCount = Math.max(1, Math.ceil(visible.length / pageSize));
  const current = Math.min(tablePage, pageCount - 1);
  const shipped = orders.filter((order) => order.status === 'shipped').length;
  const copies = orders.reduce((sum, order) => sum + order.copies, 0);

  function shipBatch() {
    const before = orders;
    setOrders(
      orders.map((order) =>
        order.status === 'printing' ? { ...order, status: 'shipped' } : order,
      ),
    );
    toast({
      tone: 'success',
      title: 'Batch shipped',
      description: 'Customers get a tracking note.',
      action: { label: 'Undo', onClick: () => setOrders(before) },
    });
  }

  const commands = [
    {
      id: 'new',
      label: 'New order',
      shortcut: 'N',
      onSelect: () => toast({ title: 'Draft order A-1043 created' }),
    },
    { id: 'late', label: 'Show late orders', onSelect: () => setFilter(['late']) },
    {
      id: 'all',
      label: 'Show all orders',
      onSelect: () => setFilter(statusOptions.map((o) => o.value)),
    },
    {
      id: 'export',
      label: 'Export CSV',
      onSelect: () => toast({ tone: 'success', title: 'orders.csv is ready' }),
    },
  ];

  return (
    <div className="ex-drawn ex-dash" data-menu={menu}>
      <header className="ex-drawn__bar">
        <MenuButton className="ex-drawn__menu" open={menu} onToggle={() => setMenu(!menu)} />
        <strong className="ex-drawn__brand">inkwell press</strong>
        <CommandMenu className="ex-dash__search" commands={commands} hotkey size="sm" />
        <NotificationList
          items={notes}
          onDismiss={(id) => setNotes(notes.filter((note) => note.id !== id))}
          onDismissAll={() => setNotes([])}
          onOpen={(id) => setNotes(notes.filter((note) => note.id !== id))}
        />
        <ThemeToggle dark={dark} onToggle={toggle} />
      </header>

      <Nav
        className="ex-drawn__nav"
        label="Inkwell press"
        items={pages}
        value={page}
        onChange={setPage}
      />

      <main className="ex-drawn__main">
        <div className="ex-dash__stats">
          <Card as="section" aria-label="Orders this week">
            <CardHeader
              title="Orders this week"
              titleAs="h2"
              actions={<Badge tone="success">+12%</Badge>}
            />
            <CardBody>
              <p className="ex-dash__figure">{orders.length}</p>
            </CardBody>
          </Card>
          <Card as="section" aria-label="Shipped">
            <CardHeader
              title="Shipped"
              titleAs="h2"
              actions={
                <Badge>
                  {shipped} of {orders.length}
                </Badge>
              }
            />
            <CardBody>
              <Progress
                value={Math.round((shipped / orders.length) * 100)}
                label="Shipped this week"
              />
            </CardBody>
          </Card>
          <Card as="section" aria-label="Copies printed">
            <CardHeader
              title="Copies"
              titleAs="h2"
              actions={<Badge tone="warning">Paper low</Badge>}
            />
            <CardBody>
              <p className="ex-dash__figure">{copies.toLocaleString('en')}</p>
            </CardBody>
          </Card>
        </div>

        <Card as="section" aria-label="Orders">
          <CardHeader
            title="Orders"
            titleAs="h2"
            description="Tap a status to filter."
            actions={
              <HoldToConfirmButton
                label="Hold to ship batch"
                confirmedLabel="Shipped"
                onConfirm={shipBatch}
              />
            }
          />
          <CardBody>
            <div className="ex-dash__tools">
              <Chips
                label="Status"
                options={statusOptions}
                value={filter}
                onChange={(next) => {
                  setFilter(next);
                  setTablePage(0);
                }}
              />
              <TableColumnsMenu
                columns={columns}
                hiddenColumns={hidden}
                onHiddenColumnsChange={setHidden}
              />
            </div>
            <Table
              caption="Orders"
              columns={columns.filter((column) => !hidden.includes(column.id))}
              rows={visible.slice(current * pageSize, (current + 1) * pageSize)}
              getRowKey={(order) => order.id}
            />
            <nav className="ex-dash__pages" aria-label="Order pages">
              <Button
                variant="ghost"
                size="sm"
                disabled={current === 0}
                onClick={() => setTablePage(current - 1)}
              >
                Previous
              </Button>
              <span aria-live="polite">
                Page {current + 1} of {pageCount}
              </span>
              <Button
                variant="ghost"
                size="sm"
                disabled={current === pageCount - 1}
                onClick={() => setTablePage(current + 1)}
              >
                Next
              </Button>
            </nav>
          </CardBody>
        </Card>
      </main>
      <Toaster />
    </div>
  );
}
