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
const all = await list(root);
const pages = all.filter((file) => file.endsWith('.html'));
const exists = (file) =>
  stat(file)
    .then((s) => s.isFile())
    .catch(() => false);
const headers = await readFile(join(root, '_headers'), 'utf8');
const errors = [];
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
  const firstHeading = html.match(/<h([1-6])\b/)?.[1];
  if (firstHeading !== '1')
    errors.push(`First heading is h${firstHeading}, not h1: ${page}`);
  // JSON-LD must parse, and every @id reference must resolve within the page graph.
  const blocks = [
    ...html.matchAll(
      /<script type="application\/ld\+json">([\s\S]*?)<\/script>/g,
    ),
  ];
  if (!page.endsWith('404.html') && blocks.length !== 1)
    errors.push(`Expected one JSON-LD graph: ${page}`);
  for (const [, json] of blocks) {
    let data;
    try {
      data = JSON.parse(json);
    } catch (error) {
      errors.push(`Invalid JSON-LD in ${page}: ${error.message}`);
      continue;
    }
    const defined = new Set((data['@graph'] || []).map((node) => node['@id']));
    const walk = (value) => {
      if (Array.isArray(value)) value.forEach(walk);
      else if (value && typeof value === 'object') {
        const keys = Object.keys(value);
        if (
          keys.length === 1 &&
          keys[0] === '@id' &&
          !defined.has(value['@id'])
        )
          errors.push(`Unresolved @id ${value['@id']} in ${page}`);
        Object.values(value).forEach(walk);
      }
    };
    walk(data['@graph']);
  }
  // A Markdown alternate must point to a generated .md file with headers.
  const alternate = html.match(
    /<link rel="alternate" type="text\/markdown" href="([^"]+)"/,
  )?.[1];
  if (alternate) {
    const pathname = new URL(alternate).pathname;
    if (!(await exists(join(root, pathname))))
      errors.push(`Missing Markdown twin ${pathname} for ${page}`);
    if (!headers.includes(`${pathname}\n  Content-Type: text/markdown`))
      errors.push(`Missing Markdown headers for ${pathname}`);
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
if (
  /\.(?:html|md|txt)<\/loc>/.test(sitemap) ||
  /\/404(?:\.html)?<\/loc>/.test(sitemap)
)
  errors.push('Sitemap includes noncanonical/error/non-page URLs.');
if ((sitemap.match(/<lastmod>/g) || []).length !== pages.length - 1)
  errors.push('Every sitemap URL needs a lastmod.');
const markdownFiles = all.filter((file) => file.endsWith('.md'));
if (!markdownFiles.length) errors.push('No Markdown twins were generated.');
for (const file of markdownFiles) {
  const md = await readFile(file, 'utf8');
  if (!md.startsWith('# ')) errors.push(`Markdown twin lacks an H1: ${file}`);
}
const llms = await readFile(join(root, 'llms.txt'), 'utf8').catch(() => '');
if (!llms.startsWith('# ') || !/^> /m.test(llms))
  errors.push('llms.txt needs an H1 and a summary blockquote.');
for (const [, url] of llms.matchAll(/\]\((https?:\/\/[^)]+)\)/g)) {
  const pathname = new URL(url).pathname;
  const file = join(root, pathname === '/' ? 'index.html' : `${pathname}.html`);
  if (!(await exists(file))) errors.push(`llms.txt links to missing ${url}`);
}
for (const loc of sitemap.matchAll(/<loc>([^<]+)<\/loc>/g))
  if (!llms.includes(`](${loc[1]})`))
    errors.push(`llms.txt is missing sitemap page ${loc[1]}`);
if ((sitemap.match(/<loc>/g) || []).length !== pages.length - 1)
  errors.push('Sitemap does not match indexable page count.');
if (errors.length) throw new Error(errors.join('\n'));
console.log(
  `Static QA passed: ${pages.length} pages, unique metadata, headings, JSON-LD @id references, internal links/assets, sitemap, llms.txt and ${markdownFiles.length} Markdown twins checked.`,
);
