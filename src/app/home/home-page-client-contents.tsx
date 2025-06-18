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
    <Card className="text-center transition-all duration-150 hover:border-primary rounded-lg bg-background h-full flex flex-col border overflow-hidden">
      <CardHeader className="p-2 pb-1">
        <CardTitle className="text-sm sm:text-lg font-headline font-semibold text-primary">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-grow p-2 pt-1">
        <p className="font-body text-foreground/80 leading-relaxed text-sm sm:text-base">
          {description}
        </p>
      </CardContent>
      {href && (
        <CardFooter className="p-2 pt-1 flex justify-end">
          <ExternalLink
            className="w-4 h-4 text-primary shrink-0"
            aria-hidden="true"
          />
        </CardFooter>
      )}
    </Card>
  );

  if (href) {
    return (
      <a href={href} rel="noopener noreferrer" className="block h-full">
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
  pinnedArticles: Article[];
}

export default function HomePageClientContents({
  pinnedArticles,
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

  const sortedPinnedArticles = useMemo(() => {
    if (!pinnedArticles) return [];
    return [...pinnedArticles].sort((a, b) => {
      const titleA = a.title[language] || "";
      const titleB = b.title[language] || "";
      return titleA.localeCompare(titleB, language, { sensitivity: "base" });
    });
  }, [pinnedArticles, language]);

  const psychotherapyApproachTitleId = "psychotherapy-approach-title";
  const networkListingsTitleId = "network-listings-title";
  const crisisInfoTitleId = "crisis-info-title";
  const ctaTitleId = "cta-title";

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

  const rawSectionPsychotherapyApproachLabel =
    translations.sectionPsychotherapyApproachLabel;
  const sectionPsychotherapyApproachLabelText =
    typeof rawSectionPsychotherapyApproachLabel === "object" &&
    rawSectionPsychotherapyApproachLabel !== null &&
    typeof rawSectionPsychotherapyApproachLabel[language] === "string"
      ? rawSectionPsychotherapyApproachLabel[language]
      : typeof rawSectionPsychotherapyApproachLabel === "string"
      ? rawSectionPsychotherapyApproachLabel
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

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section
        className="relative bg-gradient-to-t from-[#fbf1e5] to-[#f3e6d7] py-6 sm:py-10 w-full"
        aria-labelledby="hero-title-h1"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h1
            id="hero-title-h1"
            className="text-4xl sm:text-5xl lg:text-6xl font-bold font-headline text-foreground mb-1"
          >
            {heroTitleText}
          </h1>
          <p className="text-base sm:text-lg font-body text-foreground/80 mb-6 max-w-2xl mx-auto text-center">
            <span>{heroSubtitleDisplay}</span>
            <CanadaFlagIcon
              className="w-5 h-auto inline-block ml-1.5 align-middle"
              aria-hidden="true"
            />
          </p>
          <div className="flex flex-row flex-wrap items-center justify-center gap-1">
            <a
              href={dynamicMailtoLink}
              className="h-auto bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-4 py-2 text-xs font-headline border transition-transform hover:scale-105 whitespace-nowrap inline-flex items-center justify-center"
            >
              {heroButtonText}
              <Mail className="ml-2 h-4 w-4" aria-hidden="true" />
            </a>
            <Button
              asChild
              className="h-auto bg-secondary hover:bg-secondary/80 text-secondary-foreground rounded-full px-4 py-2 text-xs font-headline border transition-transform hover:scale-105 whitespace-nowrap"
            >
              <Link href={profilePath}>
                {heroButtonSecondaryText}
                <User className="ml-2 h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Psychotherapy Approach Section */}
      <section
        className="py-1 xs:py-4 sm:py-6 bg-background"
        aria-labelledby={psychotherapyApproachTitleId}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 id={psychotherapyApproachTitleId} className="sr-only">
            {sectionPsychotherapyApproachLabelText}
          </h2>
          <Card className="max-w-3xl mx-auto bg-[#eeeeee] p-1 sm:p-2 rounded-xl border">
            <CardContent className="p-1.5 sm:p-2.5 text-center">
              <p
                className={cn(
                  "font-body text-black mb-0.5 leading-normal",
                  language === "zh"
                    ? "text-base xs:text-lg sm:text-2xl"
                    : "text-sm xs:text-base sm:text-xl"
                )}
              >
                <Quote
                  className="inline-block w-4 h-4 text-primary/50 transform rotate-180 mr-1 mb-1 align-middle"
                  aria-hidden="true"
                />
                {welcomeTextContent}
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Network Listings Section */}
      <section
        className="py-6 sm:py-10 bg-secondary/30 px-4 sm:px-6 lg:px-8"
        aria-labelledby={networkListingsTitleId}
      >
        <div>
          <div className="flex justify-center mb-4 text-homeSectionHeading">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="72"
              width="72"
              viewBox="0 0 24 24"
            >
              <path
                fill="currentColor"
                d="M12 22q-2.075 0-3.9-.788t-3.175-2.137T2.788 15.9T2 12t.788-3.9t2.137-3.175T8.1 2.788T12 2t3.9.788t3.175 2.137T21.213 8.1T22 12t-.788 3.9t-2.137 3.175t-3.175 2.138T12 22m0-2q3.35 0 5.675-2.325T20 12q0-.175-.012-.363t-.013-.312q-.125.725-.675 1.2T18 13h-2q-.825 0-1.412-.587T14 11v-1h-4V8q0-.825.588-1.412T12 6h1q0-.575.313-1.012t.762-.713q-.5-.125-1.012-.2T12 4Q8.65 4 6.325 6.325T4 12h5q1.65 0 2.825 1.175T13 16v1h-3v2.75q.5.125.988.188T12 20"
              />
            </svg>
          </div>
          <h2
            id={networkListingsTitleId}
            className="text-lg sm:text-xl font-bold font-headline text-homeSectionHeading mb-1.5 sm:mb-3 text-center"
          >
            {networkListingsLabel}
          </h2>
          <div className="grid sm:grid-cols-3 gap-1.5">
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
        className="py-6 sm:py-10 bg-background px-4 sm:px-6 lg:px-8"
        aria-labelledby={crisisInfoTitleId}
      >
        <div>
          <div className="flex justify-center mb-4 text-homeSectionHeading">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="72"
              height="72"
              viewBox="0 0 24 24"
            >
              <path
                fill="currentColor"
                d="M20 11q-.425 0-.712-.288T19 10t.288-.712T20 9t.713.288T21 10t-.288.713T20 11m-1-3V3h2v5zM9 12q-1.65 0-2.825-1.175T5 8t1.175-2.825T9 4t2.825 1.175T13 8t-1.175 2.825T9 12m-8 8v-2.8q0-.85.438-1.562T2.6 14.55q1.55-.775 3.15-1.162T9 13t3.25.388t3.15 1.162q.725.375 1.163 1.088T17 17.2V20zm2-2h12v-.8q0-.275-.137-.5t-.363-.35q-1.35-.675-2.725-1.012T9 15t-2.775.338T3.5 16.35q-.225.125-.363.35T3 17.2zm6-8q.825 0 1.413-.587T11 8t-.587-1.412T9 6t-1.412.588T7 8t.588 1.413T9 10m0 8"
              />
            </svg>
          </div>
          <h2
            id={crisisInfoTitleId}
            className="text-lg sm:text-xl font-bold font-headline text-homeSectionHeading mb-1.5 sm:mb-3 text-center"
          >
            {crisisInfoLabel}
          </h2>
          <div className="grid sm:grid-cols-2 gap-1.5">
            <Card className="rounded-lg bg-background/80 p-1.5 border h-full flex flex-col">
              <CardHeader className="p-0.5 text-center">
                {/* Placeholder for Siren from Lucide */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-6 h-6 mx-auto mb-2 text-primary"
                  aria-hidden="true"
                >
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                  <line x1="12" y1="9" x2="12" y2="13"></line>
                  <line x1="12" y1="17" x2="12.01" y2="17"></line>
                </svg>
                <CardTitle className="text-sm sm:text-lg font-headline text-homeSectionHeading mb-0.5">
                  {crisisCard1TitleText}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0.5 flex-grow font-body text-foreground/90">
                <p className="mb-1 text-sm sm:text-base leading-relaxed">
                  {crisisCard1P1Text}
                </p>
                <p className="text-sm sm:text-base leading-relaxed">
                  {crisisCard1P2Text}
                </p>
              </CardContent>
            </Card>
            <Card className="rounded-lg bg-background/80 p-1.5 border h-full flex flex-col">
              <CardHeader className="p-0.5 text-center">
                {/* Placeholder for Phone from Lucide */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-6 h-6 mx-auto mb-2 text-primary"
                  aria-hidden="true"
                >
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                </svg>
                <CardTitle className="text-sm sm:text-lg font-headline text-homeSectionHeading mb-0.5">
                  {crisisCard2TitleText}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0.5 flex-grow font-body text-foreground/90">
                <p className="mb-1 text-sm sm:text-base leading-relaxed">
                  {crisisCard2P1Text}
                </p>
                <ul className="list-disc pl-4 space-y-0.25 text-sm sm:text-base leading-relaxed">
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

      {/* Call to Action Section */}
      <section
        className="py-8 sm:py-12 bg-gradient-to-r from-primary/10 to-accent/10"
        aria-labelledby={ctaTitleId}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center mb-4 text-homeSectionHeading">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="72"
              height="72"
              viewBox="0 0 24 24"
            >
              <path
                fill="currentColor"
                d="M11 17.05V7.2q-1.025-.6-2.175-.9T6.5 6q-.9 0-1.788.175T3 6.7v9.9q.875-.3 1.738-.45T6.5 16q1.175 0 2.288.263T11 17.05M12 20q-1.2-.95-2.6-1.475T6.5 18q-1.05 0-2.062.275T2.5 19.05q-.525.275-1.012-.025T1 18.15V6.1q0-.275.138-.525T1.55 5.2q1.15-.6 2.4-.9T6.5 4q1.85 0 3.15.425t2.8 1.3q.275.15.413.35T13 6.6v10.45q1.1-.525 2.213-.788T17.5 16q.9 0 1.763.15T21 16.6V4.575q.375.125.738.275t.712.35q.275.125.413.375T23 6.1v12.05q0 .575-.488.875t-1.012.025q-.925-.5-1.937-.775T17.5 18q-1.5 0-2.9.525T12 20m3.5-6V3l3-1v11zM7 11.525"
              />
            </svg>
          </div>
          <h2
            id={ctaTitleId}
            className="text-lg sm:text-xl font-bold font-headline text-homeSectionHeading mb-2 sm:mb-4 text-center"
          >
            {ctaLabel}
          </h2>
          <Card className="bg-background/80 border rounded-lg max-w-3xl mx-auto">
            <CardContent className="p-4 sm:p-6">
              <div className="sm:flex sm:items-center sm:gap-8">
                <div className="mb-6 sm:mb-0 sm:flex-grow">
                  <p className="text-sm sm:text-base font-body text-foreground/90 max-w-xl mx-auto sm:mx-0 mb-4 text-center sm:text-left">
                    {ctaTextContent}
                  </p>
                  {sortedPinnedArticles.length > 0 && (
                    <Accordion
                      type="single"
                      collapsible
                      className="w-full border-t border-b"
                    >
                      {sortedPinnedArticles.map((article) => (
                        <AccordionItem
                          value={article.slug}
                          key={article.slug}
                          className="border-x"
                        >
                          <AccordionTrigger className="text-sm sm:text-base font-semibold text-left hover:no-underline px-3 py-2.5">
                            {article.title[language]}
                          </AccordionTrigger>
                          <AccordionContent className="pt-1 pb-2 px-3">
                            <p className="text-sm sm:text-base font-body text-foreground/80 mb-2">
                              {article.description[language]}
                            </p>
                            <div className="flex justify-end">
                              <Button
                                asChild
                                variant="outline"
                                className="text-xs px-2 py-1 h-auto text-primary hover:bg-primary/10 hover:text-primary gap-1"
                              >
                                <Link
                                  href={getLocalizedPath(
                                    `/article/${article.slug}`,
                                    language
                                  )}
                                >
                                  {ctaAccordionReadArticleText}
                                  <ChevronRight
                                    className="h-3 w-3"
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
                <div className="text-center sm:text-right sm:flex-shrink-0 flex sm:items-center justify-center">
                  <Button
                    asChild
                    className="h-auto bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-4 py-2 text-xs font-headline border transition-transform hover:scale-105 whitespace-nowrap sm:w-auto"
                  >
                    <Link href={articlesPath}>
                      {ctaButtonArticlesText}
                      <Newspaper className="ml-2 h-4 w-4" aria-hidden="true" />
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
