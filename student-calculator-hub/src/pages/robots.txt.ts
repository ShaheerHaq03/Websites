import type { APIRoute } from 'astro';
import { site, isPlaceholderDomain } from '../config/site';
// RFC 9309: a named group replaces `*` for that crawler, so every AI/search bot gets its own rules.
const agents = [
  '*',
  'OAI-SearchBot',
  'ChatGPT-User',
  'GPTBot',
  'Claude-SearchBot',
  'Claude-User',
  'ClaudeBot',
  'PerplexityBot',
  'Perplexity-User',
  'Google-Extended',
  'Applebot-Extended',
  'Bingbot',
];
const rule = isPlaceholderDomain ? 'Disallow: /' : 'Allow: /';
const groups = agents
  .map(
    (agent) =>
      `User-agent: ${agent}\n${rule}\nContent-Signal: search=yes, ai-input=yes, ai-train=yes`,
  )
  .join('\n\n');
export const GET: APIRoute = () =>
  new Response(`${groups}\n\nSitemap: ${site.url}/sitemap-index.xml\n`, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
