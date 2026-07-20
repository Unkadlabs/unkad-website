// Markdown-based articles.
// To publish an article: drop a .md file into content/articles/ with
// frontmatter (title, date, description; optional topics, keywords, image).
// The filename becomes the URL slug. The index, sitemap, metadata, table
// of contents, and reading time all derive from the file at build time.

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
  topics: string[]; // short display chips (e.g. "Evaluation")
  keywords: string[]; // SEO keywords, merged into page metadata
  image: string | null; // optional hero/OG image path (e.g. /images/x.png)
};

export type Heading = { id: string; text: string };

export type Article = ArticleMeta & {
  html: string;
  headings: Heading[];
  readingMinutes: number;
};

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/<[^>]+>/g, '')
    .replace(/&[a-z]+;/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function toMeta(slug: string, data: Record<string, unknown>): ArticleMeta {
  return {
    slug,
    title: String(data.title ?? slug),
    date: String(data.date ?? ''),
    description: String(data.description ?? ''),
    topics: Array.isArray(data.topics) ? data.topics.map(String) : [],
    keywords: Array.isArray(data.keywords) ? data.keywords.map(String) : [],
    image: data.image ? String(data.image) : null,
  };
}

export function getAllArticles(): ArticleMeta[] {
  const files = fs.readdirSync(ARTICLES_DIR).filter((f) => f.endsWith('.md'));

  const articles = files.map((file) => {
    const slug = file.replace(/\.md$/, '');
    const raw = fs.readFileSync(path.join(ARTICLES_DIR, file), 'utf8');
    const { data } = matter(raw);
    return toMeta(slug, data);
  });

  // Newest first.
  return articles.sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getArticle(slug: string): Article {
  const raw = fs.readFileSync(path.join(ARTICLES_DIR, `${slug}.md`), 'utf8');
  const { data, content } = matter(raw);

  let html = marked.parse(content) as string;

  // Give h2s stable ids (for the table of contents) and collect them.
  const decode = (s: string) =>
    s
      .replace(/<[^>]+>/g, '')
      .replace(/&#39;/g, '’')
      .replace(/&quot;/g, '"')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>');
  const headings: Heading[] = [];
  html = html.replace(/<h2>([\s\S]*?)<\/h2>/g, (_m, inner: string) => {
    const id = slugify(inner);
    headings.push({ id, text: decode(inner) });
    return `<h2 id="${id}">${inner}</h2>`;
  });

  // Images: constrain and link to the full-size file.
  html = html.replace(
    /<img ([^>]*?)>/g,
    (_m, attrs: string) => `<img ${attrs} loading="lazy" decoding="async">`
  );

  const words = content.split(/\s+/).filter(Boolean).length;

  return {
    ...toMeta(slug, data),
    html,
    headings,
    readingMinutes: Math.max(1, Math.round(words / 200)),
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
