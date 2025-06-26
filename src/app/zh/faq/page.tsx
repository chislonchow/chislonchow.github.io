
import type { Metadata } from 'next';
import React, { Suspense } from 'react';
import MarkdownDisplay from '@/components/shared/markdown-display';
import ContentPageClientLayout from '@/components/shared/content-page-client-layout';
import ContentPageSkeleton from '@/components/shared/content-page-skeleton';
import { getTranslatedString } from '@/lib/translations';
import { getTranslations } from '@/lib/translations.server';
import { getStaticPageData } from '@/lib/static-page-data'; 
import type { Language } from '@/contexts/language-context';
import { JsonLd } from '@/lib/seo/schema-utils';
import { generateFaqSchema } from '@/lib/seo/faq-schema';

export async function generateMetadata(): Promise<Metadata> {
  const pageData = await getStaticPageData('faq');
  const lang: Language = "zh";

  const descriptionTemplate = pageData.metadata_description?.[lang] || "";
  const translations = getTranslations(new Date().getFullYear()); 
  const siteName = getTranslatedString(translations.siteName, lang, '');
  const description = descriptionTemplate.replace('{siteName}', siteName); 
  
  return {
    title: pageData.title[lang] || "常問問題", // Uses pageData.title now
    description: description,
    alternates: {
      canonical: '/zh/faq/',
      languages: {
        'en': '/faq/',
        'zh': '/zh/faq/',
        'x-default': '/faq/',
      },
    },
  };
}

export default async function FAQPageZh() {
  const pageData = await getStaticPageData('faq');
  const translations = getTranslations(new Date().getFullYear());
  const faqSchema = await generateFaqSchema(pageData, 'zh');
  const skeletonLoader = <ContentPageSkeleton itemCount={5} />;

  const langEn: Language = "en";
  const errorLoadingTitleEn = getTranslatedString(translations.markdownErrorLoadingTitle, langEn);
  const errorInvalidContentMessageEn = getTranslatedString(translations.markdownErrorInvalidContent, langEn);
  const errorProcessingFailedMessageEn = getTranslatedString(translations.markdownErrorProcessingFailed, langEn);

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
  const errorLoadingTitleZh = getTranslatedString(translations.markdownErrorLoadingTitle, langZh);
  const errorInvalidContentMessageZh = getTranslatedString(translations.markdownErrorInvalidContent, langZh);
  const errorProcessingFailedMessageZh = getTranslatedString(translations.markdownErrorProcessingFailed, langZh);

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
      {faqSchema && <JsonLd schema={faqSchema} />}
      <ContentPageClientLayout
        pageData={pageData}
        markdownEn={markdownEnNode}
        markdownZh={markdownZhNode}
      />
    </>
  );
}
