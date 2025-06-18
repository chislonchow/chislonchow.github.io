
"use client";

import { useLanguage, type Language } from '@/contexts/language-context';
import { Button } from '@/components/ui/button';
import { Globe } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';
import React, { useTransition } from 'react'; 

export default function LanguageToggle() {
  const { language, setLanguage, translations } = useLanguage();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition(); 

  const toggleLanguage = () => {
    const newLang: Language = language === 'en' ? 'zh' : 'en';
    
    startTransition(() => {
      if (language !== newLang) {
        setLanguage(newLang);
      }
    });

    let newPath = pathname;

    if (newLang === 'zh') {
      if (pathname === '/') {
        newPath = '/zh';
      } else if (!pathname.startsWith('/zh/')) {
        newPath = `/zh${pathname}`;
      }
    } else { // newLang === 'en'
      if (pathname === '/zh') {
        newPath = '/';
      } else if (pathname.startsWith('/zh/')) {
        newPath = pathname.substring(3);
        if (newPath === '') newPath = '/';
      }
    }

    if (newPath !== pathname) {
      router.push(newPath);
    }
  };

  const rawLangToggleEntry = translations.languageToggle;
  let buttonText: string = '';
  let ariaLabelText: string = '';

  if (typeof rawLangToggleEntry === 'object' && rawLangToggleEntry !== null) {
    const currentLangText = rawLangToggleEntry[language];
    buttonText = typeof currentLangText === 'string' ? currentLangText : '';
    
    const oppositeLang = language === 'en' ? 'zh' : 'en';
    const oppositeLangText = rawLangToggleEntry[oppositeLang];
    ariaLabelText = typeof oppositeLangText === 'string' ? oppositeLangText : '';
  } else if (typeof rawLangToggleEntry === 'string') {
    // This case implies languageToggle is a direct string, not typical for this component
    buttonText = rawLangToggleEntry;
    ariaLabelText = rawLangToggleEntry; 
  }


  return (
    <Button
      variant="outline"
      onClick={toggleLanguage}
      className="font-headline text-sm md:text-xs flex items-center"
      aria-label={ariaLabelText}
      disabled={isPending} 
    >
      <Globe className="w-4 h-4 mr-1" aria-hidden="true" />
      {buttonText}
    </Button>
  );
}
