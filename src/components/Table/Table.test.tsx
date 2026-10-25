import { fireEvent, render, screen } from '@testing-library/react';
import { createRef, useState } from 'react';
import { afterAll, afterEach, beforeAll, describe, expect, it, vi } from 'vitest';
import { Table, type TableColumn, type TableProps } from './Table';
import { TableColumnsMenu, type TableColumnsMenuProps } from './TableColumnsMenu';

type Doc = { id: number; name: string; city: string };

const rows: Doc[] = [
  { id: 1, name: 'Ada', city: 'London' },
  { id: 2, name: 'Grace', city: 'New York' },
];

const columns: TableColumn<Doc>[] = [
  { id: 'name', label: 'Name', cell: (row) => row.name },
  { id: 'city', label: 'City', cell: (row) => row.city, width: 150, minWidth: 120 },
];

function renderTable(props: Partial<TableProps<Doc>> = {}) {
  return render(
    <Table
      caption="Documents"
      columns={columns}
      rows={rows}
      getRowKey={(row) => row.id}
      {...props}
    />,
  );
}

// Exact names: a header must not take in its resize handle's name or value.
const headers = (...names: string[]) =>
  names.map((name) => screen.getByRole('columnheader', { name }));
const handle = (name: string) => screen.getByRole('separator', { name: `Resize ${name}` });
const colWidths = (container: HTMLElement) =>
  [...container.querySelectorAll('col')].map((col) => col.style.width);

// jsdom has no pointer capture.
beforeAll(() => {
  Element.prototype.setPointerCapture = vi.fn();
});
afterAll(() => {
  delete (Element.prototype as Partial<Element>).setPointerCapture;
});

