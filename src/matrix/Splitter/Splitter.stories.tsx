import type { Meta, StoryObj } from '@storybook/react-vite';
import { useRef, useState } from 'react';
import { ThemePair } from '../../../.storybook/ThemePair';
import { withMatrix } from '../../../.storybook/withMatrix';
import { Splitter } from './Splitter';

function Demo({ horizontal = false, percent = false }) {
  const [value, setValue] = useState(percent ? 0.5 : 256);
  const container = useRef<HTMLDivElement>(null);
  const tracks = percent ? `${value}fr auto ${1 - value}fr` : `${value}px auto 1fr`;
  return (
    <div
      ref={container}
      style={{
        display: 'grid',
        width: horizontal ? 320 : 600,
        height: horizontal ? 600 : 200,
        gridTemplateColumns: horizontal ? undefined : tracks,
        gridTemplateRows: horizontal ? tracks : undefined,
      }}
    >
      <div style={{ overflow: 'auto' }}>
        First pane: {percent ? `${Math.round(value * 100)}%` : `${value}px`}
      </div>
      <Splitter
        label={horizontal ? 'First pane height' : 'First pane width'}
        orientation={horizontal ? 'horizontal' : 'vertical'}
        value={value}
        min={percent ? 0.1 : 200}
        max={percent ? 0.9 : 480}
        step={percent ? 0.01 : 1}
        onChange={setValue}
        getValueFromDelta={
          percent
            ? (delta, start) => {
                const rect = container.current?.getBoundingClientRect();
                const size = horizontal ? rect?.height : rect?.width;
                return size ? start + delta / size : start;
              }
            : undefined
        }
      />
      <div style={{ overflow: 'auto' }}>Second pane</div>
    </div>
  );
}

const meta = {
  title: 'Matrix/Splitter',
  component: Splitter,
  decorators: [withMatrix],
  args: { label: 'Sidebar width', value: 256, min: 200, max: 480, onChange: () => {} },
  render: () => <Demo />,
} satisfies Meta<typeof Splitter>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Pixels: Story = {};
export const HorizontalPercent: Story = { render: () => <Demo horizontal percent /> };
export const Themes: Story = { render: () => <ThemePair>{() => <Demo percent />}</ThemePair> };
