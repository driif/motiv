import { MultiSelect } from '@driif/motiv';
import { useState } from 'react';

const options = [
  { value: 'read', label: 'Read entries', hint: 'View submitted forms' },
  { value: 'write', label: 'Edit entries', hint: 'Update existing forms' },
  { value: 'publish', label: 'Publish forms' },
  { value: 'archive', label: 'Archive entries' },
  { value: 'delete', label: 'Delete entries' },
  { value: 'export', label: 'Export entries' },
  { value: 'manage', label: 'Manage permissions' },
];

export function MultiSelectDemo() {
  const [permissions, setPermissions] = useState(['read', 'write']);
  return (
    <div style={{ width: '100%', maxWidth: '24rem', minHeight: '28rem' }}>
      <MultiSelect
        label="Permissions"
        options={options}
        value={permissions}
        onChange={setPermissions}
        name="permissions"
      />
    </div>
  );
}
