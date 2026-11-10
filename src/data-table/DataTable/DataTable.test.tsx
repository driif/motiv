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

const bodyRows = () =>
  screen.getAllByRole('row').filter((row) => row.hasAttribute('aria-rowindex'));
const region = () => screen.getByRole('region', { name: 'Records' });

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
    expect(region().style.height).toBe('70vh');
    expect(region().style.maxWidth).toBe('600px');
    expect(screen.getByRole('table', { name: 'Records' })).toHaveAttribute(
      'aria-rowcount',
      '10001',
    );
    expect(screen.getAllByRole('columnheader').map((h) => h.textContent)).toEqual(['No.', 'Name']);
    const mounted = bodyRows();
    expect(mounted.length).toBeGreaterThan(0);
    expect(mounted.length).toBeLessThan(40);
    expect(mounted[0]).toHaveAttribute('aria-rowindex', '2');
    expect(mounted[0]).toHaveTextContent('1Record 1');
  });

  it('mounts the last rows when scrolled to the end and keeps row ids', async () => {
    renderTable();
    await scrollTo(40 * 10_000);
    const mounted = bodyRows();
    const last = mounted.at(-1);
    expect(last).toHaveAttribute('aria-rowindex', '10001');
    expect(last).toHaveTextContent('10000Record 10000');
    for (const row of mounted) {
      const index = Number(row.getAttribute('aria-rowindex')) - 1;
      expect(row).toHaveTextContent(`Record ${index}`);
    }
  });

  it('keeps a focused row mounted after it leaves the window', async () => {
    renderTable();
    const button = screen.getByRole('button', { name: 'Record 2' });
    act(() => button.focus());
    await scrollTo(40 * 5_000);
    expect(screen.getByRole('button', { name: 'Record 2' })).toBe(button);
    expect(button).toHaveFocus();
    expect(screen.getByRole('button', { name: 'Record 5001' })).toBeInTheDocument();

    act(() => region().focus());
    await scrollTo(40 * 5_001);
    expect(screen.queryByRole('button', { name: 'Record 2' })).not.toBeInTheDocument();
  });

  it('keeps the Table column resize contract', () => {
    const onColumnWidthsChange = vi.fn();
    renderTable({ columnWidths: { name: 300 }, onColumnWidthsChange, height: 200 });
    expect(region().style.height).toBe('200px');
    const separator = screen.getByRole('separator', { name: 'Resize Name' });
    fireEvent.keyDown(separator, { key: 'ArrowRight' });
    expect(onColumnWidthsChange).toHaveBeenCalledWith({ name: 310 });
  });
});
