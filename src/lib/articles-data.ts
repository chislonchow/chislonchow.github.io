
import type { Language } from '@/contexts/language-context';
import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';

export interface Article {
  slug: string;
  title: { [key in Language]: string };
  description: { [key in Language]: string };
  imageUrl?: string;
  imageCaption?: { [key in Language]: string };
  content: { [key in Language]: string };
  categories: string[];
  pinned: boolean;
  date_updated: string; // YYYY-MM-DD
  date_updated_shown: boolean;
  hidden?: boolean; // New attribute
}

interface RawArticleYaml {
  title: { en: string; zh: string };
  description: { en: string; zh: string };
  imageUrl?: string;
  imageCaption?: { en: string; zh: string };
  content: { en: string; zh: string };
  categories: string[];
  pinned: boolean;
  date_updated: string;
  date_updated_shown: boolean;
  hidden?: boolean; // New attribute
}

const articlesDirectory = path.join(process.cwd(), 'src', 'content', 'articles');

let cachedArticles: Article[] | null = null;

// Regular expression for validating slugs: allows alphanumeric characters, hyphens, and underscores.
const VALID_SLUG_REGEX = /^[a-zA-Z0-9_-]+$/;

export function getArticles(): Article[] {
  if (process.env.NODE_ENV === 'production' && cachedArticles) {
    return cachedArticles;
  }

  try {
    if (!fs.existsSync(articlesDirectory)) {
        console.warn(`Articles directory not found: ${articlesDirectory}`);
        return [];
    }
    const fileNames = fs.readdirSync(articlesDirectory);
    const allArticlesData = fileNames
      .filter(fileName => fileName.endsWith('.yaml') || fileName.endsWith('.yml'))
      .map(fileName => {
        const slug = fileName.replace(/\.ya?ml$/, '');

        if (!VALID_SLUG_REGEX.test(slug)) {
          console.warn(`Skipping file ${fileName} due to invalid characters in derived slug "${slug}". Slugs should only contain alphanumeric characters, hyphens, or underscores.`);
          return null;
        }

        const fullPath = path.join(articlesDirectory, fileName);
        const fileContents = fs.readFileSync(fullPath, 'utf8');
        const data = yaml.load(fileContents) as RawArticleYaml;

        if (!data || typeof data !== 'object' || !data.title || !data.content || !data.description) {
            console.warn(`Skipping ${fileName} due to missing essential fields or invalid format.`);
            return null;
        }

        // If article is hidden, skip it
        if (data.hidden === true) {
          return null;
        }
        
        return {
          slug,
          title: data.title,
          description: data.description,
          imageUrl: data.imageUrl,
          imageCaption: data.imageCaption,
          content: data.content,
          categories: Array.isArray(data.categories) ? data.categories : [],
          pinned: data.pinned === true,
          date_updated: data.date_updated,
          date_updated_shown: data.date_updated_shown === true,
          hidden: false, // Articles that are not filtered out are not hidden
        } as Article;
      })
      .filter((article): article is Article => article !== null); // This also filters out hidden articles now

    allArticlesData.sort((a, b) => {
        if (a.pinned && !b.pinned) return -1;
        if (!a.pinned && b.pinned) return 1;
        return new Date(b.date_updated).getTime() - new Date(a.date_updated).getTime();
    });

    cachedArticles = allArticlesData;
    return cachedArticles;
  } catch (error) {
    console.error("Failed to read articles from YAML files:", error);
    cachedArticles = []; 
    return [];
  }
}

export function getArticleBySlug(slug: string): Article | undefined {
  if (!VALID_SLUG_REGEX.test(slug)) {
    console.warn(`Attempted to get article with invalid slug: "${slug}"`);
    return undefined;
  }
  const articles = getArticles(); // This will already have filtered out hidden articles
  return articles.find(article => article.slug === slug);
}
