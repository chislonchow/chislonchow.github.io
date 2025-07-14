
"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useLanguage } from "@/contexts/language-context";
import type { StaticPageData } from "@/lib/static-page-data";
import { Card, CardContent } from "@/components/ui/card";
import { remark } from "remark";
import remarkRehype from "remark-rehype";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";
import rehypeStringify from "rehype-stringify";
import behead from "remark-behead";
import parse from "html-react-parser";
import { customSchema } from "@/lib/markdown-config";
import { parserOptions } from "@/lib/markdown-parser-options";


interface ProfilePageClientProps {
  pageData: StaticPageData;
}

// Function to split the markdown content
function splitMarkdownIntoHtml(
  fullHtml: string
): { introHtml: string; mainHtml: string } {
  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = fullHtml;

  const firstParagraph = tempDiv.querySelector("p");
  let introHtml = "";

  if (firstParagraph) {
    introHtml = firstParagraph.outerHTML;
    firstParagraph.remove();
  }

  const mainHtml = tempDiv.innerHTML;

  return { introHtml, mainHtml };
}

export default function ProfilePageClient({ pageData }: ProfilePageClientProps) {
  const { language } = useLanguage();
  const [introHtml, setIntroHtml] = useState("");
  const [mainHtml, setMainHtml] = useState("");

  const {
    title: pageTitles,
    feature_image_path,
    feature_image_alt,
    markdown_content,
  } = pageData;

  useEffect(() => {
    const processMarkdown = async () => {
      if (
        !markdown_content ||
        typeof markdown_content[language] !== "string"
      ) {
        setIntroHtml("");
        setMainHtml("");
        return;
      }

      const processor = remark()
        .use(behead, { depth: 1 })
        .use(remarkRehype, { allowDangerousHtml: true })
        .use(rehypeRaw)
        .use(rehypeSanitize, customSchema)
        .use(rehypeStringify);

      const fullHtmlResult = await processor.process(
        markdown_content[language]
      );
      const fullHtml = fullHtmlResult.toString();

      if (typeof window !== "undefined") {
        const { introHtml, mainHtml } = splitMarkdownIntoHtml(fullHtml);
        setIntroHtml(introHtml);
        setMainHtml(mainHtml);
      }
    };

    processMarkdown();
  }, [language, markdown_content]);

  if (!pageData) {
    return null;
  }

  const h1Title = pageTitles[language] || pageTitles.en;
  const featureImageAltText =
    feature_image_alt?.[language] ||
    (feature_image_path ? "Feature image" : "");

  return (
    <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8 min-h-[calc(100vh-10rem)]">
      <h1 className="text-2xl md:text-3xl font-bold font-headline text-foreground mb-8 text-center">
        {h1Title}
      </h1>

      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:gap-8 mb-8">
          {/* Image Column */}
          {feature_image_path && (
            <div className="flex-shrink-0 w-full sm:w-auto flex justify-center sm:justify-start mb-6 sm:mb-0">
              <div className="relative w-[60vw] max-w-[250px] sm:w-[250px]">
                <Image
                  src={feature_image_path}
                  alt={featureImageAltText}
                  width={250}
                  height={313}
                  style={{ width: "100%", height: "auto" }}
                  sizes="(max-width: 768px) 60vw, 250px"
                  priority={!!feature_image_path}
                  data-ai-hint="person portrait"
                  className="border rounded-lg"
                />
              </div>
            </div>
          )}

          {/* Intro Text Card */}
          {introHtml && (
            <div className="flex-grow">
              <Card className="bg-primary/5 h-full">
                <CardContent className="p-6">
                  <div className="markdown-content">
                    {parse(introHtml, parserOptions)}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        {/* Main Content */}
        {mainHtml && (
          <div className="bg-background/50 p-3 xs:p-6 sm:p-8 md:p-12 rounded-xl border">
            <div className="markdown-content">
              {parse(mainHtml, parserOptions)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
