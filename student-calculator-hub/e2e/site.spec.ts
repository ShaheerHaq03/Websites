import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { calculators } from '../src/data/calculators';
const cases: Record<string, { valid: string; invalidLabel: string; invalidValue: string }> = {
  gpa: { valid: '3.33', invalidLabel: 'Course 1 credits', invalidValue: '0' },
  cgpa: { valid: '3.63', invalidLabel: 'Semester 1 GPA', invalidValue: '5' },
  weighted: { valid: '84.00%', invalidLabel: 'Category 1 weight (%)', invalidValue: '90' },
  final: { valid: '96.67%', invalidLabel: 'Final exam weight (%)', invalidValue: '101' },
  attendance: { valid: '80.00%', invalidLabel: 'Classes attended', invalidValue: '41' },
  required: { valid: '4', invalidLabel: 'Required attendance (%)', invalidValue: '101' },
  percentage: { valid: '84.00%', invalidLabel: 'Total possible marks', invalidValue: '0' },
  assignment: { valid: '63.00', invalidLabel: 'Total assignment marks', invalidValue: '0' },
  semester: { valid: '3.33', invalidLabel: 'Course 1 credits', invalidValue: '0' },
  improvement: { valid: '95.00%', invalidLabel: 'Remaining course weight (%)', invalidValue: '20' },
  study: { valid: '20.0 h', invalidLabel: 'Daily study capacity (hours)', invalidValue: '0' },
  converter: { valid: '15.00', invalidLabel: 'Original total marks', invalidValue: '0' },
};
for (const tool of calculators) {
  test(`${tool.id}: valid, invalid and reset`, async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (e) => errors.push(e.message));
    await page.goto(`/calculators/${tool.slug}`);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(tool.title);
    const form = page.locator('form');
    await form.locator('button[type=submit]').click();
    await expect(page.locator('.result-number')).toHaveText(cases[tool.id]!.valid);
    if (tool.id === 'study')
      await expect(page.getByRole('heading', { name: 'Your daily study schedule' })).toBeVisible();
    await page
      .getByLabel(cases[tool.id]!.invalidLabel, { exact: true })
      .fill(cases[tool.id]!.invalidValue);
    await form.locator('button[type=submit]').click();
    await expect(page.getByRole('alert')).toBeVisible();
    await expect(page.locator('.result-number')).toHaveCount(0);
    await page.getByRole('button', { name: 'Reset', exact: true }).click();
    await expect(page.getByRole('alert')).toHaveCount(0);
    await form.locator('button[type=submit]').click();
    await expect(page.locator('.result-number')).toHaveText(cases[tool.id]!.valid);
    expect(errors).toEqual([]);
  });
}
test('homepage, directory search, category filter and working links', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Make Every');
  await page.getByRole('link', { name: 'Explore calculators', exact: true }).first().click();
  await expect(page.locator('#all-calculators')).toBeVisible();
  await page.getByLabel('Search calculators', { exact: true }).fill('attendance');
  await expect(page.locator('[data-directory] .tool-card:visible')).toHaveCount(2);
  await page.getByLabel('Search calculators', { exact: true }).fill('no such tool');
  await expect(page.locator('[data-no-results]')).toBeVisible();
  await page.goto('/calculators');
  await page.getByRole('button', { name: 'GPA & credits', exact: true }).click();
  await expect(page.locator('.tool-card:visible')).toHaveCount(3);
  await page
    .getByRole('link', { name: /GPA Calculator/ })
    .first()
    .click();
  await expect(page).toHaveURL(/gpa-calculator/);
  await page.locator('[data-related] a').first().click();
  await expect(page).toHaveURL(/cgpa-calculator/);
});
test('dynamic courses, custom scale, and scenario snapshots', async ({ page }) => {
  await page.goto('/calculators/semester-gpa-planner');
  await page.getByRole('button', { name: 'Add course', exact: true }).click();
  await page.getByLabel('Course 4 credits', { exact: true }).fill('4');
  await page.getByRole('button', { name: 'Remove course 4' }).click();
  await page.getByText('Customize grading scale', { exact: false }).click();
  await page.getByLabel('Maximum GPA', { exact: true }).fill('5');
  await page.getByLabel('Grade points for A', { exact: true }).fill('5');
  await page.getByRole('button', { name: 'Calculate projection' }).click();
  await expect(page.locator('.result-number')).toHaveText('3.67');
  await page.getByRole('button', { name: 'Save scenario' }).click();
  await expect(page.locator('.scenario')).toHaveCount(1);
  await page.getByLabel('Course 2 grade', { exact: true }).selectOption('A');
  await page.getByRole('button', { name: 'Calculate projection' }).click();
  await page.getByRole('button', { name: 'Save scenario' }).click();
  await expect(page.locator('.scenario')).toHaveCount(2);
  await expect(page.locator('.scenario').nth(0)).toContainText('3.67');
  await expect(page.locator('.scenario').nth(1)).toContainText('4.33');
});
test('precision, boundaries, conversions, and attendance entry mode', async ({ page }) => {
  await page.goto('/calculators/grade-percentage-calculator');
  await page.getByLabel('Marks obtained', { exact: true }).fill('89.999');
  await page.getByLabel('Total possible marks', { exact: true }).fill('100');
  await page.getByLabel('Decimal places').selectOption('1');
  await page.getByLabel('Apply custom letter-grade boundaries').check();
  await page.getByRole('button', { name: 'Calculate result' }).click();
  await expect(page.locator('.result-number')).toHaveText('90.0%');
  await expect(page.locator('.result-panel')).toContainText('Grade: B');
  await page.goto('/calculators/exam-score-converter');
  await page.getByLabel('Conversion type').selectOption('percentage');
  await page.getByLabel('Percentage (%)', { exact: true }).fill('80');
  await page.getByRole('button', { name: 'Calculate result' }).click();
  await expect(page.locator('.result-number')).toHaveText('16.00');
  await page.goto('/calculators/attendance-percentage-calculator');
  await page.getByLabel('Enter missed classes instead').check();
  await page.getByRole('button', { name: 'Calculate result' }).click();
  await expect(page.locator('.result-number')).toHaveText('80.00%');
});
test('mobile navigation, theme persistence and clearing preference', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await page.getByLabel('Open navigation menu').click();
  await page
    .getByRole('navigation', { name: 'Mobile navigation' })
    .getByRole('link', { name: 'All calculators' })
    .click();
  await expect(page).toHaveURL(/calculators$/);
  await page.getByRole('button', { name: 'Switch to dark mode' }).click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await page.goto('/privacy-policy');
  await page.getByRole('button', { name: 'Clear theme preference' }).click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  expect(await page.evaluate(() => localStorage.getItem('student-hub-theme'))).toBeNull();
});
test('true 404 and all supporting pages', async ({ page }) => {
  for (const path of ['about', 'contact', 'privacy-policy', 'terms', 'disclaimer']) {
    const response = await page.goto(`/${path}`);
    expect(response?.status()).toBe(200);
    await expect(page.locator('h1')).toHaveCount(1);
  }
  const response = await page.goto('/this-page-does-not-exist');
  expect(response?.status()).toBe(404);
  await expect(page.getByRole('heading', { name: 'A little off course.' })).toBeVisible();
  await expect(page.locator('meta[name=robots]')).toHaveAttribute('content', 'noindex, follow');
});
for (const width of [320, 390, 768, 1440]) {
  test(`no horizontal overflow at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    for (const route of [
      '/',
      '/calculators',
      ...calculators.map((t) => `/calculators/${t.slug}`),
    ]) {
      await page.goto(route);
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth),
        `${route} at ${width}px`,
      ).toBe(true);
    }
  });
}
for (const route of [
  '/',
  '/calculators',
  ...calculators.map((t) => `/calculators/${t.slug}`),
  '/about',
  '/contact',
  '/privacy-policy',
  '/terms',
  '/disclaimer',
]) {
  test(`accessibility ${route}`, async ({ page }) => {
    await page.goto(route);
    if (route.startsWith('/calculators/')) await page.locator('form button[type=submit]').click();
    const r = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22a', 'wcag22aa'])
      .analyze();
    expect(r.violations).toEqual([]);
  });
}
test('dark theme accessibility and keyboard calculation', async ({ page }) => {
  await page.goto('/calculators/final-exam-grade-calculator');
  await page.getByRole('button', { name: 'Switch to dark mode' }).click();
  await page.getByLabel('Current grade (%)', { exact: true }).focus();
  await page.keyboard.press('Tab');
  await expect(page.getByLabel('Final exam weight (%)', { exact: true })).toBeFocused();
  await page.keyboard.press('Tab');
  await page.keyboard.press('Tab');
  await page.keyboard.press('Enter');
  await expect(page.locator('.result-number')).toHaveText('96.67%');
  const r = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22a', 'wcag22aa'])
    .analyze();
  expect(r.violations).toEqual([]);
});
test('static metadata, structured data, sitemap and inactive third-party scripts', async ({
  page,
  request,
}) => {
  const titles = new Set<string>();
  for (const tool of calculators) {
    await page.goto(`/calculators/${tool.slug}`);
    titles.add(await page.title());
    await expect(page.locator('link[rel=canonical]')).toHaveAttribute(
      'href',
      `https://example.com/calculators/${tool.slug}`,
    );
    await expect(page.locator('meta[name=description]')).toHaveAttribute(
      'content',
      tool.description,
    );
    const graph = await page.locator('script[type="application/ld+json"]').textContent();
    const data = JSON.parse(graph || '{}');
    expect(
      data['@graph'].some((s: Record<string, unknown>) => s['@type'] === 'WebApplication'),
    ).toBe(true);
    expect(
      data['@graph'].some((s: Record<string, unknown>) => s['@type'] === 'BreadcrumbList'),
    ).toBe(true);
    expect(
      await page.locator('script[src*="googlesyndication"],script[src*="analytics"]').count(),
    ).toBe(0);
  }
  expect(titles.size).toBe(12);
  const sitemap = await request.get('/sitemap-0.xml');
  expect(sitemap.status()).toBe(200);
  for (const tool of calculators)
    expect(await sitemap.text()).toContain(`/calculators/${tool.slug}`);
  const robots = await request.get('/robots.txt');
  expect(await robots.text()).toContain('Disallow: /');
});

test('custom grade labels can be added and selected', async ({ page }) => {
  await page.goto('/calculators/gpa-calculator');
  await page.locator('summary').filter({ hasText: 'Customize grading scale' }).click();
  await page.getByLabel('Additional grade points', { exact: true }).fill('4');
  await page.getByRole('button', { name: 'Add custom grade' }).click();
  await page.getByLabel('Course 2 grade', { exact: true }).selectOption('A+');
  await page.getByRole('button', { name: 'Calculate GPA' }).click();
  await expect(page.locator('.result-number')).toHaveText('3.67');
});

test('category cards open a filtered directory', async ({ page }) => {
  await page.goto('/');
  await page.locator('.category-cards a').filter({ hasText: 'Attendance' }).click();
  await expect(page.locator('.tool-card:visible')).toHaveCount(2);
  await expect(page.getByRole('button', { name: 'Attendance', exact: true })).toHaveAttribute(
    'aria-pressed',
    'true',
  );
});
