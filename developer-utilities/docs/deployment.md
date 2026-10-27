# Cloudflare Pages deployment

## GitHub integration

1. Commit this project and its `pnpm-lock.yaml` to a repository you control. No deployment credentials are stored in this project.
2. In Cloudflare, create a Pages project and connect that repository. Select the production branch.
3. Set root directory to `developer-utilities` for the enclosing multi-project repository, or leave it blank when this folder is the repository root.
4. Set build command to `pnpm build` and build output directory to `dist`.
5. Set `NODE_VERSION=24`, `PNPM_VERSION=9.12.0`, `PUBLIC_SITE_URL=https://YOUR-PROJECT.pages.dev`, and the operator's real `PUBLIC_CONTACT_EMAIL`. The URL must be an absolute HTTPS origin without a path. Public environment variables are visible to visitors and must never contain secrets.
6. Deploy. Review the issued `pages.dev` URL, robots.txt, sitemap-index.xml, canonical tags, custom 404, worker actions, response CSP, and browser console before promoting it.

The site is static, so no Cloudflare Astro adapter, Pages Functions, database binding, runtime secret, or paid feature is required. The build also creates `dist/_headers` with script hashes from the final HTML. Always deploy the complete output of `pnpm build` rather than invoking Astro directly or copying an older `_headers` file.

## Direct upload

```sh
pnpm install --frozen-lockfile
pnpm exec wrangler login
pnpm exec wrangler pages project create data-formatter-pro --production-branch=main
PUBLIC_SITE_URL=https://YOUR-PROJECT.pages.dev PUBLIC_CONTACT_EMAIL=you@your-domain.tld pnpm build
pnpm exec wrangler pages deploy dist --project-name=data-formatter-pro
```

Choose either Git integration or Direct Upload according to the Cloudflare account workflow. The command is documented, not executed by this implementation. The optional `pnpm deploy` shortcut builds again using your configured environment before direct upload.

## Custom domain and HTTPS

Add the hostname in the Pages project's Custom domains screen before pointing DNS. Follow Cloudflare's displayed DNS records and domain validation. After activation, change `PUBLIC_SITE_URL` to the custom HTTPS origin and rebuild so all canonical, Open Graph, structured-data, robots, and sitemap URLs agree. Cloudflare provides HTTPS for Pages; wait for certificate activation and verify it. Consider a host-specific redirect from the original pages.dev hostname only after the custom hostname works, avoiding a redirect loop. No broad SPA redirect is included: each route is an actual HTML file, and the generated 404.html preserves real 404 handling.

## Headers and caching

The post-build script hashes inline scripts, including theme initialization, structured data, and Astro hydration code. `script-src` does not use unsafe-inline or unsafe-eval. Style inline support is retained for CodeMirror and React styles. Worker and module code is same-origin. External connections are denied in the default configuration. Fingerprinted `/_astro/*` assets receive immutable caching; HTML is not forced into an immutable cache.

Cloudflare permits 100 `_headers` rules and 2,000 characters per line. The generation script checks that line limit. The current global policy fits. If many tools are added, generate route-specific hashes rather than expanding a global allowlist beyond the limit.

## Troubleshooting

- Missing command or engine errors: use Node 24 and pnpm 9.12.0; run the locked install in the correct root.
- Worker or hydration blocked: ensure HTML and generated `_headers` came from the same build. Review CSP console messages. Do not disable CSP as a workaround.
- Canonicals show the placeholder: set `PUBLIC_SITE_URL` in both production and preview build environments and rebuild. Static metadata is determined at build time.
- 404 on every tool: deploy the `dist` directory, not `src`; Pages serves extensionless paths from `.html` files.
- No message can be sent: supply the operator contact email. Until then, the form only saves a draft on the visitor's device.
- Regex timeout: this is an intentional protection; reduce input or simplify the pattern.
- Ads absent: they are disabled until explicitly configured with consent integration, policy review, approval, real IDs, and revised CSP.

Sources checked October 27, 2026: [Astro on Pages](https://developers.cloudflare.com/pages/framework-guides/deploy-an-astro-site/), [Pages headers](https://developers.cloudflare.com/pages/configuration/headers/), [custom domains](https://developers.cloudflare.com/pages/configuration/custom-domains/).
