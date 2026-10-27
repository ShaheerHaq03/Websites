import {
  limits,
  type ImageSettings,
  type ImageInfo,
  type ProcessResult,
} from './types';
export async function imageTask<T extends ImageInfo | ProcessResult>(
  blob: Blob,
  kind: 'inspect' | 'process',
  settings?: ImageSettings,
  signal?: AbortSignal,
  progress?: (text: string) => void,
): Promise<T> {
  if (signal?.aborted) throw new DOMException('Cancelled', 'AbortError');
  const fallback = async () => {
    const engine = await import('./engine');
    return (
      kind === 'inspect'
        ? await engine.inspect(blob)
        : await engine.processImage(blob, settings!, progress, signal)
    ) as T;
  };
  if (
    typeof Worker === 'undefined' ||
    typeof OffscreenCanvas === 'undefined' ||
    typeof OffscreenCanvas.prototype.convertToBlob !== 'function' ||
    typeof createImageBitmap !== 'function'
  )
    return fallback();
  try {
    return await new Promise<T>((resolve, reject) => {
      const worker = new Worker(
        new URL('../workers/image.worker.ts', import.meta.url),
        { type: 'module' },
      );
      const dispose = () => {
        worker.terminate();
        clearTimeout(timer);
        signal?.removeEventListener('abort', abort);
      };
      const abort = () => {
        dispose();
        reject(new DOMException('Cancelled', 'AbortError'));
      };
      const timer = setTimeout(() => {
        dispose();
        reject(
          new Error(
            'Processing exceeded 45 seconds. Try fewer pixels or fewer images.',
          ),
        );
      }, limits.timeout);
      signal?.addEventListener('abort', abort, { once: true });
      worker.onmessage = (
        event: MessageEvent<{ progress?: string; result?: T; error?: string }>,
      ) => {
        if (event.data.progress) {
          progress?.(event.data.progress);
          return;
        }
        dispose();
        if (event.data.error) reject(new Error(event.data.error));
        else resolve(event.data.result!);
      };
      worker.onerror = () => {
        dispose();
        reject(
          new Error(
            'Image worker failed. Try another browser or a smaller image.',
          ),
        );
      };
      worker.postMessage({ blob, kind, settings });
    });
  } catch (error) {
    if (error instanceof Error && error.message === 'WORKER_DECODE_UNAVAILABLE')
      return fallback();
    throw error;
  }
}
export async function buildZip(
  files: { name: string; blob: Blob }[],
  signal?: AbortSignal,
): Promise<Blob> {
  const check = () => {
    if (signal?.aborted) throw new DOMException('ZIP cancelled.', 'AbortError');
  };
  check();
  if (files.reduce((n, file) => n + file.blob.size, 0) > limits.batchBytes)
    throw new Error('ZIP is limited to 60 MB of image results.');
  const buffers: { name: string; buffer: ArrayBuffer }[] = [];
  for (const file of files)
    buffers.push({ name: file.name, buffer: await file.blob.arrayBuffer() });
  check();
  if (typeof Worker === 'undefined') {
    if (files.reduce((n, f) => n + f.blob.size, 0) > 10_000_000)
      throw new Error(
        'ZIP fallback is limited to 10 MB. Download images individually.',
      );
    const { zipSync } = await import('fflate');
    check();
    const bytes = zipSync(
      Object.fromEntries(
        buffers.map((file) => [file.name, new Uint8Array(file.buffer)]),
      ),
      { level: 0 },
    );
    return new Blob([bytes.slice().buffer as ArrayBuffer], {
      type: 'application/zip',
    });
  }
  return new Promise((resolve, reject) => {
    const worker = new Worker(
      new URL('../workers/zip.worker.ts', import.meta.url),
      { type: 'module' },
    );
    const timer = setTimeout(() => {
      dispose();
      reject(
        new Error('ZIP creation timed out. Download images individually.'),
      );
    }, 30_000);
    const dispose = () => {
      clearTimeout(timer);
      worker.terminate();
      signal?.removeEventListener('abort', abort);
    };
    const abort = () => {
      dispose();
      reject(new DOMException('ZIP cancelled.', 'AbortError'));
    };
    signal?.addEventListener('abort', abort, { once: true });
    worker.onmessage = (
      event: MessageEvent<{ buffer: ArrayBuffer; error?: string }>,
    ) => {
      dispose();
      if (event.data.error) reject(new Error(event.data.error));
      else resolve(new Blob([event.data.buffer], { type: 'application/zip' }));
    };
    worker.onerror = () => {
      dispose();
      reject(new Error('ZIP creation failed.'));
    };
    worker.postMessage(
      { files: buffers },
      buffers.map((file) => file.buffer),
    );
  });
}
