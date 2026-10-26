# Student Calculator Hub

A static, privacy-conscious educational website with twelve functional calculators, original formula guides, editable grading policies, responsive light/dark UI, and a searchable directory. Built with Astro 7, React 19 islands, strict TypeScript 6, Tailwind 4, pnpm, Vitest, and Playwright.

## Local development

Use Node **24.19.0** (see `.nvmrc`) and pnpm **9.12.0**.

```sh
pnpm install --frozen-lockfile
pnpm dev
```

Open the local URL printed by Astro. Production preview:

```sh
pnpm build
pnpm preview
```

## Validation

```sh
pnpm check
pnpm lint
pnpm test
pnpm build
pnpm exec playwright install chromium
pnpm test:e2e
pnpm format:check
```

`pnpm verify` runs type checks, lint, unit tests, build, and E2E in order. E2E runs against the **production build**, including all calculator routes, valid and invalid scenarios, reset, dynamic courses, custom scales, scenario comparisons, filters, themes, keyboard operation, true 404, metadata, structured data, and automated axe accessibility checks. Responsive checks use 320, 390, 768, and 1440px widths. See [docs/QA-REPORT.md](docs/QA-REPORT.md) for actual executed results and limitations; do not infer a Lighthouse score from design targets.

## Routes and tools

| Route                                           | Purpose                                                   |
| ----------------------------------------------- | --------------------------------------------------------- |
| `/`                                             | Homepage and searchable toolkit                           |
| `/calculators`                                  | Calculator directory and category filters                 |
| `/calculators/gpa-calculator`                   | Credit-weighted GPA with editable letter points           |
| `/calculators/cgpa-calculator`                  | Credit-weighted cumulative semester GPA                   |
| `/calculators/weighted-grade-calculator`        | Normalized completed-work average and course contribution |
| `/calculators/final-exam-grade-calculator`      | Required final score, including impossible goals          |
| `/calculators/attendance-percentage-calculator` | Attendance from attended or missed classes                |
| `/calculators/required-attendance-calculator`   | Minimum consecutive attendance and current miss allowance |
| `/calculators/grade-percentage-calculator`      | Raw marks, precision, custom grade boundaries             |
| `/calculators/assignment-weight-calculator`     | New assignment contribution without double counting       |
| `/calculators/semester-gpa-planner`             | Projected GPA and temporary scenario comparisons          |
| `/calculators/grade-improvement-calculator`     | Required remaining assessment average                     |
| `/calculators/study-hours-planner`              | Deterministic deadline-first daily schedule               |
| `/calculators/exam-score-converter`             | Raw/percentage/mark-scale conversion and rounding         |
| `/about`, `/contact`                            | Purpose and operator contact                              |
| `/privacy-policy`, `/terms`, `/disclaimer`      | Relevant disclosures, with explicit owner placeholders    |
| `/404`                                          | Not-found document; unknown routes return 404             |

## Architecture

- `src/config/site.ts`: site name, URL, colors, contact, owner, social links, ad and analytics settings.
- `src/data/calculators.ts`: single calculator registry, metadata, related tools, and original guide content.
- `src/lib/calculations/index.ts`: pure calculation engines and validation; no browser or network requirements.
- `src/components/ui/CalculatorUI.tsx`: reusable inputs, dynamic rows, result panels, error/reset/copy controls.
- `src/components/calculators/Calculator.tsx`: interactive forms; only calculator pages hydrate React.
- `src/layouts/BaseLayout.astro`: static navigation/footer, canonical and social metadata, JSON-LD, theme.
- `src/components/common/ToolDirectory.astro`: static cards enhanced by small filtering script.
- `src/pages`: static generated public pages and generated robots.txt.
- `public/_headers`: Cloudflare security and asset-cache headers.

No backend, database, account, paid API, or external AI inference is required. Calculation inputs, course names, and study plans stay in memory in the page. Theme preference alone uses localStorage. Scenario snapshots clear on reload or reset. Results can be copied using browser clipboard permission.

## Calculation assumptions

GPA is weighted by included credits. Default grade points are examples, editable per institution. Zero-credit rows are rejected rather than silently included. Weighted grades show both normalized completed-work average and full-course contributed points. Weights over 100% are rejected. Assignment inputs are contributions, not normalized averages. Completed and remaining weights in grade improvement must total 100%.

Impossible targets are reported without clamping. Exact 100% attendance after an absence is impossible in finite additional sessions. Attendance calculations use whole session counts. Study planning includes the deadline day, uses earliest deadline first, priority for ties, and 0.01-hour increments; it checks feasibility and makes no learning guarantees. Percentage conversion is proportional and is not percentile ranking or official test equating. Display rounding does not change grade-boundary decisions.

## Before public launch

Copy `.env.example` to `.env` for local builds, or set public variables in Cloudflare Pages. Astro embeds public configuration **at build time**; rebuild after changes.

- Supply a real HTTPS `PUBLIC_SITE_URL`.
- Supply `PUBLIC_CONTACT_EMAIL`, `PUBLIC_OWNER_NAME`, and `PUBLIC_JURISDICTION`.
- Review and adapt legal disclosures to the actual operator, hosting, retention, and applicable law.
- Verify your custom domain, HTTPS, routing, sitemap, and canonical URLs after deployment.
- Leave ads and analytics disabled until provider setup and privacy/consent review are complete.

The default `https://example.com` is explicitly a **placeholder**. Default builds are `noindex, follow` and robots-blocked to avoid accidental indexing under a fictitious domain. Set a real site URL to generate indexable production metadata. `pnpm launch:check` checks the exported launch environment and intentionally fails with default placeholders. It does not load `.env` itself and is not legal approval.

See [deployment instructions](docs/DEPLOYMENT.md), [advertising and privacy](docs/ADS-AND-PRIVACY.md), [future calculator checklist](docs/SEO-CHECKLIST.md), and [implementation report](docs/IMPLEMENTATION.md).

## Fonts and branding

The logo and decorative graphics are original SVG/CSS. Inter is self-hosted through Fontsource under its included Open Font License. No remote font or stock-image service is contacted by visitors. The supplied design-reference image was unavailable; the interface follows the written design brief.
