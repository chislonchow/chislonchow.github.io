
import type { Metadata } from "next";
import HomePageClientContents from "@/app/home/home-page-client-contents";
import { getTranslations } from "@/lib/translations";
import { getArticles } from "@/lib/articles-data";
import type { Language } from "@/contexts/language-context";
import { getNotificationData } from '@/lib/notification-data';
import HomePageNotifier from '@/components/home/home-page-notifier';
import React from 'react';

export async function generateMetadata(): Promise<Metadata> {
  const currentYear = new Date().getFullYear();
  const translations = getTranslations(currentYear);
  const lang: Language = "zh";

  const rawHomePageTitle = translations.homePageTitle;
  const title =
    typeof rawHomePageTitle === "object" && rawHomePageTitle !== null && typeof rawHomePageTitle[lang] === "string"
      ? rawHomePageTitle[lang]
      : (typeof rawHomePageTitle === "string" ? rawHomePageTitle : '');

  const rawHomePageMetaDescription = translations.homePageMetaDescription;
  const description =
    typeof rawHomePageMetaDescription === "object" && rawHomePageMetaDescription !== null && typeof rawHomePageMetaDescription[lang] === "string"
      ? rawHomePageMetaDescription[lang]
      : (typeof rawHomePageMetaDescription === "string" ? rawHomePageMetaDescription : '');

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
      },
    },
  };
}

export default async function Page() {
  const allArticles = getArticles();
  const pinnedArticles = allArticles.filter((article) => article.pinned);
  const notificationConfig = await getNotificationData();

  return (
    <>
      <HomePageClientContents pinnedArticles={pinnedArticles} />
      <HomePageNotifier notificationConfig={notificationConfig} />
    </>
  );
}
