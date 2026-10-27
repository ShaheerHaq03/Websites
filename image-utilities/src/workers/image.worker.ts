import { inspect, processImage } from '../lib/engine';
import type { ImageSettings } from '../lib/types';
self.onmessage = async (
  event: MessageEvent<{
    kind: 'inspect' | 'process';
    blob: Blob;
    settings?: ImageSettings;
    metadata?: boolean;
  }>,
) => {
  try {
    const result =
      event.data.kind === 'inspect'
        ? await inspect(event.data.blob, event.data.metadata)
        : await processImage(event.data.blob, event.data.settings!, (message) =>
            self.postMessage({ progress: message }),
          );
    self.postMessage({ result });
  } catch (error) {
    self.postMessage({
      error:
        error instanceof Error
          ? error.message
          : 'Unable to process this image.',
    });
  }
};
