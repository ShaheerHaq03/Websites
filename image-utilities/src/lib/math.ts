import { limits, type Dimensions, type Rect, type Format } from './types';
export function dimensions(width: number, height: number): Dimensions {
  if (![width, height].every((v) => Number.isInteger(v) && v > 0))
    throw new Error('Width and height must be positive whole pixels.');
  if (Math.max(width, height) > limits.side || width * height > limits.pixels)
    throw new Error(
      'Image exceeds the 8,192-pixel side or 16-megapixel limit.',
    );
  return { width, height };
}
export function linkedSize(
  source: Dimensions,
  value: number,
  axis: 'width' | 'height',
): Dimensions {
  const ratio = source.width / source.height;
  return axis === 'width'
    ? { width: value, height: Math.max(1, Math.round(value / ratio)) }
    : { width: Math.max(1, Math.round(value * ratio)), height: value };
}
export function percentageSize(source: Dimensions, percent: number) {
  if (!Number.isFinite(percent) || percent <= 0 || percent > 400)
    throw new Error('Percentage must be greater than 0 and at most 400.');
  return dimensions(
    Math.max(1, Math.round((source.width * percent) / 100)),
    Math.max(1, Math.round((source.height * percent) / 100)),
  );
}
export function gcd(a: number, b: number): number {
  return b ? gcd(b, a % b) : a;
}
export function ratioLabel({ width, height }: Dimensions) {
  const d = gcd(width, height);
  return `${width / d}:${height / d}`;
}
export function rotatedSize(source: Dimensions, rotation: number) {
  if (![0, 90, 180, 270].includes(rotation))
    throw new Error('Rotation must be 0, 90, 180, or 270 degrees.');
  return rotation % 180
    ? { width: source.height, height: source.width }
    : source;
}
export function centeredCrop(
  source: Dimensions,
  ratio: number,
  zoom = 1,
): Rect {
  if (
    !Number.isFinite(ratio) ||
    ratio <= 0 ||
    !Number.isFinite(zoom) ||
    zoom < 1 ||
    zoom > 4
  )
    throw new Error('Choose a positive aspect ratio and zoom from 1 to 4.');
  let width = source.width,
    height = width / ratio;
  if (height > source.height) {
    height = source.height;
    width = height * ratio;
  }
  width = Math.max(1, Math.floor(width / zoom));
  height = Math.max(1, Math.floor(height / zoom));
  return {
    x: Math.floor((source.width - width) / 2),
    y: Math.floor((source.height - height) / 2),
    width,
    height,
  };
}
export function cropCheck(rect: Rect, source: Dimensions): Rect {
  if (
    !Object.values(rect).every(Number.isInteger) ||
    rect.x < 0 ||
    rect.y < 0 ||
    rect.width < 1 ||
    rect.height < 1 ||
    rect.x + rect.width > source.width ||
    rect.y + rect.height > source.height
  )
    throw new Error(
      'Crop must use whole pixels and stay inside the rotated image.',
    );
  return rect;
}
export function fitRect(
  source: Dimensions,
  target: Dimensions,
  mode: 'crop' | 'fit' | 'stretch',
): Rect {
  if (mode === 'stretch') return { x: 0, y: 0, ...target };
  const scale = (mode === 'crop' ? Math.max : Math.min)(
    target.width / source.width,
    target.height / source.height,
  );
  const width = source.width * scale,
    height = source.height * scale;
  return {
    x: (target.width - width) / 2,
    y: (target.height - height) / 2,
    width,
    height,
  };
}
export function formatBytes(bytes: number) {
  return bytes < 1000
    ? `${bytes} B`
    : bytes < 1_000_000
      ? `${(bytes / 1000).toFixed(1)} KB`
      : `${(bytes / 1_000_000).toFixed(2)} MB`;
}
export function savings(original: number, result: number) {
  return original ? (1 - result / original) * 100 : 0;
}
export function outputName(name: string, format: Format, index?: number) {
  const base =
    name
      .replace(/\.[^.]*$/, '')
      .replace(/[^\p{L}\p{N}._-]/gu, '-')
      .slice(0, 90) || 'image';
  return `${base}-pixeltools${index === undefined ? '' : `-${index + 1}`}.${format === 'image/jpeg' ? 'jpg' : format.split('/')[1]}`;
}
export function batchCheck(files: { size: number }[]) {
  if (!files.length) throw new Error('Choose at least one image.');
  if (files.length > limits.batch)
    throw new Error('Choose at most 10 images per batch.');
  if (files.some((f) => f.size > limits.file))
    throw new Error('Each image must be at most 20 MB.');
  if (files.reduce((n, f) => n + f.size, 0) > limits.batchBytes)
    throw new Error('The batch exceeds the 60 MB total limit.');
}
export function compressionPolicy(mode: string) {
  if (!['quality', 'balanced', 'smallest'].includes(mode))
    throw new Error('Unknown compression mode.');
  return {
    minimumQuality:
      mode === 'quality' ? 0.55 : mode === 'balanced' ? 0.25 : 0.1,
    stages: 4,
    qualityAttempts: 7,
  };
}
export function reducedSize(size: Dimensions, target: number, actual: number) {
  const factor = Math.max(
    0.5,
    Math.min(0.9, Math.sqrt(target / actual) * 0.95),
  );
  return {
    width: Math.max(1, Math.floor(size.width * factor)),
    height: Math.max(1, Math.floor(size.height * factor)),
  };
}
