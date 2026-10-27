import { validateImage, detectImage } from './validation';
import {
  dimensions,
  fitRect,
  rotatedSize,
  cropCheck,
  compressionPolicy,
  reducedSize,
} from './math';
import {
  limits,
  type ImageSettings,
  type ProcessResult,
  type Format,
  type ImageInfo,
  type Dimensions,
} from './types';
type Surface = OffscreenCanvas | HTMLCanvasElement;
type Context = OffscreenCanvasRenderingContext2D | CanvasRenderingContext2D;
export function canvas(
  width: number,
  height: number,
): { surface: Surface; context: Context } {
  dimensions(width, height);
  const offscreen =
    typeof OffscreenCanvas !== 'undefined' &&
    typeof OffscreenCanvas.prototype.convertToBlob === 'function';
  const surface: Surface = offscreen
    ? new OffscreenCanvas(width, height)
    : document.createElement('canvas');
  surface.width = width;
  surface.height = height;
  const context = surface.getContext('2d') as Context | null;
  if (!context)
    throw new Error(
      'A 2D canvas could not be created. Your device may be low on memory.',
    );
  context.imageSmoothingEnabled = true;
  context.imageSmoothingQuality = 'high';
  return { surface, context };
}
export async function encode(
  surface: Surface,
  format: Format,
  quality: number,
): Promise<Blob> {
  if (!['image/jpeg', 'image/png', 'image/webp'].includes(format))
    throw new Error('Unsupported output format.');
  if (!Number.isFinite(quality) || quality < 0.1 || quality > 1)
    throw new Error('Quality must be between 10% and 100%.');
  let blob: Blob | undefined;
  try {
    blob =
      surface instanceof HTMLCanvasElementSafe()
        ? await new Promise<Blob>((resolve, reject) =>
            (surface as HTMLCanvasElement).toBlob(
              (b) =>
                b
                  ? resolve(b)
                  : reject(
                      new Error(
                        'Image encoding failed. Try smaller dimensions.',
                      ),
                    ),
              format,
              quality,
            ),
          )
        : await (surface as OffscreenCanvas).convertToBlob({
            type: format,
            quality,
          });
  } catch (error) {
    if (format !== 'image/webp') throw error;
  }
  if (format === 'image/webp' && blob?.type !== format) {
    const context = surface.getContext('2d') as Context;
    const pixels = context.getImageData(0, 0, surface.width, surface.height);
    blob = await (await import('./webp')).encodeWebP(pixels, quality);
  }
  if (!blob || blob.type !== format)
    throw new Error(
      `This browser cannot encode ${format.split('/')[1]!.toUpperCase()}. Choose PNG or JPEG, or try another browser.`,
    );
  return blob;
}
function HTMLCanvasElementSafe(): typeof HTMLCanvasElement {
  return (
    typeof HTMLCanvasElement === 'undefined' ? class {} : HTMLCanvasElement
  ) as typeof HTMLCanvasElement;
}
export async function decode(blob: Blob) {
  if (typeof createImageBitmap === 'function') {
    try {
      const bitmap = await createImageBitmap(blob, {
        imageOrientation: 'from-image',
      });
      return {
        source: bitmap as CanvasImageSource,
        width: bitmap.width,
        height: bitmap.height,
        release: () => bitmap.close(),
      };
    } catch {
      /* Use the DOM decoder when a browser codec cannot create a bitmap. */
    }
  }
  if (typeof document === 'undefined')
    throw new Error('WORKER_DECODE_UNAVAILABLE');
  const url = URL.createObjectURL(blob);
  const image = new Image();
  try {
    await new Promise<void>((resolve, reject) => {
      image.onload = () => resolve();
      image.onerror = () =>
        reject(
          new Error(
            'The image could not be decoded. It may be malformed or unsupported.',
          ),
        );
      image.src = url;
    });
    return {
      source: image as CanvasImageSource,
      width: image.naturalWidth,
      height: image.naturalHeight,
      release: () => {
        image.src = '';
        URL.revokeObjectURL(url);
      },
    };
  } catch (error) {
    URL.revokeObjectURL(url);
    throw error;
  }
}
export async function inspect(
  blob: Blob,
  metadata = false,
): Promise<ImageInfo> {
  const header = await validateImage(blob);
  if (
    typeof document !== 'undefined' &&
    header.width * header.height > limits.fallbackPixels
  )
    throw new Error(
      'This browser uses a fallback limited to 4 megapixels. Try a smaller image.',
    );
  const image = await decode(blob);
  try {
    dimensions(image.width, image.height);
    return {
      ...header,
      width: image.width,
      height: image.height,
      ...(metadata
        ? { metadata: await (await import('./metadata')).readMetadata(blob) }
        : {}),
    };
  } finally {
    image.release();
  }
}
export async function processImage(
  blob: Blob,
  s: ImageSettings,
  progress: (message: string) => void = () => {},
  signal?: AbortSignal,
): Promise<ProcessResult> {
  const deadline = Date.now() + limits.timeout;
  const check = () => {
    if (Date.now() > deadline)
      throw new Error(
        'Processing exceeded the 45 second budget. Use a smaller image.',
      );
    if (signal?.aborted)
      throw new DOMException('Operation cancelled.', 'AbortError');
  };
  check();
  progress('Checking image signature');
  const header = await validateImage(blob);
  progress('Decoding image');
  const image = await decode(blob);
  let rotated: Surface | undefined;
  try {
    dimensions(image.width, image.height);
    if (
      typeof document !== 'undefined' &&
      image.width * image.height > limits.fallbackPixels
    )
      throw new Error(
        'This browser uses the main-thread fallback, limited to 4 megapixels. Try a smaller image or a browser with worker canvas support.',
      );
    const info: ImageInfo = {
      ...header,
      width: image.width,
      height: image.height,
    };
    if (s.action === 'metadata') {
      const metadata = await (await import('./metadata')).readMetadata(blob);
      return {
        info: { ...info, metadata },
        width: info.width,
        height: info.height,
        attempts: 0,
        warnings: [
          'Unavailable fields are shown explicitly. No GPS coordinates are placed in links.',
        ],
      };
    }
    if (!/^#[0-9a-f]{6}$/i.test(s.background))
      throw new Error('Choose a six-digit background color.');
    const size = rotatedSize(info, s.rotation);
    let source = image.source;
    if (s.rotation) {
      const r = canvas(size.width, size.height);
      r.context.translate(size.width / 2, size.height / 2);
      r.context.rotate((s.rotation * Math.PI) / 180);
      r.context.drawImage(source, -image.width / 2, -image.height / 2);
      rotated = r.surface;
      source = rotated;
    }
    let target: Dimensions =
      s.action === 'convert' || s.action === 'strip' || s.action === 'compress'
        ? size
        : dimensions(s.width, s.height);
    if (s.action === 'crop') {
      cropCheck(s.crop, size);
      target = dimensions(s.crop.width, s.crop.height);
    }
    if (
      typeof document !== 'undefined' &&
      target.width * target.height > limits.fallbackPixels
    )
      throw new Error(
        'This browser fallback supports at most 4 megapixels of output. Choose smaller dimensions.',
      );
    const warnings: string[] = [];
    if (s.format === 'image/jpeg')
      warnings.push(
        'JPEG has no transparency. Pixels are flattened against the selected background.',
      );
    if (s.format === 'image/png')
      warnings.push(
        'PNG uses lossless pixel encoding. The quality slider does not change PNG compression.',
      );
    if (s.action === 'strip')
      warnings.push(
        'Canvas re-encoding removes original EXIF/GPS tags. Pixel/color rendering can change; browser encoders may add their own metadata.',
      );
    if (s.action === 'ratio' && s.fit === 'stretch')
      warnings.push(
        'Stretch mode changes proportions and may distort the image.',
      );
    const render = (target: Dimensions) => {
      const c = canvas(target.width, target.height);
      if (s.format === 'image/jpeg' || !s.transparent) {
        c.context.fillStyle = s.background;
        c.context.fillRect(0, 0, target.width, target.height);
      }
      if (s.action === 'crop')
        c.context.drawImage(
          source,
          s.crop.x,
          s.crop.y,
          s.crop.width,
          s.crop.height,
          0,
          0,
          target.width,
          target.height,
        );
      else {
        const rect = fitRect(
          size,
          target,
          s.action === 'ratio' ? s.fit : 'stretch',
        );
        c.context.drawImage(source, rect.x, rect.y, rect.width, rect.height);
      }
      return c.surface;
    };
    let attempts = 0;
    const encodeAt = async (surface: Surface, q: number) => {
      check();
      progress(`Encoding image · attempt ${++attempts}`);
      const output = await encode(surface, s.format, q);
      check();
      return output;
    };
    let output: Blob;
    if (s.action === 'compress') {
      if (
        !Number.isFinite(s.targetBytes) ||
        s.targetBytes < 0 ||
        s.targetBytes > limits.file
      )
        throw new Error('Target size must be between 0 and 20 MB.');
      const policy = compressionPolicy(s.mode);
      let best: { blob: Blob; size: Dimensions } | undefined;
      let fit: { blob: Blob; size: Dimensions; quality: number } | undefined;
      const stages = s.allowReduction ? policy.stages : 1;
      for (let stage = 0; stage < stages; stage++) {
        const surface = render(target);
        const high = Math.max(policy.minimumQuality, s.quality);
        let low = policy.minimumQuality,
          upper = high;
        const trials =
          s.format === 'image/png' || !s.targetBytes
            ? 1
            : policy.qualityAttempts;
        for (let trial = 0; trial < trials; trial++) {
          const quality =
            trial === 0 ? high : trial === 1 ? low : (low + upper) / 2;
          const candidate = await encodeAt(surface, quality);
          if (!best || candidate.size < best.blob.size)
            best = { blob: candidate, size: { ...target } };
          if (!s.targetBytes || candidate.size <= s.targetBytes) {
            if (!fit || quality > fit.quality)
              fit = { blob: candidate, size: { ...target }, quality };
            low = quality;
            if (trial === 0) break;
          } else upper = quality;
          if (s.format === 'image/png') break;
        }
        surface.width = 1;
        surface.height = 1;
        if (fit || !s.targetBytes || stage === stages - 1) break;
        target = reducedSize(target, s.targetBytes, best!.blob.size);
      }
      const chosen = fit || best!;
      output = chosen.blob;
      target = chosen.size;
      if (target.width !== size.width || target.height !== size.height)
        warnings.push(
          `Dimension reduction was enabled: output is ${target.width} × ${target.height} px.`,
        );
      if (s.targetBytes && output.size > s.targetBytes)
        warnings.push(
          'Target size was not reached with the permitted quality and dimensions. The actual output size is shown; try another format or explicitly allow dimension reduction.',
        );
    } else {
      const surface = render(target);
      output = await encodeAt(surface, s.quality);
      surface.width = 1;
      surface.height = 1;
    }
    const actual = detectImage(new Uint8Array(await output.arrayBuffer()));
    if (
      actual.format !== s.format ||
      actual.width !== target.width ||
      actual.height !== target.height
    )
      throw new Error(
        'Encoded output did not match the requested format or dimensions.',
      );
    return {
      blob: output,
      info,
      width: actual.width,
      height: actual.height,
      attempts,
      warnings,
      targetAchieved:
        s.action === 'compress' && s.targetBytes > 0
          ? output.size <= s.targetBytes
          : undefined,
    };
  } finally {
    image.release();
    if (rotated) {
      rotated.width = 1;
      rotated.height = 1;
    }
  }
}
