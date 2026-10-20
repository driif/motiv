import { fireEvent, render, screen } from '@testing-library/react';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { ElasticTabs } from './ElasticTabs';

const tabs = [
  { value: 'overview', label: 'Overview' },
  { value: 'activity', label: 'Activity' },
  { value: 'settings', label: 'Settings' },
];
const panels = { overview: 'Totals', activity: 'Recent events', settings: 'Preferences' };

function Controlled() {
  const [value, setValue] = useState('overview');
  return (
    <ElasticTabs label="Project" tabs={tabs} value={value} onChange={setValue} panels={panels} />
  );
}

describe('ElasticTabs', () => {
  it('is a tablist whose selected tab controls its panel', () => {
    render(
      <ElasticTabs
        label="Project"
        tabs={tabs}
        value="activity"
        onChange={vi.fn()}
        panels={panels}
        className="x"
        data-testid="t"
      />,
    );
    expect(screen.getByTestId('t')).toHaveClass('motiv-elastic-tabs', 'x');
    expect(screen.getByRole('tablist', { name: 'Project' })).toBeInTheDocument();
    const tab = screen.getByRole('tab', { name: 'Activity' });
    expect(tab).toHaveAttribute('aria-selected', 'true');
    expect(tab).toHaveAttribute('tabindex', '0');
    const panel = document.getElementById(tab.getAttribute('aria-controls') ?? '');
    expect(panel).toHaveTextContent('Recent events');
    expect(panel).toHaveAttribute('data-position', 'current');
    expect(panel).toHaveAttribute('aria-labelledby', tab.id);
  });

  it('works without panels', () => {
    render(<ElasticTabs label="Project" tabs={tabs} value="overview" onChange={vi.fn()} />);
    expect(screen.queryByRole('tabpanel')).toBeNull();
    expect(screen.getByRole('tab', { name: 'Overview' })).not.toHaveAttribute('aria-controls');
  });

  it('moves with arrows (wrapping), Home and End', () => {
    render(<Controlled />);
    const overview = screen.getByRole('tab', { name: 'Overview' });
    fireEvent.keyDown(overview, { key: 'ArrowLeft' });
    const settings = screen.getByRole('tab', { name: 'Settings' });
    expect(settings).toHaveAttribute('aria-selected', 'true');
    expect(settings).toHaveFocus();
    fireEvent.keyDown(settings, { key: 'Home' });
    expect(overview).toHaveAttribute('aria-selected', 'true');
    fireEvent.keyDown(overview, { key: 'End' });
    expect(settings).toHaveAttribute('aria-selected', 'true');
  });
});
