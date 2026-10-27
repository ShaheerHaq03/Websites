import { llmsTxt } from '../lib/seo/markdown';
export const GET = () =>
  new Response(llmsTxt(), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