describe('Table', () => {
  it('renders a labelled scroll region around a captioned table and passes props and ref', () => {
    const ref = createRef<HTMLDivElement>();
    const { container } = renderTable({ ref, className: 'custom', id: 'docs' });
    const region = screen.getByRole('region', { name: 'Documents' });
    expect(region).toBe(ref.current);
    expect(region).toHaveClass('motiv-table', 'custom');
    expect(region).toHaveAttribute('id', 'docs');
    expect(region).toHaveAttribute('tabindex', '0');
    expect(screen.getByRole('table', { name: 'Documents' })).toBeInTheDocument();
    expect(screen.getAllByRole('columnheader')).toEqual(headers('Name', 'City'));
    expect(headers('Name')[0]).toHaveAttribute('scope', 'col');
    expect(screen.getAllByRole('row')[2]).toHaveTextContent('GraceNew York');
    expect(colWidths(container)).toEqual(['200px', '150px']);
    expect(screen.getByRole('table')).toHaveStyle({ width: '350px' });
  });

  it('names each separator after the label and reports its width range', () => {
    renderTable({
      columns: [{ ...columns[0], header: <button type="button">Sort by name</button> }, columns[1]],
      resizeLabel: (label) => `Width of ${label}`,
    });
    expect(screen.getByRole('button', { name: 'Sort by name' })).toBeInTheDocument();
    expect(screen.getAllByRole('columnheader')).toEqual(headers('Sort by name', 'City'));
    const name = screen.getByRole('separator', { name: 'Width of Name' });
    expect(name).toHaveAttribute('aria-orientation', 'vertical');
    expect(name).toHaveAttribute('aria-valuenow', '200');
    expect(name).toHaveAttribute('aria-valuemin', '80');
    expect(name).toHaveAttribute('aria-valuemax', '800');
    expect(name).toHaveAttribute('tabindex', '0');
    const city = screen.getByRole('separator', { name: 'Width of City' });
    expect(city).toHaveAttribute('aria-valuenow', '150');
    expect(city).toHaveAttribute('aria-valuemin', '120');
  });

  it('previews a drag locally and reports the width once on release', () => {
    const onColumnWidthsChange = vi.fn();
    const { container } = renderTable({ onColumnWidthsChange });
    fireEvent.pointerDown(handle('Name'), { clientX: 100, pointerId: 1 });
    expect(handle('Name')).toHaveClass('motiv-table__resize--dragging');
    fireEvent.pointerMove(handle('Name'), { clientX: 140 });
    fireEvent.pointerMove(handle('Name'), { clientX: 150 });
    expect(colWidths(container)).toEqual(['250px', '150px']);
    expect(handle('Name')).toHaveAttribute('aria-valuenow', '250');
    expect(screen.getByRole('table')).toHaveStyle({ width: '400px' });
    expect(onColumnWidthsChange).not.toHaveBeenCalled();
    fireEvent.pointerUp(handle('Name'), { clientX: 160 });
    fireEvent.lostPointerCapture(handle('Name'));
    expect(onColumnWidthsChange).toHaveBeenCalledOnce();
    expect(onColumnWidthsChange).toHaveBeenCalledWith({ name: 260 });
    expect(colWidths(container)).toEqual(['260px', '150px']);
    expect(handle('Name')).not.toHaveClass('motiv-table__resize--dragging');
  });

  it.each(['pointerCancel', 'lostPointerCapture'] as const)('rolls a drag back on %s', (type) => {
    const onColumnWidthsChange = vi.fn();
    const { container } = renderTable({ onColumnWidthsChange });
    fireEvent.pointerDown(handle('City'), { clientX: 100 });
    fireEvent.pointerMove(handle('City'), { clientX: 180 });
    expect(colWidths(container)).toEqual(['200px', '230px']);
    fireEvent[type](handle('City'));
    fireEvent.pointerUp(handle('City'), { clientX: 180 });
    expect(colWidths(container)).toEqual(['200px', '150px']);
    expect(onColumnWidthsChange).not.toHaveBeenCalled();
  });

  it('clamps drags to the column minimum and 800px in whole pixels, and ignores a click', () => {
    const onColumnWidthsChange = vi.fn();
    const { container } = renderTable({ onColumnWidthsChange });
    fireEvent.pointerDown(handle('City'), { clientX: 500 });
    fireEvent.pointerMove(handle('City'), { clientX: 0 });
    expect(colWidths(container)[1]).toBe('120px');
    fireEvent.pointerUp(handle('City'), { clientX: 0 });
    fireEvent.pointerDown(handle('Name'), { clientX: 0 });
    fireEvent.pointerUp(handle('Name'), { clientX: 2000 });
    expect(onColumnWidthsChange.mock.calls).toEqual([[{ city: 120 }], [{ city: 120, name: 800 }]]);
    fireEvent.pointerDown(handle('Name'), { clientX: 10 });
    fireEvent.pointerUp(handle('Name'), { clientX: 10.4 });
    expect(onColumnWidthsChange).toHaveBeenCalledTimes(2);
    fireEvent.pointerDown(handle('City'), { clientX: 10 });
    fireEvent.pointerUp(handle('City'), { clientX: 40.6 });
    expect(onColumnWidthsChange).toHaveBeenLastCalledWith({ city: 151, name: 800 });
  });

  it('steps 10px with the arrow keys, clamped, and resets with Enter', () => {
    const onColumnWidthsChange = vi.fn();
    const { container } = renderTable({ onColumnWidthsChange });
    fireEvent.keyDown(handle('City'), { key: 'ArrowRight' });
    fireEvent.keyDown(handle('City'), { key: 'ArrowRight' });
    expect(colWidths(container)[1]).toBe('170px');
    expect(fireEvent.keyDown(handle('City'), { key: 'ArrowLeft' })).toBe(false);
    expect(onColumnWidthsChange.mock.calls).toEqual([
      [{ city: 160 }],
      [{ city: 170 }],
      [{ city: 160 }],
    ]);
    for (let step = 0; step < 5; step++) fireEvent.keyDown(handle('City'), { key: 'ArrowLeft' });
    expect(colWidths(container)[1]).toBe('120px');
    expect(onColumnWidthsChange).toHaveBeenCalledTimes(7);
    fireEvent.keyDown(handle('City'), { key: 'Enter' });
    expect(onColumnWidthsChange).toHaveBeenLastCalledWith({});
    expect(colWidths(container)[1]).toBe('150px');
    fireEvent.keyDown(handle('City'), { key: 'Enter' });
    expect(onColumnWidthsChange).toHaveBeenCalledTimes(8);
  });

  it('resets a column to its default width on double-click', () => {
    const onColumnWidthsChange = vi.fn();
    const { container } = renderTable({ onColumnWidthsChange });
    fireEvent.keyDown(handle('Name'), { key: 'ArrowLeft' });
    fireEvent.keyDown(handle('City'), { key: 'ArrowRight' });
    fireEvent.doubleClick(handle('Name'));
    expect(onColumnWidthsChange).toHaveBeenLastCalledWith({ city: 160 });
    expect(colWidths(container)).toEqual(['200px', '160px']);
  });

  it('keeps default, stored and reset widths within the column range', () => {
    const onColumnWidthsChange = vi.fn();
    const { container } = renderTable({
      columns: [
        { ...columns[0], minWidth: 300 },
        { ...columns[1], width: 100 },
      ],
      onColumnWidthsChange,
    });
    expect(colWidths(container)).toEqual(['300px', '120px']);
    expect(handle('Name')).toHaveAttribute('aria-valuenow', '300');
    expect(handle('City')).toHaveAttribute('aria-valuenow', '120');
    fireEvent.keyDown(handle('Name'), { key: 'ArrowLeft' });
    fireEvent.keyDown(handle('City'), { key: 'ArrowLeft' });
    expect(onColumnWidthsChange).not.toHaveBeenCalled();
    fireEvent.keyDown(handle('Name'), { key: 'ArrowRight' });
    fireEvent.keyDown(handle('Name'), { key: 'Enter' });
    expect(onColumnWidthsChange).toHaveBeenLastCalledWith({});
    expect(colWidths(container)).toEqual(['300px', '120px']);
  });

  it('clamps controlled widths outside the column range', () => {
    const { container } = renderTable({ columnWidths: { name: 40, city: 2000 } });
    expect(colWidths(container)).toEqual(['80px', '800px']);
    expect(handle('City')).toHaveAttribute('aria-valuenow', '800');
  });

  it.each(['constructor', '__proto__'])('stores a width for a column with id %s', (id) => {
    const onColumnWidthsChange = vi.fn();
    const { container } = renderTable({
      columns: [{ ...columns[0], id }, columns[1]],
      onColumnWidthsChange,
    });
    expect(colWidths(container)).toEqual(['200px', '150px']);
    fireEvent.keyDown(handle('Name'), { key: 'Enter' });
    expect(onColumnWidthsChange).not.toHaveBeenCalled();
    fireEvent.keyDown(handle('Name'), { key: 'ArrowRight' });
    expect(Object.hasOwn(onColumnWidthsChange.mock.lastCall?.[0], id)).toBe(true);
    expect(colWidths(container)).toEqual(['210px', '150px']);
    fireEvent.keyDown(handle('Name'), { key: 'Enter' });
    expect(onColumnWidthsChange).toHaveBeenLastCalledWith({});
    expect(colWidths(container)).toEqual(['200px', '150px']);
  });

  it('shows controlled widths and snaps back when the parent ignores a change', () => {
    const onColumnWidthsChange = vi.fn();
    const { container, rerender } = renderTable({
      columnWidths: { name: 300 },
      onColumnWidthsChange,
    });
    expect(colWidths(container)).toEqual(['300px', '150px']);
    fireEvent.keyDown(handle('Name'), { key: 'ArrowRight' });
    expect(onColumnWidthsChange).toHaveBeenCalledWith({ name: 310 });
    expect(colWidths(container)).toEqual(['300px', '150px']);
    fireEvent.keyDown(handle('Name'), { key: 'Enter' });
    expect(onColumnWidthsChange).toHaveBeenLastCalledWith({});
    rerender(
      <Table
        caption="Documents"
        columns={columns}
        rows={rows}
        getRowKey={(row) => row.id}
        columnWidths={{ name: 310, city: 400 }}
      />,
    );
    expect(colWidths(container)).toEqual(['310px', '400px']);
  });

  it('keeps an uncontrolled width while its column is hidden and shown again', () => {
    function Toggle() {
      const [hidden, setHidden] = useState<string[]>([]);
      return (
        <>
          <button type="button" onClick={() => setHidden(hidden.length ? [] : ['name'])}>
            Toggle
          </button>
          <Table
            caption="Documents"
            columns={columns.filter((column) => !hidden.includes(column.id))}
            rows={rows}
            getRowKey={(row) => row.id}
          />
        </>
      );
    }
    const { container } = render(<Toggle />);
    fireEvent.keyDown(handle('Name'), { key: 'ArrowRight' });
    fireEvent.click(screen.getByRole('button', { name: 'Toggle' }));
    expect(colWidths(container)).toEqual(['150px']);
    fireEvent.click(screen.getByRole('button', { name: 'Toggle' }));
    expect(colWidths(container)).toEqual(['210px', '150px']);
  });
});

