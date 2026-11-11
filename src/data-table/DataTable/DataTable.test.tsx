import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';
import type { TableColumn } from '../../components/Table/Table';
import { DataTable, type DataTableProps } from './DataTable';

type Row = { id: number; name: string };

const rows: Row[] = Array.from({ length: 10_000 }, (_, i) => ({
  id: i + 1,
  name: `Record ${i + 1}`,
}));
const columns: TableColumn<Row>[] = [
  { id: 'id', label: 'No.', cell: (row) => row.id },
  { id: 'name', label: 'Name', cell: (row) => <button type="button">{row.name}</button> },
];

// jsdom has no layout: the scroll container is 400px high, every row 40px.
const size = (element: HTMLElement) => (element.classList.contains('motiv-data-table') ? 400 : 40);
beforeAll(() => {
  vi.spyOn(HTMLElement.prototype, 'offsetHeight', 'get').mockImplementation(function (
    this: HTMLElement,
  ) {
    return size(this);
  });
  vi.spyOn(HTMLElement.prototype, 'offsetWidth', 'get').mockReturnValue(400);
  vi.spyOn(Element.prototype, 'clientHeight', 'get').mockImplementation(function (this: Element) {
    return size(this as HTMLElement);
  });
  vi.spyOn(Element.prototype, 'clientWidth', 'get').mockReturnValue(400);
  vi.spyOn(Element.prototype, 'scrollHeight', 'get').mockImplementation(function (this: Element) {
    return this.classList.contains('motiv-data-table') ? 40 * 10_000 : 40;
  });
  vi.spyOn(Element.prototype, 'getBoundingClientRect').mockImplementation(function (this: Element) {
    const height = size(this as HTMLElement);
    return {
      width: 400,
      height,
      top: 0,
      left: 0,
      right: 400,
      bottom: height,
      x: 0,
      y: 0,
      toJSON: () => ({}),
    };
  });
});
afterAll(() => {
  vi.restoreAllMocks();
});

function renderTable(props: Partial<DataTableProps<Row>> = {}) {
  return render(
    <DataTable
      caption="Records"
      columns={columns}
      rows={rows}
      getRowKey={(row) => row.id}
      estimateRowHeight={40}
      {...props}
    />,
  );
}

const bodyRows = () => [...document.querySelectorAll('tbody tr[aria-rowindex]')];
const spacers = () => [...document.querySelectorAll<HTMLElement>('tbody tr[aria-hidden="true"]')];
const spacerTotal = () =>
  spacers().reduce((sum, row) => sum + Number.parseFloat(row.querySelector('td')!.style.height), 0);
const region = () => screen.getByRole('region', { name: 'Records' });
const rowText = (index: number) => new RegExp(`^${index}Record ${index}$`);

async function scrollTo(top: number) {
  await act(async () => {
    Object.defineProperty(region(), 'scrollTop', { value: top, configurable: true });
    fireEvent.scroll(region());
  });
}

