
"use client";

import { useEffect } from 'react';
import { useLanguage, type Language } from '@/contexts/language-context';

interface LanguageInitializerClientProps {
  lang: Language; // The language this instance should set
}

export default function LanguageInitializerClient({ lang }: LanguageInitializerClientProps) {
  const { language: currentContextLang, setLanguage } = useLanguage();

  useEffect(() => {
    // Update document's lang attribute client-side
    // This ensures the live DOM reflects the correct language for the current page.
    if (document.documentElement.lang !== lang) {
      document.documentElement.lang = lang;
    }

    // Update React context for translations
    // This ensures components re-render with the correct language strings.
    if (currentContextLang !== lang) {
      setLanguage(lang);
    }

    // For a static export (output: 'export'), cleanup of document.documentElement.lang
    // on component unmount is less critical because navigating between /en and /zh paths
    // typically involves a full page load, which re-establishes the lang attribute
    // from the new page's root HTML (which is lang="en" from src/app/layout.tsx by default).
    // The LanguageInitializerClient on a /zh page will then set it to "zh".
    // If an English page loads, this component (with lang="zh") isn't active to revert it.
    // If navigating from /zh back to /en via client-side routing, the root layout doesn't have
    // an initializer to set it back to 'en', but the LanguageToggle would set the context,
    // and a full navigation would reset it.
    // For the specific case of `output: 'export'`, this direct DOM manipulation is a common
    // strategy to reflect the current page's language.
  }, [lang, currentContextLang, setLanguage]);

  return null; // This component doesn't render anything visible
}
