import { Select } from '@driif/motiv/drawn';
import { useState } from 'react';

const options = [
  { value: 'en', label: 'English', code: 'EN', hint: 'Default language' },
  { value: 'de', label: 'Deutsch', code: 'DE', hint: 'German' },
  { value: 'uk', label: 'Українська', code: 'UK', hint: 'Ukrainian' },
];

export function SelectDemo() {
  const [language, setLanguage] = useState('');
  return (
    <div style={{ display: 'grid', alignContent: 'start', width: '18rem', minHeight: '17rem' }}>
      <Select
        label="Language"
        options={options}
        value={language}
        onChange={setLanguage}
        clearable
      />
    </div>
  );
}
