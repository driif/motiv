import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Select } from './Select';

const options = [
  { value: 'oidc', label: 'OIDC', hint: 'Single sign-on' },
  { value: 'ldap', label: 'LDAP' },
];

describe('Select', () => {
  it('renders TerminalSelect with the drawn Select props', () => {
    const onChange = vi.fn();
    const { container } = render(
      <Select label="Auth" options={options} value="" onChange={onChange} name="a" className="x" />,
    );
    const combobox = screen.getByRole('combobox', { name: 'Auth' });
    expect(container.firstChild).toHaveClass('motiv-matrix-term', 'x');
    expect(combobox).toHaveTextContent('Select…');
    fireEvent.click(combobox);
    fireEvent.click(screen.getByRole('option', { name: /LDAP/ }));
    expect(onChange).toHaveBeenCalledWith('ldap');
    expect(document.querySelector('input[name="a"]')).toHaveValue('');
  });

  it('does not render the HTML prefix attribute as text', () => {
    render(<Select label="Auth" options={options} value="oidc" onChange={vi.fn()} prefix="og" />);
    expect(screen.getByRole('combobox', { name: 'Auth' })).toHaveTextContent(/^OIDC$/);
  });
});
