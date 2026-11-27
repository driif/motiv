import { Splitter } from '@driif/motiv/matrix';
import { useRef, useState } from 'react';

export function SplitterDemo() {
  const [sidebar, setSidebar] = useState(256);
  const [rows, setRows] = useState(0.6);
  const rowSplit = useRef<HTMLDivElement>(null);

  return (
    <div style={{ width: '100%', minWidth: 0 }}>
      <p>Drag a divider, or focus it and use arrow keys, Home and End. Escape cancels a drag.</p>
      <p>
        Double-click the sidebar divider to reset it to 256px. Scroll sideways on small screens.
      </p>
      <div style={{ overflowX: 'auto', padding: 'var(--motiv-space)' }}>
        <div
          style={{
            display: 'flex',
            minWidth: '60rem',
            height: '24rem',
            background: 'var(--motiv-color-surface)',
          }}
        >
          <aside style={{ flex: `0 0 ${sidebar}px`, overflow: 'auto' }}>
            <h3>Sidebar</h3>
            <p>{sidebar}px · 200–480px</p>
          </aside>
          <Splitter
            label="Sidebar width"
            aria-valuetext={`${sidebar} pixels`}
            value={sidebar}
            min={200}
            max={480}
            onChange={setSidebar}
            onDoubleClick={() => setSidebar(256)}
          />
          <div
            ref={rowSplit}
            style={{
              display: 'grid',
              flex: 1,
              minWidth: 0,
              minHeight: 0,
              gridTemplateRows: `minmax(0, ${rows}fr) auto minmax(0, ${1 - rows}fr)`,
            }}
          >
            <section style={{ overflow: 'auto' }}>
              <h3>Preview</h3>
              <p>{Math.round(rows * 100)}% of the workspace</p>
            </section>
            <Splitter
              label="Preview height"
              orientation="horizontal"
              aria-valuetext={`${Math.round(rows * 100)} percent`}
              value={rows}
              min={0.1}
              max={0.9}
              step={0.01}
              onChange={setRows}
              getValueFromDelta={(delta, start) => {
                const height = rowSplit.current?.getBoundingClientRect().height;
                return height ? start + delta / height : start;
              }}
            />
            <section style={{ overflow: 'auto' }}>
              <h3>Console</h3>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
