
"use client";

import type React from 'react';
import Link from 'next/link';
import type { ArticleListItem } from '@/lib/articles-data';
import { useLanguage, type Language } from '@/contexts/language-context';
import { getTranslatedString } from '@/lib/translations';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, Tag, ChevronRight } from 'lucide-react';
import { cn } from "@/lib/utils";

interface ArticleCardProps {
  article: ArticleListItem;
}

export default function ArticleCard({ article }: ArticleCardProps) {
  const { language, translations } = useLanguage();
  const articleUrl = `/${language === 'zh' ? 'zh/' : ''}article/${article.slug}/`;

  const pinnedArticleText = getTranslatedString(translations.pinnedArticle, language);
  const readArticleLabelText = getTranslatedString(translations.readArticleLabel, language);
  const articleLinkAriaLabel = `${readArticleLabelText}: ${article.title[language]}`;

  return (
    <Link href={articleUrl} className="block h-full group" aria-label={articleLinkAriaLabel}>
      <Card className="flex flex-col h-full bg-background/80 border rounded-lg shadow-sm group-hover:shadow-lg transition-all duration-150">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl font-headline text-primary">
            {article.title[language]}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-grow pb-3">
          <p className="text-sm xs:text-base text-foreground/80 leading-relaxed line-clamp-4">
            {article.description[language]}
          </p>
        </CardContent>
        <CardFooter className="flex flex-col items-stretch pt-4">
          {article.categories && article.categories.length > 0 && (
            <div className="mb-3">
              {article.categories.map((category, index) => {
                const categoryText = getTranslatedString(translations[category], language, category);
                return (
                  <Badge key={index} variant="outline" className="mr-1.5 mb-1.5 text-xs">
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
                <div className="flex items-center text-sm text-yellow-600 dark:text-yellow-400 font-headline font-semibold">
                  <Star className="w-3.5 h-3.5 mr-1 fill-yellow-500 stroke-yellow-500" aria-hidden="true" />
                  {pinnedArticleText}
                </div>
              )}
            </div>
            <div className="ml-2 text-right">
              <div className="flex items-center justify-end text-sm text-primary">
                <span className="font-headline">{readArticleLabelText}</span> 
                <ChevronRight className="h-5 w-5 ml-1" aria-hidden="true" />
              </div>
            </div>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
