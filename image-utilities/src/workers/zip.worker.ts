import { zipSync } from 'fflate';
self.onmessage = (
  event: MessageEvent<{ files: { name: string; buffer: ArrayBuffer }[] }>,
) => {
  try {
    const files = Object.fromEntries(
      event.data.files.map((file) => [file.name, new Uint8Array(file.buffer)]),
    );
    const zip = zipSync(files, { level: 0 });
    self.postMessage({ buffer: zip.buffer }, { transfer: [zip.buffer] });
  } catch {
    self.postMessage({
      error: 'Unable to build ZIP. Download images individually.',
    });
  }
};
