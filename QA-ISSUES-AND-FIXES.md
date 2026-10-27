# QA Issues & Fixes — All Three Websites

_QA date: October 27, 2026 · Status: **none of these are fixed yet**_

Sites: **Student Calculator Hub**, **Data Formatter Pro** (developer-utilities), **PixelTools** (image-utilities).

## Summary

| Site | Critical | High | Medium | Low | Total |
|---|---|---|---|---|---|
| All three sites | 2 | 0 | 0 | 0 | 2 |
| Student Calculator Hub | 0 | 1 | 1 | 8 | 10 |
| Data Formatter Pro (developer-utilities) | 0 | 1 | 1 | 10 | 12 |
| PixelTools (image-utilities) | 0 | 1 | 4 | 6 | 11 |
| **Total** | **2** | **3** | **6** | **24** | **35** |

**Severity levels**

- **Critical**: Blocks launch. Fix before going live.
- **High**: A feature is broken or the page says something untrue.
- **Medium**: Clearly noticeable to visitors; looks broken or confusing.
- **Low**: Polish. Small wording, layout, or convenience issues.

**Origin:** “Existing” = the problem was already there before the SEO work. “SEO update” = introduced or exposed by the new SEO/AEO content.

## Fix first (launch checklist)

- [ ] **ALL-1** (All three sites): Real website address is not set
- [ ] **ALL-2** (All three sites): Legal and contact pages still read as an unfinished draft
- [ ] **CALC-1** (Student Calculator Hub): Numbered steps show no numbers and bullet lists show no bullets
- [ ] **DEV-1** (Data Formatter Pro (developer-utilities)): Cron Builder loses your schedule when you edit one field
- [ ] **IMG-1** (PixelTools (image-utilities)): Metadata Viewer cannot read WebP files, so it misses GPS location

## What I need from you

- The real domain for each site (for `PUBLIC_SITE_URL`).
- A contact email for each site (for `PUBLIC_CONTACT_EMAIL`).
- The owner/operator name and the country whose law applies (calculator hub: `PUBLIC_OWNER_NAME`, `PUBLIC_JURISDICTION`; also used in the legal text of the other two).

## All three sites

### ALL-1 · Real website address is not set

**Severity:** Critical · **Origin:** Existing

- **Problem:** Each site still uses the placeholder address `https://example.com`. On the calculator hub this deliberately tells Google not to index the site (SEO score drops to 66). On the other two, every canonical link, sitemap entry and share link points to example.com instead of your domain.
- **How to see it:** Open any page's source and look at `<link rel="canonical">` or open `/robots.txt`.
- **Fix:** In each Cloudflare Pages project, set the environment variable `PUBLIC_SITE_URL` to the real address (for example `https://yourdomain.com`, no trailing slash) for both Production and Preview, then rebuild and redeploy. Do not upload the current `dist` folders: they were built with test addresses.
- **Where:** Cloudflare Pages → Settings → Environment variables

### ALL-2 · Legal and contact pages still read as an unfinished draft

**Severity:** Critical · **Origin:** Existing

- **Problem:** Privacy, Terms, Contact, About and Disclaimer pages contain text like “not yet configured”, “this preview”, “draft terms” and “should be reviewed before public launch”. Visitors have no way to contact you. Ad networks such as AdSense usually reject sites in this state.
- **How to see it:** Open `/privacy-policy`, `/terms` or `/contact` on any of the three sites.
- **Fix:** 1) Set `PUBLIC_CONTACT_EMAIL` on all three sites, and also `PUBLIC_OWNER_NAME` and `PUBLIC_JURISDICTION` on the calculator hub. 2) Rewrite the hard-coded “preview / draft / before launch” sentences into final wording; setting the variables alone will not remove them. 3) Have the final legal text checked by someone qualified. The developer-utilities and image-utilities `pnpm deploy` commands already refuse to deploy until the contact email is set.
- **Where:** `student-calculator-hub/src/data/information.ts (lines 40, 44, 63, 86, 91, 136, 172, 207)`; `developer-utilities/src/pages/contact.astro:19, privacy-policy.astro:67, terms.astro:51`; `image-utilities/src/pages/contact.astro:26, terms.astro:53, privacy-policy.astro`

