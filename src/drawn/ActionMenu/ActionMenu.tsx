import { ActionMenuBase, type ActionMenuProps } from '../../components/ActionMenu/ActionMenu';
import { Button } from '../Button';

export function ActionMenu(props: ActionMenuProps) {
  return <ActionMenuBase {...props} Button={Button} prefix="motiv-sketch" />;
}
