# Adding a calculator

- Add a unique ID, clean slug, title, description, category, icon, editorial keywords, related tool IDs, and original guide content to `src/data/calculators.ts`. Keywords guide editorial work; no obsolete meta-keywords tag is emitted.
- Implement pure logic with explicit units, valid ranges, finite-number checks, and honest impossible-result handling. Keep UI formatting separate from calculation precision.
- Include labeled keyboard-operable inputs, validation errors, reset, result announcements, and copy where useful. Add the UI to the calculator dispatcher without hydrating unrelated pages.
- Write meaningful unit tests for normal, zero, decimal, invalid, boundary, and impossible cases. Add valid/invalid E2E scenarios and accessibility checks.
- Supply useful introduction, steps, formula explanation, worked example, common mistakes, limitations, FAQs, and related internal links. Avoid repeating generic prose or making a tool merely to target a keyword.
- Static route generation, canonical URLs, social tags, breadcrumbs, WebApplication JSON-LD, and sitemap entries derive from the registry and shared layout. Check emitted HTML, not only the browser DOM.
- Do not invent reviews, organizations, affiliations, awards, or authors. FAQ text is provided for users; no FAQ rich-result markup is emitted.
- Verify `PUBLIC_SITE_URL`, indexability, robots.txt, sitemap, true 404 responses, and internal links in a production-domain build. Default placeholder builds are deliberately not indexable.
- Test 320/390/768/1440px widths, reduced-motion settings, light/dark contrast, keyboard operation, and representative zoom.
- Run type checks, lint, unit tests, static build, E2E, and formatting. Re-measure Lighthouse when layout or loading changes. Lab measurements do not establish real-world Core Web Vitals or guarantee search ranking.
