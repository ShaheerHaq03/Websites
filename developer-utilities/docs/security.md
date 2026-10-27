# Security boundaries

The default application has no backend request for transformations, no analytics, no advertising scripts, no payload persistence, no user input in URLs, no sensitive console logging, no eval, no arbitrary code execution, and no unsafe user-generated HTML injection. React renders payload text as text. JSON-LD is built from trusted registry content and escapes `<` before insertion. Local downloads use Blob URLs and revoke them after use. Files are read only after explicit user selection and size checks.

CSP is generated from final built inline script hashes with same-origin modules and workers. `connect-src 'self'` permits same-origin asset inspection (including robots.txt for audits) and blocks external connections. Core transformations make no fetch/XHR requests and there is no application backend. Inline styles are permitted for CodeMirror's generated theme styles and React layout styles. There is no script unsafe-inline or unsafe-eval. Other supplied headers deny framing, MIME sniffing, and unused device capabilities, and set an HTTPS HSTS policy without preloading or assuming control over all subdomains.

No claim of perfect security is made. Browser extensions, device compromise, browser or clipboard history, saved output, and third-party scripts added by an operator remain outside the transformation boundary. A pasted token is not verified. Prefer sanitized examples and follow organizational policy.

## Input and execution limits

- 1 MB (1,000,000 UTF-8 bytes) per input/file.
- 150 JSON nesting levels; 10,000 structural changes.
- 2,000-character regex patterns; fewer than 5,000 matches.
- 1.5-second disposable regex worker; five-second general workers.
- 1–1,000 secure UUID v4s per batch.

Worker termination is a bounded user-experience defense against catastrophic regex backtracking. It does not make arbitrary patterns inherently safe, and slower devices can reach the timeout on otherwise reasonable work. Large file text is bounded before posting to the worker; editor rendering and output growth can still cost memory on constrained devices. This is not a streaming large-data processor.

## Dependencies and changes

Commit `pnpm-lock.yaml`, use `pnpm install --frozen-lockfile`, and run `pnpm audit --prod` before release. Audit results are a snapshot, not a guarantee. Update dependencies intentionally and rerun worker, browser, CSP, CSV, and regex tests. The React Vite plugin is pinned through a pnpm override to the compatible 6.0.2 available in this environment; do not remove this override without testing the installed toolchain.

Advertising or analytics requires a privacy policy update and explicit CSP allowlists based on the actual provider and consent configuration. Do not add broad wildcards or unsafe-eval. No event should ever contain editor text, JWT values, local filenames, clipboard contents, or conversion output.
