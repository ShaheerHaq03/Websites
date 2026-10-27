/** Title-tag text and meta descriptions for the supporting pages (also used by /llms.txt). */
export const pages = {
  about: {
    path: '/about',
    name: 'About PixelTools',
    metaTitle: 'About Our Free, Private Image Tools',
    metaDescription:
      'About PixelTools: ten free image tools that resize, compress, crop, convert and inspect JPG, PNG and WebP files locally in your browser, with no account.',
  },
  contact: {
    path: '/contact',
    name: 'Contact',
    metaTitle: 'Contact Us — Feedback & Bug Reports',
    metaDescription:
      'Contact PixelTools to report a bug, suggest a new image utility, or share feedback. Include the tool, expected result and browser for a faster fix.',
  },
  privacy: {
    path: '/privacy-policy',
    name: 'Privacy Policy',
    metaTitle: 'Privacy Policy',
    metaDescription:
      'PixelTools privacy policy: images are processed locally in your browser and are not uploaded. Learn about ordinary website requests and your choices.',
  },
  terms: {
    path: '/terms',
    name: 'Terms of Use',
    metaTitle: 'Terms of Use',
    metaDescription:
      'PixelTools terms of use: practical rules for these free, browser-based image utilities, covering your images, technical limits and acceptable use.',
  },
  disclaimer: {
    path: '/disclaimer',
    name: 'Disclaimer',
    metaTitle: 'Disclaimer',
    metaDescription:
      'PixelTools disclaimer: the practical limits behind previews and pixels, from format differences and size targets to social presets and metadata.',
  },
} as const;
