# PixelTools implementation report

Verified October 27, 2026.

## A. Implementation status

**Complete for local implementation and deployment preparation.** The complete application is in the new `image-utilities` folder. Existing sibling projects and the enclosing `.gitignore` were not changed. No Cloudflare account deployment, paid-service provisioning, or message sending was performed.

The implementation uses Astro static generation, strict TypeScript, React islands, Tailwind CSS, pnpm, Vitest, Playwright, ESLint and Prettier. The light-first design includes an original logo/artwork, real homepage image workflow, global and directory search, dark mode, responsive tool workspaces, original guides, legal/information pages, SEO metadata and disabled advertising infrastructure.

The supplied image reference was not available as a usable reference during development; the written visual specification guided the original design.

## B. Tool checklist

| Tool                   | Status and real functionality                                                                                                                              | Route                               |
| ---------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------- |
| Image Resizer          | Complete: pixels, predictable ratio lock, percentage, presets, format/quality, real preview/download                                                       | `/tools/image-resizer`              |
| Image Compressor       | Complete: three modes, target sizes/custom target, measured success/failure, opt-in dimension reduction, sequential batches and ZIP                        | `/tools/image-compressor`           |
| PNG to JPG             | Complete: actual JPEG encoding, quality and explicit transparency flattening/background                                                                    | `/tools/png-to-jpg`                 |
| JPG to PNG             | Complete: real PNG output, dimensions/byte comparison, batch conversion                                                                                    | `/tools/jpg-to-png`                 |
| Image to WebP          | Complete: JPG/PNG input, quality-controlled lossy WebP, alpha and local WebAssembly encoder fallback                                                       | `/tools/image-to-webp`              |
| WebP to PNG            | Complete: static WebP decoding, PNG output and alpha preservation; animated files explicitly rejected                                                      | `/tools/webp-to-png`                |
| Image Cropper          | Complete: draggable/movable/resizable visual crop, zoomed view, quarter-turn rotation, ratio presets, numeric/keyboard alternatives                        | `/tools/image-cropper`              |
| Aspect Ratio Converter | Complete: crop, fit/padding and explicit stretch, custom ratios, actual output dimensions                                                                  | `/tools/aspect-ratio-converter`     |
| Social Image Resizer   | Complete: six platforms, named placements, crop/fit, dated/versioned source configuration and honest verification labels                                   | `/tools/social-media-image-resizer` |
| Image Metadata Viewer  | Complete: file/pixel information, real EXIF/camera/orientation/GPS where present, selective copy/JSON export and tested source-EXIF-removing PNG re-encode | `/tools/image-metadata-viewer`      |

Other HTML routes: `/`, `/tools`, `/about`, `/contact`, `/privacy-policy`, `/terms`, `/disclaimer`, `/404`, and `/guides`.

Original guide routes:

- `/guides/image-dimensions-vs-file-size`
- `/guides/jpg-vs-png-vs-webp`
- `/guides/image-metadata-and-gps`
- `/guides/resize-images-without-distortion`

There are **23 statically generated HTML pages, 22 indexable**, plus `/robots.txt`, `/sitemap-index.xml` and `/sitemap-0.xml`. Unknown routes return the custom 404. Each tool has unique static metadata, canonical/Open Graph URLs, breadcrumb/WebApplication structured data, original explanatory content, examples, quality/format limitations, FAQs and related tools. The educational content is readable without JavaScript; actual image processing requires it.

## C. Actual testing results

| Check                                         | Executed result                                                                                                              |
| --------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| TypeScript / `pnpm check`                     | Passed: 0 errors, 0 warnings, 0 hints                                                                                        |
| ESLint / `pnpm lint`                          | Passed                                                                                                                       |
| Unit tests / `pnpm test`                      | **47 passed**, none skipped                                                                                                  |
| Browser E2E and integration / `pnpm test:e2e` | **96 passed**, none skipped                                                                                                  |
| Real image integration subset                 | **33 passed**: 11 scenarios each in Chromium, Firefox and WebKit                                                             |
| Responsive UI                                 | 21 scenarios at each of 390, 768 and 1440 pixels; 63 browser UI cases                                                        |
| Production build                              | Passed: 23 pages, SEO endpoints and security headers generated                                                               |
| Static artifact checks                        | Passed: unique titles/descriptions, one h1 per page, internal links/assets and canonical sitemap count                       |
| Automated accessibility                       | Axe passed on five light-theme page/workspace states and one dark result state at each viewport; 18 scans                    |
| Formatting                                    | `pnpm format:check` passed                                                                                                   |
| Dependency audit                              | `pnpm audit` reported no known vulnerabilities; an audit is a point-in-time check                                            |
| Visual review                                 | Desktop/mobile homepage and a processed compressor workspace reviewed; no horizontal viewport overflow in the tested layouts |

