import {
  ActionMenuBase,
  type ActionMenuClassNames,
  type ActionMenuProps,
} from '../../components/ActionMenu/ActionMenu';
import { Button } from '../Button';

export const actionMenuClassNames: ActionMenuClassNames = {
  content: 'motiv-matrix-action-menu__content',
  item: 'motiv-matrix-action-menu__item',
  icon: 'motiv-matrix-action-menu__icon',
  text: 'motiv-matrix-action-menu__text',
  reason: 'motiv-matrix-action-menu__reason',
  chevron: 'motiv-matrix-action-menu__chevron',
};

export function ActionMenu(props: ActionMenuProps) {
  return <ActionMenuBase {...props} Button={Button} classNames={actionMenuClassNames} />;
}
