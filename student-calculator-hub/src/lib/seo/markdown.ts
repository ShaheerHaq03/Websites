import { site } from '../../config/site';
import { information } from '../../data/information';
import { calculators, categories, tool, type CalculatorInfo } from '../../data/calculators';

const calculatorUrl = (c: CalculatorInfo) => `${site.url}/calculators/${c.slug}`;

/** Markdown twin of a calculator page, built from the same data that renders the HTML. */
export function calculatorMarkdown(c: CalculatorInfo) {
  const lines = [
    `# ${c.title}`,
    '',
    `> ${c.description}`,
    '',
    `Canonical page: ${calculatorUrl(c)}`,
    `Category: ${c.category}`,
    `Last updated: ${site.updated}`,
    '',
    `## What is the ${c.title}?`,
    '',
    c.answer,
    '',
    c.intro,
    '',
    `## How do I use the ${c.title}?`,
    '',
    ...c.steps.map((step, i) => `${i + 1}. ${step}`),
    '',
    `## ${c.formulaQuestion}`,
    '',
    '```text',
    c.formula,
    '```',
    '',
    c.explanation,
    '',
    '## A worked example',
    '',
    c.example,
    '',
    '## What mistakes should I avoid?',
    '',
    ...c.mistakes.map((m) => `- ${m}`),
    '',
    '## How reliable is this result?',
    '',
    c.limitation,
    '',
    `Use this estimate alongside your syllabus and official records. See our [educational disclaimer](${site.url}/disclaimer) for more context.`,
    '',
    `## ${c.title}: your questions, answered`,
    '',
    ...c.faqs.flatMap((f) => [`### ${f.q}`, '', f.a, '']),
    '## Related calculators',
    '',
    ...c.related.map((id) => {
      const r = tool(id);
      return `- [${r.title}](${calculatorUrl(r)}): ${r.description}`;
    }),
    '',
    '---',
    '',
    `${site.name}: calculations run in your browser. Educational estimates only; always check your institution’s policies.`,
    '',
  ];
  return lines.join('\n');
}

/** llms.txt (llmstxt.org): H1, blockquote summary, prose, then H2 link sections. */
export function llmsTxt() {
  const groups = categories
    .filter((category) => category !== 'All tools')
    .map((category) => [
      `## ${category} calculators`,
      '',
      ...calculators
        .filter((c) => c.category === category)
        .map(
          (c) =>
            `- [${c.title}](${calculatorUrl(c)}): ${c.description} Markdown: ${calculatorUrl(c)}.md`,
        ),
      '',
    ]);
  const info = (page: string, name: string) => {
    const entry = information[page];
    return entry ? [`- [${name}](${site.url}/${page}): ${entry.description}`] : [];
  };
  return [
    `# ${site.name}`,
    '',
    `> ${site.description}`,
    '',
    `${site.name} is a free collection of ${calculators.length} academic calculators for students: GPA and CGPA, weighted grades, final exam targets, grade percentages, attendance, and study planning. Each calculator page explains its formula, gives a worked example, lists common mistakes and limitations, and answers frequent questions. All calculations run locally in the browser; course names, grades, and schedules are not sent to a server, and no account is needed. Results are educational estimates, and institutional policies take precedence.`,
    '',
    'Every calculator page has a plain Markdown version at the same URL with a `.md` suffix.',
    '',
    '## Start here',
    '',
    `- [Home](${site.url}/): Overview of all ${calculators.length} free student calculators.`,
    `- [All calculators](${site.url}/calculators): Searchable directory of every calculator, filterable by category.`,
    '',
    ...groups.flat(),
    '## About',
    '',
    ...info('about', 'About Student Calculator Hub'),
    ...info('contact', 'Contact'),
    ...info('disclaimer', 'Educational Disclaimer'),
    '',
    '## Optional',
    '',
    ...info('privacy-policy', 'Privacy Policy'),
    ...info('terms', 'Terms of Use'),
    '',
  ].join('\n');
}
