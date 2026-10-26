// Read only the public launch settings; never print environment values.
const missing = [
  'PUBLIC_SITE_URL',
  'PUBLIC_CONTACT_EMAIL',
  'PUBLIC_OWNER_NAME',
  'PUBLIC_JURISDICTION',
].filter((key) => !process.env[key]?.trim());
try {
  const url = new URL(process.env.PUBLIC_SITE_URL || 'https://example.com');
  if (url.protocol !== 'https:' || ['example.com', 'localhost', '127.0.0.1'].includes(url.hostname))
    missing.push('a real HTTPS production domain');
} catch {
  missing.push('valid PUBLIC_SITE_URL');
}
if (process.env.PUBLIC_ENABLE_ADS === 'true')
  missing.push('documented CMP, approval, privacy, and CSP review before enabling advertising');
if (missing.length) {
  console.error(`Launch configuration incomplete: ${missing.join(', ')}.`);
  process.exitCode = 1;
} else
  console.log(
    'Required owner configuration supplied. Review legal content and hosting configuration before launch.',
  );
