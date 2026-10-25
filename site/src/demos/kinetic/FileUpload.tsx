import { FileUpload } from '@driif/motiv';
import { useRef } from 'react';

export function FileUploadDemo() {
  const failed = useRef(false);
  return (
    <div style={{ width: '100%' }}>
      <p>Choose files to simulate uploads. The first one fails once; retry it.</p>
      <FileUpload
        multiple
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
    </div>
  );
}
