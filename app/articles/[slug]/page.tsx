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
      siteName: 'Unkad Labs',
      locale: 'en_US',
      title: article.title,
      description: article.description,
      type: 'article',
      url: `/articles/${slug}`,
      publishedTime: article.date,
      authors: ['Unkad Labs'],
    },
  };
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = getArticle(slug);

  // Article structured data for search engines.
  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.description,
    datePublished: article.date,
    inLanguage: 'en',
    mainEntityOfPage: `https://unkad.com/articles/${slug}`,
    image: `https://unkad.com/articles/${slug}/opengraph-image`,
    author: { '@type': 'Organization', name: 'Unkad Labs', url: 'https://unkad.com' },
    publisher: {
      '@type': 'Organization',
      name: 'Unkad Labs',
      logo: { '@type': 'ImageObject', url: 'https://unkad.com/icon.svg' },
    },
  };

  return (
    <div className="container">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
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
