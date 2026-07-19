// Markdown-based articles.
// To publish an article: drop a .md file into content/articles/ with
// frontmatter (title, date, description). The filename becomes the URL slug.
// The index, sitemap, and metadata all update automatically at build time.

import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { marked } from 'marked';

const ARTICLES_DIR = path.join(process.cwd(), 'content', 'articles');

export type ArticleMeta = {
  slug: string;
  title: string;
  date: string; // ISO date from frontmatter
  description: string;
};

export type Article = ArticleMeta & {
  html: string;
};

export function getAllArticles(): ArticleMeta[] {
  const files = fs.readdirSync(ARTICLES_DIR).filter((f) => f.endsWith('.md'));

  const articles = files.map((file) => {
    const slug = file.replace(/\.md$/, '');
    const raw = fs.readFileSync(path.join(ARTICLES_DIR, file), 'utf8');
    const { data } = matter(raw);
    return {
      slug,
      title: String(data.title ?? slug),
      date: String(data.date ?? ''),
      description: String(data.description ?? ''),
    };
  });

  // Newest first.
  return articles.sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getArticle(slug: string): Article {
  const raw = fs.readFileSync(path.join(ARTICLES_DIR, `${slug}.md`), 'utf8');
  const { data, content } = matter(raw);
  const html = marked.parse(content) as string;
  return {
    slug,
    title: String(data.title ?? slug),
    date: String(data.date ?? ''),
    description: String(data.description ?? ''),
    html,
  };
}

// "Jul 2026" for the index margin.
export function shortDate(iso: string): string {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString('en-US', {
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  });
}

// "July 19, 2026" for the article header.
export function longDate(iso: string): string {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  });
}
