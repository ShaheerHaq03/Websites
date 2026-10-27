import type { APIRoute } from 'astro';
import { guides } from '../../content/guides';
import { guideMarkdown, markdownResponse } from '../../lib/seo/markdown';
type Guide = (typeof guides)[number];
export function getStaticPaths() {
  return guides.map((guide) => ({
    params: { slug: guide.slug },
    props: { guide },
  }));
}
export const GET: APIRoute = ({ props }) =>
  markdownResponse(guideMarkdown((props as { guide: Guide }).guide));
