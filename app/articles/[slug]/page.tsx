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
    keywords: article.keywords.length > 0 ? article.keywords : undefined,
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
      // A real figure beats a generated card when the article has one.
      ...(article.image ? { images: [{ url: article.image }] } : {}),
    },
    twitter: article.image
      ? { card: 'summary_large_image', images: [article.image] }
      : undefined,
  };
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = getArticle(slug);

  const shareUrl = `https://x.com/intent/post?text=${encodeURIComponent(
    article.title
  )}&url=${encodeURIComponent(`https://www.unkad.com/articles/${slug}`)}&via=unkadlabs`;

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.description,
    datePublished: article.date,
    inLanguage: 'en',
    keywords: article.keywords.join(', ') || undefined,
    mainEntityOfPage: `https://www.unkad.com/articles/${slug}`,
    image: article.image
      ? `https://www.unkad.com${article.image}`
      : `https://www.unkad.com/articles/${slug}/opengraph-image`,
    author: { '@type': 'Organization', name: 'Unkad Labs', url: 'https://www.unkad.com' },
    publisher: {
      '@type': 'Organization',
      name: 'Unkad Labs',
      logo: { '@type': 'ImageObject', url: 'https://www.unkad.com/icon.svg' },
    },
  };

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Unkad Labs', item: 'https://www.unkad.com' },
      { '@type': 'ListItem', position: 2, name: 'Articles', item: 'https://www.unkad.com/articles' },
      { '@type': 'ListItem', position: 3, name: article.title },
    ],
  };

  return (
    <div className="article-shell">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <aside className="article-side">
        <p className="back-link">
          <Link href="/articles">← All articles</Link>
        </p>

        <div className="side-block">
          <p className="side-meta">
            <time dateTime={article.date}>{longDate(article.date)}</time>
          </p>
          <p className="side-meta">{article.readingMinutes} min read</p>
        </div>

        {article.topics.length > 0 && (
          <div className="side-block">
            <p className="side-head">Topics</p>
            <div className="chip-row">
              {article.topics.map((topic) => (
                <span key={topic} className="chip">
                  {topic}
                </span>
              ))}
            </div>
          </div>
        )}

        {article.headings.length > 1 && (
          <nav className="side-block toc" aria-label="On this page">
            <p className="side-head">On this page</p>
            <ul>
              {article.headings.map((h) => (
                <li key={h.id}>
                  <a href={`#${h.id}`}>{h.text}</a>
                </li>
              ))}
            </ul>
          </nav>
        )}

        <div className="side-block">
          <a className="side-share" href={shareUrl}>
            Share on X →
          </a>
        </div>
      </aside>

      <article className="article-main">
        <h1>{article.title}</h1>
        <p className="post-meta">
          <time dateTime={article.date}>{longDate(article.date)}</time> · Unkad Labs ·{' '}
          {article.readingMinutes} min read
        </p>
        <p className="article-lead">{article.description}</p>

        <div className="article-body" dangerouslySetInnerHTML={{ __html: article.html }} />
      </article>
    </div>
  );
}
