
import type { Language } from '@/contexts/language-context';
import type { ProcessedTranslations } from '@/lib/translations';
import { getTranslatedString } from '@/lib/translations';

// Basic obfuscation by splitting the email address parts
const EMAIL_USER = 'contact';
const EMAIL_DOMAIN = 'chislonchow.com';

/**
 * Returns the de-obfuscated email address.
 * @returns The full email address string, e.g., "user@domain.com".
 */
export function getEmailAddress(): string {
  return `${EMAIL_USER}@${EMAIL_DOMAIN}`;
}

/**
 * Generates a mailto link with pre-filled subject and body, based on the current language.
 * This is intended for primary "call to action" buttons.
 * @param translations - The full translations object.
 * @param language - The current language ('en' or 'zh').
 * @returns A fully formed mailto: string with subject and body.
 */
export function generateInquiryMailtoLink(translations: ProcessedTranslations, language: Language): string {
  const emailAddress = getEmailAddress();
  const subject = getTranslatedString(translations.heroMailSubject, language);
  const body = getTranslatedString(translations.heroMailBodyTemplate, language);

  return `mailto:${emailAddress}?subject=${encodeURIComponent(
    subject
  )}&body=${encodeURIComponent(body)}`;
}
