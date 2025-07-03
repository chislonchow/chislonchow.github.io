import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getArticleListItems } from "@/lib/articles-data";
import ArticleListClient from "@/components/articles/article-list-client";
import { getTranslatedString } from "@/lib/translations";
import { getTranslations } from "@/lib/translations.server";
import { ARTICLES_PER_PAGE } from "@/lib/site-config";
import type { Language } from "@/contexts/language-context";
import { JsonLd } from "@/lib/seo/schema-utils";
import { generateItemListSchema } from "@/lib/seo/item-list-schema";

type Props = {
  params: Promise<{ pageNumber: string }>;
};

export const dynamicParams = false;

export async function generateStaticParams() {
  const articles = getArticleListItems();
  if (!articles || articles.length === 0) {
    return [{ pageNumber: "1" }];
  }
  const totalPages = Math.ceil(articles.length / ARTICLES_PER_PAGE);
  return Array.from({ length: totalPages }, (_, i) => ({
    pageNumber: (i + 1).toString(),
  }));
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const param = await props.params;
  const lang: Language = "zh";
  const translations = getTranslations(new Date().getFullYear());
  const pageNumber = parseInt(param.pageNumber, 10);

  const siteName = getTranslatedString(translations.siteName, lang, "");

  const articles = getArticleListItems();
  const totalItems = articles.length;
  const totalPages =
    totalItems === 0 ? 1 : Math.ceil(totalItems / ARTICLES_PER_PAGE);

  if (isNaN(pageNumber) || pageNumber < 1 || pageNumber > totalPages) {
    const notFoundTitleText = getTranslatedString(
      translations.articlesListPageNotFoundMetaTitle,
      lang
    );
    const notFoundTitle = (notFoundTitleText || "{siteName}").replace(
      "{siteName}",
      siteName
    );
    return {
      title: { absolute: notFoundTitle },
      robots: { index: false, follow: false },
    };
  }

  const pageTitleTemplate = getTranslatedString(
    translations.articlesListMetaPageTitle,
    lang
  );
  const pageTitle = pageTitleTemplate
    .replace("{pageNumber}", pageNumber.toString())
    .replace("{siteName}", siteName);

  const metaDescriptionTemplate = getTranslatedString(
    translations.articlesListMetaDescription,
    lang
  );
  const metaDescriptionText = metaDescriptionTemplate
    .replace("{siteName}", siteName)
    .replace("{pageNumber}", pageNumber.toString());

  const canonicalUrl = `/zh/articles/page/${pageNumber}/`;
  const enCanonicalUrl = `/articles/page/${pageNumber}/`;

  const alternates: Metadata["alternates"] = {
    canonical: canonicalUrl,
    languages: {
      en: enCanonicalUrl,
      zh: canonicalUrl,
      "x-default": enCanonicalUrl,
    },
  };

  const robotsSettings: Metadata["robots"] = {
    index: true,
    follow: true,
  };

  return {
    title: { absolute: pageTitle },
    description: metaDescriptionText,
    alternates: alternates,
    robots: robotsSettings,
  };
}

export default async function PaginatedArticlesPageZh({ params }: Props) {
  const param = await params;
  const lang: Language = "zh";
  const articlesData = getArticleListItems();
  const generalTranslations = getTranslations(new Date().getFullYear());

  const pageNumber = parseInt(param.pageNumber, 10);
  const totalItems = articlesData.length;
  const totalPages =
    totalItems === 0 ? 1 : Math.ceil(totalItems / ARTICLES_PER_PAGE);

  if (isNaN(pageNumber) || pageNumber < 1 || pageNumber > totalPages) {
    notFound();
  }

  const startIndex = (pageNumber - 1) * ARTICLES_PER_PAGE;
  const articlesOnPage = articlesData.slice(
    startIndex,
    startIndex + ARTICLES_PER_PAGE
  );
  const itemListSchema = generateItemListSchema(
    articlesOnPage,
    lang,
    pageNumber,
    "/zh/articles/page"
  );

  const articlesPageTitleText = getTranslatedString(
    generalTranslations.articlesPageTitle,
    lang
  );
  const articlesPageGenericTitleText = getTranslatedString(
    generalTranslations.articlesPageGenericTitle,
    lang
  );

  const pageTitleText = articlesPageTitleText || articlesPageGenericTitleText;

  const siteName = getTranslatedString(generalTranslations.siteName, lang, "");

  const onPageDescriptionTemplate = getTranslatedString(
    generalTranslations.articlesListPageBodyDescription,
    lang
  );
  const onPageDescriptionText = onPageDescriptionTemplate.replace(
    "{siteName}",
    siteName
  );

  return (
    <>
      <JsonLd schema={itemListSchema} />
      <div className="container mx-auto py-6 px-2 sm:px-6 lg:px-8">
        <h1 className="text-2xl md:text-3xl font-bold font-headline text-center mb-6 section-title">
          {pageTitleText}
        </h1>
        <p className="text-sm font-headline text-muted-foreground mb-6 max-w-2xl mx-auto text-center">
          {onPageDescriptionText}
        </p>
        <ArticleListClient
          articles={articlesData}
          currentPageFromUrl={pageNumber}
          basePath="/zh/articles/page"
          articlesPerPage={ARTICLES_PER_PAGE}
        />
      </div>
    </>
  );
}
