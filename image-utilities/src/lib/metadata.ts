import type { ImageInfo } from './types';
export async function readMetadata(
  blob: Blob,
): Promise<NonNullable<ImageInfo['metadata']>> {
  const exifr = await import('exifr');
  let raw: Record<string, unknown> | undefined;
  try {
    raw = await exifr.parse(new Uint8Array(await blob.arrayBuffer()), {
      tiff: true,
      exif: true,
      gps: true,
      xmp: false,
      icc: false,
      iptc: false,
    });
  } catch {
    return { metadataNotice: 'No readable EXIF metadata was found.' };
  }
  const fields: Record<string, string | number | boolean | null> = {};
  for (const key of [
    'Make',
    'Model',
    'LensModel',
    'Orientation',
    'DateTimeOriginal',
    'CreateDate',
    'ExposureTime',
    'FNumber',
    'ISO',
    'FocalLength',
    'ColorSpace',
    'Software',
    'latitude',
    'longitude',
    'GPSAltitude',
  ]) {
    const value = raw?.[key];
    fields[key] =
      value instanceof Date
        ? `${value.toLocaleString()} (source timezone may be unspecified)`
        : typeof value === 'string' ||
            typeof value === 'number' ||
            typeof value === 'boolean'
          ? value
          : null;
  }
  return fields;
}
