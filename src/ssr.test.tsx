// @vitest-environment node
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { Checkbox, Link, RadioGroup, TextField } from './drawn';
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
});
