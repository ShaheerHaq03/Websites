import { test, expect, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { tools } from '../src/data/tools';
async function ready(page: Page, id: string) {
  await page.goto(`/tools/${id}`);
  await expect(page.locator('.tool-workspace')).toBeVisible();
}
async function editor(page: Page, label: string, text: string) {
  const box = page.getByRole('textbox', { name: label, exact: true });
  await expect(box).toBeVisible();
  await box.fill(text);
}
async function output(page: Page, text: string, label = 'Output') {
  await expect(
    page.getByRole('textbox', { name: label, exact: true }),
  ).toContainText(text);
}

test('homepage, responsive layout, theme, directory and navigation', async ({
  page,
}) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toContainText(
    'Everyday developer',
  );
  await expect(page.locator('[data-tool-card]')).toHaveCount(12);
  await page.getByRole('button', { name: 'Switch to dark theme' }).click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
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
    .fill('JWT');
  await expect(page.locator('[data-tool-card]:visible')).toHaveCount(1);
  await page
    .getByRole('searchbox', { name: 'Search tools', exact: true })
    .fill('no-such-tool');
  await expect(page.locator('[data-empty]')).toBeVisible();
  await page
    .getByRole('searchbox', { name: 'Search tools', exact: true })
    .fill('');
  await page.getByRole('button', { name: 'JSON & Data', exact: true }).click();
  await expect(page.locator('[data-tool-card]:visible')).toHaveCount(4);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
});
test('global search works by keyboard and category', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Search developer tools' }).click();
  await page.getByRole('searchbox', { name: 'Search all tools' }).fill('regex');
  await page.locator('[data-global-result]:visible').click();
  await expect(page).toHaveURL('/tools/regex-tester');
  await page.keyboard.press('Control+k');
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).not.toBeVisible();
});
for (const tool of tools)
  test(`static route, SEO, related links and no overflow: ${tool.id}`, async ({
    page,
  }) => {
    const response = await page.goto(`/tools/${tool.id}`);
    expect(response?.status()).toBe(200);
    await expect(page.locator('.tool-workspace')).toBeVisible();
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(tool.name);
    await expect(page.locator('link[rel=canonical]')).toHaveAttribute(
      'href',
      `https://example.com/tools/${tool.id}`,
    );
    await expect(page.locator('meta[name=description]')).toHaveAttribute(
      'content',
      /.+/,
    );
    expect(
      JSON.parse(
        (await page
          .locator('script[type="application/ld+json"]')
          .textContent())!,
      )['@graph'],
    ).toBeDefined();
    await expect(page.locator('#guide')).toContainText('Troubleshooting');
    await expect(page.locator('#related [data-tool-card]')).toHaveCount(3);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
    ).toBe(true);
    const csp = response?.headers()['content-security-policy'];
    expect(csp).toContain("connect-src 'self'");
    expect(csp).not.toContain("script-src 'self' 'unsafe-inline'");
  });
