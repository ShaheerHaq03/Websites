import { site, canonical } from '../../config/site';
import { getTool, tools, type Tool } from '../../data/tools';
import { content, toolHeadings, privacyNote } from '../../content/tools';
import { guides } from '../../content/guides';
import { pages } from '../../data/pages';

type Guide = (typeof guides)[number];

/** Facts shown under every tool workspace (keep in sync with the tool page). */
export const workspaceFacts =
  'Static JPG, PNG & WebP · 20 MB per file · 16 MP maximum · No account needed';

export const markdownResponse = (body: string) =>
  new Response(body, {
    headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
  });

const link = (name: string, path: string) => `[${name}](${canonical(path)})`;

export function toolMarkdown(tool: Tool) {
  const c = content[tool.id];
  const h = toolHeadings(c);
  const path = `/tools/${tool.id}`;
  return (
    [
      `# ${tool.name}`,
      `> ${c.metaDescription}`,
      `HTML version: ${canonical(path)} · Last updated: ${site.updated} · Category: ${tool.category}`,
      `## ${h.what}`,
      c.answer,
      c.intro,
      workspaceFacts,
      `## ${h.how}`,
      c.steps.map((step, i) => `${i + 1}. ${step}`).join('\n'),
      `### An everyday example`,
      c.example,
      `## ${h.uses}`,
      c.uses.map((use) => `- ${use}`).join('\n'),
      `## ${h.quality}`,
      c.quality,
      `## ${h.limits}`,
      c.limits,
      `## ${h.privacy}`,
      `${privacyNote} Read the ${link('privacy policy', pages.privacy.path)} for the full picture.`,
      `## ${h.faq}`,
      c.faq.map(([q, a]) => `### ${q}\n\n${a}`).join('\n\n'),
      `## Related tools`,
      tool.related
        .map((id) => {
          const related = getTool(id);
          return `- ${link(related.name, `/tools/${id}`)}: ${content[id].metaDescription}`;
        })
        .join('\n'),
    ].join('\n\n') + '\n'
  );
}

export function guideMarkdown(guide: Guide) {
  const path = `/guides/${guide.slug}`;
  return (
    [
      `# ${guide.title}`,
      `> ${guide.description}`,
      `HTML version: ${canonical(path)} · Last updated: ${site.updated} · ${guide.readTime} min read`,
      ...guide.sections.map(([heading, text]) => `## ${heading}\n\n${text}`),
      `## Put it into practice`,
      guide.related
        .map(
          (id) =>
            `- ${link(getTool(id).name, `/tools/${id}`)}: ${content[id].metaDescription}`,
        )
        .join('\n'),
      `Technical references: [MDN image formats](https://developer.mozilla.org/en-US/docs/Web/Media/Guides/Formats/Image_types) and [Canvas API](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API). Processing details describe this implementation; destination requirements should be checked separately.`,
    ].join('\n\n') + '\n'
  );
}

export function llmsTxt() {
  const entry = (name: string, path: string, note: string, md = false) =>
    `- ${link(name, path)}: ${note}${md ? ` Markdown: ${canonical(`${path}.md`)}` : ''}`;
  return (
    [
      `# ${site.name}`,
      `> ${site.description}`,
      `${site.name} is a set of ${tools.length} focused image utilities for resizing, compressing, cropping, changing aspect ratio, converting between JPG, PNG and WebP, preparing social media canvases, and inspecting EXIF metadata. Image decoding, processing and encoding run locally in the visitor's browser (Web Workers and Canvas, with a bundled WebAssembly WebP encoder as a fallback); selected images, filenames and metadata are not uploaded to a server, and no account is required. Input is limited to static JPG, PNG and WebP files up to 20 MB, 16 megapixels and 8,192 pixels per side; batches allow up to 10 files and 60 MB.`,
      `Every tool and guide page below also has a plain Markdown version at the same URL with a \`.md\` suffix.`,
      `## Tools`,
      [
        entry(
          'All image tools',
          '/tools',
          'Directory of every PixelTools image tool, filterable by category.',
        ),
        ...tools.map((tool) =>
          entry(
            tool.name,
            `/tools/${tool.id}`,
            content[tool.id].metaDescription,
            true,
          ),
        ),
      ].join('\n'),
      `## Guides`,
      [
        entry(
          'All image guides',
          '/guides',
          'Practical guides to pixels, formats and image privacy.',
        ),
        ...guides.map((guide) =>
          entry(
            guide.metaTitle,
            `/guides/${guide.slug}`,
            guide.metaDescription,
            true,
          ),
        ),
      ].join('\n'),
      `## About`,
      [
        entry(`${site.name} home`, '/', site.description),
        ...Object.values(pages).map((page) =>
          entry(page.name, page.path, page.metaDescription),
        ),
      ].join('\n'),
    ].join('\n\n') + '\n'
  );
}
