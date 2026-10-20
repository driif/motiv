// @vitest-environment node
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import {
  Checkbox,
  IconButton,
  IconButtonGroup,
  Link,
  MenuButton,
  NavItem,
  Progress,
  RadioGroup,
  SegmentedControl,
  Select,
  Tabs,
  TextField,
  ThemeToggle,
} from './drawn';
import { Button, Card, CardBody, CardHeader } from './index';

describe('server rendering', () => {
  it('renders Button and Card without a DOM', () => {
    const html = renderToStaticMarkup(
      <Card>
        <CardHeader title="T" />
        <CardBody>
          <Button loading>Go</Button>
        </CardBody>
      </Card>,
    );
    expect(html).toContain('class="motiv-card motiv-card--elevated motiv-card--p-md"');
    expect(html).toContain('aria-busy="true"');
  });

  it('renders the drawn components without a DOM', () => {
    const html = renderToStaticMarkup(
      <>
        <Link href="https://example.com" external>
          Example
        </Link>
        <TextField label="Email" hint="Hint" />
        <Checkbox label="Subscribe" defaultChecked />
        <RadioGroup
          name="drink"
          legend="Drink"
          options={[{ value: 'tea', label: 'Tea' }]}
          value="tea"
          onChange={() => {}}
        />
      </>,
    );
    expect(html).toContain('rel="noopener noreferrer"');
    expect(html).toMatch(/aria-describedby="[^"]+-hint"/);
    expect(html).toContain('class="motiv-checkbox"');
    expect(html).toContain('<legend class="motiv-radio-group__legend">Drink</legend>');
  });

  it('renders the drawn round-2 components without a DOM', () => {
    const options = [{ value: 'tea', label: 'Tea' }];
    const html = renderToStaticMarkup(
      <>
        <Tabs
          label="Drinks"
          items={[{ value: 'tea', label: 'Tea', panel: 'Hot' }]}
          value="tea"
          onChange={() => {}}
        />
        <SegmentedControl label="Drink" options={options} value="tea" onChange={() => {}} />
        <Select label="Drink" options={options} value="tea" onChange={() => {}} name="drink" />
      </>,
    );
    expect(html).toContain('role="tablist"');
    expect(html).toContain('role="radiogroup"');
    expect(html).toContain('aria-expanded="false"');
    expect(html).toContain('<input type="hidden" name="drink" value="tea"/>');
  });

  it('renders the drawn round-3 components without a DOM', () => {
    const html = renderToStaticMarkup(
      <>
        <NavItem href="/" icon="⌂" label="Home" active />
        <IconButtonGroup label="Tools">
          <IconButton icon="✎" label="Edit" />
        </IconButtonGroup>
        <MenuButton open onToggle={() => {}} />
        <ThemeToggle dark onToggle={() => {}} />
        <Progress value={40} label="Upload" />
      </>,
    );
    expect(html).toContain('aria-current="page"');
    expect(html).toContain('role="group"');
    expect(html).toContain('aria-expanded="true"');
    expect(html).toContain('aria-pressed="true"');
    expect(html).toContain('aria-valuenow="40"');
  });
});