The final full `pnpm verify` completed with 47 unit and 96 browser tests passing. Subsequent edits were limited to contact copy, the configured tagline, and the CI display name; the final production build also passed. Browser tests use the generated production CSP on the local static server, not only a development build.

Tests inspect actual downloaded files using Sharp as an independent decoder. They do not mock the transformation and call that a successful conversion. The suite checks encoded signatures/dimensions, alpha, known crop pixels, EXIF orientation, source metadata removal, ZIP contents, target-size success and failure, drag/drop, error states, reset/cancellation, homepage workflow, navigation, search, related links, theme persistence and real 404 behavior.

### Lighthouse measurements

Lighthouse 13.5.0, default mobile simulated throttling, local production build with security headers enabled:

| Page                      | Performance | Accessibility | Best Practices |     SEO |
| ------------------------- | ----------: | ------------: | -------------: | ------: |
| `/`                       |      **92** |       **100** |        **100** | **100** |
| `/tools/image-compressor` |      **90** |       **100** |        **100** | **100** |

Both measured pages met the specified targets. These are local lab results, not real-user field measurements or guarantees for future hosting/devices. Other routes were not individually Lighthouse-measured. Raw HTML/JSON reports are in the local ignored `reports/` directory and can be regenerated.

Automated accessibility checks are not a complete manual WCAG 2.2 AA certification. Chromium UI coverage uses three viewport sizes; Firefox/WebKit coverage focuses on real processing integration rather than every navigation/accessibility scenario.

## D. Image-processing verification and browser behavior

Successfully tested in **Chromium, Firefox and WebKit**:

- PNG → JPEG, with verified JPEG magic bytes, requested dimensions and white background replacing alpha.
- JPEG → PNG, with verified PNG signature and original visible dimensions.
- PNG → WebP, with real WebP output and alpha preserved.
- Static WebP → PNG, with alpha preserved.
- Percentage resizing and natural-pixel cropping, including quarter-turn rotation.
- Ratio fit with transparent padding.
- Compressor target failure without unauthorized dimension changes, and success after explicitly allowing reduction.
- Orientation-tagged JPEG decoding applied once.
- Reading synthetic EXIF/GPS and independently checking that Canvas PNG export contains no original camera/GPS tags.
- ZIP entries independently decoded as actual images.
- A functional DOM Canvas fallback when OffscreenCanvas is unavailable.

The tested WebKit cannot natively encode WebP with Canvas. The app detects that and lazily loads a **self-hosted @jsquash/webp 1.5.0 WebAssembly encoder**. The WebKit test successfully generated and downloaded WebP, including alpha. Chromium and Firefox use their native encoders in the tested setup. The fallback is not loaded on the initial homepage or when native output works. Scalar/SIMD encoder assets are approximately 275/337 KB; only the required variant is fetched when used. License notices ship under `/licenses`.

Known intentional limits: static JPG/PNG/WebP only; animation is detected and rejected rather than silently discarded. SVG, GIF, HEIC, AVIF and RAW input are unsupported. WebP output is described as lossy even at 100% quality. The main-thread fallback has a four-megapixel source/output limit. No true lossless WebP, arbitrary-angle rotation, AI upscaling, subject-aware crop, or color-managed RAW editing is claimed.

## E. Privacy and security

Image data, filenames, EXIF/GPS, output and clipboard contents are not sent to a processing backend, conversion API, analytics or advertising service. Core transformations and ZIP creation run locally. No persistent image history is stored. Images are not put into page URLs or production logs. GPS is revealed explicitly and never placed into a map/share URL.

The default application makes **no third-party requests**. Normal page, script, font, artwork and optional local codec asset requests still reach the static host. The sample button fetches bundled artwork. A WebAssembly fallback request fetches codec code only, with no user image or filename in its request. Analytics and advertising are disabled.

