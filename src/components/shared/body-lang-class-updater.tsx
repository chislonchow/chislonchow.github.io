
"use client";

import { useEffect } from 'react';
import { useLanguage } from '@/contexts/language-context';

/**
 * @fileoverview body-lang-class-updater is a client-side component responsible for
 * adding a language-specific class (lang-en or lang-zh) to the <body> element.
 * This allows for CSS targeting based on language without relying on the html[lang] attribute,
 * which can be useful for styles that need to be applied based on the client-side language context.
 *
 * It listens for changes in the language context and updates
 * `document.body.classList` accordingly.
 *
 * This component should be placed within the `LanguageProvider` in the
 * root layout to have access to the language context.
 */
export default function BodyLangClassUpdater() {
  const { language } = useLanguage();

  useEffect(() => {
    const body = document.body;
    if (language === 'zh') {
      body.classList.add('lang-zh');
      body.classList.remove('lang-en');
    } else { // 'en' or any other default
      body.classList.add('lang-en');
      body.classList.remove('lang-zh');
    }
    // The class will persist and be updated whenever the language context changes.
    // No specific cleanup on unmount is strictly necessary for this behavior,
    // as the effect will re-evaluate and set the correct classes on next render
    // or if the component instance managing language state changes.
  }, [language]); // Re-run effect when the language context changes

  return null; // This component does not render any visible UI
}
