import { site } from '../config/site';
// RFC 9309: a named group replaces the * group for that crawler, so each one repeats the rules.
const contentSignal = 'Content-Signal: search=yes, ai-input=yes, ai-train=yes';
const aiCrawlers = [
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
const group = (agent: string) =>
  `User-agent: ${agent}\nAllow: /\n${contentSignal}\n`;
export const GET = () =>
  new Response(
    `${['*', ...aiCrawlers].map(group).join('\n')}\nSitemap: ${site.url}/sitemap-index.xml\n`,
    { headers: { 'Content-Type': 'text/plain; charset=utf-8' } },
  );
