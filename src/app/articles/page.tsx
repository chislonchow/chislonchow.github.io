
import { redirect } from 'next/navigation';
import type { Metadata } from 'next';
import { getTranslations } from '@/lib/translations';

export async function generateMetadata(): Promise<Metadata> {
  const translations = getTranslations(new Date().getFullYear());
  const siteName = (typeof translations.siteName === 'string' ? translations.siteName : '') || '';
  
  const articlesPageTitleRaw = translations.articlesPageTitle;
  const pageTitle = (typeof articlesPageTitleRaw === 'object' && articlesPageTitleRaw !== null ? articlesPageTitleRaw['en'] : articlesPageTitleRaw) || '';
  
  const articlesListBasePageDescriptionRaw = translations.articlesListBasePageDescription;
  const descriptionTemplate = (typeof articlesListBasePageDescriptionRaw === 'object' && articlesListBasePageDescriptionRaw !== null ? articlesListBasePageDescriptionRaw['en'] : articlesListBasePageDescriptionRaw) || "";
  const description = descriptionTemplate.replace('{siteName}', siteName);

  return {
    title: pageTitle,
    description: description,
    robots: {
      index: false, 
      follow: true,
    },
    alternates: {
      canonical: '/articles/page/1/', 
      languages: {
        'en': '/articles/page/1/',
        'zh': '/zh/articles/page/1/',
      },
    },
  };
}


export default function ArticlesPageRedirect() {
  redirect('/articles/page/1');
  return null;
}
