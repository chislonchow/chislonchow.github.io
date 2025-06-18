
import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';

interface PaginationConfigYaml {
  articles_per_page?: number;
}

const configFilePath = path.join(process.cwd(), 'src', 'content', 'config', 'pagination.yaml');
let articlesPerPageValue = 15; // Default value

try {
  if (fs.existsSync(configFilePath)) {
    const fileContents = fs.readFileSync(configFilePath, 'utf8');
    const data = yaml.load(fileContents) as PaginationConfigYaml | null;
    if (data && typeof data.articles_per_page === 'number' && data.articles_per_page > 0) {
      articlesPerPageValue = data.articles_per_page;
    } else if (data && data.articles_per_page !== undefined) {
      console.warn(`Invalid value for articles_per_page in ${configFilePath}. Using default ${articlesPerPageValue}.`);
    }
  } else {
    console.warn(`Pagination config file not found: ${configFilePath}. Using default articles_per_page: ${articlesPerPageValue}.`);
  }
} catch (error) {
  console.error(`Error loading or parsing ${configFilePath}:`, error);
  console.warn(`Using default articles_per_page: ${articlesPerPageValue}.`);
}

export const ARTICLES_PER_PAGE: number = articlesPerPageValue;
