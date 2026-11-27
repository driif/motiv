import {
  ActionMenuBase,
  type ActionMenuClassNames,
  type ActionMenuProps,
} from '../../components/ActionMenu/ActionMenu';
import { Button } from '../Button';

export const actionMenuClassNames: ActionMenuClassNames = {
  content: 'motiv-sketch-action-menu__content',
  item: 'motiv-sketch-action-menu__item',
  icon: 'motiv-sketch-action-menu__icon',
  text: 'motiv-sketch-action-menu__text',
  reason: 'motiv-sketch-action-menu__reason',
  chevron: 'motiv-sketch-action-menu__chevron',
};

export function ActionMenu(props: ActionMenuProps) {
  return <ActionMenuBase {...props} Button={Button} classNames={actionMenuClassNames} />;
}
