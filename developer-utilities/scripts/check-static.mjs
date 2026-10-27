import { readdir, readFile, stat } from 'node:fs/promises';
import { resolve, join } from 'node:path';
async function list(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  return (
    await Promise.all(
      entries.map((entry) =>
        entry.isDirectory()
          ? list(join(dir, entry.name))
          : join(dir, entry.name),
      ),
    )
  ).flat();
}
const root = resolve('dist');
const pages = (await list(root)).filter((file) => file.endsWith('.html'));
const errors = [];
const markdownLinks = new Set();
const titles = new Set();
const descriptions = new Set();
for (const page of pages) {
  const html = await readFile(page, 'utf8');
  const title = html.match(/<title>(.*?)<\/title>/)?.[1];
  const description = html.match(
    /<meta name="description" content="([^"]*)"/,
  )?.[1];
  if (!title || titles.has(title))
    errors.push(`Missing/duplicate title: ${page}`);
  if (!description || descriptions.has(description))
    errors.push(`Missing/duplicate description: ${page}`);
  titles.add(title);
  descriptions.add(description);
  if ((html.match(/<h1\b/g) || []).length !== 1)
    errors.push(`Expected one h1: ${page}`);
  const body = html.slice(html.indexOf('<body'));
  if (/<h1\b/.test(body) && body.match(/<h[1-6]\b/)?.[0] !== '<h1')
    errors.push(`First heading is not the h1: ${page}`);
  // Structured data: one parseable @graph whose @id references all resolve.
  const blocks = [
    ...html.matchAll(
      /<script type="application\/ld\+json">([\s\S]*?)<\/script>/g,
    ),
  ];
  if (blocks.length !== 1) errors.push(`Expected one JSON-LD block: ${page}`);
  for (const [, json] of blocks) {
    let graph;
    try {
      graph = JSON.parse(json)['@graph'];
    } catch {
      errors.push(`Invalid JSON-LD: ${page}`);
      continue;
    }
    const ids = new Set(graph.map((node) => node['@id']).filter(Boolean));
    const refs = [];
    const walk = (value) => {
      if (Array.isArray(value)) value.forEach(walk);
      else if (value && typeof value === 'object') {
        const keys = Object.keys(value);
        if (keys.length === 1 && keys[0] === '@id') refs.push(value['@id']);
        else Object.values(value).forEach(walk);
      }
    };
    graph.forEach((node) => Object.values(node).forEach(walk));
    for (const id of refs)
      if (!ids.has(id)) errors.push(`Unresolved JSON-LD @id ${id} in ${page}`);
  }
  // Markdown twins advertised with rel=alternate must exist and get noindex headers.
  for (const [, href] of html.matchAll(
    /<link rel="alternate" type="text\/markdown" href="([^"]+)"/g,
  )) {
    const pathname = new URL(href).pathname;
    markdownLinks.add(pathname);
    if (
      !(await stat(join(root, pathname))
        .then((s) => s.isFile())
        .catch(() => false))
    )
      errors.push(`Missing Markdown twin ${pathname} for ${page}`);
  }
  for (const match of html.matchAll(/(?:href|src)="([^"#]+)"/g)) {
    if (!match[1].startsWith('/') || match[1].startsWith('//')) continue;
    const pathname = new URL(match[1], 'https://local.invalid').pathname;
    const file = join(root, pathname === '/' ? 'index.html' : pathname);
    const candidates = [file, `${file}.html`, join(file, 'index.html')];
    if (
      !(
        await Promise.all(
          candidates.map((f) =>
            stat(f)
              .then((s) => s.isFile())
              .catch(() => false),
          ),
        )
      ).some(Boolean)
    )
      errors.push(`Broken link ${match[1]} in ${page}`);
  }
}
const sitemap = await readFile(join(root, 'sitemap-0.xml'), 'utf8');
if (sitemap.includes('.html</loc>') || /\/404(?:\.html)?<\/loc>/.test(sitemap))
  errors.push('Sitemap includes noncanonical/error URLs.');
if ((sitemap.match(/<loc>/g) || []).length !== pages.length - 1)
  errors.push('Sitemap does not match indexable page count.');
if (/\.(?:md|txt)<\/loc>/.test(sitemap))
  errors.push('Sitemap includes llms.txt or Markdown twins.');
const headers = await readFile(join(root, '_headers'), 'utf8');
for (const pathname of markdownLinks)
  if (
    !headers.includes(
      `${pathname}\n  Content-Type: text/markdown; charset=utf-8\n  X-Robots-Tag: noindex\n`,
    )
  )
    errors.push(`Missing Markdown headers for ${pathname}`);
const llms = await readFile(join(root, 'llms.txt'), 'utf8').catch(() => '');
if (!llms.startsWith('# ')) errors.push('llms.txt is missing or has no H1.');
for (const [, loc] of sitemap.matchAll(/<loc>([^<]+)<\/loc>/g))
  if (!llms.includes(`](${loc})`)) errors.push(`llms.txt does not link ${loc}`);
if (errors.length) throw new Error(errors.join('\n'));
console.log(
  `Static QA passed: ${pages.length} pages, unique metadata, headings, JSON-LD @id graph, internal links/assets, sitemap, llms.txt, and ${markdownLinks.size} Markdown twins checked.`,
);
