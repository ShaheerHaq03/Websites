# Implementation report

Completed locally on 26 October 2026. The application is implemented and verified; public launch still requires the operator-specific configuration below. No hosting account has been created, no deployment has been made, and ads and analytics are inactive.

## Delivered

- Astro 7.4.2 static generation, React 19.3.1 calculator islands, strict TypeScript 6.0.3, Tailwind 4.3.3, and pnpm 9.12.0 with a lockfile.
- Original responsive branding and homepage; searchable directory; category shortcuts; light/dark preference; visible keyboard focus and reduced-motion support.
- Twelve pure calculation engines, input validation, reset, copy controls, worked examples, formula explanations, common mistakes, limitations, FAQs, and related tools.
- Editable GPA points and additional grade labels, dynamic course/semester/category/subject rows, temporary scenario snapshots, custom grade boundaries, precision/rounding, attendance entry modes, and feasibility-aware study schedules.
- Unique metadata, extensionless canonical URLs, sitemap and robots.txt, static JSON-LD WebSite/WebApplication/BreadcrumbList, social preview artwork, and real 404 handling.
- Informational/legal pages with honest owner placeholders, disabled advertising component and gated loader, local analytics abstraction, security headers, CI, and Cloudflare Pages documentation.

## Calculator routes and verification

Each calculator has passing unit tests and a browser test covering a valid calculation, invalid input, and reset.

| Calculator                       | Route                                           | Unit / browser |
| -------------------------------- | ----------------------------------------------- | -------------- |
| GPA Calculator                   | `/calculators/gpa-calculator`                   | Pass / Pass    |
| CGPA Calculator                  | `/calculators/cgpa-calculator`                  | Pass / Pass    |
| Weighted Grade Calculator        | `/calculators/weighted-grade-calculator`        | Pass / Pass    |
| Final Exam Grade Calculator      | `/calculators/final-exam-grade-calculator`      | Pass / Pass    |
| Attendance Percentage Calculator | `/calculators/attendance-percentage-calculator` | Pass / Pass    |
| Required Attendance Calculator   | `/calculators/required-attendance-calculator`   | Pass / Pass    |
| Grade Percentage Calculator      | `/calculators/grade-percentage-calculator`      | Pass / Pass    |
| Assignment Weight Calculator     | `/calculators/assignment-weight-calculator`     | Pass / Pass    |
| Semester GPA Planner             | `/calculators/semester-gpa-planner`             | Pass / Pass    |
| Grade Improvement Calculator     | `/calculators/grade-improvement-calculator`     | Pass / Pass    |
| Study Hours Planner              | `/calculators/study-hours-planner`              | Pass / Pass    |
| Exam Score Converter             | `/calculators/exam-score-converter`             | Pass / Pass    |

Other implemented routes: `/`, `/calculators`, `/about`, `/contact`, `/privacy-policy`, `/terms`, `/disclaimer`, `/404`. Unknown routes return the not-found document with HTTP 404. Generated resources include `/robots.txt`, `/sitemap-index.xml`, and `/sitemap-0.xml`.

## Actual QA

See [QA-REPORT.md](QA-REPORT.md) for measured results, report files, and scope. Type checks and lint pass; 58 unit and 44 Playwright tests pass. Twenty automated accessibility checks report no violations for the selected WCAG A/AA tags. No horizontal overflow was observed across fourteen routes at 320, 390, 768, and 1440px.

## Cloudflare Pages

- Build command: `pnpm build`
- Output directory: `dist`
- Node: `24.19.0`
- pnpm: `9.12.0`
- Root: this project folder (or `student-calculator-hub` in a parent-workspace repository)
- Static hosting; no Worker, Function, backend, or database is needed.

Follow [DEPLOYMENT.md](DEPLOYMENT.md) for GitHub integration, domain, HTTPS, headers, and environment settings. CI checks code; it does not deploy.

## Remaining owner-specific launch work

1. Supply the actual HTTPS domain, operator name, contact address, and jurisdiction in public build configuration.
2. Review legal disclosures for the actual operator, hosting arrangements, retention, and applicable rights. No professional legal review is claimed.
3. Verify the real deployed site, certificate, redirects, response headers, robots.txt, canonical URLs, and sitemap.
4. Leave advertising off until approval, real IDs, a properly integrated CMP where required, eligibility/withdrawal handling, policy disclosures, and CSP review are complete.
5. Supply a consent-aware analytics adapter only if desired. Current configuration does not transmit analytics or calculator inputs.

The default placeholder build is deliberately not indexable. `pnpm launch:check` currently fails on missing owner/domain settings as intended. There are no known failing application tests or required calculator implementations left unfinished. Cross-browser, screen-reader, hosted-network, real-user Core Web Vitals, and real-provider consent behavior remain outside the performed local verification.

## Run locally

```sh
cd student-calculator-hub
pnpm install --frozen-lockfile
pnpm dev
```

Validation and production output:

```sh
pnpm check
pnpm lint
pnpm test
pnpm build
node scripts/check-static.mjs
pnpm exec playwright install chromium
pnpm test:e2e
pnpm format:check
pnpm preview
```

For repeatable Lighthouse measurements, serve the built site on a known port, then run `pnpm audit:lighthouse http://127.0.0.1:4322 preview`. Reports go to `docs/reports`. Measurements require the Playwright Chromium installation.
