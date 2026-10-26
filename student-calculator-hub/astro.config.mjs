import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { cleanPathname, canonicalUrl } from './src/lib/seo/urls.mjs';
const site = process.env.PUBLIC_SITE_URL || 'https://example.com';
export default defineConfig({
  site,
  output: 'static',
  build: { format: 'file' },
  trailingSlash: 'never',
  integrations: [
    react(),
    sitemap({
      filter: (page) => cleanPathname(new URL(page).pathname) !== '/404',
      serialize: (item) => ({ ...item, url: canonicalUrl(new URL(item.url).pathname, site) }),
    }),
  ],
  vite: { plugins: [tailwindcss()] },
});