## Student Calculator Hub

### CALC-1 · Numbered steps show no numbers and bullet lists show no bullets

**Severity:** High · **Origin:** Existing

- **Problem:** On all 12 calculator pages, the “How do I use…?” steps and the “What mistakes should I avoid?” list appear as plain indented lines. The page's CSS reset removes list markers and nothing adds them back.
- **How to see it:** Open `/calculators/gpa-calculator` and scroll to “How do I use the GPA Calculator?”.
- **Fix:** Add `list-style: decimal;` to `.calculator-content ol` and `list-style: disc;` to `.calculator-content ul`. The existing `li::marker` colour rule will then style them.
- **Where:** `student-calculator-hub/src/styles/global.css:1678`

### CALC-2 · “What is the …?” answer repeats the paragraph right under it

**Severity:** Medium · **Origin:** SEO update

- **Problem:** The new short answer at the top of each calculator guide says almost the same thing as the older intro paragraph directly below it (for example both GPA paragraphs say the 4.0 scale is customizable). It reads as repetition.
- **How to see it:** Open any calculator page and read the first two paragraphs under “What is the …?”.
- **Fix:** Rewrite each calculator's `intro` so it adds something new (who it is for, when to use it, what makes it different) instead of restating the answer. The Markdown copies update automatically.
- **Where:** `student-calculator-hub/src/data/calculators.ts (the `intro` field of all 12 calculators)`

### CALC-3 · Calculator search only finds exact phrases

**Severity:** Low · **Origin:** Existing

- **Problem:** Searching “final exam calculator”, “study plan” or “what grade do i need” shows “0 calculators found”, even though matching calculators exist. The search looks for the whole phrase as one piece of text.
- **How to see it:** On `/calculators`, type `final exam calculator` in the search box.
- **Fix:** Split the search into words and show a calculator when every word appears in its search text. Optionally add common phrasings (such as “what grade do I need”) to each calculator's search keywords.
- **Where:** `student-calculator-hub/src/components/common/ToolDirectory.astro (the filter script, around line 48)`

### CALC-4 · Study Hours Planner shows a misleading error

**Severity:** Low · **Origin:** Existing

- **Problem:** If you pick a plan start date after a subject's deadline, the error says the deadline “must be today or later”. The real rule is “on or after the plan start date”.
- **How to see it:** Study Hours Planner → set Plan start date to 2026-11-20 → Build plan.
- **Fix:** Change the message to “Subject N deadline must be on or after the plan start date.”
- **Where:** `student-calculator-hub/src/lib/calculations/index.ts:277`

### CALC-5 · Exam Score Converter can show “Infinity” or 7.49e+24

**Severity:** Low · **Origin:** Existing

- **Problem:** Extremely large target totals produce results like “Infinity” or scientific notation, because there is no upper limit and the result is not checked before display.
- **How to see it:** Exam Score Converter → Between mark scales → 36 out of 48, target total `1e307`.
- **Fix:** Add a sensible maximum (for example 1,000,000) to the total fields, and have `format()` reject non-finite results with a friendly message.
- **Where:** `student-calculator-hub/src/lib/calculations/index.ts:23 (format) and the converter's input validation`

### CALC-6 · Some error messages name the wrong field or read oddly

**Severity:** Low · **Origin:** Existing

- **Problem:** Attendance (missed-classes mode): entering 2.5 missed classes says “Classes attended must be a whole number”. Negative values say “must be between 0 and a finite positive value”. Huge GPA credits say “Total credits must be a number”.
- **How to see it:** Attendance Percentage → switch to missed-classes mode → enter 2.5 missed.
- **Fix:** Pass the correct field label in missed-classes mode; change the open-ended range message to “must be 0 or more”; add a realistic maximum for credits.
- **Where:** `student-calculator-hub/src/lib/calculations/index.ts (line 6 and the attendance function)`

