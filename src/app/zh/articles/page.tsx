
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { getTranslatedString } from "@/lib/translations";
import { getTranslations } from "@/lib/translations.server";

export async function generateMetadata(): Promise<Metadata> {
  const translations = getTranslations(new Date().getFullYear());
  const siteName = getTranslatedString(translations.siteName, 'zh', '');

  const pageTitle = getTranslatedString(translations.articlesPageTitle, 'zh', ''); 

  const descriptionTemplate = getTranslatedString(translations.articlesListBasePageDescription, 'zh', '');
  const description = descriptionTemplate.replace("{siteName}", siteName);

  return {
    title: pageTitle,
    description: description,
    robots: {
      index: false,
      follow: true,
    },
    alternates: {
      canonical: "/zh/articles/page/1/",
      languages: {
        en: "/articles/page/1/",
        zh: "/zh/articles/page/1/",
      },
    },
  };
}

export default function ArticlesPageZhRedirect() {
  redirect("/zh/articles/page/1/");
  return null;
}
