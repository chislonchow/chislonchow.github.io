
import type { Metadata } from 'next';
import React, { Suspense } from 'react';
import MarkdownDisplay from '@/components/shared/markdown-display';
import ContentPageSkeleton from '@/components/shared/content-page-skeleton';
import { getTranslatedString } from '@/lib/translations';
import { getTranslations } from '@/lib/translations.server';
import { getStaticPageData } from '@/lib/static-page-data';
import type { Language } from '@/contexts/language-context';
import { JsonLd } from '@/lib/seo/schema-utils';
import { generateProfessionalServiceSchema } from '@/lib/seo/professional-service-schema';
import ProfilePageClient from '@/components/profile/profile-page-client';

export async function generateMetadata(): Promise<Metadata> {
  const pageData = await getStaticPageData('profile');
  const lang: Language = "en";
  
  const descriptionTemplate = pageData.metadata_description?.[lang] || "";
  const translations = getTranslations(new Date().getFullYear()); 
  const siteName = getTranslatedString(translations.siteName, lang, '');
  const description = descriptionTemplate.replace('{siteName}', siteName);
  
  return {
    title: pageData.title[lang] || "Profile", // Uses pageData.title now
    description: description,
    alternates: {
      canonical: '/profile/',
      languages: {
        'en': '/profile/',
        'zh': '/zh/profile/',
        'x-default': '/profile/',
      },
    },
  };
}

export default async function ProfilePage() {
  const pageData = await getStaticPageData('profile');
  const translations = getTranslations(new Date().getFullYear());
  const professionalServiceSchema = generateProfessionalServiceSchema('en', translations);
  
  return (
    <>
      <JsonLd schema={professionalServiceSchema} />
      <ProfilePageClient
        pageData={pageData}
      />
    </>
  );
}
