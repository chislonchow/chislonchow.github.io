
import type { Language } from "@/contexts/language-context";

/**
 * Generates a language-specific URL path.
 * Ensures a trailing slash for non-root paths and prefixes with '/zh' for Chinese.
 * @param baseHref - The base path, e.g., "/", "/profile", or "/articles/page/1".
 * @param lang - The target language, 'en' or 'zh'.
 * @returns The fully-formed, localized path, e.g., "/profile/" or "/zh/profile/".
 */
export const getLocalizedPath = (baseHref: string, lang: Language): string => {
  const slashedHref = baseHref.endsWith('/') ? baseHref : `${baseHref}/`;

  if (lang === "zh") {
    // For root path, just return language prefix. For others, prefix and add the rest of the path.
    return slashedHref === "/" ? "/zh/" : `/zh/${slashedHref.substring(1)}`;
  }
  
  return slashedHref;
};
