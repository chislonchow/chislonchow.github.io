
import type { Metadata } from 'next';
import React, { Suspense } from 'react';
import MarkdownDisplay from '@/components/shared/markdown-display';
import ContentPageClientLayout from '@/components/shared/content-page-client-layout';
import ContentPageSkeleton from '@/components/shared/content-page-skeleton';
import { getTranslations } from '@/lib/translations';
import { getStaticPageData } from '@/lib/static-page-data';
import type { Language } from '@/contexts/language-context';

export async function generateMetadata(): Promise<Metadata> {
  const translations = getTranslations(new Date().getFullYear());
  const pageData = await getStaticPageData('faq');
  const lang: Language = "en";
  
  const rawSiteName = translations.siteName;
  const siteName = typeof rawSiteName === 'string' ? rawSiteName : ''; 
  
  const rawFaqPageMetaTitle = translations.faqPageMetaTitle;
  const titleFromTranslations = 
    typeof rawFaqPageMetaTitle === 'object' && rawFaqPageMetaTitle !== null && typeof rawFaqPageMetaTitle[lang] === "string" 
      ? rawFaqPageMetaTitle[lang] 
      : (typeof rawFaqPageMetaTitle === 'string' ? rawFaqPageMetaTitle : '');
  const title = titleFromTranslations || pageData.title.en;
  
  const rawFaqPageMetaDescription = translations.faqPageMetaDescription;
  const descriptionTemplate = 
    typeof rawFaqPageMetaDescription === 'object' && rawFaqPageMetaDescription !== null && typeof rawFaqPageMetaDescription[lang] === "string"
      ? rawFaqPageMetaDescription[lang]
      : (typeof rawFaqPageMetaDescription === 'string' ? rawFaqPageMetaDescription : '');
  const description = descriptionTemplate.replace('{siteName}', siteName);
  
  return {
    title: title,
    description: description,
    alternates: {
      canonical: '/faq/',
      languages: {
        'en': '/faq/',
        'zh': '/zh/faq/',
      },
    },
  };
}

export default async function FAQPage() {
  const pageData = await getStaticPageData('faq');
  const translations = getTranslations(new Date().getFullYear());
  const skeletonLoader = <ContentPageSkeleton itemCount={5} />;

  const langEn: Language = "en";
  const rawErrorLoadingTitleEn = translations.markdownErrorLoadingTitle;
  const errorLoadingTitleEn = typeof rawErrorLoadingTitleEn === 'object' && rawErrorLoadingTitleEn !== null && typeof rawErrorLoadingTitleEn[langEn] === "string" ? rawErrorLoadingTitleEn[langEn] : (typeof rawErrorLoadingTitleEn === 'string' ? rawErrorLoadingTitleEn : '');
  
  const rawErrorInvalidContentMessageEn = translations.markdownErrorInvalidContent;
  const errorInvalidContentMessageEn = typeof rawErrorInvalidContentMessageEn === 'object' && rawErrorInvalidContentMessageEn !== null && typeof rawErrorInvalidContentMessageEn[langEn] === "string" ? rawErrorInvalidContentMessageEn[langEn] : (typeof rawErrorInvalidContentMessageEn === 'string' ? rawErrorInvalidContentMessageEn : '');
  
  const rawErrorProcessingFailedMessageEn = translations.markdownErrorProcessingFailed;
  const errorProcessingFailedMessageEn = typeof rawErrorProcessingFailedMessageEn === 'object' && rawErrorProcessingFailedMessageEn !== null && typeof rawErrorProcessingFailedMessageEn[langEn] === "string" ? rawErrorProcessingFailedMessageEn[langEn] : (typeof rawErrorProcessingFailedMessageEn === 'string' ? rawErrorProcessingFailedMessageEn : '');

  const markdownEnNode = (
    <Suspense fallback={skeletonLoader}>
      <MarkdownDisplay
        content={pageData.markdown_content.en}
        errorLoadingTitle={errorLoadingTitleEn}
        errorInvalidContentMessage={errorInvalidContentMessageEn}
        errorProcessingFailedMessage={errorProcessingFailedMessageEn}
      />
    </Suspense>
  );

  const langZh: Language = "zh";
  const rawErrorLoadingTitleZh = translations.markdownErrorLoadingTitle;
  const errorLoadingTitleZh = typeof rawErrorLoadingTitleZh === 'object' && rawErrorLoadingTitleZh !== null && typeof rawErrorLoadingTitleZh[langZh] === "string" ? rawErrorLoadingTitleZh[langZh] : (typeof rawErrorLoadingTitleZh === 'string' ? rawErrorLoadingTitleZh : '');
  
  const rawErrorInvalidContentMessageZh = translations.markdownErrorInvalidContent;
  const errorInvalidContentMessageZh = typeof rawErrorInvalidContentMessageZh === 'object' && rawErrorInvalidContentMessageZh !== null && typeof rawErrorInvalidContentMessageZh[langZh] === "string" ? rawErrorInvalidContentMessageZh[langZh] : (typeof rawErrorInvalidContentMessageZh === 'string' ? rawErrorInvalidContentMessageZh : '');
  
  const rawErrorProcessingFailedMessageZh = translations.markdownErrorProcessingFailed;
  const errorProcessingFailedMessageZh = typeof rawErrorProcessingFailedMessageZh === 'object' && rawErrorProcessingFailedMessageZh !== null && typeof rawErrorProcessingFailedMessageZh[langZh] === "string" ? rawErrorProcessingFailedMessageZh[langZh] : (typeof rawErrorProcessingFailedMessageZh === 'string' ? rawErrorProcessingFailedMessageZh : '');

  const markdownZhNode = (
    <Suspense fallback={skeletonLoader}>
      <MarkdownDisplay
        content={pageData.markdown_content.zh}
        errorLoadingTitle={errorLoadingTitleZh}
        errorInvalidContentMessage={errorInvalidContentMessageZh}
        errorProcessingFailedMessage={errorProcessingFailedMessageZh}
      />
    </Suspense>
  );

  return (
    <>
      <ContentPageClientLayout
        titleKey="faq" 
        defaultTitleEn={pageData.title.en} 
        defaultTitleZh={pageData.title.zh} 
        markdownEn={markdownEnNode}
        markdownZh={markdownZhNode}
      />
    </>
  );
}
