# Cloudflare Pages deployment

The application is static. It does **not** need a Cloudflare adapter, Worker, Pages Function, database, or server runtime for calculations.

## Exact Pages build settings

| Setting           | Value                                                                                   |
| ----------------- | --------------------------------------------------------------------------------------- |
| Framework preset  | Astro (static)                                                                          |
| Production branch | `main`                                                                                  |
| Root directory    | `student-calculator-hub` if the repository contains the parent workspace; otherwise `/` |
| Build command     | `pnpm build`                                                                            |
| Output directory  | `dist`                                                                                  |
| Node version      | `24.19.0`                                                                               |
| pnpm version      | `9.12.0` (`packageManager` in package.json)                                             |

1. Push this project's source and `pnpm-lock.yaml` to your GitHub repository. Do not commit `.env`, `node_modules`, or `dist`.
2. In Cloudflare, create a **Pages** project using Git integration and select the repository. No project has been created or deployed by this implementation.
3. Enter the settings above and configure the public environment values before building. Use the same values on a rebuild after changing domain or contact details.
4. If the build image does not honor the packageManager field, configure its supported pnpm version variable or use `corepack enable && corepack prepare pnpm@9.12.0 --activate && pnpm build` as the explicit build command. Keep `dist` as output.
5. Review the preview URL, every calculator, `/robots.txt`, `/sitemap-index.xml`, and a nonexistent URL before sending traffic.

## Domain and HTTPS

Add the custom domain through the Pages project's **Custom domains** flow, and follow Cloudflare's DNS instructions for the domain or subdomain. Wait for DNS validation and certificate activation. Verify HTTPS and redirect the unwanted www/non-www variant to the canonical host. Set `PUBLIC_SITE_URL` to that exact HTTPS origin and rebuild. Do not put a subpath in the site URL; this application targets an origin-root deployment.

Keep preview deployments from competing in search: retain placeholder/noindex settings for previews or apply a Pages preview robots header/access policy. The generated production site becomes indexable only with a real URL. If building separate preview and production environments, configure their variables separately.

The build uses file-format HTML (`about.html`, `calculators/gpa-calculator.html`) with canonical extensionless paths and no trailing slash. Cloudflare Pages serves the corresponding clean URL and redirects explicit `.html` URLs to it. A top-level `404.html` is built. Cloudflare Pages uses it for unknown paths instead of falling back to a single-page application. Do not add a `/* /index.html 200` SPA redirect.

## Configuration

`src/config/site.ts` is the central site settings file; `.env.example` lists public build variables. Never put secrets in `PUBLIC_` settings.

| Variable                                           | Purpose                                                        |
| -------------------------------------------------- | -------------------------------------------------------------- |
| `PUBLIC_SITE_URL`                                  | Real HTTPS origin, default placeholder `https://example.com`   |
| `PUBLIC_CONTACT_EMAIL`                             | Actual monitored operator address                              |
| `PUBLIC_OWNER_NAME`                                | Truthful site operator identity                                |
| `PUBLIC_JURISDICTION`                              | Operator-specific legal review context                         |
| `PUBLIC_ENABLE_ADS`                                | `false` by default; keep disabled until full activation review |
| `PUBLIC_ADSENSE_PUBLISHER_ID`                      | Real approved publisher ID                                     |
| `PUBLIC_ADSENSE_SLOT_ID`                           | Real configured ad slot                                        |
| `PUBLIC_ANALYTICS_PROVIDER`, `PUBLIC_ANALYTICS_ID` | Optional provider metadata; no network adapter installed       |

Run `pnpm launch:check` with the production values exported to catch unfilled identity/domain settings. Inspect all legal content manually; the check does not establish compliance.

## Headers and maintenance

`public/_headers` supplies CSP, framing restrictions, MIME sniffing protection, referrer and permissions policies, HSTS, and immutable hashed-asset caching. Astro hydration and theme scripts currently require `unsafe-inline`; there is no `unsafe-eval`. Adding ads, analytics, or a CMP requires a deliberate CSP review against their official integration instructions. The default restrictive CSP intentionally allows no third-party requests.

On a release, run `pnpm verify`, inspect relevant screens, and review the QA report. The GitHub workflow performs checks and build; it does not deploy. Cloudflare's Git integration can publish approved pushes once you configure it.

Sources: [Cloudflare Astro Pages guide](https://developers.cloudflare.com/pages/framework-guides/deploy-an-astro-site/), [Astro React integration](https://docs.astro.build/en/guides/integrations-guide/react/), [Astro styling](https://docs.astro.build/en/guides/styling/).

Route behavior reference: [Cloudflare Pages route matching](https://developers.cloudflare.com/pages/configuration/serving-pages/).
