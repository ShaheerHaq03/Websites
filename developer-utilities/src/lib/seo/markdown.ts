// Markdown twins of the tool pages and the /llms.txt index, built from the same data as the HTML.
import { site, canonical } from '../../config/site';
import { tools, getTool, type Tool, type ToolId } from '../../data/tools';
import { content } from '../../content/tools';
import { pages } from '../../data/pages';
export const toolMarkdownPath = (id: ToolId) => `/tools/${id}.md`;
const fence = (text: string) => ['```text', text, '```'].join('\n');
export function toolMarkdown(tool: Tool) {
  const guide = content[tool.id];
  const url = canonical(`/tools/${tool.id}`);
  return [
    `# ${tool.name}`,
    '',
    `> ${tool.description}`,
    '',
    `- Web page: ${url}`,
    `- Category: ${tool.category}`,
    `- Price: free, no account required`,
    `- Processing: runs locally in your browser; input is not uploaded`,
    `- Last updated: ${site.updated}`,
    '',
    `## ${guide.question}`,
    '',
    guide.answer,
    '',
    guide.intro,
    '',
    `## How do I use ${guide.subject}?`,
    '',
    ...guide.steps.map((step, index) => `${index + 1}. ${step}`),
    '',
    '## Example input & output',
    '',
    'Input:',
    '',
    fence(guide.example[0]),
    '',
    'Output:',
    '',
    fence(guide.example[1]),
    '',
    `## What can I use ${guide.subject} for?`,
    '',
    ...guide.uses.map((use) => `- ${use}`),
    '',
    `## What are the limitations of ${guide.subject}?`,
    '',
    guide.limitation,
    '',
    '## Troubleshooting',
    '',
    guide.troubleshooting,
    '',
    '## Frequently asked questions',
    '',
    ...guide.faqs.flatMap(([question, answer]) => [
      `### ${question}`,
      '',
      answer,
      '',
    ]),
    '## Related tools',
    '',
    ...tool.related.map((id) => {
      const related = getTool(id);
      return `- [${related.name}](${canonical(`/tools/${id}`)}): ${related.description}`;
    }),
    `- [All developer tools](${canonical('/tools')}): ${pages.tools.metaDescription}`,
    '',
  ].join('\n');
}
export function llmsTxt() {
  const link = (name: string, path: string, note: string) =>
    `- [${name}](${canonical(path)}): ${note}`;
  const sitePages = Object.values(pages);
  return [
    `# ${site.name}`,
    '',
    `> ${site.name} is a free collection of ${tools.length} browser-based developer tools for JSON, CSV, JWT, Base64, URL encoding, UUIDs, regular expressions, Unix timestamps, cron schedules, and HTTP status codes.`,
    '',
    'Core tool operations run locally in the browser: editor text, local files, and tokens are processed on the device and are not uploaded to an application server, and no account is required. Each tool page explains what the tool does, how to use it, an example, its limitations, troubleshooting notes, and an FAQ. Every tool page also has a plain Markdown version at the same URL with a .md suffix.',
    '',
    '## Tools',
    '',
    ...tools.map((tool) =>
      link(
        tool.name,
        `/tools/${tool.id}`,
        `${tool.description} Markdown: ${canonical(toolMarkdownPath(tool.id))}`,
      ),
    ),
    '',
    '## Site',
    '',
    ...sitePages
      .filter((page) => page.section === 'site')
      .map((page) => link(page.name, page.path, page.metaDescription)),
    '',
    '## Optional',
    '',
    ...sitePages
      .filter((page) => page.section === 'optional')
      .map((page) => link(page.name, page.path, page.metaDescription)),
    '',
  ].join('\n');
}
