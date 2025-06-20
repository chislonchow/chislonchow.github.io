
import type { Language } from '@/contexts/language-context';
import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import type { TranslationValue, ProcessedTranslations } from '@/lib/translations';

type YamlInputTranslations = Record<string, Partial<Record<Language, string>> | string>;


const translationsDirectory = path.join(process.cwd(), 'src', 'content', 'translations');
const configDirectory = path.join(process.cwd(), 'src', 'content', 'config');


let cachedTranslations: ProcessedTranslations | null = null;
let cacheYear: number | null = null;

function loadYamlFile(dir: string, filename: string): any {
  const filePath = path.join(dir, filename);
  try {
    if (!fs.existsSync(filePath)) {
      console.warn(`File not found: ${filePath}. Returning empty object.`);
      return {};
    }
    const fileContents = fs.readFileSync(filePath, 'utf8');
    return yaml.load(fileContents) || {};
  } catch (error) {
    console.error(`Error loading or parsing YAML file ${filename}:`, error);
    return {}; 
  }
}

// Helper to process general translations (e.g., for dynamic year)
function processGeneralTranslations(data: YamlInputTranslations, year: number): ProcessedTranslations {
  const processed: ProcessedTranslations = {};
  for (const key in data) {
    const value = data[key];
    if (key === 'footerCopyrightText' && typeof value === 'string') {
      processed[key] = value.replace('{year}', year.toString());
    } else {
      processed[key] = value as TranslationValue;
    }
  }
  return processed;
}

// Helper to process article category translations
function processCategoryTranslations(data: Record<string, Partial<Record<Language, string>>>): ProcessedTranslations {
  const processed: ProcessedTranslations = {};
  for (const key in data) {
    const enName = data[key]?.en || key;
    processed[key] = {
      en: enName,
      zh: data[key]?.zh || enName,
    };
  }
  return processed;
}


export const getTranslations = (currentYear: number): ProcessedTranslations => {
  // Use cache if available and the year matches
  if (cachedTranslations && cacheYear === currentYear) {
    return cachedTranslations;
  }

  const generalData = loadYamlFile(translationsDirectory, 'general.yaml');
  const homeData = loadYamlFile(translationsDirectory, 'home.yaml');
  const articlesData = loadYamlFile(translationsDirectory, 'articles.yaml');
  const articleCategoriesData = loadYamlFile(translationsDirectory, 'article-categories.yaml');

  // Note: Notification config is not directly merged here as it has a dedicated loader.
  // If some notification-related UI text needs to be translatable *through this system*,
  // those specific keys could be added to a relevant YAML (e.g., general.yaml).

  const processedGeneral = processGeneralTranslations(generalData, currentYear);
  const processedCategories = processCategoryTranslations(articleCategoriesData);

  const allTranslations: ProcessedTranslations = {
    ...processedGeneral,
    ...(homeData as ProcessedTranslations),
    ...(articlesData as ProcessedTranslations),
    ...processedCategories,
  };

  // Update cache after processing
  cachedTranslations = allTranslations;
  cacheYear = currentYear;

  return allTranslations;
};
