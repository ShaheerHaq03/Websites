import { test, expect } from '@playwright/test';
import { choose, processAndDownload, pixel } from './helpers';
import sharp from 'sharp';
import exifr from 'exifr';
import { readFile } from 'node:fs/promises';
import { unzipSync } from 'fflate';
test('image engine integration: PNG to JPEG is a real encoding with white transparency flattening', async ({
  page,
}) => {
  await choose(page, 'png-to-jpg', 'alpha.png');
  const result = await processAndDownload(page, 'Convert image');
  expect(result.metadata.format).toBe('jpeg');
  expect(result.buffer.subarray(0, 2)).toEqual(Buffer.from([255, 216]));
  expect(result.metadata.width).toBe(80);
  const corner = await pixel(result.buffer, 0, 0);
  expect(corner.slice(0, 3).every((v) => v > 240)).toBe(true);
  expect(corner[3]).toBe(255);
});
test('image engine integration: JPEG to PNG preserves dimensions and does not restore lost detail', async ({
  page,
}) => {
  await choose(page, 'jpg-to-png', 'camera.jpg');
  const result = await processAndDownload(page, 'Convert image');
  expect(result.metadata.format).toBe('png');
  expect(result.metadata.width).toBe(120);
  expect(result.metadata.height).toBe(80);
  expect(result.buffer.subarray(0, 8)).toEqual(
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
  );
});
test('image engine integration: alpha PNG to WebP and static WebP to PNG', async ({
  page,
}) => {
  await choose(page, 'image-to-webp', 'alpha.png');
  const webp = await processAndDownload(page, 'Convert image');
  expect(webp.metadata.format).toBe('webp');
  expect((await pixel(webp.buffer, 0, 0))[3]).toBe(0);
  await choose(page, 'webp-to-png', 'alpha.webp');
  const png = await processAndDownload(page, 'Convert image');
  expect(png.metadata.format).toBe('png');
  expect((await pixel(png.buffer, 0, 0))[3]).toBe(0);
  expect((await pixel(png.buffer, 40, 30))[3]).toBe(255);
});
test('image engine integration: resizing by percentage encodes the requested dimensions', async ({
  page,
}) => {
  await choose(page, 'image-resizer');
  await page.getByLabel('Resize percentage', { exact: true }).fill('50');
  await page.getByRole('button', { name: 'Apply', exact: true }).click();
  const result = await processAndDownload(page, 'Resize image');
  expect(result.metadata.width).toBe(60);
  expect(result.metadata.height).toBe(40);
});
test('image engine integration: crop coordinates map to natural pixels and rotation', async ({
  page,
}) => {
  await choose(page, 'image-cropper');
  await page.getByLabel('Crop x', { exact: true }).fill('60');
  await page.getByLabel('Crop y', { exact: true }).fill('0');
  await page.getByLabel('Crop width', { exact: true }).fill('60');
  await page.getByLabel('Crop height', { exact: true }).fill('40');
  const result = await processAndDownload(page, 'Crop image');
  expect(result.metadata.width).toBe(60);
  expect(result.metadata.height).toBe(40);
  const p = await pixel(result.buffer, 30, 20);
  expect(p[1]).toBeGreaterThan(150);
  expect(p[0]).toBeLessThan(50);
  await page.getByRole('button', { name: 'Rotate 90°' }).click();
  await page.getByLabel('Crop aspect ratio').selectOption('free');
  const rotated = await processAndDownload(page, 'Crop image');
  expect(rotated.metadata.width).toBe(80);
  expect(rotated.metadata.height).toBe(120);
});
test('image engine integration: fit padding preserves the whole image and alpha', async ({
  page,
}) => {
  await choose(page, 'aspect-ratio-converter');
  await page.getByLabel('Output width', { exact: true }).fill('100');
  await page.getByLabel('Adjustment mode').selectOption('fit');
  const result = await processAndDownload(page, 'Create image');
  expect(result.metadata.width).toBe(100);
  expect(result.metadata.height).toBe(100);
  expect((await pixel(result.buffer, 0, 0))[3]).toBe(0);
  expect((await pixel(result.buffer, 50, 50))[3]).toBe(255);
});
test('image engine integration: compressor reports target success and failure honestly', async ({
  page,
}) => {
  await choose(page, 'image-compressor', 'noise.png');
  await page
    .getByLabel('Output format', { exact: true })
    .selectOption('image/png');
  await page
    .getByLabel('Target file size', { exact: true })
    .selectOption('20000');
  const failed = await processAndDownload(page, 'Compress image');
  expect(failed.buffer.length).toBeGreaterThan(20000);
  await expect(page.locator('.goal-missed')).toHaveText('Target not reached');
  expect(failed.metadata.width).toBe(640);
  await page.getByLabel('Allow dimension reduction').check();
  const success = await processAndDownload(page, 'Compress image');
  expect(success.buffer.length).toBeLessThanOrEqual(20000);
  expect(success.metadata.width).toBeLessThan(640);
  await expect(page.locator('.goal-met')).toHaveText('Target reached');
});
test('image engine integration: JPEG EXIF orientation is applied once', async ({
  page,
}) => {
  await choose(page, 'jpg-to-png', 'orientation.jpg');
  const result = await processAndDownload(page, 'Convert image');
  expect(result.metadata.width).toBe(80);
  expect(result.metadata.height).toBe(120);
});
test('image engine integration: metadata reads EXIF/GPS and re-encode removes source tags', async ({
  page,
}) => {
  await choose(page, 'image-metadata-viewer', 'gps.jpg');
  await page
    .getByRole('button', { name: 'Inspect metadata', exact: true })
    .click();
  await expect(page.locator('.metadata-panel')).toContainText('PixelTools');
  await page
    .getByRole('button', { name: 'Reveal GPS fields', exact: true })
    .click();
  await expect(page.locator('.metadata-panel')).toContainText('51.5');
  const result = await processAndDownload(
    page,
    'Re-encode PNG without original EXIF',
  );
  expect(result.metadata.format).toBe('png');
  const metadata = await exifr.parse(result.buffer);
  expect(metadata?.latitude).toBeUndefined();
  expect(metadata?.Make).toBeUndefined();
});
test('image engine integration: batch ZIP contains individual real images', async ({
  page,
}) => {
  await page.goto('/tools/png-to-jpg');
  await page
    .getByLabel('Choose image files', { exact: true })
    .setInputFiles(['e2e/fixtures/grid.png', 'e2e/fixtures/alpha.png']);
  await expect(page.locator('.file-strip')).toBeVisible();
  await page
    .getByRole('button', { name: 'Convert images (2)', exact: true })
    .click();
  await expect(page.locator('.batch-results')).toBeVisible();
  const wait = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Download all as ZIP' }).click();
  const file = await wait;
  const data = await readFile((await file.path())!);
  const zip = unzipSync(data);
  expect(Object.keys(zip)).toHaveLength(2);
  for (const bytes of Object.values(zip))
    expect((await sharp(bytes).metadata()).format).toBe('jpeg');
});
test('image engine integration: main-thread fallback remains functional', async ({
  page,
}) => {
  await page.addInitScript(() => {
    Object.defineProperty(window, 'OffscreenCanvas', {
      value: undefined,
      configurable: true,
    });
  });
  await choose(page, 'png-to-jpg', 'alpha.png');
  const result = await processAndDownload(page, 'Convert image');
  expect(result.metadata.format).toBe('jpeg');
});
