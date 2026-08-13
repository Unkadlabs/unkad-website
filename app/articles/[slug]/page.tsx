import type { Metadata } from 'next';
import Link from 'next/link';
import { getAllArticles, getArticle, longDate } from '@/lib/articles';
import { publications } from '@/lib/publications';

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

  // If this article is a research note, its ledger entry supplies the note
  // number, artifacts, and citation for the side rail.
  const pub = publications.find((p) => p.slug === slug);
  const noteNo = pub
    ? String(publications.length - publications.indexOf(pub)).padStart(2, '0')
    : null;

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

      <article className="article-main">
        <p className="article-kicker">
          {pub ? `Research note ${noteNo}` : 'Lab essay'} ·{' '}
          <time dateTime={article.date}>{longDate(article.date)}</time> ·{' '}
          {article.readingMinutes} min read
        </p>
        <h1>{article.title}</h1>
        <p className="article-dek">{article.description}</p>
        <p className="article-byline">Unkad Labs</p>

        <div className="article-body" dangerouslySetInnerHTML={{ __html: article.html }} />

        <footer className="article-foot">
          {article.topics.length > 0 && <p>Topics: {article.topics.join(' / ')}</p>}
          {pub && (
            <details>
              <summary>Cite this note (BibTeX)</summary>
              <pre>{pub.bibtex}</pre>
            </details>
          )}
          <p style={{ marginTop: 'var(--s3)' }}>
            <Link href="/articles">← All articles</Link>
          </p>
        </footer>
      </article>

      <aside className="article-side">
        <div className="article-side-inner">
          {article.headings.length > 1 && (
            <nav className="rail-block toc" aria-label="On this page">
              <p className="rail-head">On this page</p>
              <ul>
                {article.headings.map((h) => (
                  <li key={h.id}>
                    <a href={`#${h.id}`}>{h.text}</a>
                  </li>
                ))}
              </ul>
            </nav>
          )}

          {pub && (
            <div className="rail-block">
              <p className="rail-head">Evidence</p>
              <ul>
                {pub.artifacts
                  .filter((a) => !a.href.startsWith('/'))
                  .map((a) => (
                    <li key={a.href}>
                      <a href={a.href}>{a.label}</a>
                    </li>
                  ))}
              </ul>
            </div>
          )}

          {pub && (
            <div className="rail-block">
              <p className="rail-head">Status</p>
              <p className="rail-meta">{pub.venue} · not peer-reviewed</p>
            </div>
          )}
        </div>
      </aside>
    </div>
  );
}
