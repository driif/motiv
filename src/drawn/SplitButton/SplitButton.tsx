import { SplitButtonBase, type SplitButtonProps } from '../../components/SplitButton/SplitButton';
import { Button } from '../Button';

export function SplitButton(props: SplitButtonProps) {
  return <SplitButtonBase {...props} Button={Button} prefix="motiv-sketch" />;
}
