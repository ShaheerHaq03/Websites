import type { ToolId } from '../data/tools';
type Content = {
  /** Lowercase noun phrase used in question headings, e.g. "the Image Resizer". */
  subject: string;
  /** Title tag text (the " | PixelTools" suffix is added by the layout). */
  metaTitle: string;
  metaDescription: string;
  /** Self-contained direct answer to "What is …?" that starts with the subject. */
  answer: string;
  intro: string;
  steps: string[];
  example: string;
  uses: string[];
  quality: string;
  limits: string;
  faq: [string, string][];
};
export const content: Record<ToolId, Content> = {
  'image-resizer': {
    subject: 'the Image Resizer',
    metaTitle: 'Image Resizer — Resize JPG, PNG & WebP Free',
    metaDescription:
      'Resize JPG, PNG and WebP images to exact pixel dimensions or a percentage, with the aspect ratio locked. Free, private and processed in your browser.',
    answer:
      'The Image Resizer is a free, browser-based tool that changes the real pixel dimensions of a JPG, PNG or WebP image. Enter a width, height or percentage with the aspect ratio locked, choose JPG, PNG or WebP output, and download the result. Images up to 20 MB and 16 megapixels are processed on your device, never uploaded.',
    intro:
      'Change the actual pixel dimensions of a photograph or graphic, rather than just changing the number printed in its filename. The resizer draws a decoded image onto a new canvas and encodes a real JPG, PNG, or WebP. Keep the ratio locked to resize without unexpectedly stretching people, logos, or text.',
    steps: [
      'Choose a static JPG, PNG, or WebP, or try the local sample.',
      'Enter a width or height with the ratio lock on, choose a percentage, or select a common canvas size.',
      'Choose an output format and quality, process, then inspect the actual dimensions before downloading.',
    ],
    example:
      'A 2400 × 1600 image resized to 50% becomes 1200 × 800 pixels. With the ratio lock on, entering a width of 900 produces a height of 600.',
    uses: [
      'Prepare a smaller photo for an application form.',
      'Create a consistent pixel width for a blog image.',
      'Reduce an oversized screenshot before sharing it.',
    ],
    quality:
      'Downscaling removes pixels. Upscaling adds interpolated pixels and cannot create missing photographic detail. The percentage slider always starts from the original dimensions, so repeated adjustments do not compound previous resizing.',
    limits:
      'Common size presets are optional canvases, not universal platform requirements. Unlocking the ratio allows distortion and is explicitly identified. Output is bounded at 8,192 pixels per side and 16 megapixels. JPEG replaces transparency with the chosen background.',
    faq: [
      [
        'How do I resize an image without stretching it?',
        'Keep “Maintain original aspect ratio” switched on. When you type a width, the height is recalculated from the original ratio and rounded to the nearest whole pixel, and the same works when you type a height. Unlocking the ratio lets you set both values freely, which can distort people, logos and text, so the interface warns you when it is off.',
      ],
      [
        'Does resizing reduce the file size to a specific KB?',
        'No. Pixel dimensions and file size measure different things. A smaller image usually takes fewer bytes, but the exact size depends on the format, quality setting and image content. Resize here to get the dimensions you need, then use the Image Compressor with a target such as 100 KB if you also have a file-size limit.',
      ],
      [
        'Can I enlarge a small image?',
        'Yes. The percentage control goes up to 400%, and you can type larger dimensions directly, as long as the output stays within 8,192 pixels per side and 16 megapixels. Upscaling adds interpolated pixels, so the picture gets bigger but not sharper; it cannot recreate detail that the original never captured.',
      ],
      [
        'Which formats can I resize and save as?',
        'You can open static JPG, PNG and WebP files and save the resized copy as JPG, PNG or WebP. JPG has no transparency, so transparent areas are filled with the background color you choose. SVG, GIF, HEIC, AVIF and animated PNG or WebP files are not supported, and the resizer handles one image at a time.',
      ],
      [
        'Are my images uploaded when I resize them?',
        'No. Decoding, resizing and encoding happen in your browser, usually in a background Web Worker, so the image bytes, filename and metadata are not sent to a server. The resized file is a new encode drawn on a canvas, which means the original EXIF and GPS tags are not copied into it.',
      ],
    ],
  },
  'image-compressor': {
    subject: 'the Image Compressor',
    metaTitle: 'Image Compressor — Compress to a Target KB',
    metaDescription:
      'Compress JPG, PNG and WebP images to a target size such as 50 KB or 100 KB. Compare real before-and-after bytes and batch up to 10 files in your browser.',
    answer:
      'The Image Compressor is a free, in-browser tool that re-encodes JPG, PNG and WebP images to use fewer bytes. Set a quality ceiling, a compression mode and an optional target such as 100 KB; it tests up to seven quality levels and reports the actual output size. It handles up to 10 images per batch, with nothing uploaded.',
    intro:
      'Create a smaller encoded image with a clear view of what changed. Select a format, set a quality ceiling, and optionally provide a target number of bytes. The compressor measures every candidate instead of assuming a requested target was reached.',
    steps: [
      'Choose one image or a batch of up to ten.',
      'Set the format, quality ceiling, mode, and optional target size. Leave dimension reduction off to preserve resolution.',
      'Run compression. Compare actual bytes and dimensions, review the target result, and download individual images or a ZIP.',
    ],
    example:
      'For a 50 KB target, the goal is at most 50,000 bytes. A result of 53,200 bytes is reported as not reached, even if it is much smaller than the original.',
    uses: [
      'Prepare photos for an email attachment size limit.',
      'Reduce web image transfer size.',
      'Create a set of lightweight preview images.',
    ],
    quality:
      'Quality-focused mode keeps the search at or above 55%; balanced allows 25%; smallest-file allows 10%. The selected quality is a ceiling unless below a mode’s floor, which is shown in the interface. PNG ignores quality because browser PNG encoding is lossless. Changing formats or dimensions has different effects from quality alone.',
    limits:
      'At most seven quality trials occur per resolution, with at most four resolutions when you explicitly allow reduction. A size goal is not a guarantee. Dimensions never shrink silently. Batch work is sequential, up to 10 files, 20 MB each, and 60 MB total input/results. A slow operation times out after 45 seconds.',
    faq: [
      [
        'Can I compress an image to exactly 50 KB?',
        'You can set 50 KB as a target, and the compressor aims for at most 50,000 bytes. It searches quality levels within your chosen mode and keeps the highest-quality result that fits. If no permitted setting reaches the goal, it says the target was not reached and shows the real size instead of claiming success.',
      ],
      [
        'Why did the compressor miss my target size?',
        'The image may need more reduction than your settings allow. PNG output is lossless, so its quality slider has no effect and only one encode is tried. Switch to JPG or WebP, choose the Balanced or Smallest file mode for a lower quality floor, or allow dimension reduction so up to four smaller resolutions can be tried.',
      ],
      [
        'What do the compression modes mean?',
        'Each mode sets the lowest quality the search may use. Quality-focused stays at or above 55%, Balanced may go down to 25%, and Smallest file may go down to 10%. Your quality slider is the starting ceiling. The tool never shrinks dimensions unless you tick “Allow dimension reduction to reach the target”.',
      ],
      [
        'Can I compress several images at once?',
        'Yes. Select up to 10 images, with each file up to 20 MB and 60 MB in total. They are compressed one after another with the same settings. You can download each result separately or all of them as a single ZIP file, which is also created locally in your browser.',
      ],
      [
        'Is my original image replaced or uploaded?',
        'Neither. The original file on your device stays unchanged, and compression runs locally in your browser, so the image is not sent to a server. Each download is a newly encoded file without the original EXIF or GPS tags. If the result is larger than the original, the interface reports that honestly.',
      ],
    ],
  },
  'png-to-jpg': {
    subject: 'the PNG to JPG converter',
    metaTitle: 'PNG to JPG Converter — Free & In-Browser',
    metaDescription:
      'Convert PNG to JPG free in your browser. Choose JPEG quality and a background color for transparent areas, batch up to 10 files and download a ZIP.',
    answer:
      'The PNG to JPG converter is a free browser tool that turns static PNG files into real JPEG images. You choose the JPEG quality and a background color, which fills any transparent areas because JPG cannot store transparency. Convert up to 10 PNGs at once and download them individually or as a ZIP, without uploading anything.',
    intro:
      'Convert a static PNG into an actual JPEG bitstream, with an explicit background for transparent pixels. This is useful for destinations that accept JPG files or for photographic PNGs that may benefit from lossy encoding. The file extension and output MIME type match the encoded result.',
    steps: [
      'Select one or more PNG files.',
      'Choose JPEG quality and a background color; white is the default.',
      'Convert, examine the flattened result, then download the JPG or a batch ZIP.',
    ],
    example:
      'A transparent logo converted with a white background becomes an opaque JPEG. With a navy background selected, transparent regions are composited over navy instead.',
    uses: [
      'Prepare an image for a JPG-only form.',
      'Convert a photographic PNG to a smaller format.',
      'Flatten transparent artwork against a deliberate background.',
    ],
    quality:
      'JPEG discards some image information. Text, sharp edges, and flat-color illustrations can show ringing or block artifacts, especially at low quality. Choose PNG or WebP when transparency matters.',
    limits:
      'JPEG does not support an alpha channel. Transparent pixels are always flattened; this is shown before processing and in the result notes. Animated PNG is rejected rather than silently losing its animation. Original EXIF and other source metadata are not copied by Canvas.',
    faq: [
      [
        'Can the JPG keep transparent pixels?',
        'No. JPEG has no alpha channel, so transparency cannot survive the conversion. Before encoding, the converter fills transparent and semi-transparent areas with the background color you pick, white by default. If you need to keep transparency, convert to WebP with the Image to WebP tool instead, or keep the original PNG.',
      ],
      [
        'Is renaming .png to .jpg enough?',
        'No. Renaming changes the filename, not the data inside it, and many sites reject a PNG that only pretends to be a JPG. This converter decodes the PNG pixels, draws them on a canvas and encodes a genuine JPEG, then checks that the output really is a JPEG with the expected dimensions.',
      ],
      [
        'Will converting PNG to JPG make the file smaller?',
        'Often, for photographs, because JPEG uses lossy compression. Screenshots, text and flat-color graphics may show artifacts around edges and do not always shrink much. The result panel shows the real original and output sizes so you can compare them. Lower the JPEG quality to save more bytes, or keep PNG when sharp detail matters.',
      ],
      [
        'Can I convert animated PNG files?',
        'No. Animated PNG (APNG) files are detected and rejected with a clear message rather than silently losing their animation. Export a single frame with an animation-aware editor first, then convert that static PNG here. This tool accepts PNG input only, so use another converter for JPG or WebP sources.',
      ],
      [
        'Does the JPG keep my PNG metadata?',
        'No. The JPEG is a fresh canvas encode, so text chunks, EXIF and other metadata from the source PNG are not copied into it. Conversion runs entirely in your browser, and the image is never uploaded to a server. The browser’s encoder may still write its own basic file information.',
      ],
    ],
  },
  'jpg-to-png': {
    subject: 'the JPG to PNG converter',
    metaTitle: 'JPG to PNG Converter — Free & In-Browser',
    metaDescription:
      'Convert JPG and JPEG images to PNG free in your browser. Get a real lossless PNG at the same dimensions and batch up to 10 files, with no upload or account.',
    answer:
      'The JPG to PNG converter is a free browser tool that turns JPG and JPEG photos into real PNG files at the same pixel dimensions. PNG stores the decoded pixels losslessly, so later edits avoid repeated JPEG compression. Convert up to 10 images at once and download them individually or as a ZIP, all processed locally.',
    intro:
      'Turn a JPEG into a PNG representation of its decoded pixels. PNG is useful for editing workflows that require a lossless pixel format or software that expects PNG input. The conversion starts from what remains in the JPEG; it cannot reverse earlier image loss.',
    steps: [
      'Select static JPEG images, including .jpg or .jpeg files.',
      'Review their dimensions and original byte sizes.',
      'Convert to PNG, compare actual output sizes, and download the results.',
    ],
    example:
      'A 600 × 400 JPEG remains 600 × 400 after conversion. Its PNG may be larger because a lossless encoder stores the already decoded pixels without further JPEG-style quantization.',
    uses: [
      'Prepare an image for a PNG-based editing workflow.',
      'Avoid further JPEG recompression during later edits.',
      'Use a consistent format for a set of screenshots and photographs.',
    ],
    quality:
      'The PNG encoder does not introduce JPEG-style lossy compression, but the browser has already decoded and possibly color-converted the source. Detail lost in the original JPEG is not restored. The original image is opaque; conversion does not automatically remove its background.',
    limits:
      'PNG does not necessarily mean a smaller file. There is no meaningful PNG quality slider in this Canvas implementation. Source metadata is not preserved. Large images remain subject to the same pixel and memory limits as other tools.',
    faq: [
      [
        'Will a blurry JPG become sharp as a PNG?',
        'No. The PNG contains exactly the pixels decoded from the JPEG, including any blur, noise or compression artifacts. Lossless PNG encoding prevents further loss from this point on, but it cannot reconstruct texture or edges that earlier JPEG compression removed. Start from the highest-quality original you have.',
      ],
      [
        'Why is my PNG larger than the JPG?',
        'JPEG uses lossy compression designed for photographs, while PNG stores every decoded pixel without discarding information. For a photo, that often makes the PNG several times larger. That is expected and does not mean anything went wrong. If you need a smaller modern file instead, try the Image to WebP converter.',
      ],
      [
        'Does converting JPG to PNG remove a white background?',
        'No. A white background in a JPEG is part of its opaque pixels, and converting to PNG does not change those pixels or invent transparency. The PNG looks the same, just in a lossless format. Removing a background requires selecting the subject in an editor, which this converter does not do.',
      ],
      [
        'Is there a quality setting for PNG?',
        'No. PNG is lossless, and the browser’s PNG encoder has no quality control, so the quality slider is disabled for this conversion. The output keeps the same width and height as the source. Accepted inputs are static .jpg and .jpeg files up to 20 MB and 16 megapixels each.',
      ],
      [
        'Is my photo uploaded, and is its EXIF data kept?',
        'Your photo is not uploaded; decoding and PNG encoding run in your browser. The new PNG is drawn from decoded pixels on a canvas, so the original EXIF data, including camera details and GPS location, is not copied into it. Orientation is applied to the pixels, so the image still displays upright.',
      ],
    ],
  },
  'image-to-webp': {
    subject: 'the Image to WebP converter',
    metaTitle: 'Image to WebP Converter — JPG & PNG to WebP',
    metaDescription:
      'Convert JPG and PNG images to WebP free in your browser. Adjust quality, keep transparency, compare real file sizes and batch up to 10 images at once.',
    answer:
      'The Image to WebP converter is a free browser tool that encodes JPG and PNG images as static WebP files. You set the quality from 10% to 100% and can keep transparent pixels from PNG sources. It shows real before-and-after file sizes, handles up to 10 images per batch and never uploads your files.',
    intro:
      'Encode a JPG or PNG as static WebP using your browser’s image encoder. WebP supports an alpha channel and adjustable lossy quality, making it a useful option for many web photographs and graphics. Output support is checked rather than inferred from a changed extension.',
    steps: [
      'Choose JPG or PNG input.',
      'Set the WebP quality and whether transparent pixels should remain transparent.',
      'Convert and compare the actual file size and appearance before downloading.',
    ],
    example:
      'A transparent 800 × 800 PNG becomes an 800 × 800 WebP with alpha enabled. A photographic JPEG may become smaller, but the actual result depends on content and quality.',
    uses: [
      'Create modern web image assets.',
      'Keep transparent edges in a format with lossy quality controls.',
      'Compare WebP sizes with existing PNG and JPEG files.',
    ],
    quality:
      'This implementation uses the browser’s quality-controlled WebP encoder. It is lossy, including at a quality setting of 100%; that setting is not labeled lossless. Browser encoders and color conversion can differ, so inspect fine text and gradients.',
    limits:
      'If Canvas cannot produce WebP, a bundled local WebAssembly encoder is loaded on demand. If neither encoding path works, a clear error is shown instead of mislabeling PNG output. Animated inputs are not accepted. True lossless WebP encoding is not claimed or implemented.',
    faq: [
      [
        'Is 100% WebP quality lossless?',
        'No. The quality setting controls lossy WebP encoding, and even 100% is still lossy. This tool does not offer or claim true lossless WebP, so keep a PNG copy when you need pixel-perfect output. High quality settings usually look very close to the source, but inspect fine text and gradients before publishing.',
      ],
      [
        'Can WebP keep the transparency from my PNG?',
        'Yes. WebP supports an alpha channel. Leave “Preserve alpha / use transparent padding” enabled and the transparent areas of a PNG stay transparent in the WebP. If you turn it off, transparent pixels are filled with the background color you choose. JPG sources have no transparency to keep.',
      ],
      [
        'Will WebP always be smaller than JPG or PNG?',
        'Not always. WebP is often smaller for photographs and many web graphics, but the result depends on the image content and the quality you pick. The converter shows the actual original and output sizes after each conversion, so you can compare them and keep whichever file works best for your page.',
      ],
      [
        'What if my browser cannot encode WebP?',
        'Some browsers cannot produce WebP from a canvas. In that case the tool loads a WebAssembly WebP encoder bundled with this site and still encodes on your device. If neither path works, you see a clear error instead of a PNG mislabeled as WebP, because the output type is checked before download.',
      ],
      [
        'Can I convert GIF or animated images to WebP?',
        'No. This converter accepts static JPG and PNG input only. Animated PNG files are rejected rather than reduced to a single frame, and GIF, SVG, HEIC and AVIF files are not supported. To turn an existing WebP into another format, use the WebP to PNG converter instead.',
      ],
    ],
  },
  'webp-to-png': {
    subject: 'the WebP to PNG converter',
    metaTitle: 'WebP to PNG Converter — Keep Transparency',
    metaDescription:
      'Convert static WebP images to PNG free in your browser. Keep transparent areas, get the same dimensions and batch up to 10 files without any upload.',
    answer:
      'The WebP to PNG converter is a free browser tool that turns static WebP images into real PNG files at the same pixel dimensions. Transparent areas are kept when transparency is enabled, making the result easy to open in editors that do not accept WebP. Up to 10 files convert locally per batch, with no upload.',
    intro:
      'Convert a static WebP into a PNG for an application or workflow that expects PNG. The output retains the decoded dimensions and alpha channel when transparent output is enabled. Pixel data is encoded into a real PNG, not simply renamed.',
    steps: [
      'Select a static WebP file.',
      'Keep transparency enabled if the source contains transparent pixels.',
      'Convert, compare the result, and download the PNG.',
    ],
    example:
      'A static 640 × 480 WebP with alpha becomes a 640 × 480 PNG with transparent areas retained. The PNG may occupy more bytes than the source.',
    uses: [
      'Prepare a WebP asset for a PNG-only editor.',
      'Convert an alpha WebP into a broadly editable pixel format.',
      'Inspect the actual size cost of a PNG export.',
    ],
    quality:
      'PNG encodes the decoded pixels without a lossy quality slider. It cannot recover detail discarded when a lossy WebP was created. Browser decoding and color management still affect the rendered pixels.',
    limits:
      'Animated WebP is detected and rejected with a clear message. This static-image tool does not claim to preserve an animation or silently export just one frame. Malformed headers and decode failures are also rejected.',
    faq: [
      [
        'Can I convert animated WebP to PNG?',
        'No. Animated WebP files are detected and rejected with a clear message. The tool does not silently export only the first frame, because that would quietly lose content. Export the frame you need from an animation-aware editor first, then convert that static WebP image here.',
      ],
      [
        'Why is the PNG larger than the WebP?',
        'WebP files are often lossy or use more efficient compression for their content, while PNG stores every decoded pixel losslessly. Converting does not restore detail that lossy WebP compression removed; it only stops further loss. A larger PNG is normal, and the interface shows the real before and after sizes.',
      ],
      [
        'Does the PNG keep transparent backgrounds?',
        'Yes. Keep “Preserve alpha / use transparent padding” enabled, and transparent or semi-transparent pixels from the WebP stay transparent in the PNG. If you turn the option off, those areas are filled with the background color you pick. The output keeps the same width and height as the source.',
      ],
      [
        'Why would I convert WebP to PNG?',
        'Some editors, upload forms and older apps still expect PNG rather than WebP. PNG is widely supported, lossless and keeps transparency, which makes it a safe working format for further editing. If your destination accepts WebP, the original is usually smaller, so convert only when you need to.',
      ],
      [
        'Are my WebP files uploaded anywhere?',
        'No. Decoding and PNG encoding happen in your browser, and the files are not sent to a conversion server. Each file can be up to 20 MB and 16 megapixels, with up to 10 files and 60 MB per batch. Download each PNG separately or all of them together as a ZIP.',
      ],
    ],
  },
  'image-cropper': {
    subject: 'the Image Cropper',
    metaTitle: 'Image Cropper — Crop & Rotate Images Online',
    metaDescription:
      'Crop JPG, PNG and WebP images online with a visual crop box, exact pixel fields, ratios like 1:1 or 16:9, zoom and 90° rotation. Free and private.',
    answer:
      'The Image Cropper is a free browser tool for cutting a JPG, PNG or WebP image down to the part you want to keep. Drag the crop box or enter exact pixel coordinates, pick freeform or a ratio such as 1:1 or 16:9, zoom up to 4× and rotate in 90° steps, then download without uploading.',
    intro:
      'Choose the part of an image worth keeping. The visual crop box operates in the natural, orientation-correct image coordinate system, so dragging the on-screen rectangle maps to actual source pixels. Numeric crop fields provide a precise and keyboard-accessible alternative.',
    steps: [
      'Choose an image and a freeform or fixed-ratio crop.',
      'Drag the crop box to move it, drag its corner to resize, or enter pixel coordinates. Use zoom to select a smaller area and rotate in 90-degree steps.',
      'Select an output format, crop, and inspect the output dimensions before downloading.',
    ],
    example:
      'Cropping an 800 × 600 image at x=100, y=50 with width=400 and height=300 produces a 400 × 300 image. Display scaling does not change those pixel coordinates.',
    uses: [
      'Remove distracting edges from a photograph.',
      'Prepare a square portrait with a controlled focal point.',
      'Make a landscape banner from a larger image.',
    ],
    quality:
      'The crop output uses the selected source region at its natural pixel size. The zoom control narrows the selected area rather than inventing extra detail. Rotations are quarter turns to keep coordinate calculations predictable.',
    limits:
      'The box must stay within the rotated image. Ratio presets guide the visual box; whole-pixel rounding can make very small crops slightly approximate. This is a single-image tool. Free rotation, perspective correction, and subject-aware cropping are not included.',
    faq: [
      [
        'How do I crop an image to a square?',
        'Choose 1:1 in the crop aspect ratio menu. The crop box becomes the largest centered square that fits the image, and you can drag it to move your subject into frame. Use zoom to crop tighter around a detail, then select an output format and crop. The result is a square at its natural pixel size.',
      ],
      [
        'Can I crop without a mouse?',
        'Yes. Enter x, y, width and height in pixels for an exact crop. The move and resize handles also respond to the arrow keys when focused, and Tab moves between controls without trapping keyboard focus. Display scaling never changes the coordinates; they always refer to the image’s real pixels.',
      ],
      [
        'What does the zoom control do?',
        'Zoom shrinks the crop area around its center, up to 4×, so you can select a smaller detail of the image. It does not add resolution: the output is the selected region at its natural pixel size. After zooming, drag the smaller crop box to the part of the picture you want to keep.',
      ],
      [
        'Can I rotate an image while cropping?',
        'Yes, in 90° clockwise steps using the Rotate button. Quarter turns keep the coordinate math exact, so the crop always maps to real pixels in the rotated image. Free-angle rotation, straightening and perspective correction are not included, and the crop box must stay inside the rotated image.',
      ],
      [
        'Does cropping reduce image quality?',
        'Cropping keeps the selected pixels at their original resolution, so the area you keep looks the same. Quality changes come only from the output format: PNG is lossless, while JPG and WebP use the quality setting you choose. The cropped file is a new encode, so original EXIF and GPS tags are not copied.',
      ],
    ],
  },
  'aspect-ratio-converter': {
    subject: 'the Aspect Ratio Converter',
    metaTitle: 'Aspect Ratio Converter — Crop, Fit or Stretch',
    metaDescription:
      'Change an image’s aspect ratio to 1:1, 4:5, 16:9, 9:16 or a custom ratio. Crop to fill, fit with padding, or stretch. Free and processed in your browser.',
    answer:
      'The Aspect Ratio Converter is a free browser tool that changes an image’s shape to a new ratio such as 1:1, 4:5, 16:9 or a custom value. Choose crop to fill the canvas, fit to keep the whole picture with padding, or stretch, then set the output width and download. Everything is processed locally.',
    intro:
      'Change an image canvas to a different shape using three explicitly different operations. Crop fills the new canvas and removes outer edges. Fit keeps the whole image and adds padding. Stretch fills the canvas by changing proportions, which can distort the subject.',
    steps: [
      'Choose an image, ratio preset, or a positive custom ratio.',
      'Set the output width, choose crop, fit, or stretch, and select a padding color or transparency.',
      'Process the canvas and verify the resulting dimensions and composition.',
    ],
    example:
      'An 800 × 600 image on a 1000 × 1000 canvas can be center-cropped to a square, fit into 1000 × 750 with padding, or stretched to 1000 × 1000 with distorted proportions.',
    uses: [
      'Create a square canvas without cutting off the subject.',
      'Prepare a consistent portrait ratio for a photo set.',
      'Compare the visual cost of cropping versus adding padding.',
    ],
    quality:
      'Fit uses a centered contain operation; crop uses a centered cover operation. Neither is subject-aware. Transparent padding is available only for PNG or WebP. JPEG padding is flattened against the chosen color.',
    limits:
      'Ratio adjustment changes geometry, not a target number of kilobytes. The custom ratio must have positive finite sides. Integer output height is rounded from the chosen width. Stretch is always accompanied by a distortion warning.',
    faq: [
      [
        'Which mode keeps the entire picture?',
        'Fit. It scales the whole image into the new canvas and adds padding where the shapes differ, using a color you choose or transparency in PNG and WebP. Crop fills the canvas by trimming the outer edges from the center. Stretch fills the canvas by changing proportions, which can distort faces, logos and text.',
      ],
      [
        'How do I change a photo to 16:9 without cropping it?',
        'Select 16:9 as the aspect ratio and choose Fit as the adjustment mode. The full photo is centered on a 16:9 canvas, and the empty space is filled with your padding color, or left transparent when PNG or WebP output is selected. Set the output width, and the height is calculated from the ratio.',
      ],
      [
        'Can the padding be transparent?',
        'Yes, when the output format is PNG or WebP and “Preserve alpha / use transparent padding” is enabled. JPG has no transparency, so JPG padding always uses the solid background color you pick, white by default. The result panel shows the final canvas size so you can confirm the padding before downloading.',
      ],
      [
        'Does crop mode choose the best part of my photo?',
        'No. Crop uses a centered cover operation, so it keeps the middle of the image and trims equally from opposite edges. It is not subject-aware. If your subject is off-center, use the Image Cropper to place the frame manually, or use Fit to keep everything and add padding instead.',
      ],
      [
        'Can I enter a custom aspect ratio?',
        'Yes. Choose Custom ratio and enter a ratio width and height, such as 21 and 9. You then set the output width, and the output height is calculated from the ratio and rounded to whole pixels. Output is limited to 8,192 pixels per side and 16 megapixels in total.',
      ],
    ],
  },
  'social-media-image-resizer': {
    subject: 'the Social Image Resizer',
    metaTitle: 'Social Media Image Resizer for Posts & Covers',
    metaDescription:
      'Resize images for Instagram, Facebook, LinkedIn, YouTube, X and Pinterest posts, profiles and covers. Crop or fit to preset sizes, free in your browser.',
    answer:
      'The Social Image Resizer is a free browser tool that fits a photo onto a preset canvas for a specific social placement, such as an Instagram portrait post, a YouTube thumbnail or an X header. Pick the platform and placement, choose crop or fit with padding, and download the result without uploading it.',
    intro:
      'Prepare a canvas for a particular social placement without guessing whether “social image size” means a post, profile, cover, or thumbnail. Presets are centralized and dated. Verified recommendations are identified; other dimensions are clearly labeled general-purpose starting points.',
    steps: [
      'Select the platform and placement, then inspect the displayed pixel dimensions and preset status.',
      'Choose center crop or fit with padding and an appropriate format.',
      'Process, inspect the canvas, and verify the current placement rules in the destination application.',
    ],
    example:
      'For an X profile image, the verified starting dimensions are 400 × 400 pixels. A header uses a different 1500 × 500 canvas and can still be displayed with cropping on different screens.',
    uses: [
      'Make a square profile canvas from a landscape photo.',
      'Fit a photograph into a portrait story canvas.',
      'Prepare a video thumbnail with explicit dimensions.',
    ],
    quality:
      'A canvas size does not define safe areas, circular masks, text placement, account eligibility, or a platform’s later recompression. Use high-quality input and keep essential content away from the edges. Upscaling a small source cannot create missing detail.',
    limits:
      'Presets were reviewed October 27, 2026. YouTube thumbnail and X profile/header recommendations have linked official references. Instagram, Facebook, LinkedIn, Pinterest, and the YouTube banner preset are labeled general-purpose starting sizes; current official requirements were not established for those entries. Check the actual placement before publishing.',
    faq: [
      [
        'Which platforms and placements are included?',
        'Presets cover Instagram, Facebook, LinkedIn, YouTube, X and Pinterest, including posts, stories, profile photos, covers, banners, pins and video thumbnails. For example, an Instagram portrait post canvas is 1080 × 1350 pixels and an X header is 1500 × 500. Each preset shows its exact dimensions and whether it is a verified recommendation.',
      ],
      [
        'What size is a YouTube thumbnail?',
        'The YouTube video thumbnail preset is 3840 × 2160 pixels, a 16:9 canvas, and the Shorts thumbnail preset is 2160 × 3840. Both are marked verified and link to YouTube’s official help page. Check YouTube’s current upload rules, including the file-size limit, before publishing, because canvas size alone does not guarantee acceptance.',
      ],
      [
        'Why is a preset marked as a starting size?',
        'A starting size is a useful canvas suggestion, not a verified current platform requirement. Only the YouTube thumbnail and X profile and header presets link to official references; Instagram, Facebook, LinkedIn, Pinterest and the YouTube banner are labeled general-purpose. Presets were reviewed on October 27, 2026, so confirm current rules in the app.',
      ],
      [
        'Does one image size work everywhere on a platform?',
        'No. Posts, stories, profile photos, banners and thumbnails each have different display rules, and many apps crop images differently on phones and desktops. Choose the named placement you need, keep important content away from the edges, and preview the result in the destination app before you publish it.',
      ],
      [
        'Should I crop or fit my image to the preset?',
        'Crop fills the whole canvas and trims edges from the center, which suits photos with a centered subject. Fit keeps the entire image and adds padding in a color you choose, or transparency for PNG and WebP. Stretching is not offered here, so your image is never distorted to fill a social canvas.',
      ],
    ],
  },
  'image-metadata-viewer': {
    subject: 'the Image Metadata Viewer',
    metaTitle: 'Image Metadata Viewer — Check EXIF & GPS Data',
    metaDescription:
      'View image metadata and EXIF data in your browser: camera, lens, capture date, orientation and GPS location. Export a PNG without EXIF/GPS. No upload.',
    answer:
      'The Image Metadata Viewer is a free browser tool that shows the details stored in a JPG, PNG or WebP file: dimensions, format, camera make and model, lens, exposure, capture date, orientation and GPS location when present. Fields that are missing are marked unavailable, and the file is never uploaded to a server.',
    intro:
      'Inspect the information available in a file without sending it to a metadata service. Basic fields come from the file and decoded pixels; EXIF fields are parsed only when present. Camera, capture date, orientation, and location entries are marked unavailable when they cannot be read.',
    steps: [
      'Choose one static JPG, PNG, or WebP and select Inspect metadata.',
      'Review the file and pixel details. Reveal GPS fields deliberately if any are present, then select only the fields you want to copy or save.',
      'Optionally re-encode as PNG without the original EXIF/GPS tags and inspect the downloaded image before publishing.',
    ],
    example:
      'A camera JPEG may contain Make, Model, DateTimeOriginal, Orientation, latitude, and longitude. A normal screenshot may have none of these; missing fields are shown as unavailable, not inferred.',
    uses: [
      'Check whether a photo contains location information.',
      'Confirm image dimensions and a reduced aspect ratio.',
      'Inspect an orientation tag that changes how a camera photo is displayed.',
    ],
    quality:
      'The viewer does not alter the original file. The optional PNG export draws orientation-correct pixels to Canvas, so it may change file size, color representation, and encoding. Original EXIF/GPS blocks are not copied. This is not a claim that every possible identifying property is removed.',
    limits:
      'EXIF availability varies by format and parser support. Color profile details and bit depth are shown only when reliably known; a browser-rendered preview is not proof of original color-space fidelity. Capture timestamps may lack an offset. GPS is never placed in a map link or shareable URL.',
    faq: [
      [
        'How do I check if a photo has GPS location data?',
        'Open the photo and select Inspect metadata. If latitude, longitude or altitude tags are present, a “Location metadata is present” notice appears, and the coordinates stay hidden until you choose Reveal GPS fields. The viewer never places coordinates in a map link or a shareable URL.',
      ],
      [
        'Why are so many fields unavailable?',
        'Many images never had EXIF, or had it removed by an editor, a screenshot tool or a social app during export. The viewer reads standard TIFF, EXIF and GPS tags and shows anything it cannot read as unavailable. It never guesses camera, date or location values from what the picture looks like.',
      ],
      [
        'Can I remove EXIF and GPS data from a photo?',
        'Yes. After inspecting, you can re-encode the image as a PNG drawn from its pixels, which does not copy the original EXIF and GPS blocks. The orientation is applied to the pixels so the image stays upright. Check the downloaded file before sharing, since the PNG may be larger than the original.',
      ],
      [
        'Does removing metadata make an image anonymous?',
        'No. Re-encoding removes the original EXIF and GPS blocks, but the visible picture, the filename, or information added by the browser encoder can still identify a person or place. Faces, signs and recognizable scenery reveal a lot without any metadata. Treat metadata removal as one step, then review the image itself.',
      ],
      [
        'Can I copy or save the metadata?',
        'Yes. Tick the fields you want, then use Copy selected to put them on your clipboard or Save selected JSON to download a small JSON file. GPS fields can only be selected after you reveal them. Everything is read locally with the open-source exifr library, and nothing is sent to a metadata service.',
      ],
    ],
  },
};
/** Question-style section headings shared by the HTML page and its Markdown twin. */
export const toolHeadings = (c: Pick<Content, 'subject'>) => ({
  what: `What is ${c.subject}?`,
  how: `How do I use ${c.subject}?`,
  uses: `When should I use ${c.subject}?`,
  quality: `How does ${c.subject} affect image quality?`,
  limits: `What are the limits of ${c.subject}?`,
  privacy: `Is ${c.subject} private?`,
  faq: `Questions about ${c.subject}`,
});
export const privacyNote =
  'Core operations run on your device. Selected image bytes, filenames, and metadata are not sent to a conversion service or tracking endpoint. Clear the workspace when you finish and manage downloads or clipboard history according to your needs.';
