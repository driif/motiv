import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { putFile } from './putFile';

class Xhr {
  static instances: Xhr[] = [];
  status = 200;
  onload: (() => void) | null = null;
  onerror: (() => void) | null = null;
  onabort: (() => void) | null = null;
  upload = { onprogress: null as ((event: Partial<ProgressEvent>) => void) | null };
  open = vi.fn();
  setRequestHeader = vi.fn();
  send = vi.fn();
  abort = vi.fn(() => this.onabort?.());

  constructor() {
    Xhr.instances.push(this);
  }
}

const file = new File(['hello'], 'hello.txt', { type: 'text/plain' });

describe('putFile', () => {
  beforeEach(() => {
    Xhr.instances = [];
    vi.stubGlobal('XMLHttpRequest', Xhr);
  });
  afterEach(() => vi.unstubAllGlobals());

  it.each([200, 201, 204, 299])('PUTs the file and resolves on %s', async (status) => {
    const result = putFile('/signed-url', file);
    const xhr = Xhr.instances[0];
    expect(xhr.open).toHaveBeenCalledWith('PUT', '/signed-url');
    expect(xhr.setRequestHeader).toHaveBeenCalledWith('Content-Type', 'text/plain');
    expect(xhr.send).toHaveBeenCalledWith(file);
    xhr.status = status;
    xhr.onload?.();
    await expect(result).resolves.toBeUndefined();
    expect(xhr.onload).toBeNull();
    expect(xhr.upload.onprogress).toBeNull();
  });

  it('overrides content type and only reports computable progress', async () => {
    const onProgress = vi.fn();
    const result = putFile('/signed-url', file, {
      contentType: 'application/octet-stream',
      onProgress,
    });
    const xhr = Xhr.instances[0];
    expect(xhr.setRequestHeader).toHaveBeenCalledWith('Content-Type', 'application/octet-stream');
    xhr.upload.onprogress?.({ lengthComputable: false, loaded: 1, total: 4 });
    xhr.upload.onprogress?.({ lengthComputable: true, loaded: 0, total: 0 });
    expect(onProgress).not.toHaveBeenCalled();
    xhr.upload.onprogress?.({ lengthComputable: true, loaded: 1, total: 4 });
    expect(onProgress).toHaveBeenCalledExactlyOnceWith(25);
    xhr.onload?.();
    await result;
  });

  it.each([0, 199, 300, 403, 500])('rejects HTTP status %s', async (status) => {
    const result = putFile('/signed-url', file);
    const xhr = Xhr.instances[0];
    xhr.status = status;
    xhr.onload?.();
    await expect(result).rejects.toThrow(`Upload failed (${status})`);
  });

  it('rejects network errors', async () => {
    const result = putFile('/signed-url', file);
    Xhr.instances[0].onerror?.();
    await expect(result).rejects.toThrow('Upload failed');
  });

  it('aborts XHR when the signal aborts', async () => {
    const controller = new AbortController();
    const result = putFile('/signed-url', file, { signal: controller.signal });
    controller.abort();
    expect(Xhr.instances[0].abort).toHaveBeenCalledTimes(1);
    await expect(result).rejects.toMatchObject({ name: 'AbortError' });
  });

  it('does not create a request for an already aborted signal', async () => {
    const controller = new AbortController();
    controller.abort();
    await expect(putFile('/signed-url', file, { signal: controller.signal })).rejects.toMatchObject(
      { name: 'AbortError' },
    );
    expect(Xhr.instances).toHaveLength(0);
  });

  it.each(['onload', 'onerror', 'onabort'] as const)(
    'cleans up listeners after %s',
    async (event) => {
      const controller = new AbortController();
      const add = vi.spyOn(controller.signal, 'addEventListener');
      const remove = vi.spyOn(controller.signal, 'removeEventListener');
      const result = putFile('/signed-url', file, { signal: controller.signal });
      const xhr = Xhr.instances[0];
      xhr[event]?.();
      if (event === 'onload') await expect(result).resolves.toBeUndefined();
      else
        await expect(result).rejects.toMatchObject({
          name: event === 'onabort' ? 'AbortError' : 'Error',
        });
      expect(remove).toHaveBeenCalledExactlyOnceWith('abort', add.mock.calls[0][1]);
      expect(xhr.onload).toBeNull();
      expect(xhr.onerror).toBeNull();
      expect(xhr.onabort).toBeNull();
      expect(xhr.upload.onprogress).toBeNull();
      controller.abort();
      expect(xhr.abort).not.toHaveBeenCalled();
    },
  );

  it('removes the abort listener if send throws synchronously', async () => {
    const controller = new AbortController();
    const remove = vi.spyOn(controller.signal, 'removeEventListener');
    vi.stubGlobal(
      'XMLHttpRequest',
      class extends Xhr {
        send = vi.fn(() => {
          throw new Error('Cannot send');
        });
      },
    );
    await expect(putFile('/signed-url', file, { signal: controller.signal })).rejects.toThrow(
      'Cannot send',
    );
    expect(remove).toHaveBeenCalledTimes(1);
    controller.abort();
    expect(Xhr.instances[0].abort).not.toHaveBeenCalled();
  });
});
