
"use client";

import { useEffect, useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  Mail,
  User,
  ExternalLink,
  Quote,
  Newspaper,
  ChevronRight,
  Home,
  AlertTriangle,
  Phone,
} from "lucide-react";
import { useLanguage, type Language } from "@/contexts/language-context";
import { getTranslatedString } from "@/lib/translations";
import Link from "next/link";
import CanadaFlagIcon from "@/components/icons/canada-flag-icon";
import type { ArticleListItem } from "@/lib/articles-data";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";
import { getLocalizedPath } from "@/lib/path-utils";

interface ServiceCardProps {
  title: string;
  description: string;
  href?: string;
}

function ServiceCard({ title, description, href }: ServiceCardProps) {
  const cardInnerContent = (
    <Card className="transition-all duration-150 hover:shadow-lg h-full flex flex-col overflow-hidden shadow-md bg-card">
      <CardHeader className="p-6 pb-3">
        <CardTitle className="text-xl sm:text-2xl font-headline font-semibold text-primary">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-grow p-6 pt-0">
        <p className={cn(
            "text-lg text-secondary-foreground leading-relaxed text-left font-headline"
          )}>
          {description}
        </p>
      </CardContent>
      {href && (
        <CardFooter className="p-6 pt-3 flex justify-end">
          <ExternalLink
            className="w-5 h-5 text-primary shrink-0"
            aria-hidden="true"
          />
        </CardFooter>
      )}
    </Card>
  );

  if (href) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="block h-full"
      >
        {cardInnerContent}
      </a>
    );
  }
  return cardInnerContent;
}

interface HotlineInfo {
  key: string;
  url: string;
}

const crisisHotlines: HotlineInfo[] = [
  { key: "crisisCard2ListItem1", url: "https://988.ca/" },
  { key: "crisisCard2ListItem2", url: "https://www.dcogt.com/408-helpline/" },
  { key: "crisisCard2ListItem3", url: "https://yssn.ca/310-cope/" },
  { key: "crisisCard2ListItem4", url: "https://kidshelpphone.ca/urgent-help" },
];

interface HomePageClientContentsProps {
  allArticles: ArticleListItem[];
}

