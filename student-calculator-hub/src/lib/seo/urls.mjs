/** Canonical route independent of Astro's directory/file build representation.
 * @param {string} pathname
 */
export function cleanPathname(pathname) {
  return (
    pathname
      .replace(/\/index\.html$/, '/')
      .replace(/\.html$/, '')
      .replace(/\/$/, '') || '/'
  );
}
/** @param {string} pathname @param {string} base */
export function canonicalUrl(pathname, base) {
  return new URL(cleanPathname(pathname), base).href;
}
