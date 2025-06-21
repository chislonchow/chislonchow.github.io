
"use client";

import type { Dispatch, SetStateAction } from 'react';
import React, { createContext, useState, useMemo, useCallback, useContext } from 'react';
import { usePathname } from 'next/navigation';

export type Language = 'en' | 'zh';

interface LanguageContextType {
  language: Language;
  setLanguage: (newLang: Language) => void;
  translations: Record<string, Record<Language, string> | string>; // Updated type
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

interface LanguageProviderProps {
  children: React.ReactNode;
  defaultLanguage: Language;
  initialTranslations: Record<string, Record<Language, string> | string>; // Updated type
}

export function LanguageProvider({ children, defaultLanguage, initialTranslations }: LanguageProviderProps) {
  const [language, setLanguageState] = useState<Language>(defaultLanguage);

  const setLanguageCallback = useCallback((newLang: Language) => {
    setLanguageState(currentLang => {
      if (currentLang === newLang) {
        return currentLang; 
      }
      return newLang;
    });
  }, []);

  const contextValue = useMemo(() => ({
    language,
    setLanguage: setLanguageCallback,
    translations: initialTranslations,
  }), [language, setLanguageCallback, initialTranslations]);

  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextType {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    console.warn("useLanguage called outside of a LanguageProvider or context not ready. Falling back to 'en' with empty translations. This might indicate an issue in your component structure or layout setup.");
    return {
      language: 'en', 
      setLanguage: () => {}, 
      translations: {} as Record<string, Record<Language, string> | string>, // Updated fallback type
    };
  }
  return context;
}
