import { ExpandingSearch } from '@driif/motiv';
import { useState } from 'react';

const files = ['invoices/2026', 'income-report.pdf', 'tax-documents', 'receipts'];

export function ExpandingSearchDemo() {
  const [query, setQuery] = useState('');
  const [opened, setOpened] = useState<string>();
  return (
    <div style={{ display: 'grid', gap: '1rem', minHeight: '16rem', alignContent: 'start' }}>
      <ExpandingSearch
        value={query}
        onChange={setQuery}
        onSubmit={setOpened}
        onSuggestionSelect={setOpened}
        suggestions={files}
        label="Search files"
      />
      <p style={{ margin: 0 }}>{opened ? `Opened ${opened}` : 'Nothing opened yet.'}</p>
    </div>
  );
}
