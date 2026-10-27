import { readdir, readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { join, relative, sep } from 'node:path';
async function files(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  return (
    await Promise.all(
      entries.map((entry) =>
        entry.isDirectory()
          ? files(join(dir, entry.name))
          : join(dir, entry.name),
      ),
    )
  ).flat();
}
const hashes = new Set();
const all = await files('dist');
for (const file of all) {
  if (!file.endsWith('.html')) continue;
  const html = await readFile(file, 'utf8');
  for (const match of html.matchAll(
    /<script\b([^>]*)>([\s\S]*?)<\/script>/gi,
  )) {
    // JSON-LD is a data block, not executed script, so script-src never applies to it.
    if (/\btype\s*=\s*["']?application\/ld\+json/i.test(match[1])) continue;
    if (!/\bsrc\s*=/.test(match[1]) && match[2].trim())
      hashes.add(
        `'sha256-${createHash('sha256').update(match[2]).digest('base64')}'`,
      );
  }
}
const csp = `default-src 'self'; script-src 'self' ${[...hashes].join(' ')}; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'self'; worker-src 'self'; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'; upgrade-insecure-requests`;
if (`  Content-Security-Policy: ${csp}`.length > 2000)
  throw new Error(
    'CSP exceeds Cloudflare Pages 2,000-character header line limit. Use per-route hashes.',
  );
// Markdown twins of HTML pages: served as Markdown and kept out of search indexes.
// Listed explicitly (one rule per file) so no header is ever applied twice.
const markdown = all
  .filter((file) => file.endsWith('.md'))
  .map((file) => '/' + relative('dist', file).split(sep).join('/'))
  .sort()
  .map(
    (path) =>
      `${path}\n  Content-Type: text/markdown; charset=utf-8\n  X-Robots-Tag: noindex\n`,
  )
  .join('\n');
await writeFile(
  'dist/_headers',
  `/*\n  Content-Security-Policy: ${csp}\n  X-Content-Type-Options: nosniff\n  Referrer-Policy: strict-origin-when-cross-origin\n  X-Frame-Options: DENY\n  Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=()\n  Strict-Transport-Security: max-age=31536000\n\n/_astro/*\n  Cache-Control: public, max-age=31536000, immutable\n${markdown ? `\n${markdown}` : ''}`,
);
console.log(
  `Generated Cloudflare security headers with ${hashes.size} inline script hashes and ${markdown ? markdown.split('\n\n').length : 0} Markdown rules.`,
);
