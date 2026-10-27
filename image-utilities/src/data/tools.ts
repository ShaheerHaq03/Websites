export const tools = [
  {
    id: 'image-resizer',
    name: 'Image Resizer',
    description:
      'The right dimensions, without the distortion. Resize in pixels or percentages.',
    category: 'Resize & Crop',
    icon: 'resize',
    color: 'blue',
    tag: 'Most popular',
    related: ['image-compressor', 'image-cropper', 'aspect-ratio-converter'],
  },
  {
    id: 'image-compressor',
    name: 'Image Compressor',
    description:
      'Less file size. More possibilities. Find the balance that works for your image.',
    category: 'Optimize',
    icon: 'compress',
    color: 'violet',
    tag: 'Most popular',
    related: ['image-resizer', 'image-to-webp', 'image-metadata-viewer'],
  },
  {
    id: 'png-to-jpg',
    name: 'PNG to JPG',
    description:
      'Turn PNGs into shareable JPGs. Pick the background for transparent areas.',
    category: 'Convert',
    icon: 'jpg',
    color: 'amber',
    tag: '',
    related: ['jpg-to-png', 'image-to-webp', 'image-compressor'],
  },
  {
    id: 'jpg-to-png',
    name: 'JPG to PNG',
    description:
      'Convert JPEG images to PNG for a lossless pixel format from this point on.',
    category: 'Convert',
    icon: 'png',
    color: 'green',
    tag: '',
    related: ['png-to-jpg', 'webp-to-png', 'image-resizer'],
  },
  {
    id: 'image-to-webp',
    name: 'Image to WebP',
    description:
      'Give JPG and PNG files a modern format, with quality controls and alpha support.',
    category: 'Convert',
    icon: 'webp',
    color: 'cyan',
    tag: '',
    related: ['webp-to-png', 'image-compressor', 'png-to-jpg'],
  },
  {
    id: 'webp-to-png',
    name: 'WebP to PNG',
    description:
      'Convert static WebP images to PNG, keeping transparent pixels where available.',
    category: 'Convert',
    icon: 'convert',
    color: 'rose',
    tag: '',
    related: ['image-to-webp', 'jpg-to-png', 'image-metadata-viewer'],
  },
  {
    id: 'image-cropper',
    name: 'Image Cropper',
    description:
      'Keep the good part. Frame your image with a visual crop, zoom, and rotation.',
    category: 'Resize & Crop',
    icon: 'crop',
    color: 'violet',
    tag: '',
    related: [
      'aspect-ratio-converter',
      'image-resizer',
      'social-media-image-resizer',
    ],
  },
  {
    id: 'aspect-ratio-converter',
    name: 'Aspect Ratio Converter',
    description:
      'Crop, fit with padding, or stretch. Change the shape on your terms.',
    category: 'Resize & Crop',
    icon: 'ratio',
    color: 'blue',
    tag: '',
    related: ['image-cropper', 'social-media-image-resizer', 'image-resizer'],
  },
  {
    id: 'social-media-image-resizer',
    name: 'Social Image Resizer',
    description:
      'Prepare posts, profiles, and covers with clear, placement-specific starting sizes.',
    category: 'Resize & Crop',
    icon: 'social',
    color: 'rose',
    tag: '',
    related: ['image-cropper', 'image-compressor', 'aspect-ratio-converter'],
  },
  {
    id: 'image-metadata-viewer',
    name: 'Image Metadata Viewer',
    description:
      'See the details behind the picture: dimensions, camera tags, and available EXIF.',
    category: 'Inspect',
    icon: 'metadata',
    color: 'green',
    tag: '',
    related: ['image-compressor', 'image-resizer', 'jpg-to-png'],
  },
] as const;
export type ToolId = (typeof tools)[number]['id'];
export type Tool = (typeof tools)[number];
export const getTool = (id: string) => tools.find((t) => t.id === id)!;
export const categories = [
  'All tools',
  'Resize & Crop',
  'Optimize',
  'Convert',
  'Inspect',
];
