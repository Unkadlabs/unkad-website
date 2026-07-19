import type { MetadataRoute } from 'next';
import { getAllArticles } from '@/lib/articles';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://unkad.com';

  const pages = ['', '/research', '/platform', '/about', '/contact', '/articles'].map((path) => ({
    url: `${base}${path}`,
  }));

  const articleUrls = getAllArticles().map((article) => ({
    url: `${base}/articles/${article.slug}`,
    lastModified: article.date,
  }));

  return [...pages, ...articleUrls];
}
