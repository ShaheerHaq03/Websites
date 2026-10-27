export const defaultSiteUrl = 'https://example.com';
/** The one "last reviewed" date for content, schema dateModified and sitemap lastmod. */
export const siteUpdated = '2026-10-27';
export const cleanPathname = (pathname) =>
  pathname
    .replace(/\/index\.html$/, '/')
    .replace(/\.html$/, '')
    .replace(/\/$/, '') || '/';
