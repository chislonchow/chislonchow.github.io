
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
    feature_image_base_width, 
    feature_image_base_height, 
    feature_image_mobile_width,
    // feature_image_priority is removed
  } = pageData;

  const h1Title = pageTitles[language] || pageTitles.en; 

  const featureImageAltText = feature_image_alt?.[language] || 
                              (feature_image_path ? "Feature image" : "");

  const baseWidthToUse = feature_image_base_width; 
  const mobileWidthToUse = feature_image_mobile_width;
  const actualBaseHeight = feature_image_base_height || baseWidthToUse; // Default height to width if not specified

  const containerStyle: React.CSSProperties = {};
  let imageSizesProp = "";

  if (feature_image_path && baseWidthToUse && mobileWidthToUse) {
    Object.assign(containerStyle, {
      position: 'relative',
      display: 'block',
      margin: '0 auto 2rem auto', 
      borderRadius: 'var(--radius)', 
      border: '1px solid hsl(var(--border))', 
      overflow: 'hidden', 
      width: mobileWidthToUse, 
      maxWidth: baseWidthToUse, 
      ['--feature-image-final-base-width' as string]: baseWidthToUse,
      ['--feature-image-final-base-height' as string]: actualBaseHeight,
    });

    try {
      const baseWNum = parseInt(baseWidthToUse.replace('px', ''));
      const actualHNum = parseInt((actualBaseHeight || baseWidthToUse).replace('px', ''));
      if (baseWNum > 0 && actualHNum > 0) {
        containerStyle.aspectRatio = `${baseWNum} / ${actualHNum}`;
      } else {
        containerStyle.aspectRatio = '1 / 1'; 
      }
    } catch (e) {
      containerStyle.aspectRatio = '1 / 1'; 
    }
    imageSizesProp = `(max-width: 319px) ${mobileWidthToUse}, ${baseWidthToUse}`;
  }
  
  return (
    <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8 min-h-[calc(100vh-10rem)]">
      <h1 className="text-2xl md:text-3xl font-bold font-headline text-foreground mb-8 text-center">
        {h1Title}
      </h1>

      {feature_image_path && baseWidthToUse && mobileWidthToUse && (
        <div className="feature-image-container" style={containerStyle}>
          <Image
            src={feature_image_path}
            alt={featureImageAltText}
            fill
            className="object-cover"
            sizes={imageSizesProp}
            priority={!!feature_image_path} // Set priority to true if feature_image_path exists
            data-ai-hint="person portrait" 
          />
        </div>
      )}

      <div className="bg-background/50 p-3 xs:p-6 sm:p-8 md:p-12 rounded-xl max-w-4xl mx-auto border">
        {language === "en" ? markdownEn : markdownZh}
      </div>
    </div>
  );
}