Binary signatures, actual decoding, requested output MIME and resulting header dimensions are validated. Limits are **20 MB per file, 10 files, 60 MB aggregate input/results, 16 megapixels, and 8,192 pixels per side**. Main-thread fallback is limited to four megapixels. Compression is bounded at seven quality trials per resolution and at most four opt-in resolutions. Image workers time out after 45 seconds; ZIP workers after 30 seconds. Cancellation/generation guards prevent stale operations from replacing new files, and temporary object URLs/bitmaps/canvas resources are released. Fallback cancellation is cooperative between browser operations.

CSP uses final-inline-script hashes, same-origin assets/workers, local Blob previews, and a narrow `wasm-unsafe-eval` permission for the bundled encoder. It does not permit JavaScript unsafe-eval or script unsafe-inline. External connections, framing, MIME sniffing and unused device permissions are restricted. CSS inline styling supports the visual crop controls. Browser extensions, device compromise, visible image content, downloaded files and clipboard history remain outside this boundary. Re-encoding is not a guarantee of anonymity or total metadata removal.

## F. Cloudflare Pages deployment

| Setting                                      | Exact value                                      |
| -------------------------------------------- | ------------------------------------------------ |
| Framework                                    | Astro, static output                             |
| Project root in enclosing repository         | `image-utilities`                                |
| Root if folder becomes standalone repository | Repository root                                  |
| Build command                                | `pnpm build`                                     |
| Output directory                             | `dist`                                           |
| Node                                         | `NODE_VERSION=24`                                |
| pnpm                                         | `PNPM_VERSION=9.12.0`                            |
| Initial origin                               | `PUBLIC_SITE_URL=https://YOUR-PROJECT.pages.dev` |
| Contact                                      | Real `PUBLIC_CONTACT_EMAIL`                      |
| Backend / adapter / Worker / Pages Function  | None required                                    |
| Paid services                                | None required                                    |

The build generates `_headers`, checks the 2,000-character Cloudflare line limit, caches fingerprinted assets immutably and preserves real 404 behavior. No SPA catchall redirect is used. HTTPS/custom-domain instructions and troubleshooting are in [deployment.md](deployment.md). No live deployment was attempted.

## G. Production configuration still required from the owner

- Actual pages.dev or custom HTTPS origin; the centralized `https://example.com` fallback is deliberately obvious.
- Real contact email and operator identity/jurisdiction details.
- Review of legal policies against the actual operator, hosting and audience.
- AdSense approval, a real publisher ID and slot IDs if ads are desired.
- A suitable consent management integration and narrow provider CSP updates before any ad loading.
- An owner-approved analytics provider/ID and corresponding policy/consent review only if analytics is desired. No analytics provider is installed now.

`pnpm launch:check` currently fails intentionally because the domain and email are not configured. That is a launch prerequisite, not a failed image-processing test. Until an email is set, the contact form truthfully saves a local draft and sends nothing.

Social preset configuration is versioned **2026-10-27.1**, reviewed October 27, 2026. Officially verified YouTube thumbnail and X profile/header entries include source links. Other entries are clearly marked general-purpose starting canvases. See [social-presets.md](social-presets.md).

## H. Remaining issues

No known failing tests or incomplete core tools remain. The limitations above are intentional and disclosed. Public deployment and owner-specific legal, contact, analytics and advertising activation remain unperformed. AdSense preparation is not approval, a generic cookie banner is not a compliance guarantee, and no search-ranking or perfect-security claim is made.

## I. Commands

From the parent workspace:

```sh
cd image-utilities
pnpm install --frozen-lockfile
pnpm dev
```

Tests and production output:

```sh
pnpm exec playwright install chromium firefox webkit
pnpm verify
pnpm test:integration
pnpm format:check
pnpm audit
pnpm build
pnpm preview
```

Production-CSP preview and Lighthouse, in separate terminals:

```sh
node scripts/serve.mjs
# In another terminal:
pnpm audit:lighthouse
```

Deployment after real configuration and account selection:

```sh
pnpm launch:check
pnpm exec wrangler login
pnpm exec wrangler pages project create pixeltools --production-branch=main
pnpm deploy
```

Development normally uses http://127.0.0.1:4330; the production static preview uses http://127.0.0.1:4331.
