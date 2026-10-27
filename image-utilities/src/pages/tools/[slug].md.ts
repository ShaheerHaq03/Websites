import type { APIRoute } from 'astro';
import { tools, type Tool } from '../../data/tools';
import { toolMarkdown, markdownResponse } from '../../lib/seo/markdown';
export function getStaticPaths() {
  return tools.map((tool) => ({ params: { slug: tool.id }, props: { tool } }));
}
export const GET: APIRoute = ({ props }) =>
  markdownResponse(toolMarkdown((props as { tool: Tool }).tool));
