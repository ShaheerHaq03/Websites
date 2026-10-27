# Architecture and processing contracts

## Static site and islands

Astro generates each route independently. Layout, navigation, guides, tool explanations, breadcrumbs, related links, and metadata are static. Small native scripts handle search and theme. Tool workspaces are React islands. The homepage loads a lightweight file-entry island and dynamically imports its complete processing workspace only after the visitor chooses a tool. Image processing, crop controls, EXIF parsing, and ZIP support are split into separate modules. No remote conversion API or backend is used.

Tool definitions live in `src/data/tools.ts`, unique content in `src/content/tools.ts`, and social presets in `src/data/social-presets.ts`. The site configuration centralizes brand, domain, contact, social links, analytics/advertising state, and theme preference. Astro configuration shares the same fallback origin and normalizes file-style generated URLs into extensionless canonical paths.

## Decode, render, encode

The validation layer reads binary PNG, JPEG, or WebP signatures and dimensions. It rejects oversized inputs and detected PNG/WebP animation before decoding. Decoding uses orientation-aware createImageBitmap where supported, with an Image/Canvas DOM fallback when required. Decode success is mandatory; a filename or MIME label alone cannot make a text file a valid image.

Module Web Workers perform decoding, rendering, encoding, compression and metadata inspection when Worker, createImageBitmap, and OffscreenCanvas.convertToBlob are available. The same engine provides a DOM fallback for other browsers. Worker codec failure may fall back to the DOM decoder. Output MIME type and binary header are verified; unsupported native WebP encoding cannot quietly return a PNG named .webp. When a browser lacks native WebP output (including the tested WebKit), an on-demand, self-hosted @jsquash/webp/libwebp WebAssembly encoder generates the actual format. Only the required scalar or SIMD WASM asset is fetched; selected pixels are never included in that asset request.

Canvas alpha is retained when PNG/WebP and transparent output are selected. JPEG always composites pixels against the selected six-digit background color, white by default. PNG quality is intentionally disabled; it is lossless pixel encoding without a Canvas quality knob. WebP is described as quality-controlled lossy encoding, including at 100% quality. Original image detail and metadata are not restored by changing formats.

## Exact tool behavior

- **Resize:** the linked dimension is derived from the original ratio and rounded to whole pixels. Percentage changes also start from the original. With the ratio locked, size presets fit within a target box; they do not promise an exact differently shaped canvas. Unlocking permits stretching and shows a warning.
- **Compression:** uses actual candidate byte sizes. Quality-focused, balanced, and smallest modes have floors of .55, .25, and .10. The requested quality is the ceiling unless below that floor; the interface shows the effective ceiling. At most seven trials run per resolution; PNG needs one. Dimension reduction is opt-in, with at most four resolutions. Search retains the smallest candidate and the highest-quality fit at the first fitting resolution. The selected format stays explicit; changing mode does not silently change the format. Targets are goals; failure and larger outputs are reported honestly.
- **Converters:** input-specific converters enforce their documented formats. The worker generates a real requested bitstream. JPEG loses alpha; JPEG-to-PNG and WebP-to-PNG do not restore earlier lossy detail. All supported conversions can process batches sequentially.
- **Crop:** the crop rectangle is expressed in natural orientation-correct pixels after a 0/90/180/270-degree rotation. Display pointer deltas are scaled into those coordinates. A draggable box and corner handle, arrow-key controls, numeric x/y/width/height, ratio presets, and a zoom selection provide usable alternatives. Zoom narrows a selected source region rather than claiming enhanced detail. Crops stay within the rotated bounds.
- **Ratio/social:** centered cover, contain, and stretch operations map to crop, fit with padding, and explicit distortion. Social workspaces expose crop and fit only. Output height is rounded from ratio and width; actual dimensions are displayed. Social data is versioned and sourced separately.
- **Metadata:** exifr is loaded on demand and reads actual available EXIF/GPS fields. Missing values are unavailable, never inferred. Basic dimensions use decoded visible orientation. GPS reveal is explicit; no maps or share URLs are created. Users select metadata for copying/downloading. Canvas PNG re-encoding does not copy source EXIF/GPS blocks; tests inspect the exported image independently. It is not advertised as a guarantee of anonymity or removal of every encoder-generated property.

## Resource management

Selection, replacement, reset, and unmount cancel workers and revoke preview URLs. Generation IDs prevent stale async work from overwriting newer files. Image bitmaps are closed; intermediate canvas storage is reduced after encoding. Batches decode/process one image at a time, with a queue that does not render ten full-resolution images simultaneously. The active source and result are previewed. ZIP creation uses a separate module worker and stored entries because the images are already compressed.

Limits: 20,000,000 bytes per source; 10 files per batch; 60,000,000 total input/result bytes; 16,000,000 source/output pixels; 8,192 pixels per side. The main-thread fallback has a four-megapixel source/output cap. General image workers terminate after 45 seconds, ZIP after 30 seconds. Fallback cancellation is cooperative around browser encoding calls; a Canvas operation already underway cannot be forcibly interrupted. There are no unbounded compression loops. Browser/device memory limits can still cause a surfaced failure.

Only compression and the four format converters support multiple files; other workspaces explicitly accept a single image. ZIP fallback without Worker support is limited to 10 MB. The app is not a streaming processor, animation editor, HEIC decoder, AI upscaler, or RAW color-managed photo editor.

## Adding tools

Add registry/content entries, a pure geometry or processing function, worker support when needed, and real output tests. The Astro dynamic route creates the static page, guide, schema, and related links. Preserve the privacy boundary, output verification, generation guards, and limits. Recheck CSP header length as new pages add script hashes.
