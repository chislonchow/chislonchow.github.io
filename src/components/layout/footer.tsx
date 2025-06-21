
"use client";

import React, { useState, useEffect } from 'react';
import { Separator } from "@/components/ui/separator";
import { useLanguage, type Language } from '@/contexts/language-context';
import { getTranslatedString } from '@/lib/translations';

const YouTubeIcon = ({ "aria-hidden": ariaHidden = true }: { "aria-hidden"?: boolean }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="36" height="32" viewBox="0 0 576 512" aria-hidden={ariaHidden} focusable="false"><path fill="currentColor" d="M549.655 124.083c-6.281-23.65-24.787-42.276-48.284-48.597C458.781 64 288 64 288 64S117.22 64 74.629 75.486c-23.497 6.322-42.003 24.947-48.284 48.597C11.412 132.305 11.412 132.305 11.412 256s0 89.438 11.412 132.305c6.281 23.65 24.787 41.5 48.284 47.821C117.22 448 288 448 288 448s170.78 0 213.371-11.486c23.497-6.321 42.003-24.171 48.284-47.821C560.345 389.438 560.345 256 560.345 256S560.345 132.305 549.655 124.083zM232.491 336.508V175.185l142.739 80.662L232.491 336.508z"/></svg>
);

const BlueskyIcon = ({ "aria-hidden": ariaHidden = true }: { "aria-hidden"?: boolean }) => (
  <svg viewBox="0 0 512 512" fill="currentColor" className="w-7 h-7" aria-hidden={ariaHidden} focusable="false">
    <path fill="currentColor" d="M111.8 62.2C170.2 105.9 233 194.7 256 242.4c23-47.6 85.8-136.4 144.2-180.2 42.1-31.6 110.3-56 110.3 21.8 0 15.5-8.9 130.5-14.1 149.2-18.2 64.8-84.4 81.4-143.3 71.3C456 322 482.2 380 425.6 438c-107.4 110.2-154.3-27.6-166.3-62.9-1.7-4.9-2.6-7.8-3.3-7.8s-1.6 3-3.3 7.8c-12 35.3-59 173.1-166.3 62.9-56.5-58-30.4-116 72.5-133.5C100 314.6 33.8 298 15.7 233.1 10.4 214.4 1.5 99.4 1.5 83.9c0-77.8 68.2-53.4 110.3-21.8z"></path>
  </svg>
);

const ThreadsIcon = ({ "aria-hidden": ariaHidden = true }: { "aria-hidden"?: boolean }) => (
  <svg viewBox="0 0 448 512" fill="currentColor" className="w-7 h-7" aria-hidden={ariaHidden} focusable="false">
    <path fill="currentColor" d="M331.5 235.7c2.2.9 4.2 1.9 6.3 2.8 29.2 14.1 50.6 35.2 61.8 61.4 15.7 36.5 17.2 95.8-30.3 143.2-36.2 36.2-80.3 52.5-142.6 53h-.3c-70.2-.5-124.1-24.1-160.4-70.2-32.3-41-48.9-98.1-49.5-169.6v-.5c.5-71.5 17.1-128.6 49.4-169.6 36.3-46.1 90.3-69.7 160.5-70.2h.3c70.3.5 124.9 24 162.3 69.9 18.4 22.7 32 50 40.6 81.7l-40.4 10.8c-7.1-25.8-17.8-47.8-32.2-65.4-29.2-35.8-73-54.2-130.5-54.6-57 .5-100.1 18.8-128.2 54.4C72.1 146.1 58.5 194.3 58 256c.5 61.7 14.1 109.9 40.3 143.3 28 35.6 71.2 53.9 128.2 54.4 51.4-.4 85.4-12.6 113.7-40.9 32.3-32.2 31.7-71.8 21.4-95.9-6.1-14.2-17.1-26-31.9-34.9-3.7 26.9-11.8 48.3-24.7 64.8-17.1 21.8-41.4 33.6-72.7 35.3-23.6 1.3-46.3-4.4-63.9-16-20.8-13.8-33-34.8-34.3-59.3-2.5-48.3 35.7-83 95.2-86.4 21.1-1.2 40.9-.3 59.2 2.8-2.4-14.8-7.3-26.6-14.6-35.2-10-11.7-25.6-17.7-46.2-17.8h-.7c-16.6 0-39 4.6-53.3 26.3l-34.4-23.6c19.2-29.1 50.3-45.1 87.8-45.1h.8c62.6.4 99.9 39.5 103.7 107.7l-.2.2zm-156 68.8c1.3 25.1 28.4 36.8 54.6 35.3 25.6-1.4 54.6-11.4 59.5-73.2-13.2-2.9-27.8-4.4-43.4-4.4-4.8 0-9.6.1-14.4.4-42.9 2.4-57.2 23.2-56.2 41.8z"></path>
  </svg>
);