### CALC-7 · Escape key does not close the mobile menu

**Severity:** Low · **Origin:** Existing

- **Problem:** On phones the menu closes when you tap outside, but not when you press Escape (keyboard and assistive-tech users expect it to).
- **How to see it:** Narrow the browser, open the ☰ menu, press Escape.
- **Fix:** Add a small keydown listener that closes the `<details class="mobile-nav">` on Escape and returns focus to its summary.
- **Where:** `student-calculator-hub/src/layouts/BaseLayout.astro`

### CALC-8 · CGPA Calculator can create two rows with the same name

**Severity:** Low · **Origin:** Existing

- **Problem:** After removing “Semester 1” and adding a semester, the new row is named “Semester 3” again, so two rows share a name.
- **How to see it:** CGPA Calculator → remove Semester 1 → Add semester.
- **Fix:** Name new rows with the next unused number instead of `rows.length + 1`.
- **Where:** `student-calculator-hub/src/components/calculators/Calculator.tsx:311`

### CALC-9 · CGPA result says “4 maximum scale” instead of “4.0”

**Severity:** Low · **Origin:** Existing

- **Problem:** The GPA calculator says “4.0” while CGPA says “on your 4 maximum scale”, which looks inconsistent.
- **How to see it:** CGPA Calculator → Calculate.
- **Fix:** Format the scale maximum with one decimal place, the same way the GPA calculator does.
- **Where:** `student-calculator-hub/src/components/calculators/Calculator.tsx (CGPA result text)`

### CALC-10 · Invalid fields are not marked for screen readers

**Severity:** Low · **Origin:** Existing

- **Problem:** Errors appear in an announced alert box, but the specific input is not flagged as invalid.
- **How to see it:** Enter a negative credit value and calculate; inspect the input.
- **Fix:** Set `aria-invalid="true"` and `aria-describedby` (pointing at the error) on the field that caused the error.
- **Where:** `student-calculator-hub/src/components/ui/CalculatorUI.tsx`

## Data Formatter Pro (developer-utilities)

### DEV-1 · Cron Builder loses your schedule when you edit one field

**Severity:** High · **Origin:** Existing

- **Problem:** Clearing one of the five field boxes blanks all of them, and typing a new value then resets the other fields to `*`. Example: editing the hour of `0 9 * * 1-5` to 17 produces `* 17 * * *`, which runs every minute between 17:00 and 17:59, every day, instead of `0 17 * * 1-5`. A user could copy a badly wrong schedule into production.
- **How to see it:** Cron Expression Builder → Load sample → clear the Hour box → type 17 → look at the expression.
- **Fix:** Keep the five field boxes in their own state (an array of five strings). Editing a box changes only that position; a blank box stays blank and shows a validation message instead of collapsing the expression. Re-split into the five boxes only when the user edits the full-expression text box.
- **Where:** `developer-utilities/src/components/tools/TimeTools.tsx:41-46 (`fields` and `changeField`)`

### DEV-2 · Search popup is stuck in the top-left corner

**Severity:** Medium · **Origin:** Existing

- **Problem:** The “Find a developer tool” search popup opens against the top-left edge of the screen instead of centred. Tailwind's CSS reset removes the browser's built-in centring for popups.
- **How to see it:** Click the search box in the header (or press Ctrl/⌘ K).
- **Fix:** Add `margin: auto;` (or `margin: 10vh auto auto;` to sit near the top) to the `dialog { }` rule.
- **Where:** `developer-utilities/src/styles/global.css:1093`

### DEV-3 · CSV to JSON FAQ overstates how Windows line breaks are kept

**Severity:** Low · **Origin:** SEO update

