import lighthouse from 'lighthouse';
import { chromium } from '@playwright/test';
import { mkdir, writeFile } from 'node:fs/promises';
await mkdir('reports', { recursive: true });
const browser = await chromium.launch({
  headless: true,
  args: ['--remote-debugging-port=9223'],
});
const results = [];
try {
  for (const path of ['/', '/tools/json-formatter']) {
    const report = await lighthouse(`http://127.0.0.1:4322${path}`, {
      port: 9223,
      output: ['html', 'json'],
      logLevel: 'error',
      onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
    });
    if (!report) throw new Error('No Lighthouse result.');
    const name = path === '/' ? 'home' : 'json-formatter';
    await writeFile(`reports/lighthouse-${name}.html`, report.report[0]);
    await writeFile(`reports/lighthouse-${name}.json`, report.report[1]);
    results.push({
      page: path,
      scores: Object.fromEntries(
        Object.entries(report.lhr.categories).map(([key, value]) => [
          key,
          Math.round((value.score || 0) * 100),
        ]),
      ),
    });
  }
} finally {
  await browser.close();
}
console.log(JSON.stringify(results, null, 2));
await writeFile(
  'reports/lighthouse-summary.json',
  JSON.stringify(results, null, 2),
);
