import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { tools } from '../src/data/tools';
import { choose, processAndDownload } from './helpers';
test('homepage, directory, theme persistence and mobile navigation', async ({
  page,
}) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toContainText(
    'Every image.',
  );
  await expect(page.locator('[data-tool-card]')).toHaveCount(10);
  await page.getByRole('button', { name: 'Switch to dark theme' }).click();
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await page.getByRole('button', { name: 'Switch to light theme' }).click();
  if ((page.viewportSize()?.width || 0) < 541) {
    await page.getByRole('button', { name: 'Toggle navigation' }).click();
    await page
      .getByRole('navigation', { name: 'Mobile navigation' })
      .getByRole('link', { name: 'All tools', exact: true })
      .click();
  } else
    await page
      .getByRole('navigation', { name: 'Main navigation' })
      .getByRole('link', { name: 'All tools', exact: true })
      .click();
  await expect(page).toHaveURL('/tools');
  await page
    .getByRole('searchbox', { name: 'Search tools', exact: true })
    .fill('WebP');
  await expect(page.locator('[data-tool-card]:visible')).toHaveCount(2);
  await page
    .getByRole('searchbox', { name: 'Search tools', exact: true })
    .fill('no such tool');
  await expect(page.locator('[data-empty]')).toBeVisible();
  await page
    .getByRole('searchbox', { name: 'Search tools', exact: true })
    .fill('');
  await page.getByRole('button', { name: 'Convert', exact: true }).click();
  await expect(page.locator('[data-tool-card]:visible')).toHaveCount(4);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
});
test('global search and real homepage file workflow', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Search image tools' }).click();
  await page
    .getByRole('searchbox', { name: 'Search all tools' })
    .fill('metadata');
  await page.locator('[data-global-result]:visible').click();
  await expect(page).toHaveURL('/tools/image-metadata-viewer');
  await page.goto('/');
  await page
    .getByLabel('Choose image files', { exact: true })
    .setInputFiles('e2e/fixtures/grid.png');
  await page
    .getByLabel('Choose a tool', { exact: true })
    .selectOption('image-resizer');
  await page.getByRole('button', { name: 'Open workspace' }).click();
  await expect(page.locator('.file-strip')).toBeVisible();
  await page.getByLabel('Width', { exact: true }).fill('60');
  await expect(page.getByLabel('Height', { exact: true })).toHaveValue('40');
  const output = await processAndDownload(page, 'Resize image');
  expect(output.metadata.width).toBe(60);
});
for (const tool of tools)
  test(`tool route and real sample workflow: ${tool.id}`, async ({ page }) => {
    await page.goto(`/tools/${tool.id}`);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(tool.name);
    await expect(page.locator('link[rel=canonical]')).toHaveAttribute(
      'href',
      `https://example.com/tools/${tool.id}`,
    );
    await expect(page.locator('[data-workspace]')).toBeVisible();
    if (['jpg-to-png', 'webp-to-png'].includes(tool.id))
      await choose(
        page,
        tool.id,
        tool.id === 'jpg-to-png' ? 'camera.jpg' : 'alpha.webp',
      );
    else {
      await page
        .getByRole('button', { name: 'Try a sample', exact: true })
        .click();
      await expect(page.locator('.file-strip')).toBeVisible();
    }
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    await expect(page.locator('#guide')).toContainText(
      'What are the limits of',
    );
    await expect(page.locator('#related [data-tool-card]')).toHaveCount(3);
    if (tool.id === 'image-metadata-viewer') {
      await page
        .getByRole('button', { name: 'Inspect metadata', exact: true })
        .click();
      await expect(page.locator('.metadata-panel')).toContainText(
        'Unavailable',
      );
    } else {
      const action =
        tool.id === 'image-resizer'
          ? 'Resize image'
          : tool.id === 'image-compressor'
            ? 'Compress image'
            : tool.id === 'image-cropper'
              ? 'Crop image'
              : [
                    'aspect-ratio-converter',
                    'social-media-image-resizer',
                  ].includes(tool.id)
                ? 'Create image'
                : 'Convert image';
      await page.getByRole('button', { name: action, exact: true }).click();
      await expect(page.locator('[data-result]')).toBeVisible({
        timeout: 20000,
      });
      await expect(
        page.getByRole('img', { name: 'Processed result', exact: true }),
      ).toBeVisible();
      await expect
        .poll(() =>
          page
            .getByRole('img', { name: 'Processed result', exact: true })
            .evaluate((img) => (img as HTMLImageElement).naturalWidth),
        )
        .toBeGreaterThan(0);
    }
    await page
      .getByRole('button', { name: 'Reset workspace', exact: true })
      .click();
    await expect(page.locator('.dropzone')).toBeVisible();
  });
