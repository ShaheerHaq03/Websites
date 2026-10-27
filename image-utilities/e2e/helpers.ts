import { expect, type Page } from '@playwright/test';
import { readFile } from 'node:fs/promises';
import sharp from 'sharp';
export async function choose(page: Page, id: string, file = 'grid.png') {
  await page.goto(`/tools/${id}`);
  await page
    .getByLabel('Choose image files', { exact: true })
    .setInputFiles(`e2e/fixtures/${file}`);
  await expect(page.locator('.file-strip')).toBeVisible();
  await expect
    .poll(() =>
      page
        .locator('img[src^="blob:"]')
        .first()
        .evaluate((img) => (img as HTMLImageElement).naturalWidth),
    )
    .toBeGreaterThan(0);
}
export async function processAndDownload(page: Page, label: string) {
  await page.getByRole('button', { name: label, exact: true }).click();
  await expect(page.locator('[data-result]')).toBeVisible({ timeout: 20000 });
  const download = page.waitForEvent('download');
  await page
    .getByRole('button', { name: 'Download image', exact: true })
    .click();
  const result = await download;
  const path = await result.path();
  const buffer = await readFile(path!);
  return {
    buffer,
    metadata: await sharp(buffer).metadata(),
    name: result.suggestedFilename(),
  };
}
export async function pixel(buffer: Buffer, x: number, y: number) {
  const { data, info } = await sharp(buffer)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  return [
    ...data.subarray((y * info.width + x) * 4, (y * info.width + x) * 4 + 4),
  ];
}
