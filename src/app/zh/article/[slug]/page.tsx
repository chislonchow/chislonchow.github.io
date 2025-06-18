
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { getArticleBySlug, getArticles } from "@/lib/articles-data";
import MarkdownDisplay from "@/components/shared/markdown-display";
import { getTranslations } from "@/lib/translations";
import { format } from "date-fns";
import { zhTW } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, Tag } from "lucide-react";
import type { Language } from "@/contexts/language-context";

type Props = {
  params: Promise<{ slug: string }>;
};

export const dynamicParams = false;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const param = await params;
  const translations = getTranslations(new Date().getFullYear());
  const article = getArticleBySlug(param.slug);
  const lang: Language = "zh";

  const rawSiteName = translations.siteName;
  const siteName = typeof rawSiteName === 'string' ? rawSiteName : '';

  if (!article) {
    const rawArticleNotFoundMetaTitleEntry = translations.articleNotFoundMetaTitle;
    const notFoundTitleText =
      typeof rawArticleNotFoundMetaTitleEntry === "object" && rawArticleNotFoundMetaTitleEntry !== null && typeof rawArticleNotFoundMetaTitleEntry[lang] === "string"
        ? rawArticleNotFoundMetaTitleEntry[lang]
        : (typeof rawArticleNotFoundMetaTitleEntry === "string" ? rawArticleNotFoundMetaTitleEntry : '');

    const notFoundTitle = (
      notFoundTitleText || "{siteName}" 
    ).replace("{siteName}", siteName);
    return {
      title: { absolute: notFoundTitle },
    };
  }
  const pageTitle = `${article.title.zh} | ${siteName}`;
  return {
    title: { absolute: pageTitle },
    description: article.description.zh,
    alternates: {
      canonical: `/zh/article/${param.slug}/`,
      languages: {
        en: `/article/${param.slug}/`,
        zh: `/zh/article/${param.slug}/`,
      },
    },
  };
}

export async function generateStaticParams() {
  const articles = getArticles();
  return articles.map((article) => ({
    slug: article.slug,
  }));
}

export default async function ArticlePageZh({ params }: Props) {
  const param = await params;
  const article = getArticleBySlug(param.slug);
  const translations = getTranslations(new Date().getFullYear());

  if (!article) {
    notFound();
  }

  const lang: Language = "zh";
  const rawUpdatedOnText = translations.updatedOn;
  const updatedOnText =
    typeof rawUpdatedOnText === "object" && rawUpdatedOnText !== null && typeof rawUpdatedOnText[lang] === "string"
      ? rawUpdatedOnText[lang]
      : (typeof rawUpdatedOnText === "string" ? rawUpdatedOnText : '');

  const rawErrorLoadingTitle = translations.markdownErrorLoadingTitle;
  const errorLoadingTitle = typeof rawErrorLoadingTitle === 'object' && rawErrorLoadingTitle !== null && typeof rawErrorLoadingTitle[lang] === "string" ? rawErrorLoadingTitle[lang] : (typeof rawErrorLoadingTitle === 'string' ? rawErrorLoadingTitle : '');

  const rawErrorInvalidContentMessage = translations.markdownErrorInvalidContent;
  const errorInvalidContentMessage = typeof rawErrorInvalidContentMessage === 'object' && rawErrorInvalidContentMessage !== null && typeof rawErrorInvalidContentMessage[lang] === "string" ? rawErrorInvalidContentMessage[lang] : (typeof rawErrorInvalidContentMessage === 'string' ? rawErrorInvalidContentMessage : '');
  
  const rawErrorProcessingFailedMessage = translations.markdownErrorProcessingFailed;
  const errorProcessingFailedMessage = typeof rawErrorProcessingFailedMessage === 'object' && rawErrorProcessingFailedMessage !== null && typeof rawErrorProcessingFailedMessage[lang] === "string" ? rawErrorProcessingFailedMessage[lang] : (typeof rawErrorProcessingFailedMessage === 'string' ? rawErrorProcessingFailedMessage : '');

  return (
    <>
      <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8 min-h-[calc(100vh-10rem)]">
        <article className="max-w-3xl mx-auto bg-card p-6 sm:p-8 md:p-10 rounded-xl border">
          <header className="mb-8 border-b pb-6">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold font-headline text-foreground mb-3">
              {article.title[lang]}
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground font-body mb-4">
              {article.description[lang]}
            </p>
            <div className="text-sm text-muted-foreground">
              <div className="flex items-center flex-wrap mb-2">
                {article.categories.map((category, index) => {
                  const categoryTranslation = translations[category];
                  const categoryText =
                    (typeof categoryTranslation === "object" && categoryTranslation !== null && typeof categoryTranslation[lang] === "string"
                      ? categoryTranslation[lang]
                      : (typeof categoryTranslation === "string" ? categoryTranslation : '')) || category; // Fallback to category key
                  return (
                    <Badge
                      key={index}
                      variant="outline"
                      className="mr-1.5 mb-1.5 text-xs"
                    >
                      <Tag className="w-3.5 h-3.5 mr-1" aria-hidden="true" />
                      {categoryText}
                    </Badge>
                  );
                })}
              </div>
              {article.date_updated_shown && (
                <div className="flex items-center">
                  <CalendarDays className="w-4 h-4 mr-1.5" aria-hidden="true" />
                  <span>
                    {updatedOnText}{" "}
                    {format(new Date(article.date_updated), "yyyy年MM月dd日", {
                      locale: zhTW,
                    })}
                  </span>
                </div>
              )}
            </div>
          </header>

          {article.imageUrl && (
            <div className="mb-8 text-center">
              <Image
                src={article.imageUrl}
                alt={article.imageCaption?.[lang] || article.title[lang]}
                width={600}
                height={400}
                className="rounded-lg mx-auto border"
                data-ai-hint="article illustration"
              />
              {article.imageCaption?.[lang] && (
                <p className="text-xs text-muted-foreground mt-2 italic">
                  {article.imageCaption[lang]}
                </p>
              )}
            </div>
          )}

          <MarkdownDisplay
            content={article.content[lang]}
            errorLoadingTitle={errorLoadingTitle}
            errorInvalidContentMessage={errorInvalidContentMessage}
            errorProcessingFailedMessage={errorProcessingFailedMessage}
          />
        </article>
      </div>
    </>
  );
}
