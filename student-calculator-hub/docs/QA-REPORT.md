# Executed QA report

Date: 26 October 2026. Local environment: macOS, Node 24.19.0, pnpm 9.12.0, Astro 7.4.2, Playwright 1.64.1 Chromium, Lighthouse 13.5.0.

## Final check results

| Check                                  | Actual result                                                                                                |
| -------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| `pnpm check`                           | Pass: 0 errors, 0 warnings, 0 hints                                                                          |
| `pnpm lint`                            | Pass                                                                                                         |
| `pnpm test`                            | Pass: 58 tests                                                                                               |
| `pnpm build`                           | Pass: 20 static HTML pages, sitemap, robots.txt, assets                                                      |
| `pnpm test:e2e`                        | Pass: 44 tests                                                                                               |
| Automated axe checks                   | Pass: 19 routes plus dark-mode calculator, no violations for configured WCAG 2/2.1/2.2 A/AA tags             |
| Responsive overflow                    | Pass: homepage, directory, and all 12 calculator routes at 320, 390, 768, 1440px                             |
| `node scripts/check-static.mjs`        | Pass: 20 unique titles/descriptions, one H1 per page, 20 parsed JSON-LD graphs, 616 internal links/fragments |
| Production URL fixture                 | Pass: configured canonical origin, indexable metadata, allowed robots, clean sitemap URLs, 404 excluded      |
| `pnpm format:check`                    | Pass                                                                                                         |
| `pnpm audit --prod --audit-level high` | No known vulnerabilities reported by the registry at execution time                                          |
| `pnpm launch:check` with defaults      | Expected failure: real domain/operator/contact/jurisdiction are not configured                               |

The final `pnpm verify` run completed type checking, lint, unit tests, build, and all 44 browser tests. Static checks and formatting were also run separately. No tests were skipped or marked as passed without execution.

## Browser coverage

Every calculator was exercised with its default worked scenario, invalid input, and reset. Additional tests cover dynamic course rows, custom grade-point maximums, added grade labels, semester scenario snapshots, custom letter boundaries using unrounded values, conversion modes, missed-class entry, navigation, related links, category shortcuts, search/filter/no-results states, mobile menu, theme persistence and deletion, keyboard calculation, supporting pages, true 404 responses, schema parsing, canonical metadata, inactive third-party scripts, and sitemap inclusion.

Screenshots were visually inspected for the desktop homepage and mobile homepage/GPA layout. Artifacts are in [screenshots](screenshots). No connected interactive GUI browser was available, so browser verification used the installed local Playwright Chromium. Keyboard actions were verified through browser tests. This is not a manual screen-reader audit or a complete WCAG conformance certification. Firefox, WebKit, hosted Cloudflare response headers, and real devices were not tested.

## Lighthouse measurements

Mobile Lighthouse was run against local static builds with its default mobile simulation. These are lab snapshots, not field Core Web Vitals or a guarantee of deployed performance.

| Build / page                     | Performance | Accessibility | Best practices | SEO |
| -------------------------------- | ----------- | ------------- | -------------- | --- |
| Default preview / home           | 100         | 100           | 100            | 66  |
| Default preview / GPA            | 100         | 100           | 100            | 66  |
| Configured-domain fixture / home | 100         | 100           | 100            | 100 |
| Configured-domain fixture / GPA  | 99          | 100           | 100            | 100 |

The default preview intentionally has `noindex` and robots blocking because its domain is `https://example.com`. Its only remaining failed binary Lighthouse audit is indexing. It should stay blocked until real launch configuration is supplied.

To verify the production code path without inventing a real owner domain or deploying, a separate temporary build used the reserved test origin `https://student-calculator-hub.test`. That build was served locally on port 4323. It has indexable metadata and the configured origin throughout canonical/sitemap/schema output. The normal `dist` remains the placeholder preview. The fixture URL is **not** a registered production site, deployment, or ownership claim.

Raw final reports:

- [Preview home](reports/preview-home-mobile.json)
- [Preview GPA](reports/preview-gpa-mobile.json)
- [Configured fixture home](reports/production-fixture-home-mobile.json)
- [Configured fixture GPA](reports/production-fixture-gpa-mobile.json)

## Fixes found during verification

The test cycle corrected a self-hosted font import, strict test types, an accessible search-name mismatch, keyboard focus on a scrolling schedule region, a logo accessible-name mismatch, and clean canonical/sitemap generation under file-format output. Additional-grade UI and category shortcut behavior have their own passing browser tests. Obsolete failed diagnostic reports were replaced by the final measurements above.

## Limits before launch

Public production operation has not been verified because no real domain or hosting deployment was authorized/configured. Owner-specific legal review, email delivery, advertising approval, real CMP integration and withdrawal, analytics provider integration, hosted security headers, and post-deployment network/SEO checks remain launch work. Advertising and analytics are disabled. No external data or calendar API is needed for the twelve calculators.
