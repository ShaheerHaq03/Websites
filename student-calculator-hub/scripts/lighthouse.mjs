import { chromium } from '@playwright/test';
import lighthouse from 'lighthouse';
import { mkdir, writeFile } from 'node:fs/promises';
const base = process.argv[2] || 'http://127.0.0.1:4322';
const prefix = (process.argv[3] || 'preview').replace(/[^a-z0-9-]/gi, '');
await mkdir('docs/reports', { recursive: true });
const browser = await chromium.launch({ args: ['--remote-debugging-port=9223'] });
try {
  for (const [name, path] of [
    ['home-mobile', '/'],
    ['gpa-mobile', '/calculators/gpa-calculator'],
  ]) {
    const result = await lighthouse(new URL(path, base).href, {
      port: 9223,
      onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
      output: 'json',
      logLevel: 'error',
    });
    if (!result) throw new Error('Lighthouse returned no report.');
    if (result.lhr.runtimeError) throw new Error(result.lhr.runtimeError.message);
    await writeFile(`docs/reports/${prefix}-${name}.json`, JSON.stringify(result.lhr));
    console.log(
      JSON.stringify({
        name: `${prefix}-${name}`,
        scores: Object.fromEntries(
          Object.entries(result.lhr.categories).map(([key, value]) => [
            key,
            Math.round(value.score * 100),
          ]),
        ),
        failedAudits: Object.values(result.lhr.audits)
          .filter((a) => a.score !== null && a.score < 1 && a.scoreDisplayMode === 'binary')
          .map((a) => ({ id: a.id, title: a.title })),
      }),
    );
  }
} finally {
  await browser.close();
}