- **Problem:** The FAQ says line breaks inside quoted cells “survive the conversion unchanged”, but Windows line breaks (CRLF) inside a quoted cell come out as plain `\n`. The editor normalises them on load.
- **How to see it:** Open a CSV containing `Ada,"1 Main St<CRLF>London"` → Convert.
- **Fix:** Simplest: reword the FAQ to say embedded line breaks are kept and normalised to `\n`. Alternatively configure the editor to keep CRLF.
- **Where:** `developer-utilities/src/content/tools/index.ts:194`; `developer-utilities/src/components/editors/CodeEditor.tsx:53`

### DEV-4 · JSON Formatter allows 151 nesting levels, page says 150

**Severity:** Low · **Origin:** SEO update

- **Problem:** 151 levels are accepted and 152 rejected, while the page text says the limit is 150 (off by one).
- **How to see it:** Format a JSON document nested 151 arrays deep.
- **Fix:** Change `depth > 150` to `depth >= 150` so the code matches the documented limit.
- **Where:** `developer-utilities/src/lib/json.ts:34`

### DEV-5 · Search popup needs Escape twice when it has text

**Severity:** Low · **Origin:** Existing

- **Problem:** The first Escape only clears the search text (normal browser behaviour for search boxes); the second closes the popup. The footer hint says “esc to close”.
- **How to see it:** Open search, type something, press Escape.
- **Fix:** Listen for Escape on the search input and close the popup directly.
- **Where:** `developer-utilities/src/components/layout/Header.astro`

### DEV-6 · Grammar in counts: “1 UUIDs”, “1 matches”, “1 tools”

**Severity:** Low · **Origin:** Existing

- **Problem:** Counters always use the plural form, so they read “1 UUIDs generated locally”, “1 registered status codes”, “1 matches”, “1 tools available”.
- **How to see it:** UUID Generator → set count to 1 → Generate.
- **Fix:** Add a tiny `plural(count, 'UUID')` helper and use it in each counter.
- **Where:** `developer-utilities/src/components/tools/UuidTool.tsx:104`; `StatusTool.tsx:69`; `src/lib/regex.ts:55`; `src/components/ui/ToolDirectory.astro:75`

### DEV-7 · Copy buttons keep saying “Copied!” forever

**Severity:** Low · **Origin:** Existing

- **Problem:** After copying once, the button label stays “Copied!” even after you generate new output, so you can't tell whether the new output was copied.
- **How to see it:** UUID Generator → Copy all → Generate again.
- **Fix:** Reset the label after about 2 seconds, and whenever the text being copied changes.
- **Where:** `developer-utilities/src/components/tools/shared.tsx:103-111 (CopyButton)`

### DEV-8 · Old results stay visible after changing options

**Severity:** Low · **Origin:** Existing

- **Problem:** Changing indentation, delimiter, the Base64URL checkbox or URL mode leaves the previous result showing until you run again. On the UUID tool an invalid count shows an error but the old list stays.
- **How to see it:** JSON Formatter → Format → change indentation from 2 to 4 spaces.
- **Fix:** Either clear the output when an option changes, or re-run automatically. Clear the UUID list when showing an error.
- **Where:** `developer-utilities/src/components/tools/DataTools.tsx`; `EncodingTools.tsx`; `UuidTool.tsx`

### DEV-9 · Regex “Common patterns” dropdown shows the wrong choice

**Severity:** Low · **Origin:** Existing

- **Problem:** After “Load sample”, the dropdown still shows the pattern you picked earlier, not the one that is loaded.
- **How to see it:** Regex Tester → choose “Capture numbers” → Load sample.
- **Fix:** Make the select a controlled input (`value` instead of `defaultValue`) and reset it when the sample loads.
- **Where:** `developer-utilities/src/components/tools/RegexTool.tsx:77`

### DEV-10 · Keyboard focus lands on an invisible element

**Severity:** Low · **Origin:** Existing

