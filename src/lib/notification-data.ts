
import type { Language } from '@/contexts/language-context';
import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import { remark } from "remark";
import remarkRehype from "remark-rehype";
import rehypeRaw from "rehype-raw";
import rehypeSanitize, { defaultSchema as sanitizeDefaultSchema } from "rehype-sanitize";
import rehypeStringify from "rehype-stringify";
import deepmerge from "deepmerge";

// Custom sanitization schema from markdown-display.tsx to allow specific tags and attributes
const customSanitizationSchema = deepmerge(sanitizeDefaultSchema, {
  tagNames: [...(sanitizeDefaultSchema.tagNames ?? []), "sub", "sup"], 
  attributes: {
    ...(sanitizeDefaultSchema.attributes ?? {}),
    // Ensure 'a' tags can have 'href', 'target', 'rel' etc. (defaultSchema already includes href for 'a')
  },
});

interface NotificationText {
  title: string;
  descriptionHtml: string;
}

export interface NotificationConfig {
  en: NotificationText;
  zh: NotificationText;
  durationSeconds: number;
  isEnabled: boolean;
}

interface RawNotificationYaml {
  enabled?: boolean;
  title?: { en?: string; zh?: string };
  description_markdown?: { en?: string; zh?: string };
  duration_seconds?: number;
}

const notificationConfigFile = path.join(process.cwd(), 'src', 'content', 'config', 'notification.yaml');

let cachedNotificationConfig: NotificationConfig | null | undefined = undefined; // undefined means not yet cached

async function processMarkdownToHtml(markdownContent: string): Promise<string> {
  if (typeof markdownContent !== 'string' || !markdownContent.trim()) {
    return '';
  }
  try {
    const processor = remark()
      .use(remarkRehype, { allowDangerousHtml: true })
      .use(rehypeRaw)
      .use(rehypeSanitize, customSanitizationSchema)
      .use(rehypeStringify);
    const result = await processor.process(markdownContent);
    return result.toString();
  } catch (error) {
    console.error("Failed to process markdown for notification:", error);
    return `<p>Error processing content.</p>`; 
  }
}

export async function getNotificationData(): Promise<NotificationConfig | null> {
  if (process.env.NODE_ENV === 'production' && cachedNotificationConfig !== undefined) {
    return cachedNotificationConfig;
  }

  try {
    if (!fs.existsSync(notificationConfigFile)) {
      console.warn(`Notification config file not found: ${notificationConfigFile}`);
      if (process.env.NODE_ENV === 'production') {
        cachedNotificationConfig = null;
      }
      return null;
    }

    const fileContents = fs.readFileSync(notificationConfigFile, 'utf8');
    const rawData = yaml.load(fileContents) as RawNotificationYaml | null;

    if (!rawData || rawData.enabled === false || !rawData.duration_seconds || rawData.duration_seconds <= 0) {
      if (process.env.NODE_ENV === 'production') {
        cachedNotificationConfig = null;
      }
      return null;
    }

    const enTitle = rawData.title?.en || '';
    const zhTitle = rawData.title?.zh || '';
    const enDescriptionMarkdown = rawData.description_markdown?.en || '';
    const zhDescriptionMarkdown = rawData.description_markdown?.zh || '';

    if (!enTitle && !zhTitle && !enDescriptionMarkdown && !zhDescriptionMarkdown) {
        console.warn("Notification enabled but no content provided.");
        if (process.env.NODE_ENV === 'production') {
            cachedNotificationConfig = null;
          }
        return null;
    }

    const enDescriptionHtml = await processMarkdownToHtml(enDescriptionMarkdown);
    const zhDescriptionHtml = await processMarkdownToHtml(zhDescriptionMarkdown);

    const config: NotificationConfig = {
      en: {
        title: enTitle,
        descriptionHtml: enDescriptionHtml,
      },
      zh: {
        title: zhTitle,
        descriptionHtml: zhDescriptionHtml,
      },
      durationSeconds: rawData.duration_seconds,
      isEnabled: true, 
    };
    
    if (process.env.NODE_ENV === 'production') {
      cachedNotificationConfig = config;
    }
    return config;

  } catch (error) {
    console.error("Failed to read or parse notification config YAML:", error);
    if (process.env.NODE_ENV === 'production') {
      cachedNotificationConfig = null;
    }
    return null;
  }
}
