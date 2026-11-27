import {
  SplitButtonBase,
  type SplitButtonClassNames,
  type SplitButtonProps,
} from '../../components/SplitButton/SplitButton';
import { actionMenuClassNames } from '../ActionMenu/ActionMenu';
import { Button } from '../Button';

const splitButtonClassNames: SplitButtonClassNames = {
  root: 'motiv-sketch-split-button',
  main: 'motiv-sketch-split-button__main',
  toggle: 'motiv-sketch-split-button__toggle',
};

export function SplitButton(props: SplitButtonProps) {
  return (
    <SplitButtonBase
      {...props}
      Button={Button}
      classNames={splitButtonClassNames}
      menuClassNames={actionMenuClassNames}
    />
  );
}
