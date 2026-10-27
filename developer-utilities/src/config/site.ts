import { defaultSiteUrl, cleanPathname } from '../lib/seo/urls.mjs';
import { siteUpdated } from './updated.mjs';
export const site = {
  name: 'Data Formatter Pro',
  tagline: 'Developer tools that just work.',
  description:
    'Free developer tools for JSON, CSV, tokens, encoding, and everyday debugging. Process your data locally in your browser.',
  url: (import.meta.env.PUBLIC_SITE_URL || defaultSiteUrl).replace(/\/$/, ''),
  /** ISO date (YYYY-MM-DD) the tool content was last reviewed. */
  updated: siteUpdated,
  logo: '/favicon.svg',
  socialImage: {
    path: '/images/social-preview.png',
    width: 1184,
    height: 622,
    alt: 'Data Formatter Pro: everyday developer tools, done right. 12 free tools, processed in your browser.',
  },
  contactEmail: import.meta.env.PUBLIC_CONTACT_EMAIL || '',
  social: {} as Record<string, string>,
  analytics: { enabled: false, id: '' },
  adsense: {
    enabled: false,
    publisherId: import.meta.env.PUBLIC_ADSENSE_PUBLISHER_ID || '',
  },
  theme: { default: 'system', storageKey: 'dfp-theme' },
};
export const canonical = (pathname: string) =>
  new URL(cleanPathname(pathname), site.url).href;
/** Human-readable form of an ISO date, e.g. "October 27, 2026". */
export const formatDate = (iso: string) =>
  new Date(`${iso}T00:00:00Z`).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  });
