
import type { Language } from '@/contexts/language-context';

export type TranslationValue = Record<Language, string> | string;
export type ProcessedTranslations = Record<string, TranslationValue>;

/**
 * Retrieves a language-specific string from a translation entry.
 * @param entry The translation entry, which can be a string or an object with language keys.
 * @param lang The desired language ('en' or 'zh').
 * @param fallback An optional string to return if no translation is found.
 * @returns The translated string or the fallback.
 */
export function getTranslatedString(
  entry: Record<Language, string> | string | undefined,
  lang: Language,
  fallback: string = ''
): string {
  if (entry === undefined) return fallback;
  if (typeof entry === 'object' && entry !== null && typeof entry[lang] === 'string') {
    return entry[lang];
  }
  if (typeof entry === 'string') {
    return entry;
  }
  return fallback;
}
