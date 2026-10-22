import {
  Button,
  Card,
  CardBody,
  CardHeader,
  FloatingField,
  Select,
  Slider,
  SpringCheckbox,
  Switch,
  Tabs,
  Textarea,
  Tooltip,
} from '@driif/motiv';
import { useState } from 'react';
import { TokenPanel } from './TokenPanel';

const tabs = [
  { value: 'profile', label: 'Profile', panel: 'Name, avatar and bio.' },
  { value: 'alerts', label: 'Alerts', panel: 'What reaches your inbox.' },
];

const plans = [
  { value: 'free', label: 'Free', hint: 'One project.' },
  { value: 'pro', label: 'Pro', hint: 'Unlimited projects.' },
  { value: 'team', label: 'Team', hint: 'Shared billing.' },
];

export function KineticPlayground() {
  const [tab, setTab] = useState('profile');
  const [alerts, setAlerts] = useState(true);
  const [volume, setVolume] = useState(40);
  const [plan, setPlan] = useState('pro');
  return (
    <TokenPanel fallback="#756383">
      <div className="site-tokens__row">
        <Button>Primary</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="danger">Danger</Button>
      </div>
      <Card>
        <CardHeader title="Profile" description="Shown on your public page." />
        <CardBody className="site-tokens__form">
          <FloatingField label="Name" defaultValue="Ada Lovelace" />
          <Textarea label="Bio" rows={2} defaultValue="Writes notes on engines." />
        </CardBody>
      </Card>
      <div className="site-tokens__row">
        <Switch checked={alerts} onChange={setAlerts} label="Alerts" />
        <SpringCheckbox label="Weekly summary" defaultChecked />
        <Tooltip content="Sent every Monday morning." label="About the summary" />
      </div>
      <Select label="Plan" options={plans} value={plan} onChange={setPlan} />
      <Slider value={volume} onChange={setVolume} label="Volume" />
      <Tabs label="Sections" items={tabs} value={tab} onChange={setTab} />
    </TokenPanel>
  );
}
