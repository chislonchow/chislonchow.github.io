
"use client";

import type React from 'react';
import Link from 'next/link';
import type { Article } from '@/lib/articles-data';
import { useLanguage, type Language } from '@/contexts/language-context';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, Tag, ChevronRight } from 'lucide-react';

interface ArticleCardProps {
  article: Article;
}

export default function ArticleCard({ article }: ArticleCardProps) {
  const { language, translations } = useLanguage();
  const articleUrl = `/${language === 'zh' ? 'zh/' : ''}article/${article.slug}`;

  const rawPinnedArticleText = translations.pinnedArticle;
  const pinnedArticleText = typeof rawPinnedArticleText === 'object' && rawPinnedArticleText !== null && typeof rawPinnedArticleText[language] === 'string' ? rawPinnedArticleText[language] : (typeof rawPinnedArticleText === 'string' ? rawPinnedArticleText : '');

  const rawReadArticleLabel = translations.readArticleLabel; // Re-add this
  const readArticleLabelText = typeof rawReadArticleLabel === 'object' && rawReadArticleLabel !== null && typeof rawReadArticleLabel[language] === 'string' ? rawReadArticleLabel[language] : (typeof rawReadArticleLabel === 'string' ? rawReadArticleLabel : '');
  const articleLinkAriaLabel = `${readArticleLabelText}: ${article.title[language]}`;

  return (
    <Link href={articleUrl} className="block h-full group" aria-label={articleLinkAriaLabel}>
      <Card className="flex flex-col h-full bg-background/80 border rounded-lg group-hover:border-primary transition-all duration-150">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl font-headline text-primary">
            {article.title[language]}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-grow pb-3">
          <p className="text-base font-body text-foreground/80 leading-relaxed line-clamp-3">
            {article.description[language]}
          </p>
        </CardContent>
        <CardFooter className="flex flex-col items-stretch pt-4">
          {article.categories && article.categories.length > 0 && (
            <div className="mb-3">
              {article.categories.map((category, index) => {
                const categoryTranslation = translations[category];
                const categoryText = (typeof categoryTranslation === 'object' && categoryTranslation !== null && typeof categoryTranslation[language] === "string" ? categoryTranslation[language] : (typeof categoryTranslation === 'string' ? categoryTranslation : '')) || category;
                return (
                  <Badge key={index} variant="outline" className="mr-1.5 mb-1.5 text-sm">
                    <Tag className="w-3.5 h-3.5 mr-1" aria-hidden="true" />
                    {categoryText}
                  </Badge>
                );
              })}
            </div>
          )}
          <div className="flex items-end justify-between w-full mt-auto">
            <div className="flex-shrink-0">
              {article.pinned && (
                <div className="flex items-center text-sm text-yellow-600 dark:text-yellow-400 font-semibold">
                  <Star className="w-3.5 h-3.5 mr-1 fill-yellow-500 stroke-yellow-500" aria-hidden="true" />
                  {pinnedArticleText}
                </div>
              )}
            </div>
            <div className="ml-2 text-right">
              <div className="flex items-center justify-end text-sm text-primary">
                <span>{readArticleLabelText}</span> 
                <ChevronRight className="h-5 w-5 ml-1" aria-hidden="true" />
              </div>
            </div>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