export default function HomePageClientContents({
  allArticles,
}: HomePageClientContentsProps) {
  const { language, translations } = useLanguage();
  const [dynamicMailtoLink, setDynamicMailtoLink] = useState<string>("#");

  const profilePath = getLocalizedPath("/profile", language);
  const articlesPath = getLocalizedPath("/articles/page/1", language);

  useEffect(() => {
    const emailUser = "contact";
    const emailDomain = "chislonchow.com";
    const emailAddress = `${emailUser}@${emailDomain}`;

    const emailSubject = getTranslatedString(translations.heroMailSubject, language);
    const emailBody = getTranslatedString(translations.heroMailBodyTemplate, language);

    const constructedLink = `mailto:${emailAddress}?subject=${encodeURIComponent(
      emailSubject
    )}&body=${encodeURIComponent(emailBody)}`;
    setDynamicMailtoLink(constructedLink);
  }, [language, translations]);

  const articlesForFrontpageAccordion = useMemo(() => {
    if (!allArticles) return [];
    return allArticles
      .filter((article) => article.frontpage_display === true)
      .sort((a, b) => {
        const titleA = a.title[language] || "";
        const titleB = b.title[language] || "";
        return titleA.localeCompare(titleB, language, { sensitivity: "base" });
      });
  }, [allArticles, language]);

  const psychotherapyApproachTitleId = "psychotherapy-approach-title";
  const networkListingsTitleId = "network-listings-title";
  const crisisInfoTitleId = "crisis-info-title";
  const ctaTitleId = "cta-title";
  const pageBottomTitleId = "page-bottom-title-h2";

  const heroSubtitleRawText = getTranslatedString(translations.heroSubtitle, language);
  let heroSubtitleDisplay: React.ReactNode = heroSubtitleRawText;
  if (language === "zh" && heroSubtitleRawText) {
    const enPhraseWithProvinceReg = /Registered Psychotherapist\s?\(安省\)/;
    const match = heroSubtitleRawText.match(enPhraseWithProvinceReg);
    if (match) {
      const matchedPhrase = match[0];
      const parts = heroSubtitleRawText.split(matchedPhrase);
      heroSubtitleDisplay = (
        <>
          {parts[0]}
          <span className="whitespace-nowrap">{matchedPhrase}</span>
          {parts.length > 1 ? parts.slice(1).join(matchedPhrase) : ""}
        </>
      );
    }
  }

  const heroButtonText = getTranslatedString(translations.heroButton, language);
  const heroButtonSecondaryText = getTranslatedString(translations.heroButtonSecondary, language);
  const psychotherapyApproachSectionTitleText = getTranslatedString(translations.psychotherapyApproachSectionTitle, language);
  const welcomeTextContent = getTranslatedString(translations.welcomeText, language);

  const { firstSentence: welcomeFirstSentence, restOfText: welcomeRestOfText } = useMemo(() => {
    if (!welcomeTextContent) return { firstSentence: '', restOfText: '' };

    let splitPoint = -1;
    const primaryTerminators = language === 'zh' ? ['。'] : ['.'];
    const secondaryTerminators = language === 'zh' ? ['？', '！'] : ['?', '!'];

    // Prioritize primary terminators
    for (const term of primaryTerminators) {
      const index = welcomeTextContent.indexOf(term);
      if (index !== -1) {
        if (splitPoint === -1 || index < splitPoint) {
          splitPoint = index;
        }
      }
    }

    // If no primary terminator found, check secondary
    if (splitPoint === -1) {
      for (const term of secondaryTerminators) {
        const index = welcomeTextContent.indexOf(term);
        if (index !== -1) {
          if (splitPoint === -1 || index < splitPoint) {
            splitPoint = index;
          }
        }
      }
    }
    
    if (splitPoint !== -1) {
      const fs = welcomeTextContent.substring(0, splitPoint + 1);
      const rt = welcomeTextContent.substring(splitPoint + 1);
      return { firstSentence: fs, restOfText: rt };
    }
    
    return { firstSentence: welcomeTextContent, restOfText: '' };
  }, [welcomeTextContent, language]);


  const networkListingsLabel = getTranslatedString(translations.sectionNetworkListingsLabel, language);
  const network1TitleText = getTranslatedString(translations.network1Title, language);
  const network1DescText = getTranslatedString(translations.network1Desc, language);
  const network2TitleText = getTranslatedString(translations.network2Title, language);
  const network2DescText = getTranslatedString(translations.network2Desc, language);
  const network3TitleText = getTranslatedString(translations.network3Title, language);
  const network3DescText = getTranslatedString(translations.network3Desc, language);

  const crisisInfoLabel = getTranslatedString(translations.sectionCrisisInfoLabel, language);
  const crisisCard1TitleText = getTranslatedString(translations.crisisCard1Title, language);
  const crisisCard1P1Text = getTranslatedString(translations.crisisCard1P1, language);
  const crisisCard1P2Text = getTranslatedString(translations.crisisCard1P2, language);
  const crisisCard2TitleText = getTranslatedString(translations.crisisCard2Title, language);
  const crisisCard2P1Text = getTranslatedString(translations.crisisCard2P1, language);

  const ctaLabel = getTranslatedString(translations.sectionCtaLabel, language);
  const ctaTextContent = getTranslatedString(translations.ctaText, language);
  const ctaAccordionReadArticleText = getTranslatedString(translations.ctaAccordionReadArticle, language);
  const ctaButtonArticlesText = getTranslatedString(translations.ctaButtonArticles, language);

  const pageBottomSectionTitleText = getTranslatedString(translations.pageBottomSectionTitle, language);
  const pageBottomSectionSubtitleText = getTranslatedString(translations.pageBottomSectionSubtitle, language);

  return (
    <div className="flex flex-col font-headline">
      {/* Hero Section */}
      <section
        className="relative bg-gradient-to-t from-[#fbf1e5] to-[#f3e6d7] pt-14 xs:pt-16 sm:pt-20 md:pt-20 md:pb-7 w-full"
        aria-labelledby="hero-title-h1"
        style={{
          backgroundImage: "url('/images/bg-fabric.tiled.webp'), linear-gradient(to top, hsl(33, 71%, 94%), hsl(33, 71%, 84%))",
          backgroundRepeat: "repeat, no-repeat",
        }}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h1
            id="hero-title-h1"
            className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl font-extrabold mb-4"
          >
            <span style={{ color: 'hsl(202 25% 20%)' }}>Chislon</span>{' '}
            <span style={{ color: 'hsl(202 25% 25%)' }}>Chow</span>
          </h1>
          <p className="text-base xs:text-lg sm:text-lg md:text-lg text-muted-foreground mb-4 xs:mb-6 sm:mb-8 max-w-2xl mx-auto">
            <span>{heroSubtitleDisplay}</span>
            <CanadaFlagIcon
              className="h-[0.8em] w-[1.6em] inline-block ml-1.5 align-middle"
              aria-hidden="true"
            />
          </p>
          <div className="flex flex-row flex-wrap items-center justify-center gap-3 sm:gap-4 pb-20">
            <a
              href={dynamicMailtoLink}
              className="h-auto bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-5 py-2.5 text-base sm:px-6 sm:py-3 sm:text-lg border transition-transform hover:scale-105 whitespace-nowrap inline-flex items-center justify-center shadow-md hover:shadow-lg"
            >
              {heroButtonText}
              <Mail
                className="ml-2 h-4 w-4 sm:h-5 sm:w-5"
                aria-hidden="true"
              />
            </a>
            <Button
              asChild
              className="h-auto bg-secondary hover:bg-secondary/80 text-secondary-foreground rounded-full px-5 py-2.5 text-base sm:px-6 sm:py-3 sm:text-lg border transition-transform hover:scale-105 whitespace-nowrap shadow-md hover:shadow-lg"
            >
              <Link href={profilePath}>
                {heroButtonSecondaryText}
                <User
                  className="ml-2 h-4 w-4 sm:h-5 sm:w-5"
                  aria-hidden="true"
                />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Psychotherapy Approach Section */}
      <section
        className="pt-20 pb-24 sm:pt-20 sm:pb-24 bg-gradient-to-r from-primary/10 to-accent/10"
        aria-labelledby={psychotherapyApproachTitleId}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2
            id={psychotherapyApproachTitleId}
            className="max-w-3xl mx-auto text-xl sm:text-3xl font-bold mb-4 text-left"
            style={{ color: 'hsl(202, 20%, 70%)' }}
          >
            {psychotherapyApproachSectionTitleText}
          </h2>
          <Card className="max-w-3xl mx-auto p-4 xs:p-8 md:p-10 shadow-md bg-gradient-to-bl from-[hsl(30_38%_92%)] to-[hsl(30_38%_91%)]">
            <CardContent className="p-0 text-left">
              <p
                className={cn(
                  "font-body", 
                  "text-[hsl(202,40%,30%)] mb-0.5 leading-normal",
                  language === "zh"
                    ? "text-xl xs:text-2xl sm:text-3xl md:text-4xl"
                    : "text-lg xs:text-xl sm:text-2xl md:text-3xl"
                )}
              >
                <Quote
                  className={cn(
                    "inline-block text-primary/50 transform rotate-180 mr-2 mb-1 align-middle",
                    language === "zh"
                      ? "w-5 h-5 xs:w-6 xs:h-6 sm:w-6 sm:h-6 md:w-7 md:h-7"
                      : "w-4 h-4 xs:w-5 xs:h-5 sm:w-5 sm:h-5 md:w-6 md:h-6"
                  )}
                  aria-hidden="true"
                />
                {welcomeFirstSentence && (
                  <span className="font-medium">{welcomeFirstSentence}</span>
                )}
                <span className="font-normal">{welcomeRestOfText}</span>
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Call to Action Section (Resources) */}
      <section
        className="py-12 sm:py-16 bg-secondary px-4 sm:px-6 lg:px-8"
        aria-labelledby={ctaTitleId}
      >
        <div className="container mx-auto">
          <div className="h-10 w-10 xs:h-12 xs:w-12 sm:h-14 sm:w-14 flex justify-center mb-3 sm:mb-6 mx-auto">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              className="w-full h-full"
            >
              <defs>
                <linearGradient id="gradient-cta-icon" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" style={{ stopColor: 'hsl(202, 20%, 63%)' }} />
                  <stop offset="100%" style={{ stopColor: 'hsl(202, 20%, 55%)' }} />
                </linearGradient>
              </defs>
              <path fill="url(#gradient-cta-icon)" d="M11 17.05V7.2q-1.025-.6-2.175-.9T6.5 6q-.9 0-1.788.175T3 6.7v9.9q.875-.3 1.738-.45T6.5 16q1.175 0 2.288.263T11 17.05M12 20q-1.2-.95-2.6-1.475T6.5 18q-1.05 0-2.062.275T2.5 19.05q-.525.275-1.012-.025T1 18.15V6.1q0-.275.138-.525T1.55 5.2q1.15-.6 2.4-.9T6.5 4q1.85 0 3.15.425t2.8 1.3q.275.15.413.35T13 6.6v10.45q1.1-.525 2.213-.788T17.5 16q.9 0 1.763.15T21 16.6V4.575q.375.125.738.275t.712.35q.275.125.413.375T23 6.1v12.05q0 .575-.488.875t-1.012.025q-.925-.5-1.937-.775T17.5 18q-1.5 0-2.9.525T12 20m3.5-6V3l3-1v11zM7 11.525" />
            </svg>
          </div>
          <h2
            id={ctaTitleId}
            className="text-xl sm:text-3xl font-bold text-muted-foreground mb-10 sm:mb-12 text-center"
          >
            {ctaLabel}
          </h2>
          <Card className="bg-card max-w-3xl mx-auto shadow-md">
            <CardContent className="p-4 xs:p-6 md:p-10">
              <div className="md:flex md:items-center md:gap-8">
                <div className="mb-8 md:mb-0 md:flex-grow">
                  <p className={cn(
                    "text-foreground/90 max-w-xl text-left mb-6 font-headline",
                    language === "zh" ? "text-xl" : "text-lg sm:text-xl"
                  )}>
                    {ctaTextContent}
                  </p>
                  {articlesForFrontpageAccordion.length > 0 && (
                    <Accordion type="single" collapsible className="w-full">
                      {articlesForFrontpageAccordion.map((article) => (
                        <AccordionItem
                          value={article.slug}
                          key={article.slug}
                          className="border-x-0 border-t-0 first:border-t-0 last:border-b-0"
                        >
                          <AccordionTrigger className="text-base md:text-lg font-bold text-left hover:no-underline px-2 py-3.5">
                            <span className="flex-1 text-left">{article.title[language]}</span>
                          </AccordionTrigger>
                          <AccordionContent className="pt-2 pb-4 px-4">
                            <p className={cn(
                                "font-body",
                                "text-base sm:text-lg text-foreground/80 mb-4"
                              )}>
                              {article.description[language]}
                            </p>
                            <div className="flex justify-end">
                              <Button
                                asChild
                                variant="outline"
                                size="sm"
                                className="text-sm px-4 py-2 h-auto text-primary hover:bg-background hover:text-primary gap-1.5 shadow-sm hover:shadow-md"
                              >
                                <Link
                                  href={getLocalizedPath(
                                    `/article/${article.slug}`,
                                    language
                                  )}
                                >
                                  {ctaAccordionReadArticleText}
                                  <ChevronRight
                                    className="h-3.5 w-3.5"
                                    aria-hidden="true"
                                  />
                                </Link>
                              </Button>
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  )}
                </div>
                <div className="text-center md:text-right md:flex-shrink-0 flex md:items-center justify-center">
                  <Button
                    asChild
                    size="lg"
                    className="h-auto bg-secondary hover:bg-secondary/80 text-secondary-foreground rounded-full px-6 py-3 text-base sm:px-8 sm:py-4 sm:text-xl md:px-7 md:py-3.5 md:text-lg border transition-transform hover:scale-105 whitespace-nowrap md:w-auto shadow-md hover:shadow-lg"
                  >
                    <Link href={articlesPath}>
                      {ctaButtonArticlesText}
                      <Newspaper
                        className="ml-2 h-5 w-5 sm:h-6 sm:w-6"
                        aria-hidden="true"
                      />
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Network Listings Section */}
      <section
        className="py-12 sm:py-16 bg-gradient-to-r from-primary/10 to-accent/10 px-4 sm:px-6 lg:px-8"
        aria-labelledby={networkListingsTitleId}
      >
        <div className="container mx-auto">
          <div className="h-10 w-10 xs:h-12 xs:w-12 sm:h-14 sm:w-14 flex justify-center mb-3 sm:mb-6 mx-auto">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              className="w-full h-full"
            >
              <defs>
                <linearGradient id="gradient-network-icon" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" style={{ stopColor: 'hsl(202, 20%, 63%)' }} />
                  <stop offset="100%" style={{ stopColor: 'hsl(202, 20%, 55%)' }} />
                </linearGradient>
              </defs>
              <path fill="url(#gradient-network-icon)" d="M12 22q-2.075 0-3.9-.788t-3.175-2.137T2.788 15.9T2 12t.788-3.9t2.137-3.175T8.1 2.788T12 2t3.9.788t3.175 2.137T21.213 8.1T22 12t-.788 3.9t-2.137 3.175t-3.175 2.138T12 22m0-2q3.35 0 5.675-2.325T20 12q0-.175-.012-.363t-.013-.312q-.125.725-.675 1.2T18 13h-2q-.825 0-1.412-.587T14 11v-1h-4V8q0-.825.588-1.412T12 6h1q0-.575.313-1.012t.762-.713q-.5-.125-1.012-.2T12 4Q8.65 4 6.325 6.325T4 12h5q1.65 0 2.825 1.175T13 16v1h-3v2.75q.5.125.988.188T12 20" />
            </svg>
          </div>
          <h2
            id={networkListingsTitleId}
            className="text-xl sm:text-3xl font-bold text-muted-foreground mb-10 sm:mb-12 text-center"
          >
            {networkListingsLabel}
          </h2>
          <div className="grid sm:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            <ServiceCard
              title={network1TitleText}
              description={network1DescText}
              href="https://openpathcollective.org/clinicians/chislon-chow/"
            />
            <ServiceCard
              title={network2TitleText}
              description={network2DescText}
              href="https://www.asianmhc.org/therapists/chislon-chow/"
            />
            <ServiceCard
              title={network3TitleText}
              description={network3DescText}
              href="https://directory.iceeft.com/therapist-profile/chislon_chow_16442/"
            />
          </div>
        </div>
      </section>

      {/* Mental Health Crisis Information Section */}
      <section
        className="py-12 sm:py-16 bg-background px-4 sm:px-6 lg:px-8"
        aria-labelledby={crisisInfoTitleId}
      >
        <div className="container mx-auto">
          <div className="h-10 w-10 xs:h-12 xs:w-12 sm:h-14 sm:w-14 flex justify-center mb-3 sm:mb-6 mx-auto">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              className="w-full h-full"
            >
              <defs>
                <linearGradient id="gradient-crisis-icon" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" style={{ stopColor: 'hsl(202, 20%, 63%)' }} />
                  <stop offset="100%" style={{ stopColor: 'hsl(202, 20%, 55%)' }} />
                </linearGradient>
              </defs>
              <path fill="url(#gradient-crisis-icon)" d="M20 11q-.425 0-.712-.288T19 10t.288-.712T20 9t.713.288T21 10t-.288.713T20 11m-1-3V3h2v5zM9 12q-1.65 0-2.825-1.175T5 8t1.175-2.825T9 4t2.825 1.175T13 8t-1.175 2.825T9 12m-8 8v-2.8q0-.85.438-1.562T2.6 14.55q1.55-.775 3.15-1.162T9 13t3.25.388t3.15 1.162q.725.375 1.163 1.088T17 17.2V20zm2-2h12v-.8q0-.275-.137-.5t-.363-.35q-1.35-.675-2.725-1.012T9 15t-2.775.338T3.5 16.35q-.225.125-.363.35T3 17.2zm6-8q.825 0 1.413-.587T11 8t-.587-1.412T9 6t-1.412.588T7 8t.588 1.413T9 10m0 8" />
            </svg>
          </div>
          <h2
            id={crisisInfoTitleId}
            className="text-xl sm:text-3xl font-bold text-muted-foreground mb-10 sm:mb-12 text-center"
          >
            {crisisInfoLabel}
          </h2>
          <div className="grid sm:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
            <Card className="bg-accent/10 p-2 xs:p-6 md:p-8 h-full flex flex-col shadow-md">
              <CardHeader className="p-2 text-center">
                <AlertTriangle
                  className="w-8 h-8 mx-auto mb-0 sm:mb-2 text-accent"
                  aria-hidden="true"
                />
                <CardTitle className="text-lg text-foreground font-semibold font-headline mb-1">
                  {crisisCard1TitleText}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-2 flex-grow text-foreground/90 text-left">
                <p className={cn(
                    "mb-3 leading-relaxed font-headline text-xl"
                  )}>
                  {crisisCard1P1Text}
                </p>
                <p className={cn(
                    "leading-relaxed font-headline text-xl"
                  )}>
                  {crisisCard1P2Text}
                </p>
              </CardContent>
            </Card>
            <Card className="bg-primary/5 p-2 xs:p-6 md:p-8 h-full flex flex-col shadow-md">
              <CardHeader className="p-2 text-center">
                <Phone
                  className="w-8 h-8 mx-auto  mb-0 sm:mb-2 text-primary"
                  aria-hidden="true"
                />
                <CardTitle className="text-lg text-foreground font-semibold font-headline mb-1">
                  {crisisCard2TitleText}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-2 flex-grow text-foreground/90">
                <p className={cn(
                    "mb-3 text-xl leading-relaxed font-headline"
                  )}>
                  {crisisCard2P1Text}
                </p>
                <ul className={cn(
                    "list-disc pl-5 space-y-1.5 text-xl leading-relaxed font-headline"
                  )}>
                  {crisisHotlines.map((hotline) => {
                    const hotlineText = getTranslatedString(translations[hotline.key], language);
                    return (
                      <li key={hotline.key}>
                        <a
                          href={hotline.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-accent hover:underline"
                        >
                          {hotlineText}
                        </a>
                      </li>
                    );
                  })}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Page Bottom Section */}
      <section
        className="py-14 sm:py-20 w-full"
        aria-labelledby={pageBottomTitleId}
        style={{
          backgroundColor: "hsl(202, 10%, 92%)",
          backgroundImage: "url('/images/bg-waves-tiled.webp')",
          backgroundRepeat: "repeat",
          backgroundPosition: "0 100%"
        }}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2
            id={pageBottomTitleId}
            className={cn(
              "font-extrabold mb-4", 
              language === "zh"
                ? "text-lg xs:text-xl sm:text-4xl md:text-4xl"
                : "text-lg xs:text-2xl sm:text-2xl md:text-2xl"
            )}
            style={{ color: "hsl(202, 10%, 30%)" }}
          >
            {pageBottomSectionTitleText}
          </h2>
          <p
            className={cn( 
              "mb-4 xs:mb-6 sm:mb-8 max-w-2xl mx-auto",
              "text-base md:text-lg"
            )}
            style={{ color: "hsl(202, 10%, 60%)" }}
          >
            {pageBottomSectionSubtitleText}
          </p>
        </div>
      </section>
    </div>
  );
}

    

    
