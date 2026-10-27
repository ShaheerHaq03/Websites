// JSON-LD builders. Every page emits one @graph whose nodes reference each other by @id.
import { site, canonical } from '../../config/site';
import type { PageType } from '../../data/pages';
export type Node = Record<string, unknown>;
export type Crumb = { name: string; path: string };
const origin = () => canonical('/').replace(/\/$/, '');
export const ids = {
  organization: () => `${origin()}/#organization`,
  website: () => `${origin()}/#website`,
  webpage: (path: string) => `${canonical(path)}#webpage`,
  breadcrumb: (path: string) => `${canonical(path)}#breadcrumb`,
};
export const ref = (id: string) => ({ '@id': id });
export const organization = (): Node => ({
  '@type': 'Organization',
  '@id': ids.organization(),
  name: site.name,
  url: canonical('/'),
  logo: {
    '@type': 'ImageObject',
    url: canonical(site.logo),
    width: 48,
    height: 48,
  },
  description: site.description,
});
export const website = (): Node => ({
  '@type': 'WebSite',
  '@id': ids.website(),
  name: site.name,
  url: canonical('/'),
  description: site.description,
  inLanguage: 'en',
  publisher: ref(ids.organization()),
});
export const breadcrumbList = (path: string, crumbs: Crumb[]): Node => ({
  '@type': 'BreadcrumbList',
  '@id': ids.breadcrumb(path),
  itemListElement: crumbs.map((crumb, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: crumb.name,
    item: canonical(crumb.path),
  })),
});
export const webPage = ({
  path,
  type,
  name,
  description,
  hasBreadcrumb,
  extra = {},
}: {
  path: string;
  type: PageType;
  name: string;
  description: string;
  hasBreadcrumb: boolean;
  extra?: Node;
}): Node => ({
  '@type': type,
  '@id': ids.webpage(path),
  url: canonical(path),
  name,
  description,
  isPartOf: ref(ids.website()),
  inLanguage: 'en',
  dateModified: site.updated,
  primaryImageOfPage: {
    '@type': 'ImageObject',
    url: canonical(site.socialImage.path),
    width: site.socialImage.width,
    height: site.socialImage.height,
  },
  ...(hasBreadcrumb ? { breadcrumb: ref(ids.breadcrumb(path)) } : {}),
  ...extra,
});
export const itemList = (
  path: string,
  name: string,
  items: { name: string; path: string; description: string }[],
): Node => ({
  '@type': 'ItemList',
  '@id': `${canonical(path)}#itemlist`,
  name,
  numberOfItems: items.length,
  itemListElement: items.map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: item.name,
    url: canonical(item.path),
    description: item.description,
  })),
});
export const serialize = (nodes: Node[]) =>
  JSON.stringify({ '@context': 'https://schema.org', '@graph': nodes }).replace(
    /</g,
    '\\u003c',
  );
