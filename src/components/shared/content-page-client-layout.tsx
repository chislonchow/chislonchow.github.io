"use client";

import type React from "react";
import { useLanguage, type Language } from "@/contexts/language-context";

interface ContentPageClientLayoutProps {
  titleKey: "profile" | "faq";
  defaultTitleEn: string;
  defaultTitleZh: string;
  markdownEn: React.ReactNode;
  markdownZh: React.ReactNode;
}

export default function ContentPageClientLayout({
  titleKey,
  defaultTitleEn,
  defaultTitleZh,
  markdownEn,
  markdownZh,
}: ContentPageClientLayoutProps) {
  const { language, translations } = useLanguage();

  const rawTitle = translations[titleKey];
  const title =
    typeof rawTitle === "object" &&
    rawTitle !== null &&
    typeof rawTitle[language] === "string"
      ? rawTitle[language]
      : typeof rawTitle === "string"
      ? rawTitle
      : language === "en"
      ? defaultTitleEn
      : defaultTitleZh; // Fallback to pageData is acceptable here

  return (
    <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8 min-h-[calc(100vh-10rem)]">
      <h1 className="text-2xl md:text-3xl font-bold font-headline text-foreground mb-8 text-center">
        {title}
      </h1>
      <div className="bg-background/50 p-3 xs:p-6 sm:p-8 md:p-12 rounded-xl max-w-4xl mx-auto border">
        {language === "en" ? markdownEn : markdownZh}
      </div>
    </div>
  );
}
