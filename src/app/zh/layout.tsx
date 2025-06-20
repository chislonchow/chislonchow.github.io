
import type { Metadata } from 'next';
import LanguageInitializerClient from '@/components/shared/language-initializer-client';
import React from 'react';
import { getTranslatedString } from '@/lib/translations';
import { getTranslations } from '@/lib/translations.server';
import type { Language } from '@/contexts/language-context';

export async function generateMetadata(): Promise<Metadata> {
  const translations = getTranslations(new Date().getFullYear());
  const lang: Language = "zh";
  
  const titleDefault = getTranslatedString(translations.rootLayoutTitleDefault, lang);
  const titleTemplate = getTranslatedString(translations.rootLayoutTitleTemplate, lang, '%s');
  const description = getTranslatedString(translations.rootLayoutMetaDescription, lang);

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
