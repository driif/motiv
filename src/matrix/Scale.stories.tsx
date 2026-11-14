import type { Meta, StoryObj } from '@storybook/react-vite';
import { expectFamiliesScaled, type Family, ScaleFrames, sample } from '../../.storybook/scale';
import { withMatrix } from '../../.storybook/withMatrix';
import { Button } from './Button';
import { Checkbox } from './Checkbox';
import { CommandMenu } from './CommandMenu';
import { IconButton } from './IconButton';
import { MultiSelect } from './MultiSelect';
import { Nav } from './Nav';
import { RadioGroup } from './Radio';
import { SegmentedControl } from './SegmentedControl';
import { Select } from './Select';
import { Switch } from './Switch';
import { Tabs } from './Tabs';
import { TextField } from './TextField';

const { noop, options } = sample;

const families: Family[] = [
  { name: 'Button', render: () => <Button>Save</Button>, box: '.motiv-matrix-btn' },
  {
    name: 'IconButton',
    render: () => <IconButton icon="+" label="Add" />,
    box: '.motiv-matrix-icon-button',
    boxOnly: true,
  },
  {
    name: 'TextField',
    render: () => <TextField label="Name" />,
    box: '.motiv-matrix-text-field__control',
    text: '.motiv-matrix-text-field__label',
  },
  {
    name: 'Select',
    render: () => <Select label="Role" options={options} value="" onChange={noop} />,
    box: '.motiv-matrix-term__trigger',
    open: '.motiv-matrix-term__trigger',
    row: '.motiv-matrix-term__option',
  },
  {
    name: 'MultiSelect',
    render: () => <MultiSelect label="Permissions" options={options} value={[]} onChange={noop} />,
    box: '.motiv-matrix-multi-select__trigger',
    open: '.motiv-matrix-multi-select__trigger',
    row: '.motiv-matrix-multi-select__option',
  },
  {
    name: 'Checkbox',
    render: () => <Checkbox label="Remember me" />,
    box: '.motiv-matrix-checkbox',
  },
  {
    name: 'Radio',
    render: () => (
      <RadioGroup name="radio" legend="Access" options={options} value="read" onChange={noop} />
    ),
    box: '.motiv-matrix-radio',
  },
  {
    name: 'Switch',
    render: () => <Switch label="Notifications" checked onChange={noop} />,
    box: '.motiv-matrix-switch',
  },
  {
    name: 'SegmentedControl',
    render: () => <SegmentedControl label="View" options={options} value="read" onChange={noop} />,
    box: '.motiv-matrix-segmented__option',
  },
  {
    name: 'Tabs',
    render: () => <Tabs label="Sections" items={sample.tabs} value="one" onChange={noop} />,
    box: '.motiv-matrix-hudtabs__tab',
  },
  {
    name: 'CommandMenu',
    render: () => <CommandMenu commands={sample.commands} />,
    box: '.motiv-matrix-command-menu__launcher',
    open: '.motiv-matrix-command-menu__launcher',
    row: '.motiv-matrix-command-menu__item',
  },
  {
    name: 'Nav',
    render: () => <Nav label="Mail" items={sample.nav} value="inbox" onChange={noop} />,
    box: '.motiv-matrix-chevnav__item',
  },
];

const meta = {
  title: 'Matrix/Scale',
  decorators: [withMatrix],
  render: () => <ScaleFrames families={families} />,
  play: ({ canvasElement }) => expectFamiliesScaled(canvasElement, families),
} satisfies Meta;

export default meta;

/** Every control family at default and compact density, with and without a scoped larger font. */
export const Scale: StoryObj<typeof meta> = {};
