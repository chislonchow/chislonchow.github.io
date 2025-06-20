
"use client";

import Link from "next/link";
import { useLanguage, type Language } from "@/contexts/language-context";
import { getTranslatedString } from "@/lib/translations";
import LanguageToggle from "@/components/shared/language-toggle";
import {
  Home,
  User,
  HelpCircle,
  Menu as MenuIcon,
  Newspaper,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import React from "react";
import { useLayoutVisibility } from '@/contexts/layout-visibility-context';
import { cn } from "@/lib/utils";

interface NavLinkInfo {
  baseHref: string;
  labelKey: "home" | "profile" | "faq" | "articles";
  icon: JSX.Element;
}

const baseNavLinks: NavLinkInfo[] = [
  {
    baseHref: "/",
    labelKey: "home",
    icon: <Home className="w-4 h-4 mr-2" aria-hidden="true" />,
  },
  {
    baseHref: "/profile",
    labelKey: "profile",
    icon: <User className="w-4 h-4 mr-2" aria-hidden="true" />,
  },
  {
    baseHref: "/faq",
    labelKey: "faq",
    icon: <HelpCircle className="w-4 h-4 mr-2" aria-hidden="true" />,
  },
  {
    baseHref: "/articles/page/1",
    labelKey: "articles",
    icon: <Newspaper className="w-4 h-4 mr-2" aria-hidden="true" />,
  },
];

const getLocalizedPath = (baseHref: string, lang: Language): string => {
  const slashedHref = baseHref.endsWith('/') ? baseHref : `${baseHref}/`;
  if (lang === "zh") {
    return slashedHref === "/" ? "/zh/" : `/zh${slashedHref.substring(1)}`;
  }
  return slashedHref;
};

const NavLinkItem = ({
  href,
  label,
  icon,
}: {
  href: string;
  label: string;
  icon: React.ReactNode;
}) => (
  <Link
    href={href}
    className="flex items-center text-sm font-medium font-headline hover:text-primary transition-colors px-3 py-2"
  >
    {icon}
    {label}
  </Link>
);

const MobileNavLinkItem = ({
  href,
  label,
  icon,
  onItemClick,
}: {
  href: string;
  label: string;
  icon: React.ReactNode;
  onItemClick?: () => void;
}) => (
  <Link
    href={href}
    onClick={onItemClick}
    className="flex items-center text-base font-medium font-headline hover:text-primary transition-colors py-3 px-4 w-full hover:bg-accent/20 rounded-md"
  >
    {icon}
    {label}
  </Link>
);

export default function Header() {
  const { language, translations } = useLanguage();
  const { showLayoutElements } = useLayoutVisibility(); 
  const [isSheetOpen, setIsSheetOpen] = React.useState(false);

  const navLinks = baseNavLinks.map((linkInfo) => {
    const labelText = getTranslatedString(translations[linkInfo.labelKey], language, linkInfo.labelKey);
    return {
      href: getLocalizedPath(linkInfo.baseHref, language),
      label: labelText,
      icon: linkInfo.icon,
    };
  });

  const handleMobileLinkClick = () => {
    setIsSheetOpen(false);
  };

  const displaySiteName = getTranslatedString(translations.headerSiteName, 'en') || 
                          getTranslatedString(translations.siteName, 'en') || 
                          "Chislon Chow, R.P.";

  const mainNavLabel = getTranslatedString(translations.mainNavigationLabel, language);
  const mobileMenuTriggerLabel = getTranslatedString(translations.mobileNavMenuTitle, language);

  return (
    <header 
      className={cn(
        "bg-background/60 backdrop-blur-md sticky top-0 z-50 shadow",
        { 'hidden': !showLayoutElements }
      )}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          <Link
            href={getLocalizedPath("/", language)}
            className="text-sm xs:text-base sm:text-lg md:text-xl font-semibold font-headline text-primary"
          >
            {displaySiteName}
          </Link>

          <nav
            className="hidden md:flex items-center space-x-2 lg:space-x-4"
            aria-label={mainNavLabel}
          >
            {navLinks.map((link) => (
              <NavLinkItem
                key={`desktop-${link.href}`}
                href={link.href}
                label={link.label}
                icon={link.icon}
              />
            ))}
            <LanguageToggle />
          </nav>

          <div className="md:hidden flex items-center">
            <LanguageToggle />
            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="ml-2"
                  aria-controls={
                    isSheetOpen ? "mobile-menu-content" : undefined
                  }
                  aria-haspopup="dialog"
                >
                  <MenuIcon className="h-6 w-6" aria-hidden="true" />
                  <span className="sr-only">{mobileMenuTriggerLabel}</span>
                </Button>
              </SheetTrigger>
              <SheetContent
                id="mobile-menu-content"
                side="right"
                className="w-[180px] p-0 pt-12 bg-background"
              >
                <SheetTitle className="sr-only">Menu</SheetTitle>
                <nav
                  className="flex flex-col space-y-2 px-4"
                  aria-label={mainNavLabel}
                >
                  {navLinks.map((link) => (
                    <MobileNavLinkItem
                      key={`mobile-${link.href}`}
                      href={link.href}
                      label={link.label}
                      icon={link.icon}
                      onItemClick={handleMobileLinkClick}
                    />
                  ))}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
