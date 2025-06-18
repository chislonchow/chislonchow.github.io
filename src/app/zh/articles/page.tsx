
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { getTranslations } from "@/lib/translations";

export async function generateMetadata(): Promise<Metadata> {
  const translations = getTranslations(new Date().getFullYear());
  const siteName = (typeof translations.siteName === 'string' ? translations.siteName : '') || "";

  const articlesPageTitleRaw = translations.articlesPageTitle;
  const pageTitle = (typeof articlesPageTitleRaw === 'object' && articlesPageTitleRaw !== null ? articlesPageTitleRaw['zh'] : articlesPageTitleRaw) || ""; 

  const articlesListBasePageDescriptionRaw = translations.articlesListBasePageDescription;
  const descriptionTemplate = (typeof articlesListBasePageDescriptionRaw === 'object' && articlesListBasePageDescriptionRaw !== null ? articlesListBasePageDescriptionRaw['zh'] : articlesListBasePageDescriptionRaw) || ""; 
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
  redirect("/zh/articles/page/1");
  return null;
}
