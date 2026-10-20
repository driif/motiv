import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { ThemePair } from '../../../.storybook/ThemePair';
import { ExpandingSearch } from './ExpandingSearch';

function Demo() {
  const [query, setQuery] = useState('');
  return (
    <div style={{ minHeight: '16rem' }}>
      <ExpandingSearch
        value={query}
        onChange={setQuery}
        suggestions={['invoices/2026', 'income-report', 'tax-documents', 'receipts']}
      />
    </div>
  );
}

const meta = {
  title: 'Components/ExpandingSearch',
  component: ExpandingSearch,
  args: { value: '', onChange: () => {} },
  render: () => <Demo />,
} satisfies Meta<typeof ExpandingSearch>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Themes: Story = { render: () => <ThemePair>{() => <Demo />}</ThemePair> };
