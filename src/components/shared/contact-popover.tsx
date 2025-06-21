
"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Info, Mail, X } from "lucide-react";
import { useLanguage, type Language } from "@/contexts/language-context";
import { getTranslatedString } from "@/lib/translations";
import { useLayoutVisibility } from "@/contexts/layout-visibility-context";
import { cn } from "@/lib/utils";

export default function ContactPopover() {
  const { language, translations } = useLanguage();
  const { showLayoutElements } = useLayoutVisibility();
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [dynamicMailtoLink, setDynamicMailtoLink] = useState<string>("#");

  const contactEmailString = getTranslatedString(translations.contactEmailValue, language);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const emailAddress = contactEmailString;
    const subject = getTranslatedString(translations.heroMailSubject, language);
    const body = getTranslatedString(translations.heroMailBodyTemplate, language);

    const constructedLink = emailAddress
      ? `mailto:${emailAddress}?subject=${encodeURIComponent(
          subject
        )}&body=${encodeURIComponent(body)}`
      : "#";
    setDynamicMailtoLink(constructedLink);
  }, [language, translations, contactEmailString]);

  const getTranslatedText = (key: string): string => {
    if (!mounted) return "";
    return getTranslatedString(translations[key], language);
  };

  const triggerAriaLabel = getTranslatedText("contactPopoverLabel");
  const closeAriaLabel = getTranslatedText("contactPopoverCloseButtonLabel");
  const popoverTitleText = getTranslatedText("contactPopoverTitle");
  const profileImageAlt = getTranslatedText("contactPopoverProfileImageAlt");
  const emailButtonText = getTranslatedText("heroButton");

  const popoverTitleId = "contact-popover-title";

  return (
    <div
      className={cn("fixed bottom-4 left-4 z-50 contact-popover-container", {
        hidden: !showLayoutElements,
      })}
    >
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="secondary"
            size="icon"
            className="rounded-full shadow-lg border w-12 h-12 hover:bg-secondary opacity-75"
            aria-label={triggerAriaLabel}
            onClick={() => setIsOpen(true)}
          >
            <Info className="h-6 w-6" aria-hidden="true" />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className={cn(
            "w-full max-w-xs md:max-w-md mb-1 bg-background text-foreground relative font-headline",
            "shadow-xl"
            )}
          sideOffset={10}
          aria-labelledby={popoverTitleId}
        >
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-1 right-1 h-6 w-6 rounded-full text-muted-foreground hover:text-foreground"
            onClick={() => setIsOpen(false)}
            aria-label={closeAriaLabel}
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </Button>
          <div className="grid gap-3 pt-2">
            <div className="space-y-0.5">
              <h4
                id={popoverTitleId}
                className="font-medium leading-none text-foreground text-sm"
              >
                {popoverTitleText}
              </h4>
            </div>
            <div className="grid gap-2.5">
              <div className="flex justify-center mb-1">
                <div className="relative h-40 w-40 xs:h-56 xs:w-56">
                  <Image
                    src="/images/profile.webp"
                    alt={profileImageAlt}
                    fill
                    sizes="(max-width: 319px) 160px, 224px"
                    className="rounded-md object-cover"
                    data-ai-hint="person portrait"
                  />
                </div>
              </div>
              <div className="flex flex-col items-center space-y-1.5 text-center">
                <Button
                  asChild
                  className="h-auto bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-4 py-2 text-xs sm:px-5 sm:py-2.5 sm:text-sm border transition-transform hover:scale-105 whitespace-nowrap"
                >
                  <a href={dynamicMailtoLink}>
                    {emailButtonText}
                    <Mail
                      className="ml-1.5 h-3.5 w-3.5 sm:h-4 sm:w-4"
                      aria-hidden="true"
                    />
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
