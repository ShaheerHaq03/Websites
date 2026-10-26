export const site = {
  name: 'Student Calculator Hub',
  shortName: 'Student Hub',
  tagline: 'A little clarity. A lot of possibility.',
  url: (import.meta.env.PUBLIC_SITE_URL || 'https://example.com').replace(/\/$/, ''),
  logo: '/favicon.svg',
  primary: '#4F46E5',
  secondary: '#2563EB',
  contactEmail: import.meta.env.PUBLIC_CONTACT_EMAIL || '',
  owner: import.meta.env.PUBLIC_OWNER_NAME || '',
  jurisdiction: import.meta.env.PUBLIC_JURISDICTION || '',
  socialLinks: [] as { label: string; url: string }[],
  analytics: {
    provider: import.meta.env.PUBLIC_ANALYTICS_PROVIDER || '',
    id: import.meta.env.PUBLIC_ANALYTICS_ID || '',
  },
  ads: {
    enabled: import.meta.env.PUBLIC_ENABLE_ADS === 'true',
    publisher: import.meta.env.PUBLIC_ADSENSE_PUBLISHER_ID || '',
    slot: import.meta.env.PUBLIC_ADSENSE_SLOT_ID || '',
  },
};
export const isPlaceholderDomain = new URL(site.url).hostname === 'example.com';
