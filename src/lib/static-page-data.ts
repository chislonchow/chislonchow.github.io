
import type { Language } from '@/contexts/language-context';
import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';

export interface StaticPageData {
  title: { [key in Language]: string };
  markdown_content: { [key in Language]: string };
}

type PageType = 'profile' | 'faq';

const contentDirectory = path.join(process.cwd(), 'src', 'content', 'static-pages');

// Basic in-memory cache for production
let staticPageCache: { [key in PageType]?: StaticPageData } = {};

export async function getStaticPageData(pageType: PageType): Promise<StaticPageData> {
  if (process.env.NODE_ENV === 'production' && staticPageCache[pageType]) {
    return staticPageCache[pageType]!;
  }

  const filePath = path.join(contentDirectory, `${pageType}.yaml`);
  
  try {
    if (!fs.existsSync(filePath)) {
      throw new Error(`YAML file not found for page type "${pageType}" at ${filePath}`);
    }
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const data = yaml.load(fileContents) as StaticPageData;

    if (!data || typeof data !== 'object' || !data.title || !data.markdown_content) {
        throw new Error(`Invalid YAML structure in ${filePath}. Missing title or markdown_content.`);
    }
    if (typeof data.title.en !== 'string' || typeof data.title.zh !== 'string' ||
        typeof data.markdown_content.en !== 'string' || typeof data.markdown_content.zh !== 'string') {
        throw new Error(`Invalid YAML structure in ${filePath}. Title and markdown_content must have 'en' and 'zh' string properties.`);
    }
    
    if (process.env.NODE_ENV === 'production') {
      staticPageCache[pageType] = data;
    }
    return data;

  } catch (error) {
    console.error(`Failed to read or parse YAML for page type "${pageType}":`, error);
    // Fallback or re-throw, depending on desired error handling
    // For now, re-throwing to make it clear during development if files are missing/malformed
    throw error; 
  }
}
