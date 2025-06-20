
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
import Link from "next/link";
import CanadaFlagIcon from "@/components/icons/canada-flag-icon";
import type { Article } from "@/lib/articles-data";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";

interface ServiceCardProps {
  title: string;
  description: string;
  href?: string;
}

const getLocalizedPath = (baseHref: string, lang: Language): string => {
  if (lang === "zh") {
    return baseHref === "/" ? "/zh" : `/zh${baseHref}`;
  }
  return baseHref;
};

function ServiceCard({ title, description, href }: ServiceCardProps) {
  const cardInnerContent = (
    <Card className="transition-all duration-150 hover:shadow-lg h-full flex flex-col overflow-hidden shadow-md bg-card">
      <CardHeader className="p-6 pb-3">
        <CardTitle className="text-sm xs:text-base md:text-base font-headline font-semibold text-primary">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-grow p-6 pt-0">
        <p className="font-body text-secondary-foreground leading-relaxed text-xs xs:text-sm md:text-base text-left">
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
  allArticles: Article[];
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

    const rawHeroMailSubject = translations.heroMailSubject;
    const emailSubject =
      typeof rawHeroMailSubject === "object" &&
      rawHeroMailSubject !== null &&
      typeof rawHeroMailSubject[language] === "string"
        ? rawHeroMailSubject[language]
        : typeof rawHeroMailSubject === "string"
          ? rawHeroMailSubject
          : "";

    const rawHeroMailBodyTemplate = translations.heroMailBodyTemplate;
    const emailBody =
      typeof rawHeroMailBodyTemplate === "object" &&
        rawHeroMailBodyTemplate !== null &&
        typeof rawHeroMailBodyTemplate[language] === "string"
        ? rawHeroMailBodyTemplate[language]
        : typeof rawHeroMailBodyTemplate === "string"
          ? rawHeroMailBodyTemplate
          : "";

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

  const rawHeroTitleText = translations.heroTitle;
  const heroTitleText =
    typeof rawHeroTitleText === "object" &&
    rawHeroTitleText !== null &&
    typeof rawHeroTitleText[language] === "string"
      ? rawHeroTitleText[language]
      : typeof rawHeroTitleText === "string"
        ? rawHeroTitleText
        : "";

  const rawHeroSubtitle = translations.heroSubtitle;
  const heroSubtitleRawText =
    typeof rawHeroSubtitle === "object" &&
      rawHeroSubtitle !== null &&
      typeof rawHeroSubtitle[language] === "string"
      ? rawHeroSubtitle[language]
      : typeof rawHeroSubtitle === "string"
        ? rawHeroSubtitle
        : "";

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

  const rawHeroButtonText = translations.heroButton;
  const heroButtonText =
    typeof rawHeroButtonText === "object" &&
      rawHeroButtonText !== null &&
      typeof rawHeroButtonText[language] === "string"
      ? rawHeroButtonText[language]
      : typeof rawHeroButtonText === "string"
        ? rawHeroButtonText
        : "";

  const rawHeroButtonSecondaryText = translations.heroButtonSecondary;
  const heroButtonSecondaryText =
    typeof rawHeroButtonSecondaryText === "object" &&
      rawHeroButtonSecondaryText !== null &&
      typeof rawHeroButtonSecondaryText[language] === "string"
      ? rawHeroButtonSecondaryText[language]
      : typeof rawHeroButtonSecondaryText === "string"
        ? rawHeroButtonSecondaryText
        : "";

  const rawPsychotherapyApproachSectionTitle = translations.psychotherapyApproachSectionTitle;
  const psychotherapyApproachSectionTitleText =
    typeof rawPsychotherapyApproachSectionTitle === "object" &&
    rawPsychotherapyApproachSectionTitle !== null &&
    typeof rawPsychotherapyApproachSectionTitle[language] === "string"
      ? rawPsychotherapyApproachSectionTitle[language]
      : typeof rawPsychotherapyApproachSectionTitle === "string"
        ? rawPsychotherapyApproachSectionTitle
        : "";

  const rawWelcomeTextContent = translations.welcomeText;
  const welcomeTextContent =
    typeof rawWelcomeTextContent === "object" &&
      rawWelcomeTextContent !== null &&
      typeof rawWelcomeTextContent[language] === "string"
      ? rawWelcomeTextContent[language]
      : typeof rawWelcomeTextContent === "string"
        ? rawWelcomeTextContent
        : "";

  const rawNetworkListingsLabel = translations.sectionNetworkListingsLabel;
  const networkListingsLabel =
    typeof rawNetworkListingsLabel === "object" &&
      rawNetworkListingsLabel !== null &&
      typeof rawNetworkListingsLabel[language] === "string"
      ? rawNetworkListingsLabel[language]
      : typeof rawNetworkListingsLabel === "string"
        ? rawNetworkListingsLabel
        : "";

  const rawNetwork1Title = translations.network1Title;
  const network1TitleText =
    typeof rawNetwork1Title === "object" &&
      rawNetwork1Title !== null &&
      typeof rawNetwork1Title[language] === "string"
      ? rawNetwork1Title[language]
      : typeof rawNetwork1Title === "string"
        ? rawNetwork1Title
        : "";

  const rawNetwork1Desc = translations.network1Desc;
  const network1DescText =
    typeof rawNetwork1Desc === "object" &&
      rawNetwork1Desc !== null &&
      typeof rawNetwork1Desc[language] === "string"
      ? rawNetwork1Desc[language]
      : typeof rawNetwork1Desc === "string"
        ? rawNetwork1Desc
        : "";

  const rawNetwork2Title = translations.network2Title;
  const network2TitleText =
    typeof rawNetwork2Title === "object" &&
      rawNetwork2Title !== null &&
      typeof rawNetwork2Title[language] === "string"
      ? rawNetwork2Title[language]
      : typeof rawNetwork2Title === "string"
        ? rawNetwork2Title
        : "";

  const rawNetwork2Desc = translations.network2Desc;
  const network2DescText =
    typeof rawNetwork2Desc === "object" &&
      rawNetwork2Desc !== null &&
      typeof rawNetwork2Desc[language] === "string"
      ? rawNetwork2Desc[language]
      : typeof rawNetwork2Desc === "string"
        ? rawNetwork2Desc
        : "";

  const rawNetwork3Title = translations.network3Title;
  const network3TitleText =
    typeof rawNetwork3Title === "object" &&
      rawNetwork3Title !== null &&
      typeof rawNetwork3Title[language] === "string"
      ? rawNetwork3Title[language]
      : typeof rawNetwork3Title === "string"
        ? rawNetwork3Title
        : "";

  const rawNetwork3Desc = translations.network3Desc;
  const network3DescText =
    typeof rawNetwork3Desc === "object" &&
      rawNetwork3Desc !== null &&
      typeof rawNetwork3Desc[language] === "string"
      ? rawNetwork3Desc[language]
      : typeof rawNetwork3Desc === "string"
        ? rawNetwork3Desc
        : "";

  const rawCrisisInfoLabel = translations.sectionCrisisInfoLabel;
  const crisisInfoLabel =
    typeof rawCrisisInfoLabel === "object" &&
      rawCrisisInfoLabel !== null &&
      typeof rawCrisisInfoLabel[language] === "string"
      ? rawCrisisInfoLabel[language]
      : typeof rawCrisisInfoLabel === "string"
        ? rawCrisisInfoLabel
        : "";

  const rawCrisisCard1Title = translations.crisisCard1Title;
  const crisisCard1TitleText =
    typeof rawCrisisCard1Title === "object" &&
      rawCrisisCard1Title !== null &&
      typeof rawCrisisCard1Title[language] === "string"
      ? rawCrisisCard1Title[language]
      : typeof rawCrisisCard1Title === "string"
        ? rawCrisisCard1Title
        : "";

  const rawCrisisCard1P1 = translations.crisisCard1P1;
  const crisisCard1P1Text =
    typeof rawCrisisCard1P1 === "object" &&
      rawCrisisCard1P1 !== null &&
      typeof rawCrisisCard1P1[language] === "string"
      ? rawCrisisCard1P1[language]
      : typeof rawCrisisCard1P1 === "string"
        ? rawCrisisCard1P1
        : "";

  const rawCrisisCard1P2 = translations.crisisCard1P2;
  const crisisCard1P2Text =
    typeof rawCrisisCard1P2 === "object" &&
      rawCrisisCard1P2 !== null &&
      typeof rawCrisisCard1P2[language] === "string"
      ? rawCrisisCard1P2[language]
      : typeof rawCrisisCard1P2 === "string"
        ? rawCrisisCard1P2
        : "";

  const rawCrisisCard2Title = translations.crisisCard2Title;
  const crisisCard2TitleText =
    typeof rawCrisisCard2Title === "object" &&
      rawCrisisCard2Title !== null &&
      typeof rawCrisisCard2Title[language] === "string"
      ? rawCrisisCard2Title[language]
      : typeof rawCrisisCard2Title === "string"
        ? rawCrisisCard2Title
        : "";

  const rawCrisisCard2P1 = translations.crisisCard2P1;
  const crisisCard2P1Text =
    typeof rawCrisisCard2P1 === "object" &&
      rawCrisisCard2P1 !== null &&
      typeof rawCrisisCard2P1[language] === "string"
      ? rawCrisisCard2P1[language]
      : typeof rawCrisisCard2P1 === "string"
        ? rawCrisisCard2P1
        : "";

  const rawCtaLabel = translations.sectionCtaLabel;
  const ctaLabel =
    typeof rawCtaLabel === "object" &&
      rawCtaLabel !== null &&
      typeof rawCtaLabel[language] === "string"
      ? rawCtaLabel[language]
      : typeof rawCtaLabel === "string"
        ? rawCtaLabel
        : "";

  const rawCtaTextContent = translations.ctaText;
  const ctaTextContent =
    typeof rawCtaTextContent === "object" &&
      rawCtaTextContent !== null &&
      typeof rawCtaTextContent[language] === "string"
      ? rawCtaTextContent[language]
      : typeof rawCtaTextContent === "string"
        ? rawCtaTextContent
        : "";

  const rawCtaAccordionReadArticleText = translations.ctaAccordionReadArticle;
  const ctaAccordionReadArticleText =
    typeof rawCtaAccordionReadArticleText === "object" &&
      rawCtaAccordionReadArticleText !== null &&
      typeof rawCtaAccordionReadArticleText[language] === "string"
      ? rawCtaAccordionReadArticleText[language]
      : typeof rawCtaAccordionReadArticleText === "string"
        ? rawCtaAccordionReadArticleText
        : "";

  const rawCtaButtonArticlesText = translations.ctaButtonArticles;
  const ctaButtonArticlesText =
    typeof rawCtaButtonArticlesText === "object" &&
      rawCtaButtonArticlesText !== null &&
      typeof rawCtaButtonArticlesText[language] === "string"
      ? rawCtaButtonArticlesText[language]
      : typeof rawCtaButtonArticlesText === "string"
        ? rawCtaButtonArticlesText
        : "";

  const rawPageBottomSectionTitle = translations.pageBottomSectionTitle;
  const pageBottomSectionTitleText =
    typeof rawPageBottomSectionTitle === "object" &&
    rawPageBottomSectionTitle !== null &&
    typeof rawPageBottomSectionTitle[language] === "string"
      ? rawPageBottomSectionTitle[language]
      : typeof rawPageBottomSectionTitle === "string"
        ? rawPageBottomSectionTitle
        : "";

  const rawPageBottomSectionSubtitle = translations.pageBottomSectionSubtitle;
  const pageBottomSectionSubtitleText =
    typeof rawPageBottomSectionSubtitle === "object" &&
      rawPageBottomSectionSubtitle !== null &&
      typeof rawPageBottomSectionSubtitle[language] === "string"
      ? rawPageBottomSectionSubtitle[language]
      : typeof rawPageBottomSectionSubtitle === "string"
        ? rawPageBottomSectionSubtitle
        : "";

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section
        className="relative bg-gradient-to-t from-[#fbf1e5] to-[#f3e6d7] pt-14 pb-4 xs:pt-16 sm:pt-20 sm:pb-5 md:pt-20 md:pb-7 w-full"
        aria-labelledby="hero-title-h1"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h1
            id="hero-title-h1"
            className="text-2xl xs:text-4xl sm:text-5xl md:text-6xl font-extrabold font-headline text-foreground mb-4"
          >
            {heroTitleText}
          </h1>
          <p className="text-xs xs:text-sm sm:text-base md:text-lg font-body text-foreground/80 mb-4 xs:mb-6 sm:mb-8 max-w-2xl mx-auto">
            <span>{heroSubtitleDisplay}</span>
            <CanadaFlagIcon
              className="h-[0.8em] w-[1.6em] inline-block ml-1.5 align-middle"
              aria-hidden="true"
            />
          </p>
          <div className="flex flex-row flex-wrap items-center justify-center gap-3 sm:gap-4 pb-20">
            <a
              href={dynamicMailtoLink}
              className="h-auto bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-4 py-2 text-xs sm:px-5 sm:py-2.5 sm:text-base font-headline border transition-transform hover:scale-105 whitespace-nowrap inline-flex items-center justify-center shadow-md hover:shadow-lg"
            >
              {heroButtonText}
              <Mail
                className="ml-2 h-2.5 w-2.5 sm:h-4 sm:w-4"
                aria-hidden="true"
              />
            </a>
            <Button
              asChild
              className="h-auto bg-secondary hover:bg-secondary/80 text-secondary-foreground rounded-full px-4 py-2 text-xs sm:px-5 sm:py-2.5 sm:text-base font-headline border transition-transform hover:scale-105 whitespace-nowrap shadow-md hover:shadow-lg"
            >
              <Link href={profilePath}>
                {heroButtonSecondaryText}
                <User
                  className="ml-2 h-2.5 w-2.5 sm:h-4 sm:w-4"
                  aria-hidden="true"
                />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Psychotherapy Approach Section */}
      <section
        className="pt-20 pb-20 sm:pt-28 sm:pb-28 bg-gradient-to-r from-primary/10 to-accent/10"
        aria-labelledby={psychotherapyApproachTitleId}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2
            id={psychotherapyApproachTitleId}
            className="max-w-3xl mx-auto text-xl sm:text-3xl font-bold font-headline text-muted-foreground mb-4 text-left"
          >
            {psychotherapyApproachSectionTitleText}
          </h2>
          <Card className="max-w-3xl mx-auto bg-primary/10 p-4 xs:p-8 md:p-10 shadow-md">
            <CardContent className="p-0 text-left">
              <p
                className={cn(
                  "font-body text-[hsl(202,40%,30%)] mb-0.5 leading-normal",
                  language === "zh"
                    ? "text-base xs:text-lg sm:text-xl md:text-2xl"
                    : "text-sm xs:text-base sm:text-lg md:text-xl"
                )}
              >
                <Quote
                  className={cn(
                    "inline-block text-primary/50 transform rotate-180 mr-2 mb-1 align-middle",
                    language === "zh"
                      ? "w-4 h-4 xs:w-5 xs:h-5 sm:w-5 sm:h-5 md:w-6 md:h-6"
                      : "w-3 h-3 xs:w-4 xs:h-4 sm:w-4 sm:h-4 md:w-5 md:h-5"
                  )}
                  aria-hidden="true"
                />
                {welcomeTextContent}
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
          <div className="h-10 w-10 xs:h-12 xs:w-12 sm:h-14 sm:w-14 flex justify-center mb-3 sm:mb-6 text-muted-foreground mx-auto">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-full h-full"
            >
              <path d="M11 17.05V7.2q-1.025-.6-2.175-.9T6.5 6q-.9 0-1.788.175T3 6.7v9.9q.875-.3 1.738-.45T6.5 16q1.175 0 2.288.263T11 17.05M12 20q-1.2-.95-2.6-1.475T6.5 18q-1.05 0-2.062.275T2.5 19.05q-.525.275-1.012-.025T1 18.15V6.1q0-.275.138-.525T1.55 5.2q1.15-.6 2.4-.9T6.5 4q1.85 0 3.15.425t2.8 1.3q.275.15.413.35T13 6.6v10.45q1.1-.525 2.213-.788T17.5 16q.9 0 1.763.15T21 16.6V4.575q.375.125.738.275t.712.35q.275.125.413.375T23 6.1v12.05q0 .575-.488.875t-1.012.025q-.925-.5-1.937-.775T17.5 18q-1.5 0-2.9.525T12 20m3.5-6V3l3-1v11zM7 11.525" />
            </svg>
          </div>
          <h2
            id={ctaTitleId}
            className="text-xl sm:text-3xl font-bold font-headline text-muted-foreground mb-10 sm:mb-12 text-center"
          >
            {ctaLabel}
          </h2>
          <Card className="bg-card max-w-3xl mx-auto shadow-md">
            <CardContent className="p-4 xs:p-6 md:p-10">
              <div className="md:flex md:items-center md:gap-8">
                <div className="mb-8 md:mb-0 md:flex-grow">
                  <p className="text-sm md:text-lg font-body text-foreground/90 max-w-xl mx-auto md:mx-0 mb-6 text-center md:text-left">
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
                          <AccordionTrigger className="text-xs md:text-sm font-bold text-left hover:no-underline px-2 py-3.5">
                            {article.title[language]}
                          </AccordionTrigger>
                          <AccordionContent className="pt-2 pb-4 px-4">
                            <p className="text-xs md:text-base font-body text-foreground/80 mb-4">
                              {article.description[language]}
                            </p>
                            <div className="flex justify-end">
                              <Button
                                asChild
                                variant="outline"
                                size="sm"
                                className="text-sm px-4 py-2 h-auto text-primary hover:bg-primary/10 hover:text-primary gap-1.5 shadow-sm hover:shadow-md"
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
                    className="h-auto bg-secondary hover:bg-secondary/80 text-secondary-foreground rounded-full px-4 py-2 text-xs sm:px-7 sm:py-3.5 sm:text-base md:px-7 md:py-3.5 md:text-lg font-headline border transition-transform hover:scale-105 whitespace-nowrap md:w-auto shadow-md hover:shadow-lg"
                  >
                    <Link href={articlesPath}>
                      {ctaButtonArticlesText}
                      <Newspaper
                        className="ml-2 h-2.5 w-2.5 sm:h-4 sm:w-4"
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
          <div className="h-10 w-10 xs:h-12 xs:w-12 sm:h-14 sm:w-14 flex justify-center mb-3 sm:mb-6 text-muted-foreground mx-auto">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-full h-full"
            >
              <path d="M12 22q-2.075 0-3.9-.788t-3.175-2.137T2.788 15.9T2 12t.788-3.9t2.137-3.175T8.1 2.788T12 2t3.9.788t3.175 2.137T21.213 8.1T22 12t-.788 3.9t-2.137 3.175t-3.175 2.138T12 22m0-2q3.35 0 5.675-2.325T20 12q0-.175-.012-.363t-.013-.312q-.125.725-.675 1.2T18 13h-2q-.825 0-1.412-.587T14 11v-1h-4V8q0-.825.588-1.412T12 6h1q0-.575.313-1.012t.762-.713q-.5-.125-1.012-.2T12 4Q8.65 4 6.325 6.325T4 12h5q1.65 0 2.825 1.175T13 16v1h-3v2.75q.5.125.988.188T12 20" />
            </svg>
          </div>
          <h2
            id={networkListingsTitleId}
            className="text-xl sm:text-3xl font-bold font-headline text-muted-foreground mb-10 sm:mb-12 text-center"
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
          <div className="h-10 w-10 xs:h-12 xs:w-12 sm:h-14 sm:w-14 flex justify-center mb-3 sm:mb-6 text-muted-foreground mx-auto">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-full h-full"
            >
              <path d="M20 11q-.425 0-.712-.288T19 10t.288-.712T20 9t.713.288T21 10t-.288.713T20 11m-1-3V3h2v5zM9 12q-1.65 0-2.825-1.175T5 8t1.175-2.825T9 4t2.825 1.175T13 8t-1.175 2.825T9 12m-8 8v-2.8q0-.85.438-1.562T2.6 14.55q1.55-.775 3.15-1.162T9 13t3.25.388t3.15 1.162q.725.375 1.163 1.088T17 17.2V20zm2-2h12v-.8q0-.275-.137-.5t-.363-.35q-1.35-.675-2.725-1.012T9 15t-2.775.338T3.5 16.35q-.225.125-.363.35T3 17.2zm6-8q.825 0 1.413-.587T11 8t-.587-1.412T9 6t-1.412.588T7 8t.588 1.413T9 10m0 8" />
            </svg>
          </div>
          <h2
            id={crisisInfoTitleId}
            className="text-xl sm:text-3xl font-bold font-headline text-muted-foreground mb-10 sm:mb-12 text-center"
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
                <CardTitle className="text-base xs:text-lg md:text-lg font-headline text-foreground font-semibold mb-1">
                  {crisisCard1TitleText}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-2 flex-grow font-body text-foreground/90 text-left">
                <p className="mb-3 text-xs xs:text-sm md:text-base leading-relaxed">
                  {crisisCard1P1Text}
                </p>
                <p className="text-xs xs:text-sm md:text-base leading-relaxed">
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
                <CardTitle className="text-base xs:text-lg md:text-lg font-headline text-foreground font-semibold mb-1">
                  {crisisCard2TitleText}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-2 flex-grow font-body text-foreground/90">
                <p className="mb-3 text-xs xs:text-sm md:text-base leading-relaxed">
                  {crisisCard2P1Text}
                </p>
                <ul className="list-disc pl-5 space-y-1.5 text-xs xs:text-sm md:text-base leading-relaxed">
                  {crisisHotlines.map((hotline) => {
                    const rawHotlineText = translations[hotline.key];
                    const hotlineText =
                      typeof rawHotlineText === "object" &&
                        rawHotlineText !== null &&
                        typeof rawHotlineText[language] === "string"
                        ? rawHotlineText[language]
                        : typeof rawHotlineText === "string"
                          ? rawHotlineText
                          : "";
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
        style={{ backgroundColor: "hsl(202, 10%, 92%)" }}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2
            id={pageBottomTitleId}
            className={cn(
              "font-extrabold font-headline mb-4",
              language === "zh"
                ? "text-2xl xs:text-4xl sm:text-5xl md:text-6xl"
                : "text-lg xs:text-2xl sm:text-3xl md:text-4xl"
            )}
            style={{ color: "hsl(202, 10%, 30%)" }}
          >
            {pageBottomSectionTitleText}
          </h2>
          <p
            className={cn(
              "font-body mb-4 xs:mb-6 sm:mb-8 max-w-2xl mx-auto",
              language === "zh"
                ? "text-base xs:text-lg sm:text-xl md:text-2xl"
                : "text-xs xs:text-sm sm:text-base md:text-lg"
            )}
            style={{ color: "hsl(202, 10%, 50%)" }}
          >
            {pageBottomSectionSubtitleText}
          </p>
        </div>
      </section>
    </div>
  );
}

