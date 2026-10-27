import { site, canonical } from '../../config/site';

/** Schema.org node used inside a page-level `@graph`. */
export type SchemaNode = Record<string, unknown> & { '@type': string };
export type PageType =
  'WebPage' | 'CollectionPage' | 'AboutPage' | 'ContactPage';
export type Crumb = { name: string; path: string };

export const ids = {
  organization: () => `${site.url}/#organization`,
  website: () => `${site.url}/#website`,
  webpage: (path: string) => `${canonical(path)}#webpage`,
  breadcrumb: (path: string) => `${canonical(path)}#breadcrumb`,
};
export const ref = (id: string) => ({ '@id': id });

export const organization = (): SchemaNode => ({
  '@type': 'Organization',
  '@id': ids.organization(),
  name: site.name,
  url: canonical('/'),
  description: site.description,
  logo: {
    '@type': 'ImageObject',
    url: canonical(site.logo.path),
    width: site.logo.width,
    height: site.logo.height,
  },
});

export const website = (): SchemaNode => ({
  '@type': 'WebSite',
  '@id': ids.website(),
  name: site.name,
  url: canonical('/'),
  description: site.description,
  inLanguage: 'en',
  publisher: ref(ids.organization()),
});

export const webPage = (opts: {
  path: string;
  type: PageType;
  name: string;
  description: string;
  hasBreadcrumb: boolean;
}): SchemaNode => ({
  '@type': opts.type,
  '@id': ids.webpage(opts.path),
  url: canonical(opts.path),
  name: opts.name,
  description: opts.description,
  isPartOf: ref(ids.website()),
  inLanguage: 'en',
  dateModified: site.updated,
  primaryImageOfPage: {
    '@type': 'ImageObject',
    url: canonical(site.socialImage.path),
    width: site.socialImage.width,
    height: site.socialImage.height,
  },
  ...(opts.hasBreadcrumb ? { breadcrumb: ref(ids.breadcrumb(opts.path)) } : {}),
});

export const breadcrumbList = (path: string, crumbs: Crumb[]): SchemaNode => ({
  '@type': 'BreadcrumbList',
  '@id': ids.breadcrumb(path),
  itemListElement: crumbs.map((crumb, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: crumb.name,
    item: canonical(crumb.path),
  })),
});

export const itemList = (
  path: string,
  name: string,
  items: { name: string; path: string }[],
): SchemaNode => ({
  '@type': 'ItemList',
  '@id': `${canonical(path)}#itemlist`,
  name,
  numberOfItems: items.length,
  itemListElement: items.map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: item.name,
    url: canonical(item.path),
  })),
});

export const faqPage = (
  path: string,
  faq: readonly (readonly [string, string])[],
): SchemaNode => ({
  '@type': 'FAQPage',
  '@id': `${canonical(path)}#faq`,
  isPartOf: ref(ids.webpage(path)),
  inLanguage: 'en',
  mainEntity: faq.map(([question, answer]) => ({
    '@type': 'Question',
    name: question,
    acceptedAnswer: { '@type': 'Answer', text: answer },
  })),
});

/** Serialize a graph for a `<script type="application/ld+json">` block. */
export const serializeGraph = (nodes: SchemaNode[]) =>
  JSON.stringify({ '@context': 'https://schema.org', '@graph': nodes }).replace(
    /</g,
    '\\u003c',
  );