test('social preset review labels, platform placement and actual output', async ({
  page,
}) => {
  await choose(page, 'social-media-image-resizer');
  await page.getByLabel('Platform', { exact: true }).selectOption('X');
  await expect(page.locator('.preset-note')).toContainText(
    'Official recommendation verified',
  );
  const result = await processAndDownload(page, 'Create image');
  expect(result.metadata.width).toBe(400);
  expect(result.metadata.height).toBe(400);
  await page.getByLabel('Platform', { exact: true }).selectOption('Pinterest');
  await expect(page.locator('.preset-note')).toContainText(
    'General-purpose starting size',
  );
});
test('invalid file, wrong tool input, oversize and invalid dimensions are rejected', async ({
  page,
}) => {
  await page.goto('/tools/png-to-jpg');
  await page
    .getByLabel('Choose image files', { exact: true })
    .setInputFiles('e2e/fixtures/invalid.png');
  await expect(page.getByRole('alert')).toContainText('Unsupported image');
  await page
    .getByLabel('Choose image files', { exact: true })
    .setInputFiles('e2e/fixtures/camera.jpg');
  await expect(page.getByRole('alert')).toContainText('expects PNG');
  await page.getByLabel('Choose image files', { exact: true }).setInputFiles({
    name: 'too-big.png',
    mimeType: 'image/png',
    buffer: Buffer.alloc(20000001),
  });
  await expect(page.getByRole('alert')).toContainText('20 MB');
  await choose(page, 'image-resizer');
  await page.getByLabel('Width', { exact: true }).fill('0');
  await page.getByRole('button', { name: 'Resize image', exact: true }).click();
  await expect(page.getByRole('alert')).toContainText('positive whole pixels');
});
test('drag and drop selects a real local image', async ({ page }) => {
  await page.goto('/tools/image-resizer');
  await expect(page.locator('.dropzone')).toBeVisible();
  const data = await page.evaluateHandle(async () => {
    const bytes = await (await fetch('/images/sample-landscape.png')).blob();
    const transfer = new DataTransfer();
    transfer.items.add(
      new File([bytes], 'local-demo.png', { type: 'image/png' }),
    );
    return transfer;
  });
  await page.locator('.dropzone').dispatchEvent('drop', { dataTransfer: data });
  await expect(page.locator('.file-strip')).toContainText('local-demo.png');
});
test('crop pointer controls and numeric fallback remain inside natural image', async ({
  page,
}) => {
  await choose(page, 'image-cropper');
  await page.getByLabel('Crop aspect ratio').selectOption('1:1');
  await page.getByLabel('Crop zoom').fill('2');
  const mover = page.getByRole('button', {
    name: 'Move crop area with arrow keys or drag',
  });
  await mover.focus();
  await page.keyboard.press('ArrowRight');
  await expect(page.getByLabel('Crop x', { exact: true })).toHaveValue('41');
  const handle = page.getByRole('button', {
    name: 'Resize crop area with arrow keys or drag',
  });
  await handle.focus();
  await page.keyboard.press('ArrowLeft');
  await expect(page.getByLabel('Crop width', { exact: true })).toHaveValue(
    '39',
  );
  const box = await mover.boundingBox();
  if (!box) throw new Error('Crop box missing.');
  await page.mouse.move(box.x + 10, box.y + 10);
  await page.mouse.down();
  await page.mouse.move(box.x + 20, box.y + 10);
  await page.mouse.up();
  expect(
    Number(await page.getByLabel('Crop x', { exact: true }).inputValue()),
  ).toBeGreaterThanOrEqual(41);
});
test('metadata selected copy, GPS reveal and privacy network boundaries', async ({
  page,
  context,
}) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  const requests: string[] = [];
  page.on('request', (r) => {
    if (
      r.url().startsWith('http') &&
      (!r.url().startsWith('http://127.0.0.1:4331/') || r.method() !== 'GET')
    )
      requests.push(r.url());
  });
  await choose(page, 'image-metadata-viewer', 'gps.jpg');
  await page
    .getByRole('button', { name: 'Inspect metadata', exact: true })
    .click();
  await expect(page.locator('.metadata-panel')).toContainText(
    'Location metadata is present',
  );
  await expect(
    page.getByLabel('Include latitude', { exact: true }),
  ).toHaveCount(0);
  await page.getByRole('button', { name: 'Reveal GPS fields' }).click();
  await page.getByLabel('Include latitude', { exact: true }).check();
  await page
    .getByRole('button', { name: 'Copy selected', exact: true })
    .click();
  expect(await page.evaluate(() => navigator.clipboard.readText())).toContain(
    '51.5',
  );
  expect(requests).toEqual([]);
  expect(page.url()).not.toContain('?');
});
test('supporting pages, guides and real 404 response', async ({ page }) => {
  for (const path of [
    '/about',
    '/contact',
    '/privacy-policy',
    '/terms',
    '/disclaimer',
    '/guides',
    '/guides/jpg-vs-png-vs-webp',
  ]) {
    const response = await page.goto(path);
    expect(response?.status()).toBe(200);
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
  }
  const response = await page.goto('/missing-image-page');
  expect(response?.status()).toBe(404);
  await expect(page.locator('meta[name=robots]')).toHaveAttribute(
    'content',
    'noindex, follow',
  );
});
test('automated accessibility: homepage, directory, selected workspace, crop and metadata', async ({
  page,
}) => {
  for (const path of [
    '/',
    '/tools',
    '/tools/image-compressor',
    '/tools/image-cropper',
    '/tools/image-metadata-viewer',
  ]) {
    await page.goto(path);
    if (path.startsWith('/tools/')) {
      await page
        .getByLabel('Choose image files', { exact: true })
        .setInputFiles('e2e/fixtures/grid.png');
      await expect(page.locator('.file-strip')).toBeVisible();
    }
    const result = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
      .analyze();
    expect(
      result.violations.map((v) => ({
        id: v.id,
        nodes: v.nodes.map((n) => n.target),
      })),
      path,
    ).toEqual([]);
  }
});
test('dark mode result accessibility', async ({ page }) => {
  await choose(page, 'png-to-jpg', 'alpha.png');
  await page.getByRole('button', { name: 'Switch to dark theme' }).click();
  await page
    .getByRole('button', { name: 'Convert image', exact: true })
    .click();
  await expect(page.locator('[data-result]')).toBeVisible();
  const result = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
    .analyze();
  expect(
    result.violations.map((v) => ({
      id: v.id,
      nodes: v.nodes.map((n) => n.target),
    })),
  ).toEqual([]);
});

test('reset cancels an in-flight image worker without stale output', async ({
  page,
}) => {
  await choose(page, 'image-compressor', 'noise.png');
  await page.route('**/*image.worker*.js', async (route) => {
    await new Promise((resolve) => setTimeout(resolve, 250));
    await route.continue().catch(() => {});
  });
  await page
    .getByRole('button', { name: 'Compress image', exact: true })
    .click();
  await page
    .getByRole('button', { name: 'Reset workspace', exact: true })
    .click();
  await expect(page.locator('.dropzone')).toBeVisible();
  await expect(page.locator('[data-result]')).toHaveCount(0);
  await page
    .getByLabel('Choose image files', { exact: true })
    .setInputFiles('e2e/fixtures/grid.png');
  await expect(page.locator('.file-strip')).toContainText('grid.png');
  await page
    .getByRole('button', { name: 'Compress image', exact: true })
    .click();
  await expect(page.locator('[data-result]')).toBeVisible();
});
