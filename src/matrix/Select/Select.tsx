import type { SelectProps } from '../../drawn/Select';
import { TerminalSelect } from '../TerminalSelect';

// TerminalSelect's `prefix` is display text, not the HTML attribute, and its root can't take it.
export function Select({ placeholder = 'Select…', prefix: _prefix, ...props }: SelectProps) {
  return <TerminalSelect {...props} placeholder={placeholder} />;
}
