import type { Metadata } from 'next';
import Link from 'next/link';
import { getAllArticles, shortDate } from '@/lib/articles';

export const metadata: Metadata = {
  title: 'Articles',
  description:
    'Writing from Unkad Labs on Somali language AI, alignment, and building open research infrastructure from Mogadishu.',
  alternates: { canonical: '/articles' },
  openGraph: {
    siteName: 'Unkad Labs',
    locale: 'en_US',
    title: 'Articles · Unkad Labs',
    description: 'Writing from Unkad Labs on Somali language AI and alignment research.',
    type: 'website',
    url: '/articles',
  },
};

export default function ArticlesIndexPage() {
  const articles = getAllArticles();

  return (
    <div className="container">
      <h1>Articles</h1>

      <ul className="dated-list">
        {articles.map((article) => (
          <li key={article.slug}>
            <time dateTime={article.date}>{shortDate(article.date)}</time>
            <p className="title">
              <Link href={`/articles/${article.slug}`}>{article.title}</Link>
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
