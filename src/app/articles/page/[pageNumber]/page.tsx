
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getArticles } from "@/lib/articles-data";
import ArticleListClient from "@/components/articles/article-list-client";
import { getTranslations } from "@/lib/translations";
import { ARTICLES_PER_PAGE } from "@/lib/site-config";
import type { Language } from "@/contexts/language-context";

type Props = {
  params: Promise<{ pageNumber: string }>;
};

export const dynamicParams = false;

export async function generateStaticParams() {
  const articles = getArticles();
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
  const lang: Language = "en";
  const translations = getTranslations(new Date().getFullYear());
  const pageNumber = parseInt(param.pageNumber, 10);
  
  const rawSiteName = translations.siteName;
  const siteName = typeof rawSiteName === 'string' ? rawSiteName : '';

  const articles = getArticles();
  const totalItems = articles.length;
  const totalPages =
    totalItems === 0 ? 1 : Math.ceil(totalItems / ARTICLES_PER_PAGE);

  if (isNaN(pageNumber) || pageNumber < 1 || pageNumber > totalPages) {
    const rawArticlesListPageNotFoundMetaTitle = translations.articlesListPageNotFoundMetaTitle;
    const notFoundTitleText =
      typeof rawArticlesListPageNotFoundMetaTitle === "object" && rawArticlesListPageNotFoundMetaTitle !== null && typeof rawArticlesListPageNotFoundMetaTitle[lang] === "string"
        ? rawArticlesListPageNotFoundMetaTitle[lang]
        : (typeof rawArticlesListPageNotFoundMetaTitle === "string" ? rawArticlesListPageNotFoundMetaTitle : '');
    const notFoundTitle = (
      notFoundTitleText || "{siteName}" 
    ).replace("{siteName}", siteName);
    return {
      title: { absolute: notFoundTitle },
      robots: { index: false, follow: false }, 
    };
  }

  const rawArticlesListMetaPageTitle = translations.articlesListMetaPageTitle;
  const pageTitleTemplate =
    typeof rawArticlesListMetaPageTitle === "object" && rawArticlesListMetaPageTitle !== null && typeof rawArticlesListMetaPageTitle[lang] === "string"
      ? rawArticlesListMetaPageTitle[lang]
      : (typeof rawArticlesListMetaPageTitle === "string" ? rawArticlesListMetaPageTitle : '');
  const pageTitle = pageTitleTemplate
    .replace("{pageNumber}", pageNumber.toString())
    .replace("{siteName}", siteName);

  const rawArticlesListMetaDescription = translations.articlesListMetaDescription;
  const metaDescriptionTemplate =
    typeof rawArticlesListMetaDescription === "object" && rawArticlesListMetaDescription !== null && typeof rawArticlesListMetaDescription[lang] === "string"
      ? rawArticlesListMetaDescription[lang]
      : (typeof rawArticlesListMetaDescription === "string" ? rawArticlesListMetaDescription : '');
  const metaDescriptionText = metaDescriptionTemplate
    .replace("{siteName}", siteName)
    .replace("{pageNumber}", pageNumber.toString());

  const canonicalUrl = `/articles/page/${pageNumber}/`;

  const alternates: Metadata["alternates"] = {
    canonical: canonicalUrl,
    languages: {
      en: canonicalUrl,
      zh: `/zh/articles/page/${pageNumber}/`,
    },
  };

  const robotsSettings: Metadata['robots'] = {
    index: pageNumber === 1,
    follow: true,
    noarchive: pageNumber !== 1,
    nosnippet: pageNumber !== 1,
  };

  return {
    title: { absolute: pageTitle },
    description: metaDescriptionText,
    alternates: alternates,
    robots: robotsSettings,
  };
}

export default async function PaginatedArticlesPage({ params }: Props) {
  const param = await params;
  const lang: Language = "en";
  const articlesData = getArticles();
  const generalTranslations = getTranslations(new Date().getFullYear());

  const pageNumber = parseInt(param.pageNumber, 10);
  const totalItems = articlesData.length;
  const totalPages =
    totalItems === 0 ? 1 : Math.ceil(totalItems / ARTICLES_PER_PAGE);

  if (isNaN(pageNumber) || pageNumber < 1 || pageNumber > totalPages) {
    notFound();
  }

  const rawArticlesPageTitle = generalTranslations.articlesPageTitle;
  const articlesPageTitleText =
    typeof rawArticlesPageTitle === "object" && rawArticlesPageTitle !== null && typeof rawArticlesPageTitle[lang] === "string"
      ? rawArticlesPageTitle[lang]
      : (typeof rawArticlesPageTitle === "string" ? rawArticlesPageTitle : '');

  const rawArticlesPageGenericTitle = generalTranslations.articlesPageGenericTitle;
  const articlesPageGenericTitleText = 
    typeof rawArticlesPageGenericTitle === "object" && rawArticlesPageGenericTitle !== null && typeof rawArticlesPageGenericTitle[lang] === "string"
      ? rawArticlesPageGenericTitle[lang]
      : (typeof rawArticlesPageGenericTitle === "string" ? rawArticlesPageGenericTitle : '');
  
  const pageTitleText = articlesPageTitleText || articlesPageGenericTitleText;


  const rawPaginationPageInfo = generalTranslations.paginationPageInfo;
  const paginationInfoText =
    typeof rawPaginationPageInfo === "object" && rawPaginationPageInfo !== null && typeof rawPaginationPageInfo[lang] === "string"
      ? rawPaginationPageInfo[lang]
      : (typeof rawPaginationPageInfo === "string" ? rawPaginationPageInfo : '');

  const rawSiteName = generalTranslations.siteName;
  const siteName = typeof rawSiteName === 'string' ? rawSiteName : '';
  
  const rawArticlesListPageBodyDescription = generalTranslations.articlesListPageBodyDescription;
  const onPageDescriptionTemplate =
    typeof rawArticlesListPageBodyDescription === "object" && rawArticlesListPageBodyDescription !== null && typeof rawArticlesListPageBodyDescription[lang] === "string"
      ? rawArticlesListPageBodyDescription[lang]
      : (typeof rawArticlesListPageBodyDescription === "string" ? rawArticlesListPageBodyDescription : '');
  const onPageDescriptionText = onPageDescriptionTemplate.replace(
    "{siteName}",
    siteName
  );

  return (
    <div className="container mx-auto py-6 px-2 sm:px-6 lg:px-8">
      <h1 className="text-2xl md:text-3xl font-bold font-headline text-foreground mb-3 text-center">
        {pageTitleText}
        {totalItems > 0 &&
          ` - ${paginationInfoText
            .replace("{currentPage}", pageNumber.toString())
            .replace("{totalPages}", totalPages.toString())}`}
      </h1>
      <p className="text-sm font-body text-muted-foreground mb-6 max-w-2xl mx-auto text-center">
        {onPageDescriptionText}
      </p>
      <ArticleListClient
        articles={articlesData}
        currentPageFromUrl={pageNumber}
        basePath="/articles/page"
        articlesPerPage={ARTICLES_PER_PAGE}
      />
    </div>
  );
}
