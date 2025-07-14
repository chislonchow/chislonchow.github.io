
import type { Metadata } from 'next';
import React, { Suspense } from 'react';
import { getTranslatedString } from '@/lib/translations';
import { getTranslations } from '@/lib/translations.server';
import { getStaticPageData } from '@/lib/static-page-data'; 
import type { Language } from '@/contexts/language-context';
import { JsonLd } from '@/lib/seo/schema-utils';
import { generateProfessionalServiceSchema } from '@/lib/seo/professional-service-schema';
import ProfilePageClient from '@/components/profile/profile-page-client';

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

  return (
    <>
      <JsonLd schema={professionalServiceSchema} />
      <ProfilePageClient
        pageData={pageData}
      />
    </>
  );
}
