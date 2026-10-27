# PixelTools

A complete browser-based image toolkit, built in the independent `image-utilities` folder. Astro generates static pages; React islands provide local image processing. No backend, account, paid API, or database is required.

## Run locally

Requires Node 24+ and pnpm 9.12.0. From this directory:

```sh
pnpm install --frozen-lockfile
pnpm dev
```

Development URL: http://127.0.0.1:4330. The production-CSP test/preview server is http://127.0.0.1:4331.

## The ten tools

| Tool                   | Route                               |
| ---------------------- | ----------------------------------- |
| Image Resizer          | `/tools/image-resizer`              |
| Image Compressor       | `/tools/image-compressor`           |
| PNG to JPG             | `/tools/png-to-jpg`                 |
| JPG to PNG             | `/tools/jpg-to-png`                 |
| Image to WebP          | `/tools/image-to-webp`              |
| WebP to PNG            | `/tools/webp-to-png`                |
| Image Cropper          | `/tools/image-cropper`              |
| Aspect Ratio Converter | `/tools/aspect-ratio-converter`     |
| Social Image Resizer   | `/tools/social-media-image-resizer` |
| Image Metadata Viewer  | `/tools/image-metadata-viewer`      |

Other routes: `/`, `/tools`, `/about`, `/contact`, `/privacy-policy`, `/terms`, `/disclaimer`, `/404`, `/guides`, and four original guides. The homepage file picker opens an actual inline processing workspace; it never discards a selected file by navigating away. Directory and global search work without a remote search service.

Static JPG, PNG, and WebP are supported. Animation, SVG, GIF, HEIC, and AVIF are intentionally rejected. Files are checked by their binary signature and actual decoding. Outputs are encoded, checked for format/dimensions, and independently decoded in browser integration tests. A self-hosted WebAssembly fallback provides WebP encoding when the browser lacks native support; it is loaded only when needed.

## Checks

```sh
pnpm check
pnpm lint
pnpm test
pnpm build
pnpm exec playwright install chromium firefox webkit
pnpm test:e2e
pnpm test:integration
pnpm format:check
pnpm audit
# Main verification sequence:
pnpm verify
```

The browser suite includes real file selection, drag-and-drop, processing, preview, output downloads, independent image decoding, alpha checks, crop pixels, compression success/failure, EXIF/GPS, ZIP contents, and browser fallback behavior. UI tests run at 390, 768, and 1440 pixels. Integration tests also run in Firefox and WebKit where installed. See the implementation report for the actual executed results rather than assuming all browser features are identical.

`pnpm fixtures` regenerates deterministic test images and the original mountain illustration from the bundled source SVG. Sharp is a development/test dependency only and is never part of browser processing or hosting. Self-hosted Inter font license text is included in `public/licenses`.

## Preview, measure, deploy

```sh
pnpm build
node scripts/serve.mjs
# In another terminal:
pnpm audit:lighthouse
```

The static preview server applies generated Cloudflare security headers. Standard `pnpm preview` is also available but Astro preview does not automatically apply Pages `_headers`.

Copy `.env.example` to `.env`, supply the real HTTPS `PUBLIC_SITE_URL` and operator `PUBLIC_CONTACT_EMAIL`, and review the legal text. `https://example.com` is the centralized, obvious development fallback. Until email is configured, the contact page saves a local feedback draft and truthfully does not send a message.

Cloudflare Pages: **build command `pnpm build`; output `dist`; Node 24; pnpm 9.12.0.** Use project root `image-utilities` in the enclosing repository, or `/` when this folder is its own repository. No adapter, Worker, Pages Function, or paid plan is needed.

```sh
pnpm launch:check
pnpm exec wrangler login
pnpm exec wrangler pages project create pixeltools --production-branch=main
pnpm deploy
```

No live deployment is performed by creating this project. The included CI workflow assumes this folder becomes the repository root. For a monorepo, move it to the root `.github/workflows` and adjust working-directory, lockfile, and artifact paths to `image-utilities`.

- [Architecture, processing contracts and limits](docs/architecture.md)
- [Cloudflare Pages deployment](docs/deployment.md)
- [Privacy and security](docs/security.md)
- [Advertising and consent](docs/advertising.md)
- [Versioned social preset sources](docs/social-presets.md)
- [Implementation and actual verification report](docs/implementation-report.md)
