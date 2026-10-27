export const defaultSiteUrl = 'https://example.com';
export const cleanPathname = (pathname) =>
  pathname
    .replace(/\/index\.html$/, '/')
    .replace(/\.html$/, '')
    .replace(/\/$/, '') || '/';