const BloggerIcon = ({ "aria-hidden": ariaHidden = true }: { "aria-hidden"?: boolean }) => (
  <svg viewBox="-2 -2 24 24" fill="currentColor" className="w-7 h-7" aria-hidden={ariaHidden} focusable="false">
    <g fill="currentColor"><path d="M11.81 15c1.744 0 3.16-1.42 3.17-3.154L15 9.293l-.03-.14-.083-.174-.142-.11c-.184-.144-1.116.01-1.367-.218-.178-.163-.206-.456-.26-.855-.1-.771-.163-.811-.284-1.073-.44-.929-1.63-1.627-2.448-1.723H8.169A3.174 3.174 0 0 0 5 8.16v3.686C5 13.58 6.426 15 8.17 15zm-3.6-7.419h1.757c.335 0 .607.273.607.604s-.272.604-.607.604H8.21a.61.61 0 0 1-.607-.604c0-.331.271-.604.607-.604M7.603 11.8c0-.33.271-.601.607-.601h3.57c.333 0 .604.27.604.601 0 .327-.27.601-.604.601H8.21a.607.607 0 0 1-.607-.601"></path><path d="M4 2a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2zm0-2h12a4 4 0 0 1 4 4v12a4 4 0 0 1-4 4H4a4 4 0 0 1-4-4V4a4 4 0 0 1 4-4"></path></g>
  </svg>
);

export default function Footer() {
  const { language, translations } = useLanguage();
  const [emailAddress, setEmailAddress] = useState<string>('');
  const [mailtoLink, setMailtoLink] = useState<string>('#');

  useEffect(() => {
    const determinedEmailAddress = getTranslatedString(translations.contactEmailValue, language);
    setEmailAddress(determinedEmailAddress);
    setMailtoLink(determinedEmailAddress ? `mailto:${determinedEmailAddress}` : '#');
  }, [language, translations]);
  
  const fullCopyrightText = getTranslatedString(translations.footerCopyrightText, language);
  const emailLabelText = getTranslatedString(translations.contactEmailLabel, language);
  const socialNavLabelText = getTranslatedString(translations.socialMediaNavLabel, language);
  const bloggerLabelText = getTranslatedString(translations.socialBloggerLabel, language);
  const youtubeLabelText = getTranslatedString(translations.socialYoutubeLabel, language);
  const blueskyLabelText = getTranslatedString(translations.socialBlueskyLabel, language);
  const threadsLabelText = getTranslatedString(translations.socialThreadsLabel, language);
  const footerDisclaimerText = getTranslatedString(translations.footerDisclaimer, language);

  return (
    <footer className="bg-secondary/50 py-8 mt-auto">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <Separator className="mb-8" />
      </div>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 font-headline">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:space-x-8 mb-6">
          {/* Left Half: Social Media */}
          <div className="sm:w-1/2 mb-6 sm:mb-0">
            <nav aria-label={socialNavLabelText}>
              <div className="flex items-center space-x-4">
                <a 
                  href="https://blog.chislonchow.com" 
                  aria-label={bloggerLabelText} 
                  className="text-primary hover:text-primary hover:scale-110 transition-all duration-150 ease-in-out"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <BloggerIcon />
                </a>
                <a 
                  href="https://www.youtube.com/@ChislonChow" 
                  aria-label={youtubeLabelText} 
                  className="text-primary hover:text-primary hover:scale-110 transition-all duration-150 ease-in-out"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <YouTubeIcon />
                </a>
                <a 
                  href="https://bsky.app/profile/chislonchow.com" 
                  aria-label={blueskyLabelText} 
                  className="text-primary hover:text-primary hover:scale-110 transition-all duration-150 ease-in-out"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <BlueskyIcon />
                </a>
                <a 
                  href="https://www.threads.net/@chislonchow" 
                  aria-label={threadsLabelText} 
                  className="text-primary hover:text-primary hover:scale-110 transition-all duration-150 ease-in-out"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ThreadsIcon />
                </a>
              </div>
            </nav>
          </div>

          {/* Right Half: Contact Info and Disclaimer Text */}
          <div className="sm:w-1/2 text-left sm:text-right">
            <p className="text-muted-foreground text-sm mb-2">
              <span className="mr-1">{emailLabelText}</span>
              <a href={mailtoLink} className="hover:text-primary hover:underline">
                {emailAddress}
              </a>
            </p>
            <p className="text-muted-foreground text-sm italic font-normal">
              {footerDisclaimerText}
            </p>
          </div>
        </div>

        {/* Copyright Information - Full Width Below */}
        <div className="text-center">
          <p className="text-muted-foreground text-sm font-normal">
            {fullCopyrightText}
          </p>
        </div>
      </div>
    </footer>
  );
}
