
"use client";

import type React from 'react';
import { useState, useMemo, useEffect, useRef } from 'react';
import type { Article } from '@/lib/articles-data';
import ArticleCard from './article-card';
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger, DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ChevronDown, ListFilter, ArrowUpDown, Star, ArrowDownAZ, ArrowUpZA, ChevronLeft, ChevronRight, Home } from 'lucide-react';
import { useLanguage, type Language } from '@/contexts/language-context';
import { Skeleton } from '@/components/ui/skeleton';
import { Toolbar } from '@/components/ui/toolbar';
import { useRouter } from 'next/navigation';
import { cn } from "@/lib/utils";

interface ArticleListClientProps {
  articles: Article[];
  currentPageFromUrl: number;
  basePath: string;
  articlesPerPage: number;
}

const sortArticlesByTitleHelper = (data: Article[], order: 'asc' | 'desc', language: Language) => {
  return [...data].sort((a, b) => {
    const titleA = a.title[language] || '';
    const titleB = b.title[language] || '';
    return order === 'asc' ? titleA.localeCompare(titleB, language, { sensitivity: 'base' }) : titleB.localeCompare(titleA, language, { sensitivity: 'base' });
  });
};

export default function ArticleListClient({ articles, currentPageFromUrl, basePath, articlesPerPage }: ArticleListClientProps) {
  const { language, translations } = useLanguage();
  const router = useRouter();

  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [sortByPinned, setSortByPinned] = useState<boolean>(true);
  const [sortByFrontpageDisplay, setSortByFrontpageDisplay] = useState<boolean>(false);
  const [sortByTitle, setSortByTitle] = useState<'asc' | 'desc'>('asc');

  const [clientSideCurrentPage, setClientSideCurrentPage] = useState(currentPageFromUrl);

  const [componentReady, setComponentReady] = useState(false);
  const isInitialLoadRef = useRef(true);

  useEffect(() => {
    if (translations && translations.selectCategoriesPlaceholder) {
      setComponentReady(true);
    }
  }, [translations]);

  useEffect(() => {
    setClientSideCurrentPage(1);
  }, [selectedCategories, sortByPinned, sortByFrontpageDisplay, sortByTitle]);

  useEffect(() => {
    setClientSideCurrentPage(currentPageFromUrl);
    isInitialLoadRef.current = true;
  }, [currentPageFromUrl]);


  const handleSortByPinnedToggle = () => {
    if (!sortByPinned) {
      setSortByPinned(true);
      setSortByFrontpageDisplay(false);
    } else {
      setSortByPinned(false);
    }
  };

  const handleSortByFrontpageDisplayToggle = () => {
    if (!sortByFrontpageDisplay) {
      setSortByFrontpageDisplay(true);
      setSortByPinned(false);
    } else {
      setSortByFrontpageDisplay(false);
    }
  };

  const sortedCategoryFilters = useMemo(() => {
    const allCategoryKeys = articles.reduce((acc, article) => {
      article.categories.forEach(categoryKey => acc.add(categoryKey));
      return acc;
    }, new Set<string>());

    return Array.from(allCategoryKeys)
      .map(key => {
        const categoryTranslation = translations[key];
        const label = (typeof categoryTranslation === 'object' && categoryTranslation !== null && typeof categoryTranslation[language] === "string" ? categoryTranslation[language] : (typeof categoryTranslation === 'string' ? categoryTranslation : '')) || key;
        return {
          key: key,
          label: label,
        };
      })
      .sort((a, b) => a.label.localeCompare(b.label, language, { sensitivity: 'base' }));
  }, [articles, language, translations]);

  const filteredAndSortedArticles = useMemo(() => {
    let processedArticles = articles;

    if (selectedCategories.length > 0) {
      processedArticles = processedArticles.filter(article =>
        article.categories.some(category => selectedCategories.includes(category))
      );
    }

    if (sortByPinned) {
      const pinnedArticles = processedArticles.filter(article => article.pinned);
      const unpinnedArticles = processedArticles.filter(article => !article.pinned);
      const sortedPinned = sortArticlesByTitleHelper(pinnedArticles, sortByTitle, language);
      const sortedUnpinned = sortArticlesByTitleHelper(unpinnedArticles, sortByTitle, language);
      return [...sortedPinned, ...sortedUnpinned];
    } else if (sortByFrontpageDisplay) {
      const frontpageArticles = processedArticles.filter(article => article.frontpage_display);
      const otherArticles = processedArticles.filter(article => !article.frontpage_display);
      const sortedFrontpage = sortArticlesByTitleHelper(frontpageArticles, sortByTitle, language);
      const sortedOther = sortArticlesByTitleHelper(otherArticles, sortByTitle, language);
      return [...sortedFrontpage, ...sortedOther];
    } else {
      return sortArticlesByTitleHelper(processedArticles, sortByTitle, language);
    }
  }, [articles, selectedCategories, sortByPinned, sortByFrontpageDisplay, sortByTitle, language]);

  const totalPagesForFilteredView = Math.ceil(filteredAndSortedArticles.length / articlesPerPage);

  const paginatedArticlesToDisplay = useMemo(() => {
    const startIndex = (clientSideCurrentPage - 1) * articlesPerPage;
    return filteredAndSortedArticles.slice(startIndex, startIndex + articlesPerPage);
  }, [filteredAndSortedArticles, clientSideCurrentPage, articlesPerPage]);

  const currentStartIndex = (clientSideCurrentPage - 1) * articlesPerPage + 1;
  const currentEndIndex = Math.min(clientSideCurrentPage * articlesPerPage, filteredAndSortedArticles.length);

  const handleCategoryChange = (categoryKey: string, checked: boolean) => {
    setSelectedCategories(prev =>
      checked ? [...prev, categoryKey] : prev.filter(c => c !== categoryKey)
    );
  };

  const handlePageNavigation = (newPageNumber: number) => {
    router.push(`${basePath}/${newPageNumber}`);
  };

  useEffect(() => {
    if (componentReady) {
      if (isInitialLoadRef.current) {
        isInitialLoadRef.current = false;
      } else {
        const articleListTop = document.querySelector('.grid[aria-live="polite"]');
        if (articleListTop) {
          const yOffset = -80;
          const y = articleListTop.getBoundingClientRect().top + window.pageYOffset + yOffset;
          window.scrollTo({top: y, behavior: 'smooth' });
        } else {
          window.scrollTo({top: 0, behavior: 'smooth'});
        }
      }
    }
  }, [clientSideCurrentPage, currentPageFromUrl, componentReady]);

  const rawControlsToolbarLabel = translations.articleControlsToolbarLabel;
  const controlsToolbarLabel = typeof rawControlsToolbarLabel === 'object' && rawControlsToolbarLabel !== null && typeof rawControlsToolbarLabel[language] === 'string' ? rawControlsToolbarLabel[language] : (typeof rawControlsToolbarLabel === 'string' ? rawControlsToolbarLabel : '');

  const rawArticlesListAriaLabelText = translations.articlesListAriaLabel;
  const articlesListAriaLabelText = typeof rawArticlesListAriaLabelText === 'object' && rawArticlesListAriaLabelText !== null && typeof rawArticlesListAriaLabelText[language] === 'string' ? rawArticlesListAriaLabelText[language] : (typeof rawArticlesListAriaLabelText === 'string' ? rawArticlesListAriaLabelText : '');

  const rawSelectCategoriesPlaceholder = translations.selectCategoriesPlaceholder;
  const selectCategoriesPlaceholderText = typeof rawSelectCategoriesPlaceholder === 'object' && rawSelectCategoriesPlaceholder !== null && typeof rawSelectCategoriesPlaceholder[language] === 'string' ? rawSelectCategoriesPlaceholder[language] : (typeof rawSelectCategoriesPlaceholder === 'string' ? rawSelectCategoriesPlaceholder : '');

  const rawCategoriesSelected = translations.categoriesSelected;
  const categoriesSelectedTemplate = typeof rawCategoriesSelected === 'object' && rawCategoriesSelected !== null && typeof rawCategoriesSelected[language] === 'string' ? rawCategoriesSelected[language] : (typeof rawCategoriesSelected === 'string' ? rawCategoriesSelected : '');

  const rawFilterLabel = translations.filterLabel;
  const filterLabelText = typeof rawFilterLabel === 'object' && rawFilterLabel !== null && typeof rawFilterLabel[language] === 'string' ? rawFilterLabel[language] : (typeof rawFilterLabel === 'string' ? rawFilterLabel : '');

  const rawClearAllCategories = translations.clearAllCategories;
  const clearAllCategoriesText = typeof rawClearAllCategories === 'object' && rawClearAllCategories !== null && typeof rawClearAllCategories[language] === 'string' ? rawClearAllCategories[language] : (typeof rawClearAllCategories === 'string' ? rawClearAllCategories : '');

  const rawNoCategoriesAvailable = translations.noCategoriesAvailable;
  const noCategoriesAvailableText = typeof rawNoCategoriesAvailable === 'object' && rawNoCategoriesAvailable !== null && typeof rawNoCategoriesAvailable[language] === "string" ? rawNoCategoriesAvailable[language] : (typeof rawNoCategoriesAvailable === 'string' ? rawNoCategoriesAvailable : '');

  const rawSortLabel = translations.sortLabel;
  const sortLabelText = typeof rawSortLabel === 'object' && rawSortLabel !== null && typeof rawSortLabel[language] === 'string' ? rawSortLabel[language] : (typeof rawSortLabel === 'string' ? rawSortLabel : '');

  const rawPrioritizePinnedTooltip = translations.prioritizePinnedToggleTooltip;
  const prioritizePinnedTooltipText = typeof rawPrioritizePinnedTooltip === 'object' && rawPrioritizePinnedTooltip !== null && typeof rawPrioritizePinnedTooltip[language] === 'string' ? rawPrioritizePinnedTooltip[language] : (typeof rawPrioritizePinnedTooltip === 'string' ? rawPrioritizePinnedTooltip : '');

  const rawPrioritizeFrontpageTooltip = translations.prioritizeFrontpageToggleTooltip;
  const prioritizeFrontpageToggleTooltipText = typeof rawPrioritizeFrontpageTooltip === 'object' && rawPrioritizeFrontpageTooltip !== null && typeof rawPrioritizeFrontpageTooltip[language] === 'string' ? rawPrioritizeFrontpageTooltip[language] : (typeof rawPrioritizeFrontpageTooltip === 'string' ? rawPrioritizeFrontpageTooltip : '');

  const rawSortTitleTooltip = translations.sortTitleToggleTooltip;
  const sortTitleTooltipText = typeof rawSortTitleTooltip === 'object' && rawSortTitleTooltip !== null && typeof rawSortTitleTooltip[language] === 'string' ? rawSortTitleTooltip[language] : (typeof rawSortTitleTooltip === 'string' ? rawSortTitleTooltip : '');

  const rawNoArticlesFound = translations.noArticlesFound;
  const noArticlesFoundText = typeof rawNoArticlesFound === 'object' && rawNoArticlesFound !== null && typeof rawNoArticlesFound[language] === 'string' ? rawNoArticlesFound[language] : (typeof rawNoArticlesFound === 'string' ? rawNoArticlesFound : '');

  const rawPaginationPrevious = translations.paginationPrevious;
  const paginationPreviousText = typeof rawPaginationPrevious === 'object' && rawPaginationPrevious !== null && typeof rawPaginationPrevious[language] === 'string' ? rawPaginationPrevious[language] : (typeof rawPaginationPrevious === 'string' ? rawPaginationPrevious : '');

  const rawPaginationPageInfo = translations.paginationPageInfo;
  const paginationPageInfoTemplate = typeof rawPaginationPageInfo === 'object' && rawPaginationPageInfo !== null && typeof rawPaginationPageInfo[language] === 'string' ? rawPaginationPageInfo[language] : (typeof rawPaginationPageInfo === 'string' ? rawPaginationPageInfo : '');

  const rawPaginationItemsInfo = translations.paginationItemsInfo;
  const paginationItemsInfoTemplate = typeof rawPaginationItemsInfo === 'object' && rawPaginationItemsInfo !== null && typeof rawPaginationItemsInfo[language] === 'string' ? rawPaginationItemsInfo[language] : (typeof rawPaginationItemsInfo === 'string' ? rawPaginationItemsInfo : '');

  const rawPaginationNext = translations.paginationNext;
  const paginationNextText = typeof rawPaginationNext === 'object' && rawPaginationNext !== null && typeof rawPaginationNext[language] === 'string' ? rawPaginationNext[language] : (typeof rawPaginationNext === 'string' ? rawPaginationNext : '');


  if (!componentReady) {
    return (
      <div>
        <Toolbar
          className="mb-6 pt-3 pb-4 flex flex-col sm:flex-row items-start sm:items-center sm:justify-between gap-y-4 sm:gap-x-6 sm:gap-y-0"
          aria-label={controlsToolbarLabel || "Article display controls"}
        >
          <div className="flex flex-col sm:flex-row sm:items-center w-full sm:w-auto gap-y-2 sm:gap-x-3">
             <Skeleton className="h-10 w-full rounded-md sm:w-auto sm:min-w-[180px]" />
          </div>
          <div className="w-full sm:w-auto flex items-center justify-center sm:justify-start space-x-2">
            <Skeleton className="h-5 w-5" />
            <Skeleton className="h-5 w-12 shrink-0" />
            <Skeleton className="h-10 w-10 rounded-md" />
            <Skeleton className="h-10 w-10 rounded-md" />
            <Skeleton className="h-10 w-10 rounded-md" />
          </div>
        </Toolbar>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" aria-label={articlesListAriaLabelText || "Articles list"}>
          {[...Array(articlesPerPage)].map((_, i) => (
            <div key={i} className="flex flex-col space-y-3">
              <Skeleton className="h-[125px] w-full rounded-xl" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
              </div>
              <Skeleton className="h-10 w-1/2" />
            </div>
          ))}
        </div>
        { articlesPerPage < articles.length && (
            <div className="mt-8 flex items-center justify-between">
              <Skeleton className="h-10 w-10 rounded-md" />
              <div className="flex flex-col items-center">
                <Skeleton className="h-6 w-24 rounded-md mb-1" />
                <Skeleton className="h-5 w-32 rounded-md" />
              </div>
              <Skeleton className="h-10 w-10 rounded-md" />
            </div>
          )
        }
      </div>
    );
  }

  const getCategoryFilterText = () => {
    if (selectedCategories.length === 0) {
      return selectCategoriesPlaceholderText;
    }
    if (selectedCategories.length === 1) {
      const categoryKey = selectedCategories[0];
      const foundFilter = sortedCategoryFilters.find(f => f.key === categoryKey);
      return foundFilter ? foundFilter.label : categoryKey;
    }
    return categoriesSelectedTemplate.replace('{count}', selectedCategories.length.toString());
  };

  return (
    <div>
      <Toolbar
        className="mb-6 pt-3 pb-4 flex flex-col sm:flex-row items-start sm:items-center sm:justify-between gap-y-4 sm:gap-x-6 sm:gap-y-0"
        aria-label={controlsToolbarLabel}
      >
        <div className="flex flex-col sm:flex-row sm:items-center w-full sm:w-auto gap-y-2 sm:gap-x-3">
          {sortedCategoryFilters.length > 0 ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full sm:w-auto flex items-center justify-between text-sm min-w-[200px] max-w-full font-headline"
                >
                  <div className="flex items-center truncate mr-2">
                    <ListFilter className="h-4 w-4 mr-1.5 shrink-0" aria-hidden="true" />
                    <span className={cn(
                      "truncate",
                      selectedCategories.length === 0 && "text-muted-foreground"
                    )}>
                      {getCategoryFilterText()}
                    </span>
                  </div>
                  <ChevronDown className="h-4 w-4 shrink-0 opacity-50" aria-hidden="true" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className={cn("w-[--radix-dropdown-menu-trigger-width]", "font-headline")}>
                <DropdownMenuLabel>{filterLabelText}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {sortedCategoryFilters.map(filterItem => (
                  <DropdownMenuCheckboxItem
                    key={filterItem.key}
                    checked={selectedCategories.includes(filterItem.key)}
                    onCheckedChange={(checked) => handleCategoryChange(filterItem.key, !!checked)}
                  >
                    {filterItem.label}
                  </DropdownMenuCheckboxItem>
                ))}
                {sortedCategoryFilters.length > 0 && <DropdownMenuSeparator />}
                <DropdownMenuItem
                  onSelect={() => setSelectedCategories([])}
                  disabled={selectedCategories.length === 0}
                  className="text-sm text-destructive focus:text-destructive-foreground focus:bg-destructive font-headline"
                >
                  {clearAllCategoriesText}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
             <div className="flex items-center text-sm text-muted-foreground px-3 py-2 h-10 border border-transparent rounded-md w-full sm:w-auto font-headline">
                <ListFilter className="h-4 w-4 mr-1.5 shrink-0" aria-hidden="true" />
                <span>{noCategoriesAvailableText}</span>
             </div>
          )}
        </div>
        <div className="w-full sm:w-auto flex items-center justify-center sm:justify-start space-x-2">
          <ArrowUpDown className="h-4 w-4 text-foreground" aria-hidden="true" />
          <span className="text-sm font-headline text-foreground shrink-0">
            {sortLabelText}
          </span>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleSortByPinnedToggle}
                  aria-pressed={sortByPinned}
                  aria-label={prioritizePinnedTooltipText}
                >
                  <Star className={cn('h-4 w-4', sortByPinned ? 'fill-yellow-500 stroke-yellow-500' : 'text-muted-foreground')} aria-hidden="true" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{prioritizePinnedTooltipText}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleSortByFrontpageDisplayToggle}
                  aria-pressed={sortByFrontpageDisplay}
                  aria-label={prioritizeFrontpageToggleTooltipText}
                >
                  <Home className={cn('h-4 w-4', sortByFrontpageDisplay ? 'fill-primary stroke-primary' : 'text-muted-foreground')} aria-hidden="true" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{prioritizeFrontpageToggleTooltipText}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setSortByTitle(prev => (prev === 'asc' ? 'desc' : 'asc'))}
                  aria-label={sortTitleTooltipText}
                >
                  {sortByTitle === 'asc' ? <ArrowDownAZ className="h-4 w-4 text-foreground" aria-hidden="true" /> : <ArrowUpZA className="h-4 w-4 text-foreground" aria-hidden="true" />}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{sortTitleTooltipText}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </Toolbar>

      {paginatedArticlesToDisplay.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" aria-live="polite" aria-label={articlesListAriaLabelText}>
          {paginatedArticlesToDisplay.map(article => (
            <ArticleCard
              key={article.slug}
              article={article}
            />
          ))}
        </div>
      ) : (
        <p className="text-center text-muted-foreground py-10 font-headline">
          {noArticlesFoundText}
        </p>
      )}

      {componentReady && totalPagesForFilteredView > 1 && (
        <div className="mt-8 flex items-center justify-between">
          <Button
            variant="outline"
            size="icon"
            onClick={() => handlePageNavigation(clientSideCurrentPage - 1)}
            disabled={clientSideCurrentPage === 1}
            aria-label={paginationPreviousText}
          >
            <ChevronLeft className="h-4 w-4" aria-hidden="true" />
          </Button>
          <div className="text-sm text-muted-foreground text-center font-headline" role="status" aria-live="polite">
            <div>
              {paginationPageInfoTemplate
                .replace('{currentPage}', clientSideCurrentPage.toString())
                .replace('{totalPages}', totalPagesForFilteredView.toString())}
            </div>
            {filteredAndSortedArticles.length > 0 && (
              <div>
                {paginationItemsInfoTemplate
                  .replace('{startIndex}', currentStartIndex.toString())
                  .replace('{endIndex}', currentEndIndex.toString())
                  .replace('{totalItems}', filteredAndSortedArticles.length.toString())}
              </div>
            )}
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={() => handlePageNavigation(clientSideCurrentPage + 1)}
            disabled={clientSideCurrentPage === totalPagesForFilteredView || totalPagesForFilteredView === 0}
            aria-label={paginationNextText}
          >
            <ChevronRight className="h-4 w-4" aria-hidden="true" />
          </Button>
        </div>
      )}
    </div>
  );
}

