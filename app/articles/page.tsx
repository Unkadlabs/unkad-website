import type { Metadata } from 'next';
import Link from 'next/link';
import { getAllArticles, shortDate } from '@/lib/articles';

export const metadata: Metadata = {
  title: 'Articles',
  description:
    'Writing from Unkad Labs on Somali language AI, alignment, and building open research infrastructure.',
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
    <div className="container rv2">
      <span className="eyebrow">Articles &middot; Unkad Labs</span>
      <h1>Everything we write, in the order we learned it.</h1>
      <p className="article-lead">
        Research notes with their evidence attached, and the occasional piece about building
        the lab itself. Failed predictions stay published.
      </p>

      <ul className="dated-list rv2-dated">
        {articles.map((article) => (
          <li key={article.slug}>
            <time dateTime={article.date}>{shortDate(article.date)}</time>
            <p className="title">
              <Link href={`/articles/${article.slug}`}>{article.title}</Link>
            </p>
          </li>
        ))}
      </ul>

      <p className="hint-line">
        Research notes also live on the <Link href="/research">publications index</Link>, with
        BibTeX and artifacts.
      </p>
    </div>
  );
}
