
"use client";

import type React from "react";
import Image from "next/image";
import { useLanguage, type Language } from "@/contexts/language-context";
import type { StaticPageData } from "@/lib/static-page-data"; 

interface ContentPageClientLayoutProps {
  pageData: StaticPageData; 
  markdownEn: React.ReactNode;
  markdownZh: React.ReactNode;
}

export default function ContentPageClientLayout({
  pageData,
  markdownEn,
  markdownZh,
}: ContentPageClientLayoutProps) {
  const { language } = useLanguage(); 

  const {
    title: pageTitles, 
    feature_image_path,
    feature_image_alt, 
  } = pageData;

  const h1Title = pageTitles[language] || pageTitles.en; 

  const featureImageAltText = feature_image_alt?.[language] || 
                              (feature_image_path ? "Feature image" : "");

  return (
    <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8 min-h-[calc(100vh-10rem)]">
      <h1 className="text-2xl md:text-3xl font-bold font-headline text-foreground mb-8 text-center">
        {h1Title}
      </h1>

      {feature_image_path && (
        <div className="mb-8 flex justify-center">
          <div className="relative w-[60vw] max-w-[250px] border rounded-lg overflow-hidden">
            <Image
              src={feature_image_path}
              alt={featureImageAltText}
              width={250} 
              height={313}
              style={{ width: '100%', height: 'auto' }}
              sizes="(max-width: 768px) 60vw, 250px"
              priority={!!feature_image_path}
              data-ai-hint="person portrait" 
            />
          </div>
        </div>
      )}

      <div className="bg-background/50 p-3 xs:p-6 sm:p-8 md:p-12 rounded-xl max-w-4xl mx-auto border">
        {language === "en" ? markdownEn : markdownZh}
      </div>
    </div>
  );
}
