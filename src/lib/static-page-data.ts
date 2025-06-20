
import type { Language } from '@/contexts/language-context';
import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';

export interface StaticPageData {
  title: { [key in Language]: string }; // For H1 heading AND now for base of HTML <title>
  metadata_description?: { [key in Language]: string }; // For HTML <meta name="description">
  markdown_content: { [key in Language]: string };
  feature_image_path?: string;
  feature_image_alt?: { [key in Language]: string };
  feature_image_base_width?: string;  // e.g., "250px"
  feature_image_base_height?: string; // e.g., "250px", if undefined, defaults to base_width (square)
  feature_image_mobile_width?: string; // e.g., "60vw"
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
    const data = yaml.load(fileContents) as Partial<Omit<StaticPageData, 'title' | 'markdown_content'> & { title: { en: string; zh: string }, markdown_content: { en: string; zh: string } }>;


    if (!data || typeof data !== 'object' || !data.title || !data.markdown_content) {
        throw new Error(`Invalid YAML structure in ${filePath}. Missing title or markdown_content.`);
    }
    if (typeof data.title.en !== 'string' || typeof data.title.zh !== 'string' ||
        typeof data.markdown_content.en !== 'string' || typeof data.markdown_content.zh !== 'string') {
        throw new Error(`Invalid YAML structure in ${filePath}. Title and markdown_content must have 'en' and 'zh' string properties.`);
    }
    
    if (data.metadata_description && (typeof data.metadata_description.en !== 'string' || typeof data.metadata_description.zh !== 'string')) {
        console.warn(`Warning: metadata_description in ${filePath} is present but might be missing 'en' or 'zh' string properties. Proceeding with available data.`);
    }
    if (data.feature_image_alt && (typeof data.feature_image_alt.en !== 'string' || typeof data.feature_image_alt.zh !== 'string')) {
        console.warn(`Warning: feature_image_alt in ${filePath} is present but might be missing 'en' or 'zh' string properties. Proceeding with available data.`);
    }
    
    const validatedData: StaticPageData = {
        title: data.title,
        metadata_description: data.metadata_description,
        markdown_content: data.markdown_content,
        feature_image_path: data.feature_image_path,
        feature_image_alt: data.feature_image_alt,
        feature_image_base_width: data.feature_image_path ? (data.feature_image_base_width || "250px") : undefined,
        feature_image_base_height: data.feature_image_path ? data.feature_image_base_height : undefined,
        feature_image_mobile_width: data.feature_image_path ? (data.feature_image_mobile_width || "60vw") : undefined,
    };
    
    if (process.env.NODE_ENV === 'production') {
      staticPageCache[pageType] = validatedData;
    }
    return validatedData;

  } catch (error) {
    console.error(`Failed to read or parse YAML for page type "${pageType}":`, error);
    throw error; 
  }
}
