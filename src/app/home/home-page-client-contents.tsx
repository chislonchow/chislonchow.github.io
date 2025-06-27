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
  ChevronRight,
  Handshake,
  LifeBuoy,
  DoorOpen,
  Ear,
  HeartHandshake,
  Wallet,
  Navigation,
  SearchCode,
  UserCog,
  FolderLock,
  DraftingCompass,
  MessageCircleQuestion,
  ChevronDown,
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
import parse from "html-react-parser";
import { remark } from "remark";
import remarkRehype from "remark-rehype";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";
import rehypeStringify from "rehype-stringify";
import { customSchema } from "@/lib/markdown-config";
import { parserOptions } from "@/lib/markdown-parser-options";
import { generateInquiryMailtoLink } from "@/lib/email-utils";

interface InfoCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

function InfoCard({ icon, title, description }: InfoCardProps) {
  return (
    <div className="flex flex-col items-center text-center p-1 sm:p-2">
      <div className="flex items-center justify-center bg-primary/10 rounded-full h-12 w-12 sm:h-16 sm:w-16 mb-4">
        {icon}
      </div>
      <h3 className="text-lg font-semibold font-headline text-foreground mb-2">
        {title}
      </h3>
      <p className="text-base text-muted-foreground">{description}</p>
    </div>
  );
}

interface ServiceHighlightCardProps {
  icon: React.ReactNode;
  title: string;
  description: React.ReactNode;
}

function ServiceHighlightCard({
  icon,
  title,
  description,
}: ServiceHighlightCardProps) {
  return (
    <Card className="h-full flex flex-col shadow-md bg-card/50">
      <CardHeader className="items-center pb-2 text-center">
        <div className="flex items-center justify-center rounded-full h-12 w-12 sm:h-16 sm:w-16 text-primary">
          {icon}
        </div>
        <CardTitle className="text-lg font-headline text-foreground flex items-center justify-center mt-4 mb-2">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-grow pt-2">
        <div className="text-base text-muted-foreground leading-relaxed service-glance-description">
          {description}
        </div>
      </CardContent>
    </Card>
  );
}

interface ApproachStepProps {
  icon: React.ReactNode;
  title: string;
  description: React.ReactNode; // Changed to React.ReactNode
  isLast?: boolean;
}

function ApproachStep({
  icon,
  title,
  description,
  isLast = false,
}: ApproachStepProps) {
  return (
    <div className="flex">
      {/* Icon Column */}
      <div className="flex flex-col items-center mr-4 sm:mr-6">
        <div>
          <div className="flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-primary/5 shrink-0 text-primary">
            {icon}
          </div>
        </div>
        {!isLast && <div className="w-px h-full min-h-[8rem] bg-border" />}
      </div>

      {/* Content Column */}
      <div className="pb-2">
        <h3 className="text-lg font-headline font-semibold text-foreground mb-1">
          {title}
        </h3>
        <div className="text-base text-muted-foreground approach-description">
          {description}
        </div>
      </div>
    </div>
  );
}

const ResourcesIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    className={cn("w-full h-full", className)}
  >
    <defs>
      <linearGradient id="gradient-cta-icon" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" style={{ stopColor: "hsl(202, 20%, 63%)" }} />
        <stop offset="100%" style={{ stopColor: "hsl(202, 20%, 55%)" }} />
      </linearGradient>
    </defs>
    <path
      fill="url(#gradient-cta-icon)"
      d="M11 17.05V7.2q-1.025-.6-2.175-.9T6.5 6q-.9 0-1.788.175T3 6.7v9.9q.875-.3-1.738-.45T6.5 16q1.175 0 2.288.263T11 17.05M12 20q-1.2-.95-2.6-1.475T6.5 18q-1.05 0-2.062.275T2.5 19.05q-.525.275-1.012-.025T1 18.15V6.1q0-.275.138-.525T1.55 5.2q1.15-.6 2.4-.9T6.5 4q1.85 0 3.15.425t2.8 1.3q.275.15.413.35T13 6.6v10.45q1.1-.525 2.213-.788T17.5 16q.9 0 1.763.15T21 16.6V4.575q.375.125.738.275t.712.35q.275.125.413.375T23 6.1v12.05q0 .575-.488.875t-1.012.025q-.925-.5-1.937-.775T17.5 18q-1.5 0-2.9.525T12 20m3.5-6V3l3-1v11zM7 11.525"
    />
  </svg>
);

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
  const faqPath = getLocalizedPath("/faq", language);

  const serviceFeesDescMarkdown = getTranslatedString(
    translations.serviceFeesDescMarkdown,
    language
  );
  const serviceLocationDescMarkdown = getTranslatedString(
    translations.serviceLocationDescMarkdown,
    language
  );
  const serviceFocusAreasDescMarkdown = getTranslatedString(
    translations.serviceFocusAreasDescMarkdown,
    language
  );
  const serviceQuestionsDescMarkdown = getTranslatedString(
    translations.serviceQuestionsDescMarkdown,
    language
  );
  const approach1DescMarkdown = getTranslatedString(
    translations.approach1Desc,
    language
  );
  const approach2DescMarkdown = getTranslatedString(
    translations.approach2Desc,
    language
  );
  const approach3DescMarkdown = getTranslatedString(
    translations.approach3Desc,
    language
  );

  const [serviceFeesHtml, setServiceFeesHtml] = useState("");
  const [serviceLocationHtml, setServiceLocationHtml] = useState("");
  const [serviceFocusAreasHtml, setServiceFocusAreasHtml] = useState("");
  const [serviceQuestionsHtml, setServiceQuestionsHtml] = useState("");
  const [approach1Html, setApproach1Html] = useState("");
  const [approach2Html, setApproach2Html] = useState("");
  const [approach3Html, setApproach3Html] = useState("");

  const handleScrollToNext = () => {
    const element = document.getElementById("free-consultation-section");
    if (element) {
      // The header is sticky and has a height of h-14 (56px).
      const headerOffset = 56;
      const elementPosition =
        element.getBoundingClientRect().top + window.scrollY;
      const offsetPosition = elementPosition - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    const processMarkdown = async () => {
      const processor = remark()
        .use(remarkRehype, { allowDangerousHtml: true })
        .use(rehypeRaw)
        .use(rehypeSanitize, customSchema)
        .use(rehypeStringify);

      const feesPromise = processor.process(serviceFeesDescMarkdown);
      const locationPromise = processor.process(serviceLocationDescMarkdown);
      const focusPromise = processor.process(serviceFocusAreasDescMarkdown);
      const questionsPromise = processor.process(serviceQuestionsDescMarkdown);
      const approach1Promise = processor.process(approach1DescMarkdown);
      const approach2Promise = processor.process(approach2DescMarkdown);
      const approach3Promise = processor.process(approach3DescMarkdown);

      const [
        feesFile,
        locationFile,
        focusFile,
        questionsFile,
        approach1File,
        approach2File,
        approach3File,
      ] = await Promise.all([
        feesPromise,
        locationPromise,
        focusPromise,
        questionsPromise,
        approach1Promise,
        approach2Promise,
        approach3Promise,
      ]);

      setServiceFeesHtml(String(feesFile));
      setServiceLocationHtml(String(locationFile));
      setServiceFocusAreasHtml(String(focusFile));
      setServiceQuestionsHtml(String(questionsFile));
      setApproach1Html(String(approach1File));
      setApproach2Html(String(approach2File));
      setApproach3Html(String(approach3File));
    };
    if (
      serviceFeesDescMarkdown &&
      serviceLocationDescMarkdown &&
      serviceFocusAreasDescMarkdown &&
      serviceQuestionsDescMarkdown
    ) {
      processMarkdown();
    }
  }, [
    language,
    serviceFeesDescMarkdown,
    serviceLocationDescMarkdown,
    serviceFocusAreasDescMarkdown,
    serviceQuestionsDescMarkdown,
    approach1DescMarkdown,
    approach2DescMarkdown,
    approach3DescMarkdown,
  ]);

  useEffect(() => {
    setDynamicMailtoLink(generateInquiryMailtoLink(translations, language));
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

  const freeConsultationTitleId = "free-consultation-title";
  const resourcesTitleId = "resources-title";
  const pageBottomTitleId = "page-bottom-title-h2";

  const heroSubtitleRawText = getTranslatedString(
    translations.heroSubtitle,
    language
  );
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
  const heroButtonSecondaryText = getTranslatedString(
    translations.heroButtonSecondary,
    language
  );

  const freeConsultationTitleText = getTranslatedString(
    translations.freeConsultationTitle,
    language
  );
  const freeConsultationSubtitleText = getTranslatedString(
    translations.freeConsultationSubtitle,
    language
  );
  const freeConsultationDescriptionText = getTranslatedString(
    translations.freeConsultationDescription,
    language
  );

  const whyChoosePsychotherapyTitleText = getTranslatedString(
    translations.whyChoosePsychotherapyTitle,
    language
  );
  const whyChooseCard1TitleText = getTranslatedString(
    translations.whyChooseCard1Title,
    language
  );
  const whyChooseCard1DescText = getTranslatedString(
    translations.whyChooseCard1Desc,
    language
  );
  const whyChooseCard2TitleText = getTranslatedString(
    translations.whyChooseCard2Title,
    language
  );
  const whyChooseCard2DescText = getTranslatedString(
    translations.whyChooseCard2Desc,
    language
  );
  const whyChooseCard3TitleText = getTranslatedString(
    translations.whyChooseCard3Title,
    language
  );
  const whyChooseCard3DescText = getTranslatedString(
    translations.whyChooseCard3Desc,
    language
  );
  const whyChooseCard4TitleText = getTranslatedString(
    translations.whyChooseCard4Title,
    language
  );
  const whyChooseCard4DescText = getTranslatedString(
    translations.whyChooseCard4Desc,
    language
  );

  const myApproachTitleText = getTranslatedString(
    translations.myApproachTitle,
    language
  );
  const approach1TitleText = getTranslatedString(
    translations.approach1Title,
    language
  );
  const approach2TitleText = getTranslatedString(
    translations.approach2Title,
    language
  );
  const approach3TitleText = getTranslatedString(
    translations.approach3Title,
    language
  );

  const serviceSectionTitleText = getTranslatedString(
    translations.serviceSectionTitle,
    language
  );
  const serviceFeesTitleText = getTranslatedString(
    translations.serviceFeesTitle,
    language
  );
  const serviceLocationTitleText = getTranslatedString(
    translations.serviceLocationTitle,
    language
  );
  const serviceFocusAreasTitleText = getTranslatedString(
    translations.serviceFocusAreasTitle,
    language
  );

  const serviceQuestionsTitleText = getTranslatedString(
    translations.serviceQuestionsTitle,
    language
  );
  const serviceQuestionsButtonFAQText = getTranslatedString(
    translations.serviceQuestionsButtonFAQ,
    language
  );
  const serviceQuestionsButtonEmailText = getTranslatedString(
    translations.serviceQuestionsButtonEmail,
    language
  );

  const resourcesSectionLabel = getTranslatedString(
    translations.sectionResourcesLabel,
    language
  );
  const resourcesTextContent = getTranslatedString(
    translations.resourcesTextContent,
    language
  );
  const resourcesAccordionReadArticleText = getTranslatedString(
    translations.resourcesAccordionReadArticleText,
    language
  );
  const resourcesButtonArticlesText = getTranslatedString(
    translations.resourcesButtonArticlesText,
    language
  );

  const pageBottomSectionTitleText = getTranslatedString(
    translations.pageBottomSectionTitle,
    language
  );
  const pageBottomSectionSubtitleText = getTranslatedString(
    translations.pageBottomSectionSubtitle,
    language
  );

  return (
    <div className="flex flex-col font-headline">
      {/* Hero Section */}
      <section
        className="relative pt-14 xs:pt-16 sm:pt-20 md:pt-20 pb-20 w-full bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('/images/bg-hero.webp'), linear-gradient(to top, hsl(33, 71%, 100%), hsl(33, 71%, 90%))`,
        }}
        aria-labelledby="hero-title-h1"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h1
            id="hero-title-h1"
            className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl font-black mb-4"
          >
            <span style={{ color: "hsl(202 25% 20%)" }}>Chislon</span>{" "}
            <span style={{ color: "hsl(202 25% 25%)" }}>Chow</span>
          </h1>
          <p
            className="text-base xs:text-lg sm:text-lg md:text-lg mb-4 xs:mb-6 sm:mb-8 max-w-2xl mx-auto font-light"
            style={{ color: "hsl(202 25% 25%)" }}
          >
            <span>{heroSubtitleDisplay}</span>
            <CanadaFlagIcon
              className="h-[0.8em] w-[1.6em] inline-block ml-1.5 align-middle"
              aria-hidden="true"
            />
          </p>
          <div className="flex flex-row flex-wrap items-center justify-center gap-3 sm:gap-4 pb-10">
            <Button
              asChild
              className="h-auto bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-5 py-2.5 text-base sm:px-6 sm:py-3 sm:text-lg transition-transform hover:scale-105 whitespace-nowrap shadow-md hover:shadow-lg"
            >
              <a href={dynamicMailtoLink}>
                {heroButtonText}
                <Mail
                  className="ml-2 h-4 w-4 sm:h-5 sm:w-5"
                  aria-hidden="true"
                />
              </a>
            </Button>
            <Button
              asChild
              className="h-auto bg-secondary hover:bg-secondary/80 text-secondary-foreground rounded-full px-5 py-2.5 text-base sm:px-6 sm:py-3 sm:text-lg transition-transform hover:scale-105 whitespace-nowrap shadow-md hover:shadow-lg"
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
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
          <button
            onClick={handleScrollToNext}
            className="rounded-full border p-2 text-gray-300 border-gray-300 transition-colors hover:text-white hover:border-white focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
            aria-label="Scroll to next section"
          >
            <ChevronDown className="h-6 w-6" />
          </button>
        </div>
      </section>

      {/* Free Consultation Section */}
      <section
        id="free-consultation-section"
        className="py-12 sm:py-16 w-full"
        style={{
          backgroundColor: "hsl(202, 10%, 92%)",
          backgroundImage: "url('/images/bg-waves-tiled.webp')",
          backgroundRepeat: "repeat",
          backgroundPosition: "0 100%",
        }}
        aria-labelledby={freeConsultationTitleId}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="max-w-3xl mx-auto shadow-md overflow-hidden bg-card/85">
            <CardContent className="p-6 md:p-8">
              <div className="flex flex-col sm:flex-row items-center sm:gap-6">
                <div className="mb-4 sm:mb-0 sm:shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 md:h-16 md:w-16">
                    <Handshake className="h-8 w-8 md:h-10 md:w-10 text-primary" />
                  </div>
                </div>
                <div className="text-center sm:text-left">
                  <h2
                    id={freeConsultationTitleId}
                    className="text-xl md:text-2xl font-bold font-headline text-foreground mb-2"
                  >
                    {freeConsultationTitleText}
                  </h2>
                  <p className="text-md md:text-lg text-accent font-headline">
                    {freeConsultationSubtitleText}
                  </p>
                </div>
              </div>
              <p className="text-base md:text-lg text-muted-foreground text-left mt-6">
                {freeConsultationDescriptionText}
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Why Talk Therapy? Section */}
      <section
        className="py-12 sm:py-16 bg-secondary"
        aria-labelledby="why-choose-title"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2
            id="why-choose-title"
            className="text-2xl md:text-3xl font-bold font-headline text-foreground mb-8 text-center"
          >
            {whyChoosePsychotherapyTitleText}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-2 gap-y-4 sm:gap-8 max-w-5xl mx-auto">
            <InfoCard
              icon={<Ear className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />}
              title={whyChooseCard1TitleText}
              description={whyChooseCard1DescText}
            />
            <InfoCard
              icon={<LifeBuoy className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />}
              title={whyChooseCard2TitleText}
              description={whyChooseCard2DescText}
            />
            <InfoCard
              icon={<DoorOpen className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />}
              title={whyChooseCard3TitleText}
              description={whyChooseCard3DescText}
            />
            <InfoCard
              icon={
                <FolderLock className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
              }
              title={whyChooseCard4TitleText}
              description={whyChooseCard4DescText}
            />
          </div>
        </div>
      </section>

      {/* Therapeutic Approach Section */}
      <section
        className="py-12 sm:py-16 bg-gradient-to-r from-primary/10 to-accent/10"
        aria-labelledby="my-approach-title"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2
            id="my-approach-title"
            className="text-2xl md:text-3xl font-bold font-headline text-foreground mb-12 text-center"
          >
            {myApproachTitleText}
          </h2>
          <div className="max-w-3xl mx-auto">
            <div className="grid grid-cols-1 gap-y-2">
              <ApproachStep
                icon={<HeartHandshake className="h-6 w-6 sm:h-8 sm:w-8" />}
                title={approach1TitleText}
                description={
                  <div className="markdown-content">
                    {parse(approach1Html, parserOptions)}
                  </div>
                }
              />
              <ApproachStep
                icon={<DraftingCompass className="h-6 w-6 sm:h-8 sm:w-8" />}
                title={approach2TitleText}
                description={
                  <div className="markdown-content">
                    {parse(approach2Html, parserOptions)}
                  </div>
                }
              />
              <ApproachStep
                icon={<UserCog className="h-6 w-6 sm:h-8 sm:w-8" />}
                title={approach3TitleText}
                description={
                  <div className="markdown-content">
                    {parse(approach3Html, parserOptions)}
                  </div>
                }
                isLast={true}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Psychotherapy Service Section */}
      <section
        className="py-12 sm:py-16 bg-secondary"
        aria-labelledby="psychotherapy-service-title"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2
            id="psychotherapy-service-title"
            className="text-2xl md:text-3xl font-bold font-headline text-foreground mb-12 text-center"
          >
            {serviceSectionTitleText}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
            <ServiceHighlightCard
              icon={<Wallet className="h-6 w-6 sm:h-8 sm:w-8" />}
              title={serviceFeesTitleText}
              description={
                <div className="markdown-content">
                  {parse(serviceFeesHtml, parserOptions)}
                </div>
              }
            />
            <ServiceHighlightCard
              icon={<Navigation className="h-6 w-6 sm:h-8 sm:w-8" />}
              title={serviceLocationTitleText}
              description={
                <div className="markdown-content">
                  {parse(serviceLocationHtml, parserOptions)}
                </div>
              }
            />
            <ServiceHighlightCard
              icon={<SearchCode className="h-6 w-6 sm:h-8 sm:w-8" />}
              title={serviceFocusAreasTitleText}
              description={
                <div className="markdown-content">
                  {parse(serviceFocusAreasHtml, parserOptions)}
                </div>
              }
            />
            <Card className="h-full flex flex-col shadow-md bg-card/75">
              <CardHeader className="items-center pb-2 text-center">
                <div className="flex items-center justify-center rounded-full h-12 w-12 sm:h-16 sm:w-16 text-primary">
                  <MessageCircleQuestion className="h-6 w-6 sm:h-8 sm:w-8" />
                </div>
                <CardTitle className="text-lg font-headline text-foreground flex items-center justify-center mt-4 mb-2">
                  {serviceQuestionsTitleText}
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-grow flex flex-col pt-2">
                <div className="text-base text-muted-foreground leading-relaxed text-left have-questions-description">
                  <div className="markdown-content">
                    {parse(serviceQuestionsHtml, parserOptions)}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col xs:flex-row gap-2 w-full justify-center items-center pt-2 pb-6 px-6">
                <Button
                  asChild
                  variant="outline"
                  className="w-full xs:w-auto transition-transform hover:scale-105 shadow-md hover:shadow-lg"
                >
                  <Link href={faqPath}>{serviceQuestionsButtonFAQText}</Link>
                </Button>
                <Button
                  asChild
                  className="w-full xs:w-auto transition-transform hover:scale-105 shadow-md hover:shadow-lg"
                >
                  <a href={dynamicMailtoLink}>
                    {serviceQuestionsButtonEmailText}
                  </a>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </section>

      {/* Resources Section */}
      <section
        className="py-12 sm:py-16 bg-gradient-to-r from-primary/10 to-accent/10 px-4 sm:px-6 lg:px-8"
        aria-labelledby={resourcesTitleId}
      >
        <div className="container mx-auto">
          <div className="h-10 w-10 xs:h-12 xs:h-12 sm:h-14 sm:w-14 flex justify-center mb-3 sm:mb-6 mx-auto">
            <ResourcesIcon />
          </div>
          <h2
            id={resourcesTitleId}
            className="text-2xl md:text-3xl font-bold mb-10 sm:mb-12 text-center"
            style={{ color: "hsl(202, 20%, 55%)" }}
          >
            {resourcesSectionLabel}
          </h2>
          <Card className="bg-card max-w-3xl mx-auto shadow-md">
            <CardContent className="p-4 xs:p-6 md:p-10">
              <p
                className={cn(
                  "text-left mb-6 font-headline",
                  "text-base",
                  "text-foreground/90"
                )}
              >
                {resourcesTextContent}
              </p>

              {articlesForFrontpageAccordion.length > 0 ? (
                <div className="flex flex-col">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-y-4 sm:gap-x-4">
                    <div className="flex-grow">
                      <Accordion type="single" collapsible className="w-full">
                        {articlesForFrontpageAccordion.map((article) => (
                          <AccordionItem
                            value={article.slug}
                            key={article.slug}
                            className="border-x-0 border-t-0 first:border-t-0 last:border-b-0"
                          >
                            <AccordionTrigger className="text-base md:text-lg font-bold text-left hover:no-underline px-2 py-3.5">
                              <span className="flex-1 text-left">
                                {article.title[language]}
                              </span>
                            </AccordionTrigger>
                            <AccordionContent className="pt-2 pb-4 px-4">
                              <p
                                className={cn(
                                  "text-base text-foreground/80 mb-4 font-body"
                                )}
                              >
                                {article.description[language]}
                              </p>
                              <div className="flex justify-end">
                                <Button
                                  asChild
                                  variant="outline"
                                  size="sm"
                                  className="text-sm px-4 py-2 h-auto text-primary gap-1.5 transition-transform hover:scale-105 shadow-md hover:shadow-lg"
                                >
                                  <Link
                                    href={getLocalizedPath(
                                      `/article/${article.slug}`,
                                      language
                                    )}
                                  >
                                    {resourcesAccordionReadArticleText}
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
                    </div>
                    <div className="flex-shrink-0 text-center sm:text-right">
                      <Button
                        asChild
                        variant="outline"
                        className="w-full xs:w-auto transition-transform hover:scale-105 shadow-md hover:shadow-lg"
                      >
                        <Link href={articlesPath}>
                          {resourcesButtonArticlesText}
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex-shrink-0 text-center sm:text-right flex justify-center sm:justify-end mt-6">
                  <Button
                    asChild
                    variant="outline"
                    className="w-full xs:w-auto transition-transform hover:scale-105 shadow-md hover:shadow-lg"
                  >
                    <Link href={articlesPath}>
                      {resourcesButtonArticlesText}
                    </Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
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
          backgroundPosition: "0 100%",
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
