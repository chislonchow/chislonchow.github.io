
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { getArticleBySlug, getArticleListItems } from "@/lib/articles-data";
import MarkdownDisplay from "@/components/shared/markdown-display";
import { getTranslatedString } from "@/lib/translations";
import { getTranslations } from "@/lib/translations.server";
import { format } from "date-fns";
import { zhTW } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, Tag } from "lucide-react";
import type { Language } from "@/contexts/language-context";
import { cn } from "@/lib/utils";

type Props = {
  params: Promise<{ slug: string }>;
};

export const dynamicParams = false;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const param = await params;
  const translations = getTranslations(new Date().getFullYear());
  const article = getArticleBySlug(param.slug);
  const lang: Language = "zh";

  const siteName = getTranslatedString(translations.siteName, lang, "");

  if (!article) {
    const notFoundTitleText = getTranslatedString(translations.articleNotFoundMetaTitle, lang);
    const notFoundTitle = (notFoundTitleText || "{siteName}").replace(
      "{siteName}",
      siteName
    );
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
  const articles = getArticleListItems();
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
  const updatedOnText = getTranslatedString(translations.updatedOn, lang);
  const errorLoadingTitle = getTranslatedString(translations.markdownErrorLoadingTitle, lang);
  const errorInvalidContentMessage = getTranslatedString(translations.markdownErrorInvalidContent, lang);
  const errorProcessingFailedMessage = getTranslatedString(translations.markdownErrorProcessingFailed, lang);

  return (
    <>
      <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8 min-h-[calc(100vh-10rem)]">
        <article className="max-w-3xl mx-auto bg-card p-3 xs:p-6 sm:p-8 md:p-10 rounded-xl border">
          <header className="mb-8 border-b pb-6">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold font-headline text-foreground mb-3">
              {article.title[lang]}
            </h1>
            <p className="text-base md:text-lg text-muted-foreground font-body mb-4">
              {article.description[lang]}
            </p>
            <div className="text-sm text-muted-foreground">
              <div className="flex items-center flex-wrap mb-2">
                {article.categories.map((category, index) => {
                  const categoryText = getTranslatedString(translations[category], lang, category);
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
                <div className={cn("flex items-center font-headline")}>
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
                <p className="text-xs text-muted-foreground mt-2 italic font-headline">
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
