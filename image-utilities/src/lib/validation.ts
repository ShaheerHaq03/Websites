import { limits, type Format, type ImageInfo } from './types';
import { dimensions } from './math';
const ascii = (bytes: Uint8Array, start: number, length: number) =>
  String.fromCharCode(...bytes.slice(start, start + length));
export function detectImage(bytes: Uint8Array): Omit<ImageInfo, 'size'> {
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  if (
    bytes.length >= 33 &&
    [137, 80, 78, 71, 13, 10, 26, 10].every((v, i) => bytes[i] === v)
  ) {
    if (ascii(bytes, 12, 4) !== 'IHDR')
      throw new Error('PNG header is malformed.');
    const width = view.getUint32(16),
      height = view.getUint32(20);
    let animated = false;
    let alpha = bytes[25] === 4 || bytes[25] === 6;
    for (let i = 8; i + 12 <= bytes.length;) {
      const length = view.getUint32(i),
        type = ascii(bytes, i + 4, 4);
      if (length > bytes.length - i - 12)
        throw new Error('PNG chunk is truncated.');
      if (type === 'acTL') animated = true;
      if (type === 'tRNS') alpha = true;
      if (type === 'IEND') break;
      i += 12 + length;
    }
    return {
      format: 'image/png',
      width,
      height,
      animated,
      alpha,
      bitDepth: bytes[24],
    };
  }
  if (
    bytes.length >= 12 &&
    ascii(bytes, 0, 4) === 'RIFF' &&
    ascii(bytes, 8, 4) === 'WEBP'
  ) {
    const riffSize = view.getUint32(4, true) + 8;
    if (riffSize > bytes.length) throw new Error('WebP file is truncated.');
    const kind = ascii(bytes, 12, 4);
    if (kind === 'VP8X' && bytes.length >= 30)
      return {
        format: 'image/webp',
        width: 1 + bytes[24]! + (bytes[25]! << 8) + (bytes[26]! << 16),
        height: 1 + bytes[27]! + (bytes[28]! << 8) + (bytes[29]! << 16),
        animated: !!(bytes[20]! & 2),
        alpha: !!(bytes[20]! & 16),
      };
    if (kind === 'VP8L' && bytes.length >= 25 && bytes[20] === 47)
      return {
        format: 'image/webp',
        width: 1 + bytes[21]! + ((bytes[22]! & 63) << 8),
        height:
          1 + (bytes[22]! >> 6) + (bytes[23]! << 2) + ((bytes[24]! & 15) << 10),
        animated: false,
        alpha: !!(bytes[24]! & 16),
      };
    if (
      kind === 'VP8 ' &&
      bytes.length >= 30 &&
      bytes[23] === 157 &&
      bytes[24] === 1 &&
      bytes[25] === 42
    )
      return {
        format: 'image/webp',
        width: view.getUint16(26, true) & 16383,
        height: view.getUint16(28, true) & 16383,
        animated: false,
        alpha: false,
      };
    throw new Error('Unsupported or malformed WebP bitstream.');
  }
  if (bytes[0] === 255 && bytes[1] === 216) {
    let i = 2;
    while (i + 4 <= bytes.length) {
      if (bytes[i++] !== 255) throw new Error('JPEG marker is malformed.');
      while (bytes[i] === 255) i++;
      const marker = bytes[i++]!;
      if (marker === 217 || marker === 218) break;
      if (marker === 1 || (marker >= 208 && marker <= 215)) continue;
      const length = view.getUint16(i);
      if (length < 2 || i + length > bytes.length)
        throw new Error('JPEG segment is truncated.');
      if (
        [
          192, 193, 194, 195, 197, 198, 199, 201, 202, 203, 205, 206, 207,
        ].includes(marker) &&
        length >= 8
      )
        return {
          format: 'image/jpeg',
          width: view.getUint16(i + 5),
          height: view.getUint16(i + 3),
          animated: false,
          alpha: false,
          bitDepth: bytes[i + 2],
        };
      i += length;
    }
    throw new Error('JPEG dimensions were not found.');
  }
  throw new Error(
    'Unsupported image. Choose a valid static JPG, PNG, or WebP file. SVG, GIF, HEIC, and AVIF are not supported.',
  );
}
export async function validateImage(blob: Blob, allowed?: readonly Format[]) {
  if (!blob.size) throw new Error('The selected file is empty.');
  if (blob.size > limits.file)
    throw new Error('Each image must be at most 20 MB.');
  const info = detectImage(new Uint8Array(await blob.arrayBuffer()));
  dimensions(info.width, info.height);
  if (allowed && !allowed.includes(info.format))
    throw new Error(
      `This tool expects ${allowed.map((v) => v.split('/')[1]!.toUpperCase()).join(' or ')} input.`,
    );
  if (info.animated)
    throw new Error(
      'Animated PNG/WebP is not supported. Export a static frame first; this tool will not silently discard animation.',
    );
  return { ...info, size: blob.size };
}
export function allowedFor(id: string): readonly Format[] {
  return id === 'png-to-jpg'
    ? ['image/png']
    : id === 'jpg-to-png'
      ? ['image/jpeg']
      : id === 'image-to-webp'
        ? ['image/png', 'image/jpeg']
        : id === 'webp-to-png'
          ? ['image/webp']
          : ['image/jpeg', 'image/png', 'image/webp'];
}
