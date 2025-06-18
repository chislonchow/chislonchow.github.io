
"use client";

import { useEffect } from 'react';
import { useLanguage } from '@/contexts/language-context';

/**
 * @fileoverview html-lang-updater is a client-side component responsible for
 * synchronizing the `lang` attribute of the `<html>` element with the
 * application's current language state from the LanguageContext.
 *
 * It listens for changes in the language context and updates
 * `document.documentElement.lang` accordingly. This ensures that the
 * live DOM reflects the correct language, which is important for
 * accessibility and SEO for crawlers that execute JavaScript.
 *
 * This component should be placed within the `LanguageProvider` in the
 * root layout to have access to the language context.
 */
export default function HtmlLangUpdater() {
  const { language } = useLanguage();

  useEffect(() => {
    /**
     * When the language from the context changes, this effect updates
     * the `lang` attribute on the `<html>` tag (`document.documentElement`).
     * This ensures the browser's live DOM reflects the current language
     * of the application.
     */
    if (document.documentElement.lang !== language) {
      document.documentElement.lang = language;
    }
  }, [language]); // Re-run effect when the language context changes

  return null; // This component does not render any visible UI
}
