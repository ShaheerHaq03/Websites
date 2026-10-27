import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import {
  defaultSiteUrl,
  cleanPathname,
  siteUpdated,
} from './src/lib/seo/urls.mjs';
try {
  process.loadEnvFile('.env');
} catch (error) {
  if (error.code !== 'ENOENT') throw error;
}
const site = process.env.PUBLIC_SITE_URL || defaultSiteUrl;
export default defineConfig({
  site,
  output: 'static',
  trailingSlash: 'never',
  build: { format: 'file' },
  integrations: [
    react(),
    sitemap({
      // Only HTML pages: no 404, Markdown twins, llms.txt or robots.txt.
      filter: (url) => {
        const pathname = cleanPathname(new URL(url).pathname);
        return pathname !== '/404' && !/\.(md|txt)$/.test(pathname);
      },
      serialize: (item) => ({
        ...item,
        url: new URL(cleanPathname(new URL(item.url).pathname), site).href,
        lastmod: siteUpdated,
      }),
    }),
  ],
  vite: { plugins: [tailwindcss()] },
});
