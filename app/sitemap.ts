import type { MetadataRoute } from 'next';
import { getAllArticles } from '@/lib/articles';

export const dynamic = 'force-static';

// Every entry used to be a bare URL. That is valid, but it tells a crawler
// nothing about what is worth recrawling, so a research page that changes twice
// a year and an article index that changes weekly were offered as equals.
//
// Priority is relative within this file only — it has no effect on ranking
// against anyone else's site. It is a hint about which of our own pages matter
// when the crawler cannot fetch them all.
export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://www.unkad.com';

  const pages: MetadataRoute.Sitemap = [
    { url: base, changeFrequency: 'weekly', priority: 1 },
    // The two pages carrying the subject matter the lab wants to be found for.
    { url: `${base}/research`, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${base}/platform`, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${base}/articles`, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${base}/about`, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${base}/contact`, changeFrequency: 'yearly', priority: 0.4 },
  ];

  const articles = getAllArticles();

  // Articles are the only thing here that a stranger links to, so they carry
  // the freshness signal. Newest first and weighted highest: an article
  // published this week is the one most likely to be worth fetching now.
  const articleUrls: MetadataRoute.Sitemap = articles.map((article, i) => ({
    url: `${base}/articles/${article.slug}`,
    lastModified: article.date,
    changeFrequency: 'yearly',
    priority: i === 0 ? 0.9 : 0.7,
  }));

  return [...pages, ...articleUrls];
}