- **Problem:** The hidden file input is its own Tab stop right after the “Open file” button, so keyboard users land on something they can't see. Some filter groups have a label but no role.
- **How to see it:** Tab through a tool page past the “Open file” button.
- **Fix:** Give the hidden input `tabIndex={-1}` (the visible button already opens it). Add `role="group"` to the labelled filter containers.
- **Where:** `developer-utilities/src/components/tools/shared.tsx`; `StatusTool.tsx`; `src/components/ui/ToolDirectory.astro`

### DEV-11 · Copy icon looks like an empty checkbox; “All tools ⌄” isn't a dropdown

**Severity:** Low · **Origin:** Existing

- **Problem:** Copy buttons use the `▢` character, which reads as an unchecked checkbox. The header link “All tools ⌄” shows a dropdown arrow but is a plain link.
- **How to see it:** Any tool's Copy button; the header.
- **Fix:** Use a proper copy icon (the site's existing Icon set or an inline SVG). Remove the ⌄ from the header link.
- **Where:** `developer-utilities/src/components/tools/shared.tsx:110`; `src/components/layout/Header.astro`

### DEV-12 · Stray carriage-return characters in one Markdown copy

**Severity:** Low · **Origin:** SEO update

- **Problem:** `/tools/json-to-csv.md` contains two raw carriage-return characters from the example output. Harmless to visitors, slightly untidy for AI readers.
- **How to see it:** Download `/tools/json-to-csv.md` and view it in a hex viewer.
- **Fix:** Strip `\r` when generating the Markdown copies.
- **Where:** `developer-utilities/src/lib/seo/markdown.ts`

## PixelTools (image-utilities)

### IMG-1 · Metadata Viewer cannot read WebP files, so it misses GPS location

**Severity:** High · **Origin:** Existing

- **Problem:** For a WebP photo that contains camera details and GPS location, the viewer says “No readable EXIF metadata was found”. The library it uses (exifr) does not support WebP. The page, meta description and llms.txt all promise WebP support, so a user checking a photo before sharing gets a false “no location”. The notice also appears as a raw table row named `metadataNotice`.
- **How to see it:** Image Metadata Viewer → choose a WebP photo with GPS → Inspect metadata.
- **Fix:** For WebP files, find the `EXIF` chunk inside the RIFF container, drop its optional `Exif\0\0` prefix, and pass the remaining bytes to `exifr.parse` (it reads raw TIFF/EXIF data). Show the “no metadata” notice as a message, not as a table row. Until this ships, remove “WebP” from the viewer's claims.
- **Where:** `image-utilities/src/lib/metadata.ts:5-17`; `image-utilities/src/components/tools/MetadataPanel.tsx:97`

### IMG-2 · Search popup is stuck in the top-left corner

**Severity:** Medium · **Origin:** Existing

- **Problem:** Same problem as DEV-2: the “Find your image tool” popup opens against the top-left edge instead of centred, on desktop and mobile.
- **How to see it:** Click the search box in the header (or press Ctrl/⌘ K).
- **Fix:** Add `margin: auto;` (or `margin: 10vh auto auto;`) to the `dialog { }` rule.
- **Where:** `image-utilities/src/styles/global.css:1171`

### IMG-3 · Error messages appear off-screen, and the status says “finished” on failure

**Severity:** Medium · **Origin:** Existing

- **Problem:** On phones the error appears about a full screen below the button, so tapping Resize appears to do nothing. The status line also says “Processing finished. Review the actual results below.” even when processing failed.
- **How to see it:** Phone-size screen → Image Resizer → load a photo → width 9000 → Resize image.
- **Fix:** Only show “Processing finished” on success; show “Processing failed. See the message below.” otherwise. Move the error box next to the action button, or scroll it into view and move focus to it.
- **Where:** `image-utilities/src/components/tools/ToolApp.tsx:361 (message) and :1160 (error box)`

### IMG-4 · Damaged or half-downloaded JPEGs silently become blank images

**Severity:** Medium · **Origin:** Existing

- **Problem:** A truncated JPEG is accepted (“1 image ready · 800 × 600”) and produces a fully transparent image marked “Target reached”, with no warning.
- **How to see it:** Use the first 600 bytes of a JPEG in the Image Compressor.
- **Fix:** In validation, check that the file is complete: a JPEG should contain the end marker `FF D9`, a PNG should contain an `IEND` chunk, and a WebP's RIFF size should match the file length. Otherwise show “This file looks incomplete or damaged.”
- **Where:** `image-utilities/src/lib/validation.ts:110 (validateImage)`; `image-utilities/src/lib/engine.ts`

### IMG-5 · Aspect Ratio Converter can show “1200 × Infinity pixels”

**Severity:** Medium · **Origin:** Existing

- **Problem:** With a custom ratio width of 0, the preview reads “1200 × Infinity pixels”; an empty ratio height shows “× 0 pixels”. The ratio boxes also show a “px” unit, but ratio parts are not pixels.
- **How to see it:** Aspect Ratio Converter → Custom → set Ratio width to 0.
- **Fix:** Check both ratio parts are greater than 0 before calculating and show “Ratio parts must be greater than 0” beside the fields. Add an optional `unit` setting to `NumberField` and hide “px” for ratio fields.
- **Where:** `image-utilities/src/components/tools/ToolApp.tsx:400-406, 779-810`; `image-utilities/src/components/tools/controls.tsx:58`

### IMG-6 · Home page headings lose a space on phones

**Severity:** Low · **Origin:** Existing

- **Problem:** On narrow screens “The right format makes a difference.” shows as “The right formatmakes a difference.”, and “A few things to know.” as “A few thingsto know.” The hidden line break had no space next to it.
- **How to see it:** Home page at phone width; scroll to those two sections.
- **Fix:** Put a space before each `<br />` (for example `format{' '}<br />`).
- **Where:** `image-utilities/src/pages/index.astro:130, 284`

### IMG-7 · Empty search suggests JSON tools; “1 tools” grammar

**Severity:** Low · **Origin:** Existing

- **Problem:** When a search finds nothing, it suggests “Try “JSON”, “encoding”, or “time””, text copied from the developer site that matches no image tool. Counters read “1 tools available” / “1 matching tools”.
- **How to see it:** On `/tools`, search for `zzz`.
- **Fix:** Change the suggestion to image terms such as “resize”, “compress” or “WebP”. Use singular/plural correctly in the counters.
- **Where:** `image-utilities/src/components/ui/ToolDirectory.astro:50, 75`; `image-utilities/src/components/layout/Header.astro:227`

### IMG-8 · The FAQ says WebP at 100% is never lossless, but Chrome and Firefox make it lossless

**Severity:** Low · **Origin:** SEO update

- **Problem:** At quality 100, Chrome and Firefox produce lossless WebP (much larger files); Safari stays lossy. The FAQ, the tool's limitations text and the JPG-vs-PNG-vs-WebP guide all say 100% is still lossy.
- **How to see it:** Image to WebP → quality 100 in Chrome → compare file size with quality 99.
- **Fix:** Reword to: “At 100%, Chrome and Firefox may switch to lossless WebP, which makes much larger files; Safari stays lossy. Use 90–99% for smaller files.” (Or cap quality at 99% so output is always lossy.)
- **Where:** `image-utilities/src/content/tools.ts:235, 238-239`; `image-utilities/src/content/guides.ts:55`

### IMG-9 · Metadata Viewer leftovers and layout glitch

**Severity:** Low · **Origin:** Existing

- **Problem:** After inspecting, the side panel still says “Select Inspect metadata to begin” and “Ready when you are”. On phones the “Dimensions” label breaks as “Dimension / s”. “Copy selected” with nothing ticked copies `{}`.
- **How to see it:** Metadata Viewer → Inspect any image → look at the side panel.
- **Fix:** Hide the placeholder text once results exist; let the label wrap only between words (or shorten it); disable “Copy selected” when nothing is ticked.
- **Where:** `image-utilities/src/components/tools/MetadataPanel.tsx`; `image-utilities/src/styles/global.css`

### IMG-10 · Batch errors don't say which file is the problem

**Severity:** Low · **Origin:** Existing

- **Problem:** One bad file in a batch rejects the whole batch with a generic message that doesn't name the file, and “Checking image 2 of 3” stays on screen next to the error.
- **How to see it:** Image Compressor → select two good images and a text file renamed `.jpg`.
- **Fix:** Include the file name in the error (“photo3.jpg is not a supported image”) and clear the progress text when an error appears.
- **Where:** `image-utilities/src/components/tools/ToolApp.tsx`

### IMG-11 · Smaller usability items

**Severity:** Low · **Origin:** Existing

- **Problem:** “Reset workspace” doesn't turn “Maintain original aspect ratio” back on. Guides are not in the header menu. Escape doesn't close the mobile menu. After choosing a file, keyboard focus is lost. The resizer text calls the percentage box a “slider” but it is a number box.
- **How to see it:** Image Resizer → untick aspect ratio → Reset workspace.
- **Fix:** Re-enable the aspect lock on reset; add “Guides” to the desktop and mobile menus; close the mobile menu on Escape; move focus to the selected-file summary after a file is chosen; change “slider” to “field”.
- **Where:** `image-utilities/src/components/tools/ToolApp.tsx`; `image-utilities/src/components/layout/Header.astro`; `image-utilities/src/content/tools.ts`

## Not bugs, but worth knowing

- **Cron day rules** (Data Formatter Pro (developer-utilities)): With both a day-of-month step and a weekday (e.g. `0 0 */2 * 1`) the preview uses “either day” (OR) logic, which some crontab versions treat differently. The page already tells users to verify against their scheduler; consider mentioning this case.
- **Cron description of `0-7`** (Data Formatter Pro (developer-utilities)): The description library reads `0 0 * * 0-7` as “Sunday through Sunday”. Technically correct, slightly odd.
- **CSV formula protection** (Data Formatter Pro (developer-utilities)): With “Protect spreadsheet formulas” on (default), negative numbers like `-5` are written as `'-5`. This is documented, but may surprise people exporting numbers.
- **Breadcrumb names in structured data** (PixelTools (image-utilities)): Guide and About pages use their marketing headline (e.g. “Small tools. A bigger picture.”) as the breadcrumb name. Valid, but the short page name would read better in search results.
- **Markdown header rule** (Student Calculator Hub): The calculator hub uses one wildcard `/*.md` rule in `_headers`; the other two list each file. After deploying, run `curl -I https://yourdomain/calculators/gpa-calculator.md` and confirm `text/markdown` and `X-Robots-Tag: noindex`.
- **Old local test servers** (All three sites): Two local test servers started before this session (ports 4322 and 4331) still serve old security headers. Restart them before local testing.

## What passed

| Area | Result |
|---|---|
| All pages | 60 pages × 5 browser/device setups (Chrome, Firefox, Safari engine, iPhone 13, Pixel 7): no console errors, no failed requests, no security-policy (CSP) blocks, no sideways scrolling at 320–1440 px, real 404 page. |
| Calculator Hub | All 12 calculators gave correct answers against independent hand calculations, including edge cases (zero, negative, impossible targets, custom scales). |
| Data Formatter Pro | All 12 tools checked against reference implementations: JSON, CSV, JWT, Base64, URL, UUID, regex, timestamps, cron next-runs and status codes. |
| PixelTools | Every output file checked for real format, dimensions, transparency handling, compression targets and metadata removal; crop, rotate and social presets exact. |
| Site features | Theme toggle and memory, keyboard navigation and focus, skip links, mobile menus, contact form drafts. |
| SEO / AI files | robots.txt, sitemaps, llms.txt and Markdown copies all valid; FAQ structured data matches the visible text; Lighthouse SEO, Accessibility and Best Practices 100 on every page. |
| Automated tests | Unit tests 58/58, 108/108 and 47/47; type checks clean on all three sites. |