const menuColumns = [
  { id: 'name', label: 'Name' },
  { id: 'city', label: 'City' },
  { id: 'zip', label: 'Postal code' },
];

function renderMenu(props: Partial<TableColumnsMenuProps> = {}) {
  return render(
    <TableColumnsMenu
      columns={menuColumns}
      hiddenColumns={[]}
      onHiddenColumnsChange={() => {}}
      {...props}
    />,
  );
}

const toggle = (element: Element, type: 'beforetoggle' | 'toggle', newState: string) =>
  fireEvent(element, Object.assign(new Event(type), { newState }));

describe('TableColumnsMenu', () => {
  // jsdom hides popovers but has no popover API; show the panel so its checkboxes are queryable.
  const style = document.createElement('style');
  beforeAll(() => {
    style.textContent = '[popover] { display: block !important; }';
    document.head.append(style);
  });
  afterAll(() => style.remove());
  afterEach(() => vi.restoreAllMocks());

  it('opens a native auto popover from a labelled trigger and passes props and ref', () => {
    const ref = createRef<HTMLDivElement>();
    renderMenu({ ref, className: 'custom', id: 'menu', label: 'Shown columns' });
    expect(ref.current).toHaveClass('motiv-table-menu', 'custom');
    expect(ref.current).toHaveAttribute('id', 'menu');
    const panel = screen.getByRole('group', { name: 'Shown columns' });
    expect(panel).toHaveAttribute('popover', 'auto');
    expect(screen.getByRole('button', { name: 'Shown columns' })).toHaveAttribute(
      'popovertarget',
      panel.id,
    );
  });

  it('reports the hidden ids when a column is toggled', () => {
    const onHiddenColumnsChange = vi.fn();
    renderMenu({ hiddenColumns: ['city'], onHiddenColumnsChange });
    expect(screen.getByRole('checkbox', { name: 'City' })).not.toBeChecked();
    expect(screen.getByRole('checkbox', { name: 'Name' })).toBeChecked();
    fireEvent.click(screen.getByRole('checkbox', { name: 'Name' }));
    expect(onHiddenColumnsChange).toHaveBeenLastCalledWith(['city', 'name']);
    fireEvent.click(screen.getByRole('checkbox', { name: 'City' }));
    expect(onHiddenColumnsChange).toHaveBeenLastCalledWith([]);
  });

  it('disables the last visible column and ignores unknown hidden ids', () => {
    const onHiddenColumnsChange = vi.fn();
    renderMenu({ hiddenColumns: ['gone', 'city', 'zip'], onHiddenColumnsChange });
    expect(screen.getByRole('checkbox', { name: 'Name' })).toBeDisabled();
    expect(screen.getByRole('checkbox', { name: 'City' })).toBeEnabled();
    fireEvent.click(screen.getByRole('checkbox', { name: 'Postal code' }));
    expect(onHiddenColumnsChange).toHaveBeenCalledWith(['gone', 'city']);
  });

  it('places the panel under the trigger, flips it when it does not fit, and follows scroll', () => {
    vi.spyOn(document.documentElement, 'clientWidth', 'get').mockReturnValue(1000);
    vi.spyOn(document.documentElement, 'clientHeight', 'get').mockReturnValue(800);
    renderMenu();
    const panel = screen.getByRole('group', { name: 'Columns' });
    const rect = vi
      .spyOn(screen.getByRole('button', { name: 'Columns' }), 'getBoundingClientRect')
      .mockReturnValue({ top: 100, bottom: 140, right: 900 } as DOMRect);
    const size = vi
      .spyOn(panel, 'getBoundingClientRect')
      .mockReturnValue({ width: 0, height: 0 } as DOMRect);
    toggle(panel, 'beforetoggle', 'open');
    expect(panel.style.top).toBe('140px');
    expect(panel.style.bottom).toBe('auto');
    expect(panel.style.right).toBe('100px');
    expect(panel.style.getPropertyValue('--_space')).toBe('660px');

    size.mockReturnValue({ width: 240, height: 300 } as DOMRect);
    rect.mockReturnValue({ top: 700, bottom: 740, right: 200 } as DOMRect);
    toggle(panel, 'toggle', 'open');
    expect(panel.style.top).toBe('auto');
    expect(panel.style.bottom).toBe('100px');
    expect(panel.style.right).toBe('760px');
    expect(panel.style.getPropertyValue('--_space')).toBe('700px');

    rect.mockReturnValue({ top: 100, bottom: 140, right: 900 } as DOMRect);
    fireEvent.scroll(document);
    expect(panel.style.top).toBe('140px');
    fireEvent(window, new Event('resize'));
    expect(rect).toHaveBeenCalledTimes(4);
    fireEvent.scroll(panel);
    expect(rect).toHaveBeenCalledTimes(4);

    toggle(panel, 'toggle', 'closed');
    fireEvent.scroll(document);
    fireEvent(window, new Event('resize'));
    expect(rect).toHaveBeenCalledTimes(4);
  });
});
