import type { Meta, StoryObj } from '@storybook/react-vite';
import type { CSSProperties } from 'react';
import { ThemePair } from '../../../.storybook/ThemePair';
import { FileUpload, type FileUploadProps } from './FileUpload';

const uploading: FileUploadProps['upload'] = (_file, { signal, onProgress }) =>
  new Promise((_resolve, reject) => {
    onProgress(46);
    signal.addEventListener('abort', () => reject(new DOMException('Aborted', 'AbortError')), {
      once: true,
    });
  });

function selectFiles(canvas: HTMLElement, names = ['report.pdf']) {
  for (const input of canvas.querySelectorAll('input[type="file"]')) {
    const transfer = new DataTransfer();
    for (const name of names) transfer.items.add(new File(['Example content'], name));
    (input as HTMLInputElement).files = transfer.files;
    input.dispatchEvent(new Event('change', { bubbles: true }));
  }
}

const meta: Meta<typeof FileUpload> = {
  title: 'Components/FileUpload',
  component: FileUpload,
  args: { upload: async (_file, _options) => {} },
  decorators: [
    (Story) => (
      <div style={{ width: 'min(36rem, 100%)' }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Idle: Story = {};

export const Uploading: Story = {
  args: { upload: uploading },
  play: ({ canvasElement }) => selectFiles(canvasElement),
};

export const Done: Story = {
  play: ({ canvasElement }) => selectFiles(canvasElement),
};

export const Failed: Story = {
  name: 'Error',
  args: {
    upload: async () => {
      throw new Error('The upload could not be completed. Try again.');
    },
  },
  play: ({ canvasElement }) => selectFiles(canvasElement),
};

export const Multiple: Story = {
  args: {
    multiple: true,
    upload: (file, options) => {
      if (file.name === 'sending.pdf') return uploading(file, options);
      if (file.name === 'retry.pdf') return Promise.reject(new Error('Upload failed'));
      return Promise.resolve();
    },
  },
  play: ({ canvasElement }) =>
    selectFiles(canvasElement, ['uploaded.pdf', 'sending.pdf', 'retry.pdf']),
};

export const LongFilenames: Story = {
  args: { upload: uploading },
  decorators: [
    (Story) => (
      <div style={{ width: 'min(18rem, 100%)' }}>
        <Story />
      </div>
    ),
  ],
  play: ({ canvasElement }) =>
    selectFiles(canvasElement, [
      'annual-report-with-a-very-long-unbroken-filename-for-the-finance-team-2026-final.pdf',
    ]),
};

export const Disabled: Story = { args: { disabled: true } };

export const Themes: Story = {
  args: { upload: uploading },
  render: (args) => <ThemePair>{() => <FileUpload {...args} />}</ThemePair>,
  play: ({ canvasElement }) => selectFiles(canvasElement),
};

export const Rethemed: Story = {
  args: { upload: uploading },
  render: (args) => (
    <div
      data-theme="light"
      style={
        {
          '--motiv-color-primary': '#2563eb',
          '--motiv-color-on-primary': '#ffffff',
          '--motiv-button-radius': '0.25rem',
          '--motiv-progress-accent': '#2563eb',
        } as CSSProperties
      }
    >
      <FileUpload {...args} />
    </div>
  ),
  play: ({ canvasElement }) => selectFiles(canvasElement),
};
