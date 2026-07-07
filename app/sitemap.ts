import type { MetadataRoute } from 'next';
import { posts } from '@/lib/posts';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://dhiglabs.org';

  const pages = ['', '/research', '/platform', '/about', '/contact', '/blog'].map((path) => ({
    url: `${base}${path}`,
  }));

  const postUrls = posts.map((post) => ({
    url: `${base}/blog/${post.slug}`,
    lastModified: post.date,
  }));

  return [...pages, ...postUrls];
}
