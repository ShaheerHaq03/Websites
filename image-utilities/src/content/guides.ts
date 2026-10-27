export const guides = [
  {
    slug: 'image-dimensions-vs-file-size',
    metaTitle: 'Image Dimensions vs File Size: Pixels vs KB',
    metaDescription:
      'Why a 1200-pixel image can be 50 KB or 5 MB. Learn how pixel dimensions and file size differ, and whether to resize or compress to meet a requirement.',
    title: 'Pixels and kilobytes tell different stories.',
    description:
      'Why a 1200-pixel image can be 50 KB or 5 MB—and which setting to change.',
    readTime: 4,
    sections: [
      [
        'Dimensions describe the canvas',
        'Pixel width and height describe the grid used to represent an image. A 1200 × 800 picture contains 960,000 pixel positions. That number says nothing by itself about how efficiently the file stores the image. Resizing changes this grid; it does not directly promise a byte count.',
      ],
      [
        'File size describes stored bytes',
        'A file size such as 100 KB measures storage or transfer cost. Pixel count matters, but so do the format, detail, noise, transparency, quality setting, and metadata. A flat-color illustration often encodes much smaller than a noisy photograph with the same dimensions. PixelTools uses decimal units: 1 KB is 1,000 bytes and 1 MB is 1,000,000 bytes.',
      ],
      [
        'Start with the actual requirement',
        'If a form says 600 × 400 pixels, use the resizer and verify the output dimensions. If it says under 100 KB, use the compressor with a 100,000-byte goal. If both apply, resize first, then compress while keeping dimension reduction off. Recheck the actual result instead of trusting a target label.',
      ],
      [
        'A practical example',
        'A 2400 × 1600 image contains 3.84 million pixels. Resizing it to 1200 × 800 reduces the pixel count to 960,000, one quarter as many. The encoded byte count will not necessarily be exactly one quarter, because image encoders respond to content and settings.',
      ],
      [
        'When a target is not reached',
        'A PNG may not become smaller when you move a quality slider because Canvas PNG encoding does not expose a lossy quality control. Consider a suitable JPEG or WebP, permit more quality loss, or explicitly reduce dimensions. Keep a larger original for later editing.',
      ],
    ],
    related: ['image-resizer', 'image-compressor'],
  },
  {
    slug: 'jpg-vs-png-vs-webp',
    metaTitle: 'JPG vs PNG vs WebP: Which Image Format to Use',
    metaDescription:
      'JPG vs PNG vs WebP compared: transparency, lossy and lossless quality, compatibility and real file size, so you can pick the right format for each image.',
    title: 'JPG, PNG, or WebP? Pick for the picture.',
    description:
      'A practical guide to transparency, lossy quality, compatibility, and actual file size.',
    readTime: 5,
    sections: [
      [
        'JPEG is useful for photographs',
        'JPEG uses lossy compression and does not store alpha transparency. It can work well for photographs with continuous tones, but small text and hard edges may show artifacts. Transparent input must be composited against an opaque color before JPEG encoding. A higher quality value usually retains more detail at a larger size; the exact encoder behavior varies.',
      ],
      [
        'PNG is useful for sharp graphics and alpha',
        'PNG uses lossless pixel encoding and supports transparency. It is often useful for screenshots, line art, and assets that need alpha. Lossless encoding does not mean that a conversion recovers information already lost in a JPEG. A photographic PNG can also be considerably larger than a quality-controlled JPEG or WebP.',
      ],
      [
        'WebP offers another tradeoff',
        'Static WebP supports alpha and lossy quality controls in browsers that implement its encoder. PixelTools verifies the output MIME type and signature, since some Canvas implementations silently use PNG for unsupported formats. A quality setting of 100% is not a guarantee of true lossless WebP and is not described that way here.',
      ],
      [
        'Conversion is a real re-encode',
        'Changing a suffix does not change a file format. A converter decodes source pixels, renders the requested canvas, and encodes a new bitstream. That can alter metadata, color representation, and file size. Always examine the generated file if those properties matter to your workflow.',
      ],
      [
        'Choose a format, then compare',
        'Use PNG for a transparent graphic when lossless pixel encoding is useful; try JPEG for an opaque photograph accepted by the destination; test WebP for a compatible web asset. Compare actual bytes and appearance rather than assuming one format always wins. Keep the original when possible.',
      ],
    ],
    related: ['png-to-jpg', 'jpg-to-png', 'image-to-webp'],
  },
  {
    slug: 'image-metadata-and-gps',
    metaTitle: 'Image Metadata & GPS: What EXIF Reveals',
    metaDescription:
      'Understand EXIF metadata, orientation tags, capture dates and GPS location in photos, and what re-encoding does and does not remove before you share.',
    title: 'The details your image may carry.',
    description:
      'Understand EXIF, orientation, capture dates, and GPS before sharing a photograph.',
    readTime: 5,
    sections: [
      [
        'A file can contain more than pixels',
        'EXIF and related metadata can hold camera identifiers, exposure settings, orientation, capture times, or GPS coordinates. Availability depends on the camera, format, export software, and previous editing. A screenshot without camera information is normal; missing metadata should never be guessed from the picture.',
      ],
      [
        'Orientation is different from rotation of pixels',
        'A camera may store a landscape pixel grid with a tag asking viewers to rotate it for display. PixelTools decodes using browser orientation handling and reports the resulting visible dimensions. The original orientation field, when present, describes the source file. Different viewers can interpret unsupported tags differently.',
      ],
      [
        'Capture time is not always a global instant',
        'A camera timestamp may contain a local wall-clock time without a timezone offset. Do not treat such a value as definitive UTC or infer a travel location from it. Verify offsets and source camera settings before relying on EXIF dates in a consequential workflow.',
      ],
      [
        'Inspect GPS before publishing',
        'Location metadata can reveal where an image was captured. The metadata viewer keeps GPS fields behind a reveal control and never creates a map or shareable coordinate URL. Choose only the fields you intend to copy. Review the visible image too: signs, faces, and recognizable scenery can reveal information without EXIF.',
      ],
      [
        'What re-encoding removes—and what it does not prove',
        'Drawing decoded pixels to a new Canvas PNG does not copy the original EXIF/GPS blocks in this implementation. The exported image is tested for removal of those source fields, but browser encoders can add their own information and the filename or image itself can remain identifying. Removing metadata is one step, not a guarantee of anonymity.',
      ],
    ],
    related: ['image-metadata-viewer', 'image-resizer'],
  },
  {
    slug: 'resize-images-without-distortion',
    metaTitle: 'How to Resize Images Without Distortion',
    metaDescription:
      'Resize images without stretching them: keep the aspect ratio, crop to fill a new shape, fit with padding, and learn why upscaling cannot restore detail.',
    title: 'A new size. The same proportions.',
    description:
      'Choose between resizing, cropping, and padding without accidentally stretching your subject.',
    readTime: 4,
    sections: [
      [
        'Keep the original ratio when resizing',
        'A ratio of 3:2 describes the relationship between width and height. Keeping it locked means that a width change predictably recalculates height from the original image. The final values are whole pixels, so small images can have slight rounding differences.',
      ],
      [
        'Crop to fill a differently shaped canvas',
        'A landscape image cannot fill a square while retaining all of its original content and proportions. Crop preserves proportions by removing some edges. A centered cover operation is convenient, but a manual crop lets you decide where the focal point should remain.',
      ],
      [
        'Fit when you need the whole picture',
        'Fit scales the full source into the new canvas and leaves padding wherever its shape differs. Choose a background color, or transparent padding in PNG/WebP. For JPEG, transparency is flattened against the selected color.',
      ],
      [
        'Stretch only as a deliberate choice',
        'Stretching changes the horizontal and vertical scales independently. That can distort faces, logos, circles, and type. It may be useful for abstract texture, but it should not be an invisible default. PixelTools labels stretch explicitly and shows a warning.',
      ],
      [
        'Do not expect upscaling to restore detail',
        'Adding pixel positions relies on interpolation. It does not recreate detail that was never captured or was removed by prior compression. Work from the largest suitable original and inspect the exported image at its intended display size.',
      ],
    ],
    related: ['image-resizer', 'aspect-ratio-converter', 'image-cropper'],
  },
] as const;
