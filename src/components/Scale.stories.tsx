import type { Meta, StoryObj } from '@storybook/react-vite';
import { expectFamiliesScaled, type Family, ScaleFrames, sample } from '../../.storybook/scale';
import { ActionMenu } from './ActionMenu';
import { Button } from './Button';
import { CommandMenu } from './CommandMenu';
import { GlideNav } from './GlideNav';
import { IconButton } from './IconButton';
import { LiquidSwitch } from './LiquidSwitch';
import { MultiSelect } from './MultiSelect';
import { RadioGroup } from './Radio';
import { SegmentedControl } from './SegmentedControl';
import { Select } from './Select';
import { SpringCheckbox } from './SpringCheckbox';
import { Tabs } from './Tabs';
import { TextField } from './TextField';

const { noop, options } = sample;

const families: Family[] = [
  { name: 'Button', render: () => <Button>Save</Button>, box: '.motiv-btn' },
  {
    name: 'IconButton',
    render: () => <IconButton icon="+" label="Add" />,
    box: '.motiv-icon-button',
    boxOnly: true,
  },
  {
    name: 'TextField',
    render: () => <TextField label="Name" />,
    box: '.motiv-float__control',
    text: '.motiv-float__label',
    field: true,
  },
  {
    name: 'Select',
    render: () => <Select label="Role" options={options} value="" onChange={noop} />,
    box: '.motiv-picker__trigger',
    open: '.motiv-picker__trigger',
    row: '.motiv-picker__option',
  },
  {
    name: 'MultiSelect',
    render: () => <MultiSelect label="Permissions" options={options} value={[]} onChange={noop} />,
    box: '.motiv-multi-select__trigger',
    open: '.motiv-multi-select__trigger',
    row: '.motiv-multi-select__option',
  },
  { name: 'Checkbox', render: () => <SpringCheckbox label="Remember me" />, box: '.motiv-check' },
  {
    name: 'Radio',
    render: () => (
      <RadioGroup name="radio" legend="Access" options={options} value="read" onChange={noop} />
    ),
    box: '.motiv-radio',
  },
  {
    name: 'Switch',
    render: () => <LiquidSwitch label="Notifications" checked onChange={noop} />,
    box: '.motiv-liquid',
  },
  {
    name: 'SegmentedControl',
    render: () => <SegmentedControl label="View" options={options} value="read" onChange={noop} />,
    box: '.motiv-segmented__option',
  },
  {
    name: 'Tabs',
    render: () => <Tabs label="Sections" items={sample.tabs} value="one" onChange={noop} />,
    box: '.motiv-elastic-tabs__tab',
  },
  {
    name: 'ActionMenu',
    render: () => <ActionMenu label="Export" items={[{ label: 'CSV', onSelect: noop }]} />,
    box: '.motiv-btn',
    open: '.motiv-btn',
    row: '.motiv-action-menu__item',
  },
  {
    name: 'CommandMenu',
    render: () => <CommandMenu commands={sample.commands} />,
    box: '.motiv-command-menu__launcher',
    open: '.motiv-command-menu__launcher',
    row: '.motiv-command-menu__item',
  },
  {
    name: 'Nav',
    render: () => <GlideNav label="Mail" items={sample.nav} value="inbox" onChange={noop} />,
    box: '.motiv-glide-nav__item',
  },
];

const meta = {
  title: 'Components/Scale',
  render: () => <ScaleFrames families={families} />,
  play: ({ canvasElement }) => expectFamiliesScaled(canvasElement, families),
} satisfies Meta;

export default meta;

/** Every control family at default and compact density, with and without a scoped larger font. */
export const Scale: StoryObj<typeof meta> = {};
