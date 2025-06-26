'use client'; 

import { useEffect } from 'react';
import { Home, AlertTriangle } from 'lucide-react';
import { useLanguage } from '@/contexts/language-context';
import { getTranslatedString } from '@/lib/translations';
import { useLayoutVisibility } from '@/contexts/layout-visibility-context';
import { cn } from "@/lib/utils";
import { getLocalizedPath } from '@/lib/path-utils';

export default function NotFoundClient() {
  const { language, translations } = useLanguage();
  const { setShowLayoutElements } = useLayoutVisibility();

  useEffect(() => {
    // The metadata (title, robots meta tag) is now handled by the `metadata` export
    // in `not-found.tsx`. This effect is now only responsible for client-side layout adjustments.
    setShowLayoutElements(false);

    return () => {
      // Restore layout elements when navigating away from the 404 page
      // (e.g., via the "Go to Homepage" link).
      setShowLayoutElements(true); 
    };
  }, [setShowLayoutElements]); 

  const homePath = getLocalizedPath('/', language);

  const notFoundTitleText = getTranslatedString(translations.notFoundTitle, language);
  const notFoundMessageText = getTranslatedString(translations.notFoundMessage, language);
  const notFoundGoHomeText = getTranslatedString(translations.notFoundGoHome, language);

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
