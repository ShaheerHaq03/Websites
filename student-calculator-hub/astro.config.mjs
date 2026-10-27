import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { cleanPathname, canonicalUrl } from './src/lib/seo/urls.mjs';
import { SITE_UPDATED } from './src/config/updated.mjs';
const site = process.env.PUBLIC_SITE_URL || 'https://example.com';
export default defineConfig({
  site,
  output: 'static',
  build: { format: 'file' },
  trailingSlash: 'never',
  integrations: [
    react(),
    sitemap({
      // Pages only: no 404, and never the Markdown twins or llms.txt.
      filter: (page) => {
        const pathname = new URL(page).pathname;
        return cleanPathname(pathname) !== '/404' && !/\.(md|txt)$/.test(pathname);
      },
      serialize: (item) => ({
        ...item,
        url: canonicalUrl(new URL(item.url).pathname, site),
        lastmod: SITE_UPDATED,
      }),
    }),
  ],
  vite: { plugins: [tailwindcss()] },
});
