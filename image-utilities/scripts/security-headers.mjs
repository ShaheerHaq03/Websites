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
    // JSON-LD is a data block, not executed script, so CSP does not apply to it.
    if (/\btype\s*=\s*["']?application\/ld\+json/i.test(match[1])) continue;
    if (!/\bsrc\s*=/.test(match[1]) && match[2].trim())
      hashes.add(
        `'sha256-${createHash('sha256').update(match[2]).digest('base64')}'`,
      );
  }
}
const csp = `default-src 'self'; script-src 'self' 'wasm-unsafe-eval' ${[...hashes].join(' ')}; style-src 'self' 'unsafe-inline'; img-src 'self' blob: data:; font-src 'self'; connect-src 'self'; worker-src 'self'; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'`;
if (`  Content-Security-Policy: ${csp}`.length > 2000)
  throw new Error(
    'CSP exceeds Cloudflare Pages 2,000-character header line limit. Use per-route hashes.',
  );
// Markdown twins of tool/guide pages: served as Markdown and kept out of the
// index so they never compete with the HTML pages. Listed per file because
// Cloudflare Pages splats are not documented to match a suffix like /*.md.
const markdownPaths = all
  .filter((file) => file.endsWith('.md'))
  .map((file) => `/${relative('dist', file).split(sep).join('/')}`)
  .sort();
const markdown = markdownPaths
  .map(
    (path) =>
      `${path}\n  Content-Type: text/markdown; charset=utf-8\n  X-Robots-Tag: noindex\n`,
  )
  .join('\n');
await writeFile(
  'dist/_headers',
  `/*\n  Content-Security-Policy: ${csp}\n  X-Content-Type-Options: nosniff\n  Referrer-Policy: strict-origin-when-cross-origin\n  X-Frame-Options: DENY\n  Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=()\n  Strict-Transport-Security: max-age=31536000\n\n/_astro/*\n  Cache-Control: public, max-age=31536000, immutable\n\n/llms.txt\n  Content-Type: text/plain; charset=utf-8\n${markdown ? `\n${markdown}` : ''}`,
);
console.log(
  `Generated Cloudflare security headers with ${hashes.size} inline script hashes and ${markdownPaths.length} Markdown rules.`,
);
