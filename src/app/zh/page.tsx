
import type { Metadata } from "next";
import HomePageClientContents from "@/app/home/home-page-client-contents";
import { getTranslatedString } from "@/lib/translations";
import { getTranslations } from "@/lib/translations.server";
import { getArticleListItems } from "@/lib/articles-data";
import type { Language } from "@/contexts/language-context";
import { getNotificationData } from '@/lib/notification-data';
import HomePageNotifier from '@/components/home/home-page-notifier';
import React from 'react';
import { JsonLd } from '@/lib/seo/schema-utils';
import { generateProfessionalServiceSchema } from '@/lib/seo/professional-service-schema';

export async function generateMetadata(): Promise<Metadata> {
  const currentYear = new Date().getFullYear();
  const translations = getTranslations(currentYear);
  const lang: Language = "zh";

  const title = getTranslatedString(translations.homePageTitle, lang);
  const description = getTranslatedString(translations.homePageMetaDescription, lang);

  return {
    title: {
      absolute: title,
    },
    description: description,
    alternates: {
      canonical: "/zh/",
      languages: {
        en: "/",
        zh: "/zh/",
        'x-default': '/',
      },
    },
  };
}

export default async function Page() {
  const allArticles = getArticleListItems();
  const notificationConfig = await getNotificationData();
  const translations = getTranslations(new Date().getFullYear());
  const professionalServiceSchema = generateProfessionalServiceSchema('zh', translations);

  return (
    <>
      <JsonLd schema={professionalServiceSchema} />
      <HomePageClientContents allArticles={allArticles} />
      <HomePageNotifier notificationConfig={notificationConfig} />
    </>
  );
}
