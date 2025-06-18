
import fs from 'fs';
import path from 'path';
import { getArticles } from '../src/lib/articles-data'; // Adjust path as necessary

const BASE_URL = 'https://chislonchow.com';

// Helper to format date to YYYY-MM-DD
const formatDate = (dateInput: Date | string): string => {
  const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
  return date.toISOString().split('T')[0];
};

async function generateSitemap() {
  const articles = getArticles(); // This is synchronous as currently written in articles-data.ts
  const today = formatDate(new Date());

  const urls = [
    // Static pages (English)
    { 
      loc: `${BASE_URL}/`, 
      lastmod: today, 
      alternates: [
        { lang: 'en', href: `${BASE_URL}/` }, 
        { lang: 'zh', href: `${BASE_URL}/zh/` }
      ] 
    },
    { 
      loc: `${BASE_URL}/profile/`, 
      lastmod: today, 
      alternates: [
        { lang: 'en', href: `${BASE_URL}/profile/` }, 
        { lang: 'zh', href: `${BASE_URL}/zh/profile/` }
      ] 
    },
    { 
      loc: `${BASE_URL}/faq/`, 
      lastmod: today, 
      alternates: [
        { lang: 'en', href: `${BASE_URL}/faq/` }, 
        { lang: 'zh', href: `${BASE_URL}/zh/faq/` }
      ] 
    },
    { 
      loc: `${BASE_URL}/articles/page/1/`, 
      lastmod: today, // Could be date of latest article if preferred
      alternates: [
        { lang: 'en', href: `${BASE_URL}/articles/page/1/` }, 
        { lang: 'zh', href: `${BASE_URL}/zh/articles/page/1/` }
      ] 
    },

    // Static pages (Chinese)
    { 
      loc: `${BASE_URL}/zh/`, 
      lastmod: today, 
      alternates: [
        { lang: 'zh', href: `${BASE_URL}/zh/` }, 
        { lang: 'en', href: `${BASE_URL}/` }
      ] 
    },
    { 
      loc: `${BASE_URL}/zh/profile/`, 
      lastmod: today, 
      alternates: [
        { lang: 'zh', href: `${BASE_URL}/zh/profile/` }, 
        { lang: 'en', href: `${BASE_URL}/profile/` }
      ] 
    },
    { 
      loc: `${BASE_URL}/zh/faq/`, 
      lastmod: today, 
      alternates: [
        { lang: 'zh', href: `${BASE_URL}/zh/faq/` }, 
        { lang: 'en', href: `${BASE_URL}/faq/` }
      ] 
    },
    { 
      loc: `${BASE_URL}/zh/articles/page/1/`, 
      lastmod: today, // Could be date of latest article
      alternates: [
        { lang: 'zh', href: `${BASE_URL}/zh/articles/page/1/` }, 
        { lang: 'en', href: `${BASE_URL}/articles/page/1/` }
      ] 
    },
  ];

  // Individual articles
  articles.forEach(article => {
    const articleLastMod = formatDate(article.date_updated);
    // English version
    urls.push({
      loc: `${BASE_URL}/article/${article.slug}/`, // Corrected path
      lastmod: articleLastMod,
      alternates: [
        { lang: 'en', href: `${BASE_URL}/article/${article.slug}/` }, // Corrected path
        { lang: 'zh', href: `${BASE_URL}/zh/article/${article.slug}/` } // Corrected path
      ]
    });
    // Chinese version
    urls.push({
      loc: `${BASE_URL}/zh/article/${article.slug}/`, // Corrected path
      lastmod: articleLastMod,
      alternates: [
        { lang: 'zh', href: `${BASE_URL}/zh/article/${article.slug}/` }, // Corrected path
        { lang: 'en', href: `${BASE_URL}/article/${article.slug}/` } // Corrected path
      ]
    });
  });

  const uniqueUrls = Array.from(new Set(urls.map(url => url.loc)))
    .map(loc => urls.find(url => url.loc === loc)!);


  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
  ${uniqueUrls.map(url => `
  <url>
    <loc>${url.loc}</loc>
    <lastmod>${url.lastmod}</lastmod>
    ${url.alternates.map(alt => `<xhtml:link rel="alternate" hreflang="${alt.lang}" href="${alt.href}" />`).join('\n    ')}
  </url>`).join('')}
</urlset>`;

  const publicDir = path.join(process.cwd(), 'public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }
  fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), sitemapXml.trim());
  console.log('Sitemap generated successfully at public/sitemap.xml');
}

generateSitemap().catch(error => {
  console.error('Error generating sitemap:', error);
  process.exit(1);
});
