import { defaultSiteUrl } from '../src/lib/seo/urls.mjs';
try {
  process.loadEnvFile('.env');
} catch (error) {
  if (error.code !== 'ENOENT') throw error;
}
const problems = [];
const origin = process.env.PUBLIC_SITE_URL || defaultSiteUrl;
try {
  const url = new URL(origin);
  if (
    url.protocol !== 'https:' ||
    url.pathname !== '/' ||
    url.search ||
    url.hash ||
    url.hostname === new URL(defaultSiteUrl).hostname
  )
    problems.push(
      'Set PUBLIC_SITE_URL to the real HTTPS origin (pages.dev or your domain), without a path.',
    );
} catch {
  problems.push('Set PUBLIC_SITE_URL to a valid HTTPS origin.');
}
if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(process.env.PUBLIC_CONTACT_EMAIL || ''))
  problems.push('Set PUBLIC_CONTACT_EMAIL to a real operator support address.');
if (problems.length) {
  console.error(problems.join('\n'));
  process.exitCode = 1;
} else
  console.log(
    'Domain and contact settings are present. Complete the policy/consent review in docs before public launch.',
  );
