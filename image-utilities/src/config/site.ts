import {
  defaultSiteUrl,
  cleanPathname,
  siteUpdated,
} from '../lib/seo/urls.mjs';
export const site = {
  name: 'PixelTools',
  tagline: 'Resize, Compress & Convert Images — Free and Private.',
  description:
    'Free, private image tools to resize, compress, crop, convert and inspect JPG, PNG and WebP images right in your browser, with no uploads and no account.',
  url: (import.meta.env.PUBLIC_SITE_URL || defaultSiteUrl).replace(/\/$/, ''),
  contactEmail: import.meta.env.PUBLIC_CONTACT_EMAIL || '',
  locale: 'en_US',
  /** Single content-review date: visible "Last updated", schema dateModified, sitemap lastmod. */
  updated: siteUpdated,
  socialImage: {
    path: '/images/social-preview.png',
    width: 1200,
    height: 630,
    alt: 'PixelTools logo with the headline “Every image. Just the right size.” Resize, compress, crop and convert. Free and private.',
  },
  logo: { path: '/favicon.svg', width: 48, height: 48 },
  social: {},
  analytics: { enabled: false, id: '' },
  adsense: {
    enabled: false,
    publisherId: import.meta.env.PUBLIC_ADSENSE_PUBLISHER_ID || '',
  },
  theme: { default: 'light', storageKey: 'pixeltools-theme' },
};
export const canonical = (path: string) =>
  new URL(cleanPathname(path), site.url).href;
/** Human-readable form of a YYYY-MM-DD date, without timezone drift. */
export const displayDate = (iso: string) =>
  new Date(`${iso}T12:00:00Z`).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  });
