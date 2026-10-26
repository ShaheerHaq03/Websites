import { readFile, readdir, stat } from 'node:fs/promises';
import { resolve, join, sep } from 'node:path';
const root = resolve(process.argv[2] || 'dist');
async function walk(dir) {
  const files = [];
  for (const name of await readdir(dir)) {
    const path = join(dir, name);
    if ((await stat(path)).isDirectory()) files.push(...(await walk(path)));
    else files.push(path);
  }
  return files;
}
const pages = (await walk(root)).filter((p) => p.endsWith('.html'));
const titles = new Set(),
  descriptions = new Set();
let links = 0,
  schemas = 0;
async function targetFor(pathname) {
  if (pathname === '/') return join(root, 'index.html');
  const file = resolve(root, '.' + pathname);
  if (file !== root && !file.startsWith(root + sep)) throw new Error('Unsafe internal path');
  for (const candidate of [file, file + '.html', join(file, 'index.html')]) {
    try {
      if ((await stat(candidate)).isFile()) return candidate;
    } catch {
      /* Try next static mapping. */
    }
  }
  throw new Error(`Missing internal destination: ${pathname}`);
}
for (const page of pages) {
  const html = await readFile(page, 'utf8');
  const title = html.match(/<title>([\s\S]*?)<\/title>/)?.[1];
  const description = html.match(/<meta name="description" content="([^"]*)"/i)?.[1];
  if (!title || titles.has(title)) throw new Error(`Missing/duplicate title: ${page}`);
  if (!description || descriptions.has(description))
    throw new Error(`Missing/duplicate description: ${page}`);
  titles.add(title);
  descriptions.add(description);
  if ((html.match(/<h1(?:\s|>)/g) || []).length !== 1) throw new Error(`Expected one H1: ${page}`);
  for (const match of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    const schema = JSON.parse(match[1]);
    if (schema['@context'] !== 'https://schema.org' || !Array.isArray(schema['@graph']))
      throw new Error(`Invalid JSON-LD graph: ${page}`);
    schemas++;
  }
  for (const match of html.matchAll(/<a\b[^>]*href="([^"]*)"/g)) {
    const href = match[1].replace(/&amp;/g, '&');
    if (!href.startsWith('/') && !href.startsWith('#')) continue;
    const url = new URL(
      href,
      'https://local.test' +
        (page.endsWith('index.html')
          ? '/'
          : '/' + page.slice(root.length + 1).replace(/\.html$/, '')),
    );
    const target = href.startsWith('#') ? page : await targetFor(url.pathname);
    if (url.hash) {
      const targetHtml = await readFile(target, 'utf8');
      const id = decodeURIComponent(url.hash.slice(1));
      if (!targetHtml.includes(`id="${id}"`)) throw new Error(`Missing fragment ${href}: ${page}`);
    }
    links++;
  }
}
console.log(
  `${pages.length} HTML pages: unique titles/descriptions, one H1 each, ${schemas} parsed JSON-LD graphs, ${links} valid internal links/fragments.`,
);
