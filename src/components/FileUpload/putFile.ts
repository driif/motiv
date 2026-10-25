export interface PutFileOptions {
  /** Receives upload progress as a percentage from 0 to 100. */
  onProgress?: (percent: number) => void;
  signal?: AbortSignal;
  contentType?: string;
}

export function putFile(
  url: string,
  file: File,
  { onProgress, signal, contentType = file.type }: PutFileOptions = {},
): Promise<void> {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) {
      reject(new DOMException('Upload aborted', 'AbortError'));
      return;
    }
    const xhr = new XMLHttpRequest();
    const cleanup = () => {
      signal?.removeEventListener('abort', abort);
      xhr.onload = xhr.onerror = xhr.onabort = xhr.upload.onprogress = null;
    };
    const finish = (error?: Error) => {
      cleanup();
      if (error) reject(error);
      else resolve();
    };
    const abort = () => {
      finish(new DOMException('Upload aborted', 'AbortError'));
      xhr.abort();
    };
    xhr.onload = () =>
      finish(
        xhr.status >= 200 && xhr.status < 300
          ? undefined
          : new Error(`Upload failed (${xhr.status})`),
      );
    xhr.onerror = () => finish(new Error('Upload failed'));
    xhr.onabort = () => finish(new DOMException('Upload aborted', 'AbortError'));
    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable && event.total > 0) {
        onProgress?.((event.loaded / event.total) * 100);
      }
    };
    try {
      xhr.open('PUT', url);
      xhr.setRequestHeader('Content-Type', contentType);
      signal?.addEventListener('abort', abort, { once: true });
      xhr.send(file);
    } catch (error) {
      cleanup();
      reject(error);
    }
  });
}
