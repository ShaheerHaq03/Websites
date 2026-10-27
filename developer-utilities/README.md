# Data Formatter Pro

A complete static developer toolkit built in its own `developer-utilities` folder. Astro generates indexable pages; React islands provide the tools; all transformations run locally. No database, backend, account, conversion API, or paid service is required.

## Run locally

Requires Node.js 24+ and pnpm 9.12.0. From this directory:

```sh
pnpm install --frozen-lockfile
pnpm dev
```

Open the URL printed by Astro (normally http://127.0.0.1:4321). The sibling student calculator project is independent.

## Tools

| Tool                       | Route                             |
| -------------------------- | --------------------------------- |
| JSON Formatter & Validator | `/tools/json-formatter`           |
| Structural JSON Diff       | `/tools/json-diff`                |
| JSON to CSV                | `/tools/json-to-csv`              |
| CSV to JSON                | `/tools/csv-to-json`              |
| JWT Decoder                | `/tools/jwt-decoder`              |
| Base64 / Base64URL         | `/tools/base64-encoder-decoder`   |
| Secure UUID v4 Generator   | `/tools/uuid-generator`           |
| JavaScript Regex Tester    | `/tools/regex-tester`             |
| Unix Timestamp Converter   | `/tools/unix-timestamp-converter` |
| Five-field Cron Builder    | `/tools/cron-expression-builder`  |
| URL Encoder / Decoder      | `/tools/url-encoder-decoder`      |
| HTTP Status Code Reference | `/tools/http-status-codes`        |

Other routes: `/`, `/tools`, `/about`, `/contact`, `/privacy-policy`, `/terms`, `/disclaimer`, and `/404`. Unknown paths return the custom 404 on Cloudflare Pages. `robots.txt`, `sitemap-index.xml`, and `sitemap-0.xml` are generated.

## Quality checks

```sh
pnpm check
pnpm lint
pnpm test
pnpm build
pnpm exec playwright install chromium
pnpm test:e2e
pnpm format:check
pnpm audit --prod
# Or run the main checks in sequence:
pnpm verify
```

Playwright tests at 390, 768, and 1440 pixels, with the generated production CSP enabled. `pnpm preview` serves the built app for visual review; the stricter test server is `node scripts/serve.mjs` (port 4322). Standard Astro preview does not apply Cloudflare `_headers`.

For a Lighthouse report, first run `node scripts/serve.mjs` in another terminal, then `pnpm audit:lighthouse`. Reports are local and ignored by Git. See `docs/implementation-report.md` for actual measured results and limitations.

The included `.github/workflows/ci.yml` runs when this folder is the repository root. In a monorepo, move it to the repository’s root workflow directory and adjust working-directory, lockfile, and artifact paths to `developer-utilities`.

## Configuration and deployment

Copy `.env.example` to `.env` and set the real `PUBLIC_SITE_URL` and `PUBLIC_CONTACT_EMAIL`. The single obvious fallback domain is `https://example.com`, configured centrally. Astro configuration uses the same environment setting. The feedback form saves a local draft when no support email is configured; it never pretends to send a message.

Cloudflare Pages: **build `pnpm build`, output `dist`, project root `developer-utilities`** if using this enclosing repository. Use `/` when this folder is the repository root. Set `NODE_VERSION=24` and `PNPM_VERSION=9.12.0`. No runtime environment, adapter, functions, or paid subscription is needed.

```sh
# Manual deployment, only after you choose to authenticate to your account:
pnpm exec wrangler login
pnpm exec wrangler pages project create data-formatter-pro --production-branch=main
pnpm deploy
```

This project has not been deployed to a live account. Domain, operator contact details, legal review, and optional ad configuration remain owner tasks. Analytics and advertising are disabled by default; there are no imaginary publisher IDs or fake ads.

- [Cloudflare setup and troubleshooting](docs/deployment.md)
- [Architecture and exact transformation behavior](docs/architecture.md)
- [Security and privacy boundaries](docs/security.md)
- [AdSense, consent, and activation requirements](docs/advertising.md)
- [Implementation and QA report](docs/implementation-report.md)
