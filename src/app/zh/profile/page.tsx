
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
import { generateProfessionalServiceSchema } from '@/lib/seo/professional-service-schema';

export async function generateMetadata(): Promise<Metadata> {
  const pageData = await getStaticPageData('profile');
  const lang: Language = "zh";
  
  const descriptionTemplate = pageData.metadata_description?.[lang] || "";
  const translations = getTranslations(new Date().getFullYear());
  const siteName = getTranslatedString(translations.siteName, lang, '');
  const description = descriptionTemplate.replace('{siteName}', siteName);

  return {
    title: pageData.title[lang] || "關於我", // Uses pageData.title now
    description: description,
    alternates: {
      canonical: '/zh/profile/',
      languages: {
        'en': '/profile/',
        'zh': '/zh/profile/',
        'x-default': '/profile/',
      },
    },
  };
}

export default async function ProfilePageZh() {
  const pageData = await getStaticPageData('profile');
  const translations = getTranslations(new Date().getFullYear());
  const professionalServiceSchema = generateProfessionalServiceSchema('zh', translations);
  const skeletonLoader = <ContentPageSkeleton itemCount={3} />;

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
      <JsonLd schema={professionalServiceSchema} />
      <ContentPageClientLayout
        pageData={pageData}
        markdownEn={markdownEnNode}
        markdownZh={markdownZhNode}
      />
    </>
  );
}
