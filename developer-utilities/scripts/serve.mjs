// Test server applies the exact generated Pages security headers to the static build.
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { resolve, extname, sep } from 'node:path';
const root = resolve('dist');
const headersFile = await readFile(resolve(root, '_headers'), 'utf8');
// Parse _headers into { pattern: { name: value } }. Only "/*" (all pages) and exact paths are used here.
const rules = {};
let current = null;
for (const line of headersFile.split('\n')) {
  if (!line.trim()) continue;
  if (!line.startsWith('  ')) {
    current = rules[line.trim()] = {};
    continue;
  }
  const i = line.indexOf(':');
  if (current) current[line.slice(2, i)] = line.slice(i + 1).trim();
}
const types = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css',
  '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.txt': 'text/plain; charset=utf-8',
  '.png': 'image/png',
  '.xml': 'application/xml',
  '.md': 'text/markdown; charset=utf-8',
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
      ...rules['/*'],
      'Content-Type': types[extname(file)] || 'application/octet-stream',
      ...(code === 200 ? rules[pathname] : undefined),
    });
    res.end(await readFile(file));
  } catch {
    res.writeHead(400);
    res.end('Bad request');
  }
}).listen(4322, '127.0.0.1', () =>
  console.log('Static site: http://127.0.0.1:4322 (production CSP enabled)'),
);
