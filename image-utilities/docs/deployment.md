# Cloudflare Pages Free

This Astro project outputs static HTML and assets. Core transformations require no adapter, Pages Functions, Worker, database, authentication, runtime secret or paid plan.

## GitHub integration

1. Commit the project, `pnpm-lock.yaml`, original sample assets and fixtures to a repository you control. Never commit private selected images or `.env`.
2. Create a Cloudflare Pages project, connect the repository and choose the production branch.
3. Set root directory to `image-utilities` in the enclosing repository. If this folder is its own repository, use its root instead.
4. Framework: Astro. Build command: **`pnpm build`**. Output directory: **`dist`**.
5. Build variables: `NODE_VERSION=24`, `PNPM_VERSION=9.12.0`, `PUBLIC_SITE_URL=https://YOUR-PROJECT.pages.dev`, and a real `PUBLIC_CONTACT_EMAIL`.
6. Deploy, then inspect the provided pages.dev HTTPS URL, real image actions, downloads, workers, mobile layout, 404, headers, robots.txt and sitemap. No deployment was performed while implementing this project.

Public variables are included in a static build and must never hold secrets. `.env.example` documents supported configuration. The obvious fallback domain is `https://example.com` in the shared URL module. `pnpm launch:check` intentionally fails until a real HTTPS origin and operator email are present.

## Direct upload

```sh
pnpm install --frozen-lockfile
pnpm exec wrangler login
pnpm exec wrangler pages project create pixeltools --production-branch=main
pnpm deploy
```

Set `.env` first. `pnpm deploy` runs the launch check, builds, and invokes Wrangler direct upload. Do not run it until the intended account and project are selected. Choose Git integration or Direct Upload according to the account workflow.

## Domain, HTTPS and caching

Add a custom domain through the Pages Custom domains screen before setting DNS to the displayed target. Complete certificate validation and test HTTPS. Then set `PUBLIC_SITE_URL` to the canonical HTTPS origin and rebuild so canonical, schema, Open Graph, sitemap and robots URLs agree. Optional host-specific redirects from the pages.dev address should be added only after the custom domain works, avoiding a redirect loop.

The full build generates script-hashed CSP `_headers` and checks Cloudflare's 2,000-character line limit. Deploy final HTML and headers together. Fingerprinted `/_astro/*` assets receive immutable caching; HTML is not forced immutable. Actual `404.html` is present, and there is no SPA catchall redirect. Pages serves clean extensionless paths from the generated `.html` files.

## Troubleshooting

- Engine/install errors: verify Node 24 and pnpm 9.12.0, then use the locked install in the correct directory.
- Blank local previews: ensure CSP permits `blob:` images and same-origin module workers. Deploy matching headers and assets from one build.
- WebP fallback fails: allow the same-origin .wasm asset with application/wasm MIME type and retain the narrow wasm-unsafe-eval CSP permission. If the browser supports neither native encoding nor WebAssembly, use JPEG/PNG or a modern browser. PNG output is never mislabeled as WebP.
- Too many pixels: choose a smaller source; browsers without worker canvas support have a stricter fallback limit. Compression is not an unlimited large-file service.
- Metadata missing: unavailable fields are normal; the parser never invents tags.
- Incorrect canonical domain: change the build environment and rebuild; static metadata does not update at runtime.
- Contact only saves drafts: set the real email address; there is deliberately no form backend.
- Ads absent: advertising is disabled until approval, real IDs, a consent integration and CSP changes are complete.

Official references: [Astro on Pages](https://developers.cloudflare.com/pages/framework-guides/deploy-an-astro-site/), [headers](https://developers.cloudflare.com/pages/configuration/headers/), [custom domains](https://developers.cloudflare.com/pages/configuration/custom-domains/).
