// Test server applies the exact generated Pages security headers to the static build.
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { resolve, extname, sep } from 'node:path';
const root = resolve('dist');
const headersFile = await readFile(resolve(root, '_headers'), 'utf8');
// Parse _headers into per-route rules (exact paths and trailing splats),
// mirroring how Cloudflare Pages attaches headers to matching URLs.
const rules = [];
for (const line of headersFile.split('\n')) {
  if (!line.trim()) continue;
  if (!line.startsWith(' ')) {
    rules.push({ pattern: line.trim(), headers: {} });
    continue;
  }
  const i = line.indexOf(':');
  const name = line.slice(0, i).trim();
  if (rules.length && name !== 'Cache-Control')
    rules.at(-1).headers[name] = line.slice(i + 1).trim();
}
const headersFor = (pathname) =>
  Object.assign(
    {},
    ...rules
      .filter(({ pattern }) =>
        pattern.endsWith('*')
          ? pathname.startsWith(pattern.slice(0, -1))
          : pattern === pathname,
      )
      .map((rule) => rule.headers),
  );
const types = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css',
  '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.txt': 'text/plain',
  '.md': 'text/markdown; charset=utf-8',
  '.xml': 'application/xml',
  '.wasm': 'application/wasm',
};
createServer(async (req, res) => {
  try {
    const pathname = decodeURIComponent(
      new URL(req.url, 'http://localhost').pathname,
    );
    let file = resolve(root, `.${pathname === '/' ? '/index.html' : pathname}`);
    if (file !== root && !file.startsWith(root + sep)) {
      res.writeHead(403);
      res.end();
      return;
    }
    if (!extname(file)) file += '.html';
    let code = 200;
    try {
      await stat(file);
    } catch {
      file = resolve(root, '404.html');
      code = 404;
    }
    res.writeHead(code, {
      'Content-Type': types[extname(file)] || 'application/octet-stream',
      ...headersFor(pathname),
    });
    res.end(await readFile(file));
  } catch {
    res.writeHead(400);
    res.end('Bad request');
  }
}).listen(4331, '127.0.0.1', () =>
  console.log('Static site: http://127.0.0.1:4331 (production CSP enabled)'),
);