describe('DataTable', () => {
  it('renders the Table header and only a window of 10,000 rows', () => {
    renderTable({ className: 'custom', style: { maxWidth: 600 } });
    expect(region()).toHaveClass('motiv-table', 'motiv-data-table', 'custom');
    expect(region().style.maxHeight).toBe('70vh');
    expect(region().style.maxWidth).toBe('600px');
    expect(screen.getByRole('table', { name: 'Records' })).toHaveAttribute(
      'aria-rowcount',
      '10001',
    );
    expect(screen.getAllByRole('row')[0]).toHaveAttribute('aria-rowindex', '1');
    expect(screen.getAllByRole('columnheader').map((h) => h.textContent)).toEqual(['No.', 'Name']);
    const mounted = bodyRows();
    expect(mounted.length).toBeGreaterThan(0);
    expect(mounted.length).toBeLessThan(40);
    expect(mounted[0]).toHaveAttribute('aria-rowindex', '2');
    expect(mounted[0]).toHaveTextContent(rowText(1));
    expect(spacerTotal() + mounted.length * 40).toBe(40 * 10_000);
  });

  it('mounts the last rows when scrolled to the end and keeps row ids', async () => {
    renderTable();
    await scrollTo(40 * 10_000);
    const mounted = bodyRows();
    expect(mounted.at(-1)).toHaveAttribute('aria-rowindex', '10001');
    for (const row of mounted) {
      expect(row).toHaveTextContent(rowText(Number(row.getAttribute('aria-rowindex')) - 1));
    }
    expect(spacerTotal() + mounted.length * 40).toBe(40 * 10_000);
  });

  it('places rows by measured height, not the estimate', async () => {
    renderTable({ estimateRowHeight: 30 });
    await scrollTo(40 * 5_000);
    const first = Number(bodyRows()[0].getAttribute('aria-rowindex')) - 2;
    const top = Number.parseFloat(spacers()[0].querySelector('td')!.style.height);
    // Rows mounted before the scroll measured 40px, 10px more than the estimate each.
    expect(top).toBeGreaterThan(30 * first);
    expect((top - 30 * first) % 10).toBe(0);
  });

  it('keeps a focused row mounted above and below the window', async () => {
    renderTable();
    const early = screen.getByRole('button', { name: 'Record 2' });
    act(() => early.focus());
    await scrollTo(40 * 5_000);
    expect(screen.getByRole('button', { name: 'Record 2' })).toBe(early);
    expect(early).toHaveFocus();
    expect(screen.getByRole('button', { name: 'Record 5001' })).toBeInTheDocument();
    expect(spacerTotal() + bodyRows().length * 40).toBe(40 * 10_000);

    const late = screen.getByRole('button', { name: 'Record 5001' });
    act(() => late.focus());
    await scrollTo(0);
    expect(screen.getByRole('button', { name: 'Record 2' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Record 5001' })).toBe(late);
    expect(spacerTotal() + bodyRows().length * 40).toBe(40 * 10_000);

    act(() => region().focus());
    await scrollTo(40 * 8_000);
    expect(screen.queryByRole('button', { name: 'Record 5001' })).not.toBeInTheDocument();
  });

  it('keeps the focused row when the window loses focus', async () => {
    renderTable();
    const button = screen.getByRole('button', { name: 'Record 2' });
    act(() => button.focus());
    fireEvent.blur(button, { relatedTarget: null });
    await scrollTo(40 * 5_000);
    expect(screen.getByRole('button', { name: 'Record 2' })).toBe(button);
  });

  it('forgets a focused row that leaves the rows', async () => {
    const { rerender } = renderTable();
    act(() => screen.getByRole('button', { name: 'Record 2' }).focus());
    const table = (list: Row[]) => (
      <DataTable caption="Records" columns={columns} rows={list} getRowKey={(row) => row.id} />
    );
    rerender(table(rows.filter((row) => row.id !== 2)));
    rerender(table(rows));
    await scrollTo(40 * 5_000);
    expect(screen.queryByRole('button', { name: 'Record 2' })).not.toBeInTheDocument();
  });

  it('scrolls to the last and first row with End and Home on the region', async () => {
    const scrollTo = vi.fn(function (this: HTMLElement, options: ScrollToOptions) {
      Object.defineProperty(this, 'scrollTop', { value: options.top, configurable: true });
      fireEvent.scroll(this);
    });
    Element.prototype.scrollTo = scrollTo as unknown as Element['scrollTo'];
    renderTable();
    scrollTo.mockClear();
    await act(async () => {
      fireEvent.keyDown(screen.getByRole('button', { name: 'Record 1' }), { key: 'End' });
    });
    expect(scrollTo).not.toHaveBeenCalled();
    await act(async () => {
      fireEvent.keyDown(region(), { key: 'End' });
    });
    await vi.waitFor(() =>
      expect(screen.getByRole('button', { name: 'Record 10000' })).toBeInTheDocument(),
    );
    await act(async () => {
      fireEvent.keyDown(region(), { key: 'Home' });
    });
    await vi.waitFor(() =>
      expect(screen.getByRole('button', { name: 'Record 1' })).toBeInTheDocument(),
    );
    delete (Element.prototype as Partial<Element>).scrollTo;
  });

  it('keeps the Table column resize contract', () => {
    const onColumnWidthsChange = vi.fn();
    renderTable({ columnWidths: { name: 300 }, onColumnWidthsChange, maxHeight: 200 });
    expect(region().style.maxHeight).toBe('200px');
    const separator = screen.getByRole('separator', { name: 'Resize Name' });
    fireEvent.keyDown(separator, { key: 'ArrowRight' });
    expect(onColumnWidthsChange).toHaveBeenCalledWith({ name: 310 });
  });
});
