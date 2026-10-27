import type { APIRoute } from 'astro';
import { tools, type Tool } from '../../data/tools';
import { toolMarkdown } from '../../lib/seo/markdown';
export function getStaticPaths() {
  return tools.map((tool) => ({ params: { slug: tool.id }, props: { tool } }));
}
export const GET: APIRoute = ({ props }) =>
  new Response(toolMarkdown((props as { tool: Tool }).tool), {
    headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
  });
