import { FileUpload } from '@driif/motiv';
import { useRef, useState } from 'react';

export function FileUploadDemo() {
  const failed = useRef(false);
  const nextId = useRef(1);
  const [attached, setAttached] = useState([
    { id: 'initial', name: 'Attached document.pdf', size: 10240 },
  ]);
  const [message, setMessage] = useState('');
  return (
    <div style={{ width: '100%' }}>
      <p>Choose files to simulate uploads. The first one fails once; retry it.</p>
      <FileUpload
        multiple
        attachedFiles={attached.map((file) => ({
          ...file,
          onDownload: () => setMessage(`Download ${file.name}`),
          onRemove: () => setAttached((current) => current.filter((item) => item.id !== file.id)),
        }))}
        onUploaded={(file) =>
          setAttached((current) => [
            ...current,
            { id: String(nextId.current++), name: file.name, size: file.size },
          ])
        }
        onDiscard={(file) => setMessage(`Removed ${file.name}`)}
        upload={(_file, { signal, onProgress }) => {
          const fail = !failed.current;
          failed.current = true;
          return new Promise((resolve, reject) => {
            let progress = 0;
            const abort = () => {
              window.clearInterval(timer);
              reject(new DOMException('Upload aborted', 'AbortError'));
            };
            const timer = window.setInterval(() => {
              progress += 10;
              onProgress(progress);
              if ((fail && progress === 60) || progress === 100) {
                window.clearInterval(timer);
                signal.removeEventListener('abort', abort);
                if (fail) reject(new Error('Simulated failure. Retry to finish.'));
                else resolve();
              }
            }, 200);
            signal.addEventListener('abort', abort, { once: true });
          });
        }}
      />
      {message && <p role="status">{message}</p>}
    </div>
  );
}
