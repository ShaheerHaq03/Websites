import { site } from '../../config/site';
import { calculators } from '../../data/calculators';

/** ItemList of every calculator, in the same order as the visible directory. */
export function calculatorItemList(id: string) {
  return {
    '@type': 'ItemList',
    '@id': id,
    name: 'Student calculators',
    numberOfItems: calculators.length,
    itemListElement: calculators.map((c, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: c.title,
      url: `${site.url}/calculators/${c.slug}`,
    })),
  };
}
