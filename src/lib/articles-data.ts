
import type { Language } from '@/contexts/language-context';
import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';

// Type for raw data from metadata.yaml
interface ArticleMetadataYaml {
  title: { [key in Language]: string };
  description: { [key in Language]: string };
  categories?: string[];
  pinned?: boolean;
  date_updated: string;
  date_updated_shown?: boolean;
  hidden?: boolean;
  frontpage_display?: boolean;
}

// For list views, this is the processed, final data structure.
export interface ArticleListItem {
  slug: string;
  title: { [key in Language]: string };
  description: { [key in Language]: string };
  categories: string[];
  pinned: boolean;
  date_updated: string;
  date_updated_shown: boolean;
  hidden?: boolean;
  frontpage_display: boolean;
}

// For the full article page, we need everything.
export interface Article extends ArticleListItem {
  imageUrl?: string;
  imageCaption?: { [key in Language]: string };
  content: { [key in Language]: string };
}

// From content.yaml
interface ArticleContentData {
  imageUrl?: string;
  imageCaption?: { [key in Language]: string };
  content: { [key in Language]: string };
}


const articlesDirectory = path.join(process.cwd(), 'src', 'content', 'articles');
const VALID_SLUG_REGEX = /^[a-zA-Z0-9_-]+$/;

let cachedArticleListItems: ArticleListItem[] | null = null;
const articleCache = new Map<string, Article>();

// Helper to read and parse a metadata.yaml file for a given slug
function readArticleMetadata(slug: string): ArticleMetadataYaml | null {
    if (!VALID_SLUG_REGEX.test(slug)) {
        console.warn(`Invalid slug format: "${slug}"`);
        return null;
    }

    const metadataPath = path.join(articlesDirectory, slug, 'metadata.yaml');

    if (!fs.existsSync(metadataPath)) {
        return null;
    }

    try {
        const metadataContents = fs.readFileSync(metadataPath, 'utf8');
        const metadata = yaml.load(metadataContents) as ArticleMetadataYaml;

        if (!metadata?.title || !metadata?.description) {
            console.warn(`Skipping slug "${slug}" due to missing title or description in metadata.yaml.`);
            return null;
        }

        return metadata;
    } catch (error) {
        console.error(`Error reading or parsing metadata.yaml for slug "${slug}":`, error);
        return null;
    }
}


// Get all articles for list views (without heavy 'content' field)
export function getArticleListItems(): ArticleListItem[] {
    if (process.env.NODE_ENV === 'production' && cachedArticleListItems) {
        return cachedArticleListItems;
    }

    try {
        if (!fs.existsSync(articlesDirectory)) {
            console.warn(`Articles directory not found: ${articlesDirectory}`);
            return [];
        }

        const articleSlugs = fs.readdirSync(articlesDirectory, { withFileTypes: true })
            .filter(dirent => dirent.isDirectory())
            .map(dirent => dirent.name);

        const allArticleItems = articleSlugs
            .map(slug => {
                const metadata = readArticleMetadata(slug);
                if (!metadata || metadata.hidden) {
                    return null;
                }

                // Explicitly construct the ArticleListItem to ensure type correctness
                const item: ArticleListItem = {
                    slug,
                    title: metadata.title,
                    description: metadata.description,
                    categories: Array.isArray(metadata.categories) ? metadata.categories : [],
                    pinned: metadata.pinned === true,
                    date_updated: metadata.date_updated,
                    date_updated_shown: metadata.date_updated_shown === true,
                    hidden: metadata.hidden,
                    frontpage_display: metadata.frontpage_display === true,
                };
                return item;
            })
            .filter((item): item is ArticleListItem => item !== null);

        allArticleItems.sort((a, b) => {
            if (a.pinned && !b.pinned) return -1;
            if (!a.pinned && b.pinned) return 1;
            return new Date(b.date_updated).getTime() - new Date(a.date_updated).getTime();
        });

        if (process.env.NODE_ENV === 'production') {
          cachedArticleListItems = allArticleItems;
        }
        return allArticleItems;
    } catch (error) {
        console.error("Failed to read article list items:", error);
        return [];
    }
}

// Get a single, full article by its slug, including content
export function getArticleBySlug(slug: string): Article | undefined {
    if (process.env.NODE_ENV === 'production' && articleCache.has(slug)) {
        return articleCache.get(slug);
    }

    const metadata = readArticleMetadata(slug);
    if (!metadata || metadata.hidden) {
        return undefined;
    }

    const contentPath = path.join(articlesDirectory, slug, 'content.yaml');
    if (!fs.existsSync(contentPath)) {
        console.warn(`content.yaml not found for slug "${slug}"`);
        return undefined;
    }

    try {
        const contentContents = fs.readFileSync(contentPath, 'utf8');
        const contentData = yaml.load(contentContents) as ArticleContentData;

        if (!contentData?.content) {
            console.warn(`Missing content field in content.yaml for slug "${slug}"`);
            return undefined;
        }
        
        const article: Article = {
            slug,
            title: metadata.title,
            description: metadata.description,
            categories: Array.isArray(metadata.categories) ? metadata.categories : [],
            pinned: metadata.pinned === true,
            date_updated: metadata.date_updated,
            date_updated_shown: metadata.date_updated_shown === true,
            hidden: metadata.hidden,
            frontpage_display: metadata.frontpage_display === true,
            imageUrl: contentData.imageUrl,
            imageCaption: contentData.imageCaption,
            content: contentData.content,
        };
        
        if (process.env.NODE_ENV === 'production') {
            articleCache.set(slug, article);
        }

        return article;

    } catch (error) {
        console.error(`Error reading or parsing content.yaml for slug "${slug}":`, error);
        return undefined;
    }
}
