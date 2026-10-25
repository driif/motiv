// @vitest-environment node
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import * as D from './drawn';
import {
  Checkbox,
  Button as DrawnButton,
  Card as DrawnCard,
  CardHeader as DrawnCardHeader,
  HoldToConfirmButton,
  IconButton,
  IconButtonGroup,
  InkSplatterButton,
  Link,
  MenuButton,
  Nav,
  NavItem,
  OrbitalThemeToggle,
  Progress,
  RadioGroup,
  SegmentedControl,
  Select,
  Slider,
  Switch,
  Tabs,
  Textarea,
  TextField,
  ThemeToggle,
  Tooltip,
} from './drawn';
import * as K from './index';
import { Button, Card, CardBody, CardHeader } from './index';
import * as M from './matrix';

it('renders FileUpload and imports putFile without a DOM or XHR', () => {
  const html = renderToStaticMarkup(<K.FileUpload upload={async () => {}} />);
  expect(html).toContain('type="file"');
  expect(html).toContain('Choose files');
  expect(html).toContain('aria-live="polite"');
  expect(K.putFile).toBeTypeOf('function');
});

describe('server rendering', () => {
  it('keeps Toaster empty and toast calls inert without a DOM', () => {
    const before = renderToStaticMarkup(<K.Toaster />);
    const id = K.toast({ tone: 'error', title: 'Request-specific error' });
    K.dismissToast(id);
    const after = renderToStaticMarkup(<K.Toaster />);
    expect(after).toBe(before);
    expect(after).toContain('role="status"');
    expect(after).toContain('role="alert"');
    expect(after).toContain('aria-label="Notifications"');
    expect(after).not.toContain('<li');
    expect(after).not.toContain('Request-specific error');
  });

  it.each([false, true])('renders Confirm without opening a non-modal dialog (open=%s)', (open) => {
    const html = renderToStaticMarkup(
      <K.Confirm
        open={open}
        title="Delete project?"
        slug="my-project"
        onConfirm={() => {}}
        onCancel={() => {}}
      >
        <ul>
          <li>3 bindings</li>
        </ul>
      </K.Confirm>,
    );
    expect(html).toContain('<dialog');
    expect(html).not.toContain(' open=');
    expect(html).toContain('Delete project?');
    expect(html).toContain('<ul><li>3 bindings</li></ul>');
    expect(html).toMatch(/aria-labelledby="([^"]+)".*?<h2 id="\1"/);
  });

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

  it('renders the drawn Button and Card without a DOM', () => {
    const html = renderToStaticMarkup(
      <DrawnCard interactive>
        <DrawnCardHeader title="T" />
        <DrawnButton loading>Go</DrawnButton>
      </DrawnCard>,
    );
    expect(html).toContain(
      'class="motiv-card motiv-card--elevated motiv-card--p-md motiv-card--interactive"',
    );
    expect(html).toContain('aria-busy="true"');
    expect(html).toContain('motiv-btn__spinner');
  });

  it('renders the drawn OrbitalThemeToggle without a DOM', () => {
    const html = renderToStaticMarkup(<OrbitalThemeToggle dark onToggle={() => {}} />);
    expect(html).toContain('class="motiv-orbital-toggle motiv-orbital-toggle--dark"');
    expect(html).toContain('aria-pressed="true"');
    expect(html).toMatch(/<filter id="(motiv-ink-[^"]+)".*filter:url\(#\1\)/);
  });

  it('renders the drawn Tooltip and effect buttons without a DOM', () => {
    const html = renderToStaticMarkup(
      <>
        <Tooltip content="Note" />
        <InkSplatterButton successLabel="Sent">Send</InkSplatterButton>
        <HoldToConfirmButton onConfirm={() => {}} />
      </>,
    );
    expect(html).toMatch(/aria-describedby="([^"]+)".*role="tooltip" id="\1"/);
    expect(html).toContain('aria-live="polite"');
    expect(html).toContain('aria-live="assertive"');
  });

  it('renders the drawn Switch, Slider and Textarea without a DOM', () => {
    const html = renderToStaticMarkup(
      <>
        <Switch label="Wi-Fi" checked onChange={() => {}} />
        <Slider label="Budget" value={40} onChange={() => {}} marks={[0, 100]} />
        <Textarea label="Message" hint="Hint" />
      </>,
    );
    expect(html).toContain('role="switch"');
    expect(html).toContain('aria-valuetext="40"');
    expect(html).toMatch(/<textarea aria-describedby="[^"]+-hint"/);
  });
  it('renders the kinetic components without a DOM', () => {
    const noop = () => {};
    const options = [
      { value: 'tea', label: 'Tea', hint: 'Hot' },
      { value: 'coffee', label: 'Coffee' },
    ];
    const html = renderToStaticMarkup(
      <>
        <K.MagneticButton>Go</K.MagneticButton>
        <K.MorphSubmitButton onAction={noop} />
        <K.BellButton count={3} />
        <K.BadgeButton count={120} label="Inbox" />
        <K.CopyField value="token" />
        <K.RadialMenu actions={[{ id: 'a', label: 'Add', icon: '+', onSelect: noop }]} />
        <K.IconButtonGroup label="Tools">
          <K.IconButton icon="✎" label="Edit" />
        </K.IconButtonGroup>
        <K.MenuButton open onToggle={noop} />
        <K.ThemeToggle dark onToggle={noop} />
        <K.SegmentedControl label="Drink" options={options} value="tea" onChange={noop} />
        <K.ElasticTabs
          label="Drinks"
          tabs={options}
          value="tea"
          onChange={noop}
          panels={{ tea: 'Hot', coffee: 'Strong' }}
        />
        <K.FilterChips label="Drinks" options={options} value={['tea']} onChange={noop} />
        <K.RadioGroup name="d" legend="Drink" options={options} value="tea" onChange={noop} />
        <K.Stepper label="Guests" value={2} onChange={noop} />
        <K.CommandMenu commands={[{ id: 'n', label: 'New', onSelect: noop }]} hotkey />
        <K.FloatingField label="Email" hint="Hint" />
        <K.OtpInput label="Code" value="12" onChange={noop} />
        <K.ExpandingSearch value="" onChange={noop} suggestions={['Billing']} />
        <K.FrequencySlider label="Volume" value={40} onChange={noop} />
        <K.MomentumSlider label="Budget" value={40} onChange={noop} marks={[0, 100]} />
        <K.LiquidSwitch label="Wi-Fi" checked onChange={noop} />
        <K.Switch label="Wi-Fi" checked onChange={noop} />
        <K.Slider label="Budget" value={40} onChange={noop} />
        <K.SpringCheckbox label="Subscribe" defaultChecked />
        <K.Checkbox label="Subscribe" defaultChecked />
        <K.TextField label="Name" hint="Hint" aria-describedby="err" />
        <K.Progress value={40} label="Upload" />
        <K.LikeButton liked count={12} onToggle={noop} />
        <K.MuteToggle muted onChange={noop} />
        <K.SlipCard title="T" description="D" note="N" />
        <K.Accordion items={[{ id: 'a', title: 'Q', content: 'A' }]} defaultOpen={['a']} />
        <K.Carousel label="Plans" slides={[{ id: 'a', label: 'A', content: 'Slide' }]} />
        <K.GlideNav label="Main" items={[{ id: 'a', label: 'Home' }]} value="a" onChange={noop} />
        <K.StepProgress
          steps={[
            { id: 'a', label: 'One' },
            { id: 'b', label: 'Two' },
          ]}
          current={1}
        />
        <K.DrillStack
          path={[
            { id: 'r', name: 'root' },
            { id: 'c', name: 'child' },
          ]}
          onNavigate={noop}
        />
        <K.ProgressRing label="Upload" value={40} />
        <K.Odometer value={42} />
      </>,
    );
    expect(html).toContain('role="switch"');
    expect(html).toContain('role="tablist"');
    expect(html).toContain('role="spinbutton"');
    expect(html).toContain('aria-valuenow="40"');
    expect(html).toContain('Ctrl K');
    expect(html).toContain('aria-current="step"');
    expect(html).toMatch(/aria-describedby="err [^"]+-hint"/);
    expect(html).toContain('class="motiv-bar"');
  });

  it('renders GlideNav links with the static active bar hook', () => {
    const html = renderToStaticMarkup(
      <K.GlideNav
        label="Main"
        items={[{ id: 'a', label: 'Home', href: '/' }]}
        value="a"
        onChange={() => {}}
      />,
    );
    expect(html).toContain('<a href="/" class="motiv-glide-nav__item" aria-current="page">');
    expect(html).not.toContain('data-placed');
  });

  it('exports the generic names as aliases of the flavored components', () => {
    expect(K.Checkbox).toBe(K.SpringCheckbox);
    expect(M.ThemeToggle).toBe(M.GlitchThemeToggle);
    expect(M.MenuButton).toBe(M.SignalBurger);
  });
  it('renders the matrix components without a DOM', () => {
    const noop = () => {};
    const options = [
      { value: 'oidc', label: 'OIDC', code: 'OIDC', hint: 'SSO' },
      { value: 'ldap', label: 'LDAP' },
    ];
    const html = renderToStaticMarkup(
      <>
        <M.Card interactive>
          <M.CardHeader title="T" />
          <M.CardBody>
            <M.Button loading>Go</M.Button>
          </M.CardBody>
          <M.CardFooter />
        </M.Card>
        <M.IconButtonGroup label="Tools">
          <M.IconButton icon="✎" label="Edit" />
        </M.IconButtonGroup>
        <M.TextField label="Email" hint="Hint" />
        <M.Checkbox label="Subscribe" defaultChecked />
        <M.RadioGroup name="d" legend="Drink" options={options} value="oidc" onChange={noop} />
        <M.Progress value={40} label="Upload" />
        <M.Link href="https://example.com" external>
          Example
        </M.Link>
        <M.GlitchThemeToggle dark onToggle={noop} />
        <M.ScanButton>Scan</M.ScanButton>
        <M.TerminalSelect label="Auth" options={options} value="oidc" onChange={noop} name="a" />
        <M.DecodeSecretField label="Token" value="secret" onChange={noop} />
        <M.SignalBurger open onToggle={noop} />
        <M.MenuButton open={false} onToggle={noop} />
        <M.ThemeToggle dark={false} onToggle={noop} />
        <M.HudTabs
          label="Tabs"
          tabs={options}
          value="ldap"
          onChange={noop}
          panels={{ oidc: 'A' }}
        />
        <M.Switch label="Wi-Fi" checked onChange={noop} />
        <M.Slider label="Budget" value={40} onChange={noop} marks={[0, 100]} />
        <M.Textarea label="Message" hint="Hint" />
        <M.ChevronNav
          label="Main"
          sections={[{ title: 'S', items: [{ id: 'a', label: 'A', expandable: true }] }]}
          value="a"
          onChange={noop}
        />
      </>,
    );
    expect(html).toContain('motiv-matrix-btn__spinner');
    expect(html).toContain('aria-valuenow="40"');
    expect(html).toContain('aria-pressed="true"');
    expect(html).toContain('role="combobox"');
    expect(html).toContain('<input type="hidden" name="a" value="oidc"/>');
    expect(html).toContain('type="password"');
    expect(html).toContain('aria-expanded="true"');
    expect(html).toContain('aria-expanded="false"');
    expect(html).toContain('aria-pressed="false"');
    expect(html).toContain('TARGET 02 / 02');
    expect(html).toContain('aria-current="page"');
    expect(html).toContain('role="switch"');
    expect(html).toContain('aria-valuetext="40"');
    expect(html).toContain('<textarea');
  });

  it('renders Nav and Tabs in all three styles without a DOM', () => {
    const noop = () => {};
    const items = [
      { id: 'a', label: 'Inbox', count: 4 },
      { id: 'b', label: 'Sent' },
    ];
    const tabs = [{ value: 'a', label: 'A', panel: 'Panel A' }];
    const html = renderToStaticMarkup(
      <>
        <K.Nav label="Main" items={items} value="b" onChange={noop} />
        <Nav label="Main" items={items} value="b" onChange={noop} />
        <M.Nav label="Main" items={items} value="b" onChange={noop} />
        <K.Tabs label="T" items={tabs} value="a" onChange={noop} />
        <M.Tabs label="T" items={tabs} value="a" onChange={noop} />
      </>,
    );
    expect(html.match(/aria-current="page"/g)).toHaveLength(3);
    expect(html.match(/role="tablist"/g)).toHaveLength(2);
    expect(html.match(/Panel A/g)).toHaveLength(2);
  });

  it('renders Select and Tooltip in kinetic and matrix without a DOM', () => {
    const noop = () => {};
    const options = [{ value: 'tea', label: 'Tea' }];
    const html = renderToStaticMarkup(
      <>
        <K.Select label="Drink" options={options} value="tea" onChange={noop} name="k" />
        <M.Select label="Drink" options={options} value="" onChange={noop} name="m" />
        <K.Tooltip content="Note" />
        <M.Tooltip content="Note" />
      </>,
    );
    expect(html.match(/role="combobox"/g)).toHaveLength(2);
    expect(html).toContain('<input type="hidden" name="k" value="tea"/>');
    expect(html).toContain('Select…');
    expect(html.match(/aria-describedby="([^"]+)".*?role="tooltip" id="\1"/g)).toHaveLength(2);
  });

  it('renders Accordion, Stepper and Carousel in drawn and matrix without a DOM', () => {
    const noop = () => {};
    const items = [{ id: 'a', title: 'Q', content: 'Answer' }];
    const slides = [{ id: 'a', label: 'A', content: 'Slide' }];
    const html = renderToStaticMarkup(
      <>
        <D.Accordion items={items} defaultOpen={['a']} />
        <M.Accordion items={items} defaultOpen={['a']} />
        <D.Stepper label="Guests" value={2} onChange={noop} />
        <M.Stepper label="Guests" value={2} onChange={noop} />
        <D.Carousel label="Plans" slides={slides} />
        <M.Carousel label="Plans" slides={slides} />
      </>,
    );
    expect(html.match(/aria-expanded="true"/g)).toHaveLength(2);
    expect(html.match(/role="spinbutton"/g)).toHaveLength(2);
    expect(html).toContain('>02</div>');
    expect(html.match(/aria-roledescription="carousel"/g)).toHaveLength(2);
    expect(html).toContain('[01/01]');
  });
  it('renders SegmentedControl, Link and Chips in their new styles without a DOM', () => {
    const noop = () => {};
    const options = [
      { value: 'tea', label: 'Tea', hint: 'Hot' },
      { value: 'coffee', label: 'Coffee' },
    ];
    const html = renderToStaticMarkup(
      <>
        <D.SegmentedControl label="Drink" options={options} value="tea" onChange={noop} />
        <M.SegmentedControl label="Drink" options={options} value="tea" onChange={noop} />
        <K.Link href="https://example.com" external>
          Example
        </K.Link>
        <K.Chips label="Drinks" options={options} value={['tea']} onChange={noop} />
        <D.Chips label="Drinks" options={options} value={['tea']} onChange={noop} />
        <M.Chips label="Drinks" options={options} value={['tea']} onChange={noop} />
      </>,
    );
    expect(html.match(/role="radiogroup"/g)).toHaveLength(2);
    expect(html.match(/data-active="true"/g)).toHaveLength(2);
    expect(html).toContain('class="motiv-underline-link"');
    expect(html).toContain('rel="noopener noreferrer"');
    expect(html.match(/aria-pressed="true"/g)).toHaveLength(3);
    expect(html.match(/1 of 2 selected/g)).toHaveLength(3);
  });

  it('renders OtpInput and CommandMenu in their new styles without a DOM', () => {
    const noop = () => {};
    const commands = [{ id: 'n', label: 'New', onSelect: noop }];
    const html = renderToStaticMarkup(
      <>
        <D.OtpInput label="Code" value="12" onChange={noop} status="success" />
        <M.OtpInput label="Code" value="12" onChange={noop} status="error" />
        <D.CommandMenu commands={commands} hotkey />
        <M.CommandMenu commands={commands} hotkey />
      </>,
    );
    expect(html).toContain('class="motiv-sketch-otp" data-status="success"');
    expect(html).toContain('class="motiv-matrix-otp" data-status="error"');
    expect(html.match(/autoComplete="one-time-code"/g)).toHaveLength(2);
    expect(html.match(/role="menu"/g)).toHaveLength(2);
    expect(html.match(/Ctrl K/g)).toHaveLength(2);
  });
});
