import { site } from '../config/site';
/** Search and AI crawlers that get an explicit group (RFC 9309: a named group replaces `*`). */
const namedAgents = [
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
const contentSignal = 'Content-Signal: search=yes, ai-input=yes, ai-train=yes';
const group = (agent: string) =>
  `User-agent: ${agent}\nAllow: /\n${contentSignal}\n`;
export const GET = () =>
  new Response(
    `${['*', ...namedAgents].map(group).join('\n')}\nSitemap: ${site.url}/sitemap-index.xml\n`,
    { headers: { 'Content-Type': 'text/plain; charset=utf-8' } },
  );
