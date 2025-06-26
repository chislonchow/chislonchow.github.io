
import type { Language } from '@/contexts/language-context';
import type { ProcessedTranslations } from '@/lib/translations';
import { getTranslatedString } from '@/lib/translations';
import type { Service, Person, WithContext, Place } from 'schema-dts';

/**
 * @fileoverview Generates Service schema markup for the website.
 */

const BASE_URL = 'https://chislonchow.com';

export function generateProfessionalServiceSchema(lang: Language, translations: ProcessedTranslations): WithContext<Service> {
  
  const provider: Person = {
    '@type': 'Person',
    name: 'Chislon Chow',
    jobTitle: 'Psychotherapist',
    url: `${BASE_URL}/profile/`,
    knowsLanguage: [
        'English',
        'Cantonese'
    ]
  };

  const schema: Service = {
    '@type': 'Service',
    name: getTranslatedString(translations.homePageTitle, lang),
    description: getTranslatedString(translations.homePageMetaDescription, lang),
    url: `${BASE_URL}${lang === 'zh' ? '/zh/' : '/'}`,
    provider: provider,
    areaServed: {
        '@type': 'Place',
        name: 'Ontario'
    },
    serviceType: [
        "Psychotherapy",
        "Mental Health Service"
    ],
  };

  return {
    '@context': 'https://schema.org',
    ...schema,
  };
}