test('JSON formatter formats, validates, minifies and reports duplicate keys', async ({
  page,
}) => {
  await ready(page, 'json-formatter');
  await editor(page, 'JSON input', '{"a":1,"a":2}');
  await page.getByRole('button', { name: 'Format JSON', exact: true }).click();
  await output(page, '"a": 2');
  await expect(page.locator('.warning-panel')).toContainText('Duplicate');
  await page.getByRole('button', { name: 'Minify', exact: true }).click();
  await output(page, '{"a":2}');
  await editor(page, 'JSON input', '{bad');
  await page.getByRole('button', { name: 'Validate', exact: true }).click();
  await expect(page.getByRole('alert')).toContainText('Invalid JSON');
});
test('JSON diff preserves duplicates in unordered mode and expands paths', async ({
  page,
}) => {
  await ready(page, 'json-diff');
  await editor(page, 'Original JSON', '[1,1]');
  await editor(page, 'Updated JSON', '[1]');
  await page.getByLabel('Ignore array order').check();
  await page.getByRole('button', { name: 'Compare JSON' }).click();
  await expect(page.locator('.success-message')).toContainText('1 removed');
  await page.locator('.diff-change summary').click();
  await expect(page.locator('.diff-values')).toContainText('1');
});
test('JSON to CSV converts nested fields with quoting and a table preview', async ({
  page,
}) => {
  await ready(page, 'json-to-csv');
  await editor(
    page,
    'JSON input',
    '[{"user":{"name":"Ada, Lin"},"tags":[1,2]}]',
  );
  await page.getByRole('button', { name: 'Convert to CSV' }).click();
  await output(page, 'user.name,tags');
  await output(page, '"Ada, Lin"');
  await expect(page.locator('.table-preview')).toContainText('Ada, Lin');
});
test('CSV to JSON handles multiline quotes and rejects duplicate headers', async ({
  page,
}) => {
  await ready(page, 'csv-to-json');
  await editor(page, 'CSV input', 'name,note\nAda,"Hello,\nworld"');
  await page.getByRole('button', { name: 'Convert to JSON' }).click();
  await output(page, 'Hello,\\nworld');
  await editor(page, 'CSV input', 'a,a\n1,2');
  await page.getByRole('button', { name: 'Convert to JSON' }).click();
  await expect(page.getByRole('alert')).toContainText('unique');
});
test('JWT decoder never claims signature verification', async ({ page }) => {
  await ready(page, 'jwt-decoder');
  await expect(page.locator('.security-notice')).toContainText(
    'Signature has not been verified',
  );
  await page.getByRole('button', { name: 'Decode JWT', exact: true }).click();
  await output(page, '"signatureVerified": false', 'Decoded token');
  await output(page, 'Ada Lovelace', 'Decoded token');
});
test('Base64 round trips Unicode and swaps output', async ({ page }) => {
  await ready(page, 'base64-encoder-decoder');
  await editor(page, 'Input', 'Hello 世界 😀');
  await page.getByRole('button', { name: 'Encode', exact: true }).click();
  await output(page, 'SGVsbG8');
  await page.getByRole('button', { name: 'Swap input / output' }).click();
  await page.getByRole('button', { name: 'Decode', exact: true }).click();
  await output(page, 'Hello 世界 😀');
});
test('UUID generation, individual copy controls and validation', async ({
  page,
}) => {
  await ready(page, 'uuid-generator');
  await page.getByLabel('Number of UUIDs').fill('3');
  await page.getByRole('button', { name: 'Generate UUIDs' }).click();
  await expect(page.locator('.uuid-row')).toHaveCount(3);
  const value = await page.locator('.uuid-row code').first().textContent();
  expect(value).toMatch(/^[\da-f]{8}-[\da-f]{4}-4/);
  await page.getByLabel('UUID to validate').fill(value!);
  await page
    .getByRole('button', { name: 'Validate UUID', exact: true })
    .click();
  await expect(page.locator('.validation-box [role=status]')).toContainText(
    'Valid UUID v4',
  );
});
test('regex captures groups, highlights and previews replacement', async ({
  page,
}) => {
  await ready(page, 'regex-tester');
  await page
    .getByLabel('JavaScript pattern', { exact: true })
    .fill('(?<word>hello)');
  await editor(page, 'Test string', 'hello world hello');
  await page.getByLabel('Replacement text').fill('[$<word>]');
  await page.getByRole('button', { name: 'Test expression' }).click();
  await expect(page.locator('mark')).toHaveCount(2);
  await expect(page.locator('.success-message')).toContainText('2 matches');
  await expect(
    page.locator('.panel').filter({
      has: page.getByRole('heading', { name: 'Replacement preview' }),
    }),
  ).toContainText('[hello] world [hello]');
  await page.locator('.captures summary').first().click();
  await expect(page.locator('.captures details').first()).toContainText('word');
});
test('pathological regex terminates its worker and remains usable', async ({
  page,
}) => {
  await ready(page, 'regex-tester');
  await page.getByLabel('JavaScript pattern', { exact: true }).fill('(a+)+$');
  await editor(page, 'Test string', 'a'.repeat(35) + '!');
  await page.getByRole('button', { name: 'Test expression' }).click();
  await expect(page.getByRole('alert')).toContainText('timed out', {
    timeout: 10000,
  });
  await page.getByRole('button', { name: 'Load sample' }).click();
  await page.getByRole('button', { name: 'Test expression' }).click();
  await expect(page.locator('.success-message')).toContainText('2 matches');
});
test('timestamps handle negative seconds and reject ambiguous dates', async ({
  page,
}) => {
  await ready(page, 'unix-timestamp-converter');
  await page.getByLabel('Unix timestamp', { exact: true }).fill('-1');
  await page
    .getByRole('button', { name: 'Convert timestamp', exact: true })
    .click();
  await output(page, '1969-12-31T23:59:59.000Z', 'Converted date');
  await page.getByLabel('Input type').selectOption('date');
  await page
    .getByLabel('ISO date', { exact: true })
    .fill('2026-01-01T12:00:00');
  await page
    .getByRole('button', { name: 'Convert timestamp', exact: true })
    .click();
  await expect(page.getByRole('alert')).toContainText('explicit offset');
});
test('cron builds a real schedule and rejects unsupported syntax', async ({
  page,
}) => {
  await ready(page, 'cron-expression-builder');
  await page.getByRole('button', { name: 'Validate & preview' }).click();
  await expect(page.locator('.success-message')).toContainText('09:00');
  await expect(
    page.getByRole('textbox', { name: 'Next 5 executions', exact: true }),
  ).toContainText('Z');
  await page.getByLabel('Minute', { exact: true }).fill('30');
  await expect(page.getByLabel('Cron expression', { exact: true })).toHaveValue(
    '30 9 * * 1-5',
  );
  await page.getByLabel('Cron expression', { exact: true }).fill('* * * * * *');
  await page.getByRole('button', { name: 'Validate & preview' }).click();
  await expect(page.getByRole('alert')).toContainText('five-field');
});
test('URL encoding, inspection, duplicate parameters and editing', async ({
  page,
}) => {
  await ready(page, 'url-encoder-decoder');
  await editor(page, 'Input', 'hello world&😀');
  await page.getByRole('button', { name: 'Encode', exact: true }).click();
  await output(page, 'hello%20world%26');
  await page.getByRole('button', { name: 'Load sample' }).click();
  await page.getByRole('button', { name: 'Inspect URL' }).click();
  await expect(page.locator('.query-row')).toHaveCount(3);
  await page.getByLabel('Value 1', { exact: true }).fill('new value');
  await page.getByRole('button', { name: 'Rebuild URL' }).click();
  await output(page, 'q=new+value&tag=tools&tag=web');
});
test('HTTP reference searches, filters and shows useful guidance', async ({
  page,
}) => {
  await ready(page, 'http-status-codes');
  await page.getByRole('searchbox', { name: 'Find a status code' }).fill('429');
  await expect(page.locator('.status-card')).toHaveCount(1);
  await expect(page.locator('.status-card')).toContainText('Retry-After');
  await page.getByRole('button', { name: '5xx Server error' }).click();
  await expect(page.locator('.status-list')).toContainText(
    'No status codes match',
  );
  await page.getByRole('button', { name: 'Clear filters' }).click();
  await expect(page.locator('.status-card')).toHaveCount(59);
});
test('file upload, download and oversize rejection', async ({ page }) => {
  await ready(page, 'json-formatter');
  await page.getByLabel('Open local file').setInputFiles({
    name: 'test.json',
    mimeType: 'application/json',
    buffer: Buffer.from('{"uploaded":true}'),
  });
  await page.getByRole('button', { name: 'Format JSON', exact: true }).click();
  await output(page, '"uploaded": true');
  const download = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Download', exact: true }).click();
  expect((await download).suggestedFilename()).toBe('formatted.json');
  await page.getByLabel('Open local file').setInputFiles({
    name: 'large.json',
    mimeType: 'application/json',
    buffer: Buffer.alloc(1_000_001, 32),
  });
  await expect(page.getByRole('alert')).toContainText('1 MB');
});
test('copy output uses clipboard and clear resets both editors', async ({
  page,
  context,
  browserName,
}) => {
  test.skip(
    browserName !== 'chromium',
    'Clipboard permissions are Chromium-specific',
  );
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await ready(page, 'json-formatter');
  await page.getByRole('button', { name: 'Format JSON', exact: true }).click();
  await expect(page.locator('.success-message')).toBeVisible();
  await page.getByRole('button', { name: 'Copy output', exact: true }).click();
  expect(await page.evaluate(() => navigator.clipboard.readText())).toContain(
    'Ada Lovelace',
  );
  await page.getByRole('button', { name: 'Clear', exact: true }).click();
  await expect(
    page.getByRole('textbox', { name: 'JSON input', exact: true }),
  ).toBeEmpty();
});
test('tool transformations do not make external requests or include payloads in URLs', async ({
  page,
}) => {
  const external: string[] = [];
  page.on('request', (request) => {
    if (!request.url().startsWith('http://127.0.0.1:4322'))
      external.push(request.url());
  });
  await ready(page, 'jwt-decoder');
  await page.getByRole('button', { name: 'Decode JWT', exact: true }).click();
  await output(page, 'signatureVerified', 'Decoded token');
  expect(external).toEqual([]);
  expect(page.url()).not.toContain('?');
});
test('static content and links remain available without JavaScript', async ({
  browser,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto('http://127.0.0.1:4322/tools/json-formatter');
  await expect(
    page.getByRole('heading', {
      name: 'What is the JSON Formatter?',
      exact: true,
    }),
  ).toBeVisible();
  await expect(page.locator('#guide')).toContainText(
    'How do I use the JSON Formatter?',
  );
  await expect(page.locator('#faq h3')).toHaveCount(5);
  await context.close();
});
test('supporting routes, feedback draft and real 404 status', async ({
  page,
}) => {
  for (const route of ['about', 'privacy-policy', 'terms', 'disclaimer']) {
    const response = await page.goto(`/${route}`);
    expect(response?.status()).toBe(200);
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  }
  await page.goto('/contact');
  await page.getByLabel('Your message').fill('Please add a YAML formatter.');
  const download = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Save feedback draft' }).click();
  expect((await download).suggestedFilename()).toBe(
    'data-formatter-feedback.txt',
  );
  const response = await page.goto('/this-does-not-exist');
  expect(response?.status()).toBe(404);
  await expect(page.locator('meta[name=robots]')).toHaveAttribute(
    'content',
    'noindex, follow',
  );
});
test('automated accessibility on homepage, directory, editor, JWT, regex and reference', async ({
  page,
}) => {
  for (const route of [
    '/',
    '/tools',
    '/tools/json-formatter',
    '/tools/jwt-decoder',
    '/tools/regex-tester',
    '/tools/http-status-codes',
  ]) {
    await page.goto(route);
    if (route.startsWith('/tools/'))
      await expect(page.locator('.tool-workspace')).toBeVisible();
    const result = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
      .analyze();
    expect(
      result.violations,
      `${route}: ${JSON.stringify(result.violations.map((v) => ({ id: v.id, nodes: v.nodes.map((n) => n.target) })))}`,
    ).toEqual([]);
  }
});

test('dark-theme accessibility and plain textarea fallback', async ({
  page,
}) => {
  await ready(page, 'json-formatter');
  await page.getByRole('button', { name: 'Switch to dark theme' }).click();
  await page
    .locator('.code-editor')
    .first()
    .getByRole('button', { name: 'Use plain textarea' })
    .click();
  await editor(page, 'JSON input', '{"dark":true}');
  await page.getByRole('button', { name: 'Format JSON', exact: true }).click();
  await output(page, '"dark": true');
  const result = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
    .analyze();
  expect(
    result.violations.map((v) => ({
      id: v.id,
      targets: v.nodes.map((n) => n.target),
    })),
  ).toEqual([]);
});

test('editor keyboard navigation does not trap Tab', async ({ page }) => {
  await ready(page, 'json-formatter');
  const input = page.getByRole('textbox', { name: 'JSON input', exact: true });
  await input.focus();
  await page.keyboard.press('Tab');
  await expect(input).not.toBeFocused();
});
