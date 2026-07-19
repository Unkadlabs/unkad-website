import type { Metadata } from 'next';
import Link from 'next/link';
import { getAllArticles, getArticle, longDate } from '@/lib/articles';

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getAllArticles().map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticle(slug);
  return {
    title: article.title,
    description: article.description,
    alternates: { canonical: `/articles/${slug}` },
    openGraph: {
      title: article.title,
      description: article.description,
      type: 'article',
      url: `/articles/${slug}`,
    },
  };
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = getArticle(slug);

  return (
    <div className="container">
      <article>
        <p className="back-link">
          <Link href="/articles">← All articles</Link>
        </p>

        <h1>{article.title}</h1>
        <p className="post-meta">
          <time dateTime={article.date}>{longDate(article.date)}</time> · Unkad Labs
        </p>

        <div className="article-body" dangerouslySetInnerHTML={{ __html: article.html }} />
      </article>
    </div>
  );
}
