// Metadata for the non-tool pages. The .astro pages, llms.txt, and structured data all read from here.
export type PageType =
  'WebPage' | 'CollectionPage' | 'AboutPage' | 'ContactPage';
export type SitePage = {
  path: string;
  /** Short link label used in llms.txt and breadcrumbs. */
  name: string;
  /** <title> text, before the " | Data Formatter Pro" suffix. */
  seoTitle: string;
  /** Meta description: 120–160 characters. */
  metaDescription: string;
  /** Visible H1 for document pages. */
  heading?: string;
  /** Visible introduction under the H1 for document pages. */
  intro?: string;
  eyebrow?: string;
  pageType: PageType;
  /** llms.txt section; legal pages are listed under "Optional". */
  section: 'site' | 'optional';
};
export const pages = {
  home: {
    path: '/',
    name: 'Home',
    seoTitle: 'Free Developer Tools: JSON, CSV, JWT',
    metaDescription:
      'Free developer tools for JSON, CSV, tokens, encoding, and everyday debugging. Process your data locally in your browser, with no signup and no uploads.',
    pageType: 'WebPage',
    section: 'site',
  },
  tools: {
    path: '/tools',
    name: 'All tools',
    seoTitle: 'All 12 Free Developer Tools',
    metaDescription:
      'Find the right browser-based tool for JSON, CSV, encoding, UUIDs, regex, timestamps, cron, and HTTP. Free and no account required.',
    pageType: 'CollectionPage',
    section: 'site',
  },
  about: {
    path: '/about',
    name: 'About',
    seoTitle: 'About: Free, Local Developer Tools',
    metaDescription:
      'Data Formatter Pro is a free set of local-first developer tools for JSON, CSV, JWT, Base64, regex, time, and HTTP. Learn how and why the tools are built.',
    heading: 'Less busywork. More building.',
    intro:
      'Focused, free utilities for the little tasks that show up in every developer’s day.',
    eyebrow: 'ABOUT DATA FORMATTER PRO',
    pageType: 'AboutPage',
    section: 'site',
  },
  contact: {
    path: '/contact',
    name: 'Contact',
    seoTitle: 'Contact & Feedback',
    metaDescription:
      'Contact Data Formatter Pro to report a bug, suggest a new developer tool, or share feedback, and learn which details make a problem quick to reproduce.',
    heading: 'Let’s make the tools better.',
    intro:
      'Report a bug, suggest a utility, or share feedback. A small, reproducible example helps.',
    eyebrow: 'CONTACT',
    pageType: 'ContactPage',
    section: 'site',
  },
  privacy: {
    path: '/privacy-policy',
    name: 'Privacy Policy',
    seoTitle: 'Privacy Policy',
    metaDescription:
      'Read how Data Formatter Pro keeps tool input in your browser, what ordinary website requests include, how preferences are stored, and the choices you have.',
    heading: 'Privacy Policy',
    intro:
      'How local processing, website requests, and optional services affect your data.',
    eyebrow: 'LAST UPDATED OCTOBER 27, 2026',
    pageType: 'WebPage',
    section: 'optional',
  },
  terms: {
    path: '/terms',
    name: 'Terms of Use',
    seoTitle: 'Terms of Use',
    metaDescription:
      'Terms of use for the free Data Formatter Pro developer tools: acceptable use, your data and output, accuracy and availability, and technical limitations.',
    heading: 'Terms of Use',
    intro: 'Practical terms for using these free browser-based utilities.',
    eyebrow: 'LAST UPDATED OCTOBER 27, 2026',
    pageType: 'WebPage',
    section: 'optional',
  },
  disclaimer: {
    path: '/disclaimer',
    name: 'Disclaimer',
    seoTitle: 'Disclaimer',
    metaDescription:
      'Understand what the Data Formatter Pro developer tools can and cannot establish: decoding is not verification, and local processing is not perfect security.',
    heading: 'Disclaimer',
    intro:
      'Understand what these development utilities can and cannot establish.',
    eyebrow: 'LAST UPDATED OCTOBER 27, 2026',
    pageType: 'WebPage',
    section: 'optional',
  },
} satisfies Record<string, SitePage>;
