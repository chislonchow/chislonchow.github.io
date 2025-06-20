
import type { Metadata } from 'next';
import './globals.css';
import { Noto_Sans_TC, Noto_Serif_TC } from 'next/font/google';
import { LanguageProvider } from '@/contexts/language-context';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';

import React, { Suspense } from 'react';
import HtmlLangUpdater from '@/components/shared/html-lang-updater';
import BodyLangClassUpdater from '@/components/shared/body-lang-class-updater';
import { getTranslatedString } from '@/lib/translations';
import { getTranslations } from '@/lib/translations.server';
import { LayoutVisibilityProvider } from '@/contexts/layout-visibility-context';
import type { Language } from '@/contexts/language-context';

const noto_sans_tc = Noto_Sans_TC({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-noto-sans-tc',
  display: 'swap',
});

const noto_serif_tc = Noto_Serif_TC({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-noto-serif-tc',
  display: 'swap',
});

const ContactPopover = React.lazy(() => import('@/components/shared/contact-popover'));

export async function generateMetadata(): Promise<Metadata> {
  const translations = getTranslations(new Date().getFullYear());
  const lang: Language = "en";
  
  const titleDefault = getTranslatedString(translations.rootLayoutTitleDefault, lang);
  const titleTemplate = getTranslatedString(translations.rootLayoutTitleTemplate, lang, '%s');
  const description = getTranslatedString(translations.rootLayoutMetaDescription, lang);

  return {
    metadataBase: new URL('https://chislonchow.com'),
    title: {
      default: titleDefault,
      template: titleTemplate,
    },
    description: description,
    alternates: {
      canonical: '/',
      languages: {
        'en': '/',
        'zh': '/zh/',
      },
    },
    icons: {}, 
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const initialTranslations = getTranslations(new Date().getFullYear());

  return (
    <html lang="en" className={`${noto_sans_tc.variable} ${noto_serif_tc.variable}`}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body className="font-body antialiased flex flex-col min-h-screen">
        <LanguageProvider defaultLanguage="en" initialTranslations={initialTranslations}>
          <LayoutVisibilityProvider>
            <HtmlLangUpdater />
            <BodyLangClassUpdater />
            <Header />
            <main className="flex-grow">{children}</main>
            <Footer />
            <Suspense fallback={null}>
              <ContactPopover />
            </Suspense>
          </LayoutVisibilityProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
