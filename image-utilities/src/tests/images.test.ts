import { describe, it, expect } from 'vitest';
import { readFile } from 'node:fs/promises';
import {
  dimensions,
  linkedSize,
  percentageSize,
  centeredCrop,
  cropCheck,
  rotatedSize,
  fitRect,
  formatBytes,
  savings,
  outputName,
  batchCheck,
  compressionPolicy,
  reducedSize,
  ratioLabel,
} from '../lib/math';
import { detectImage, validateImage, allowedFor } from '../lib/validation';
import { readMetadata } from '../lib/metadata';
import { tools } from '../data/tools';
import { content } from '../content/tools';
import { socialPresets, socialVersion } from '../data/social-presets';
const fixture = async (name: string) =>
  new Uint8Array(await readFile(`e2e/fixtures/${name}`));
describe('resize dimensions', () => {
  it('preserves ratios predictably on either axis', () => {
    expect(linkedSize({ width: 120, height: 80 }, 600, 'width')).toEqual({
      width: 600,
      height: 400,
    });
    expect(linkedSize({ width: 120, height: 80 }, 400, 'height')).toEqual({
      width: 600,
      height: 400,
    });
  });
  it('calculates percentages from original pixels', () => {
    expect(percentageSize({ width: 1200, height: 800 }, 50)).toEqual({
      width: 600,
      height: 400,
    });
    expect(percentageSize({ width: 1, height: 1 }, 1)).toEqual({
      width: 1,
      height: 1,
    });
  });
  it.each([0, -1, 401, NaN, Infinity])(
    'rejects invalid percentage %s',
    (percent) =>
      expect(() =>
        percentageSize({ width: 100, height: 100 }, percent),
      ).toThrow(),
  );
  it.each([
    [0, 100],
    [-1, 100],
    [1.5, 20],
    [8193, 1],
    [5000, 5000],
    [NaN, 100],
  ])('rejects invalid or excessive pixel sizes', (w, h) =>
    expect(() => dimensions(w, h)).toThrow(),
  );
  it('allows the pixel boundary and exact ratio labels', () => {
    expect(dimensions(4000, 4000)).toEqual({ width: 4000, height: 4000 });
    expect(ratioLabel({ width: 1200, height: 800 })).toBe('3:2');
  });
});
describe('crop and aspect geometry', () => {
  it('center crops the natural dimensions', () => {
    expect(centeredCrop({ width: 800, height: 600 }, 1)).toEqual({
      x: 100,
      y: 0,
      width: 600,
      height: 600,
    });
    expect(centeredCrop({ width: 800, height: 600 }, 16 / 9)).toEqual({
      x: 0,
      y: 75,
      width: 800,
      height: 450,
    });
  });
  it('zooms by reducing the selected source region', () =>
    expect(centeredCrop({ width: 800, height: 600 }, 1, 2)).toEqual({
      x: 250,
      y: 150,
      width: 300,
      height: 300,
    }));
  it('validates crop coordinates against the rotated image', () => {
    expect(rotatedSize({ width: 120, height: 80 }, 90)).toEqual({
      width: 80,
      height: 120,
    });
    expect(() =>
      cropCheck(
        { x: 70, y: 0, width: 20, height: 20 },
        { width: 80, height: 120 },
      ),
    ).toThrow();
  });
  it.each([
    { x: -1, y: 0, width: 20, height: 20 },
    { x: 0, y: 0, width: 0, height: 20 },
    { x: 0, y: 0, width: 20.5, height: 20 },
  ])('rejects invalid crop %j', (rect) =>
    expect(() => cropCheck(rect, { width: 80, height: 60 })).toThrow(),
  );
  it('distinguishes fit, crop, and stretch rather than distorting silently', () => {
    const source = { width: 800, height: 600 },
      target = { width: 1000, height: 1000 };
    expect(fitRect(source, target, 'fit')).toEqual({
      x: 0,
      y: 125,
      width: 1000,
      height: 750,
    });
    expect(fitRect(source, target, 'crop').width).toBeCloseTo(1333.333);
    expect(fitRect(source, target, 'stretch')).toEqual({
      x: 0,
      y: 0,
      width: 1000,
      height: 1000,
    });
  });
  it.each([0, -1, NaN, Infinity])('rejects invalid ratios %s', (ratio) =>
    expect(() => centeredCrop({ width: 10, height: 10 }, ratio)).toThrow(),
  );
  it('rejects unsupported arbitrary rotation', () =>
    expect(() => rotatedSize({ width: 10, height: 10 }, 45)).toThrow());
});
describe('bytes, output naming and batches', () => {
  it.each([
    [999, '999 B'],
    [1000, '1.0 KB'],
    [1000000, '1.00 MB'],
  ])('uses honest decimal file-size units', (bytes, label) =>
    expect(formatBytes(bytes as number)).toBe(label),
  );
  it('reports larger files as negative savings', () => {
    expect(savings(1000, 500)).toBe(50);
    expect(savings(1000, 1500)).toBe(-50);
  });
  it('matches output extensions and makes safe unique ZIP names', () => {
    expect(outputName('../../photo.png', 'image/jpeg', 1)).toBe(
      '..-..-photo-pixeltools-2.jpg',
    );
    expect(outputName('世界 hello.jpeg', 'image/webp')).toBe(
      '世界-hello-pixeltools.webp',
    );
  });
  it('bounds file count, individual bytes and aggregate bytes', () => {
    expect(() => batchCheck([])).toThrow();
    expect(() =>
      batchCheck(Array.from({ length: 11 }, () => ({ size: 1 }))),
    ).toThrow('10');
    expect(() => batchCheck([{ size: 20000001 }])).toThrow('20 MB');
    expect(() =>
      batchCheck(Array.from({ length: 4 }, () => ({ size: 20000000 }))),
    ).toThrow('60 MB');
    expect(() =>
      batchCheck(Array.from({ length: 3 }, () => ({ size: 20000000 }))),
    ).not.toThrow();
  });
});
describe('compression decisions', () => {
  it('has explicit quality floors and bounded trials', () => {
    expect(compressionPolicy('quality')).toEqual({
      minimumQuality: 0.55,
      stages: 4,
      qualityAttempts: 7,
    });
    expect(compressionPolicy('balanced').minimumQuality).toBe(0.25);
    expect(compressionPolicy('smallest').minimumQuality).toBe(0.1);
    expect(() => compressionPolicy('unknown')).toThrow();
  });
  it('reduces dimensions predictably without upscaling', () => {
    const result = reducedSize({ width: 1000, height: 800 }, 10000, 100000);
    expect(result).toEqual({ width: 500, height: 400 });
    expect(reducedSize({ width: 1, height: 1 }, 1, 100)).toEqual({
      width: 1,
      height: 1,
    });
  });
});
describe('real format detection and validation', () => {
  it.each([
    ['grid.png', 'image/png', 120, 80],
    ['camera.jpg', 'image/jpeg', 120, 80],
    ['alpha.webp', 'image/webp', 80, 60],
    ['alpha.png', 'image/png', 80, 60],
  ])(
    'reads signatures/dimensions from %s',
    async (name, format, width, height) => {
      const info = detectImage(await fixture(name as string));
      expect(info).toMatchObject({ format, width, height, animated: false });
    },
  );
  it('detects alpha in real PNG and WebP fixtures', async () => {
    expect(detectImage(await fixture('alpha.png')).alpha).toBe(true);
    expect(detectImage(await fixture('alpha.webp')).alpha).toBe(true);
  });
  it('does not trust an extension or MIME label', async () => {
    await expect(
      validateImage(
        new Blob([await fixture('invalid.png')], { type: 'image/png' }),
      ),
    ).rejects.toThrow('Unsupported image');
    expect(
      (
        await validateImage(
          new Blob([await fixture('grid.png')], { type: 'text/plain' }),
        )
      ).format,
    ).toBe('image/png');
  });
  it('rejects empty, excessive, truncated and tool-incompatible inputs', async () => {
    await expect(validateImage(new Blob())).rejects.toThrow('empty');
    await expect(
      validateImage(new Blob([new Uint8Array(20000001)])),
    ).rejects.toThrow('20 MB');
    expect(() =>
      detectImage(new Uint8Array([255, 216, 255, 224, 0, 255])),
    ).toThrow('truncated');
    await expect(
      validateImage(
        new Blob([await fixture('camera.jpg')]),
        allowedFor('png-to-jpg'),
      ),
    ).rejects.toThrow('expects PNG');
  });
  it('detects and rejects animated WebP explicitly', async () => {
    const bytes = new Uint8Array(30);
    bytes.set(new TextEncoder().encode('RIFF'), 0);
    new DataView(bytes.buffer).setUint32(4, 22, true);
    bytes.set(new TextEncoder().encode('WEBPVP8X'), 8);
    bytes[20] = 2;
    expect(detectImage(bytes).animated).toBe(true);
    await expect(validateImage(new Blob([bytes]))).rejects.toThrow('Animated');
  });
});
describe('real EXIF parsing and registry coverage', () => {
  it('reads camera fields without inventing missing GPS', async () => {
    const result = await readMetadata(new Blob([await fixture('camera.jpg')]));
    expect(result.Make).toBe('PixelTools');
    expect(result.Model).toBe('Fixture Camera');
    expect(result.latitude).toBeNull();
  });
  it('reads synthetic GPS coordinates only from embedded EXIF', async () => {
    const result = await readMetadata(new Blob([await fixture('gps.jpg')]));
    expect(result.latitude).toBeCloseTo(51.5);
    expect(result.longitude).toBeCloseTo(-0.1166667);
  });
  it('does not fabricate fields for a PNG without EXIF', async () => {
    const result = await readMetadata(new Blob([await fixture('grid.png')]));
    expect(result.Make).toBeNull();
    expect(result.Orientation).toBeNull();
  });
  it('has a distinct guide for every required tool and versioned social sources', () => {
    expect(tools).toHaveLength(10);
    for (const tool of tools) {
      expect(content[tool.id].steps.length).toBeGreaterThan(1);
      expect(tool.related.every((id) => tools.some((t) => t.id === id))).toBe(
        true,
      );
    }
    expect(socialVersion).toContain('2026-10-27');
    for (const preset of socialPresets)
      if (preset.verified) expect(preset.source).toMatch(/^https:/);
  });
});

describe('cancel and selection safety', () => {
  it('honors cancellation before ZIP allocation', async () => {
    const { buildZip } = await import('../lib/client');
    const controller = new AbortController();
    controller.abort();
    await expect(
      buildZip(
        [{ name: 'test.png', blob: new Blob(['test']) }],
        controller.signal,
      ),
    ).rejects.toMatchObject({ name: 'AbortError' });
  });
});
