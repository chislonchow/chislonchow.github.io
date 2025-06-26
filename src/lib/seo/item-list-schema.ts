
import type { ArticleListItem } from '@/lib/articles-data';
import type { Language } from '@/contexts/language-context';
import type { ItemList, ListItem, WithContext } from 'schema-dts';
import { getLocalizedPath } from '@/lib/path-utils';
import { ARTICLES_PER_PAGE } from '@/lib/site-config';

/**
 * @fileoverview Generates ItemList schema markup for paginated article lists.
 */

const BASE_URL = 'https://chislonchow.com';

export function generateItemListSchema(
  articlesOnPage: ArticleListItem[],
  lang: Language,
  currentPage: number,
  basePath: string // e.g., '/articles/page' or '/zh/articles/page'
): WithContext<ItemList> {
  const itemListElement: ListItem[] = articlesOnPage.map((article, index) => {
    const position = (currentPage - 1) * ARTICLES_PER_PAGE + index + 1;
    const articleUrl = `${BASE_URL}${getLocalizedPath(`/article/${article.slug}`, lang)}`;

    return {
      '@type': 'ListItem',
      position: position,
      item: {
        '@type': 'Article',
        url: articleUrl,
        name: article.title[lang],
      },
    };
  });

  const schema: ItemList = {
    '@type': 'ItemList',
    itemListElement: itemListElement,
  };

  return {
    '@context': 'https://schema.org',
    ...schema,
  };
}
