
'use client'; 

import { useEffect } from 'react';
import { Home, AlertTriangle } from 'lucide-react';
import { useLanguage, type Language } from '@/contexts/language-context';
import { useLayoutVisibility } from '@/contexts/layout-visibility-context';
import { cn } from "@/lib/utils";

const getLocalizedPath = (baseHref: string, lang: Language): string => {
  if (lang === 'zh') {
    return baseHref === '/' ? '/zh/' : `/zh${baseHref}`;
  }
  return baseHref === '/' ? '/' : `${baseHref}/`;
};

export default function NotFound() {
  const { language, translations } = useLanguage();
  const { setShowLayoutElements } = useLayoutVisibility();

  useEffect(() => {
    document.title = "404";

    let robotsMeta = document.querySelector('meta[name="robots"]');
    if (robotsMeta) {
      robotsMeta.remove();
    }
    robotsMeta = document.createElement('meta');
    robotsMeta.setAttribute('name', "robots");
    robotsMeta.setAttribute('content', "noindex, nofollow, nocache");
    document.head.appendChild(robotsMeta);
    
    setShowLayoutElements(false);

    return () => {
      const currentRobotsMeta = document.querySelector('meta[name="robots"][content="noindex, nofollow, nocache"]');
      if (currentRobotsMeta) {
        currentRobotsMeta.remove();
      }
      setShowLayoutElements(true); 
    };
  }, [setShowLayoutElements]); 

  const homePath = getLocalizedPath('/', language);

  const rawNotFoundTitleText = translations.notFoundTitle;
  const notFoundTitleText = (typeof rawNotFoundTitleText === 'object' && rawNotFoundTitleText !== null ? rawNotFoundTitleText[language] : rawNotFoundTitleText) || '';
  
  const rawNotFoundMessageText = translations.notFoundMessage;
  const notFoundMessageText = (typeof rawNotFoundMessageText === 'object' && rawNotFoundMessageText !== null ? rawNotFoundMessageText[language] : rawNotFoundMessageText) || '';
  
  const rawNotFoundGoHomeText = translations.notFoundGoHome;
  const notFoundGoHomeText = (typeof rawNotFoundGoHomeText === 'object' && rawNotFoundGoHomeText !== null ? rawNotFoundGoHomeText[language] : rawNotFoundGoHomeText) || '';

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground text-center px-4 py-8">
      <AlertTriangle className="w-16 h-16 text-destructive mb-6" aria-hidden="true" />
      <h1 className="text-5xl md:text-7xl font-bold font-headline text-primary mb-4">
        404
      </h1>
      <h2 className="text-xl md:text-2xl font-semibold font-headline text-foreground mb-3">
        {notFoundTitleText}
      </h2>
      <p className="text-md md:text-lg text-muted-foreground mb-8 max-w-md font-body">
        {notFoundMessageText}
      </p>
      <a
        href={homePath}
        className={cn(
          "inline-flex items-center justify-center whitespace-nowrap rounded-full text-sm font-headline px-6 py-3",
          "bg-primary text-primary-foreground hover:bg-primary/90", 
          "ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        )}
      >
        <Home className="mr-2 h-4 w-4" aria-hidden="true" />
        {notFoundGoHomeText}
      </a>
    </div>
  );
}
