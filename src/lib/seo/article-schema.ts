import type { Article as ArticleData } from '@/lib/articles-data';
import type { Language } from '@/contexts/language-context';
import type { Article as SchemaArticle, Person, Organization, WithContext, QuantitativeValue } from 'schema-dts';

/**
 * @fileoverview Generates Article schema markup for an article page.
 */

const BASE_URL = 'https://chislonchow.com';
const SITE_NAME = 'Chislon Chow';

export function generateArticleSchema(articleData: ArticleData, lang: Language): WithContext<SchemaArticle> {
  const author: Person = {
    '@type': 'Person',
    name: SITE_NAME,
    url: `${BASE_URL}/profile/`,
  };
  
  const publisher: Organization = {
    '@type': 'Organization',
    name: SITE_NAME,
  };

  const schema: SchemaArticle = {
    '@type': 'Article',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${BASE_URL}/${lang === 'zh' ? 'zh/' : ''}article/${articleData.slug}/`,
    },
    headline: articleData.title[lang],
    description: articleData.description[lang],
    image: articleData.imageUrl ? [`${BASE_URL}${articleData.imageUrl}`] : undefined,
    author: author,
    publisher: publisher,
    datePublished: articleData.date_updated,
    dateModified: articleData.date_updated,
  };

  return {
    '@context': 'https://schema.org',
    ...schema
  };
}
