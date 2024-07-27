import { ui, defaultLang } from './ui';
import { getRelativeLocaleUrl } from 'astro:i18n';

export function getLangFromUrl(url: URL) {  
  const [, lang] = url.pathname.split('/');
  if (lang in ui) return lang as keyof typeof ui;
  return defaultLang;
}

// Get translations strings for different parts of the UI
export function useTranslations(lang: keyof typeof ui) {
  return function t(key: keyof typeof ui[typeof defaultLang]) {
    return ui[lang][key] || ui[defaultLang][key];
  }
}

// Get Equivalent URL for of new locale
export function getEquivalentUrl(url: URL, newLocale : string) {
  return getRelativeLocaleUrl(newLocale, getPathname(url));
}

function getPathname(url : URL) {
  // Split the pathname by '/' and remove trailing slashes
  const pathParts = url.pathname.split('/').filter(part => part);

  // Drop the first part if it is a language code
  const [, lang] = url.pathname.split('/');
  if (lang in ui) pathParts.shift();

  // Join the remaining parts to get the actual pathname
  return '/' + pathParts.join('/');
}
