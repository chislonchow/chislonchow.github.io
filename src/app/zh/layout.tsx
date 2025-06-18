
import type { Metadata } from 'next';
import LanguageInitializerClient from '@/components/shared/language-initializer-client';
import React from 'react';
import { getTranslations } from '@/lib/translations';
import type { Language } from '@/contexts/language-context';

export async function generateMetadata(): Promise<Metadata> {
  const translations = getTranslations(new Date().getFullYear());
  const lang: Language = "zh";
  
  const rawRootLayoutTitleDefault = translations.rootLayoutTitleDefault;
  const titleDefault = 
    typeof rawRootLayoutTitleDefault === 'object' && rawRootLayoutTitleDefault !== null && typeof rawRootLayoutTitleDefault[lang] === "string"
      ? rawRootLayoutTitleDefault[lang]
      : (typeof rawRootLayoutTitleDefault === 'string' ? rawRootLayoutTitleDefault : '');
  
  const rawTitleTemplate = translations.rootLayoutTitleTemplate;
  const titleTemplate = typeof rawTitleTemplate === 'string'
    ? rawTitleTemplate
    : '%s';
  
  const rawRootLayoutMetaDescription = translations.rootLayoutMetaDescription;
  const description = 
    typeof rawRootLayoutMetaDescription === 'object' && rawRootLayoutMetaDescription !== null && typeof rawRootLayoutMetaDescription[lang] === "string"
      ? rawRootLayoutMetaDescription[lang]
      : (typeof rawRootLayoutMetaDescription === 'string' ? rawRootLayoutMetaDescription : '');

  return {
    // metadataBase is inherited from the root layout.
    title: {
      default: titleDefault,
      template: titleTemplate,
    },
    description: description,
    alternates: {
      canonical: '/zh/', 
      languages: {
        'en': '/', 
        'zh': '/zh/',
      },
    },
  };
}

export default function ZhLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <LanguageInitializerClient lang="zh" />
      {children}
    </>
  );
}
