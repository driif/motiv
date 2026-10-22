import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Checkbox,
  Slider,
  Switch,
  Tabs,
  Textarea,
  TextField,
} from '@driif/motiv/drawn';
import { useState } from 'react';
import { TokenPanel } from './TokenPanel';

const tabs = [
  { value: 'profile', label: 'Profile', panel: 'Name, avatar and bio.' },
  { value: 'alerts', label: 'Alerts', panel: 'What reaches your inbox.' },
];

export function DrawnPlayground() {
  const [tab, setTab] = useState('profile');
  const [alerts, setAlerts] = useState(true);
  const [volume, setVolume] = useState(40);
  return (
    <TokenPanel fallback="#1f6230">
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
          <TextField label="Name" defaultValue="Ada Lovelace" />
          <Textarea label="Bio" rows={2} defaultValue="Writes notes on engines." />
        </CardBody>
      </Card>
      <div className="site-tokens__row">
        <Switch checked={alerts} onChange={setAlerts} label="Alerts" />
        <Checkbox label="Weekly summary" defaultChecked />
      </div>
      <Slider value={volume} onChange={setVolume} label="Volume" />
      <Tabs label="Sections" items={tabs} value={tab} onChange={setTab} />
    </TokenPanel>
  );
}
