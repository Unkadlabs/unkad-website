import type { Metadata } from 'next';
import Link from 'next/link';
import { getAllArticles, longDate } from '@/lib/articles';
import { publications } from '@/lib/publications';

export const metadata: Metadata = {
  title: 'Articles',
  description:
    'Writing from Unkad Labs on Somali language AI, alignment, and building open research infrastructure. Research notes with their evidence attached; failed predictions stay published.',
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

// The first sentence of the description serves as the dek: enough context
// to choose what to read without repeating the whole standfirst.
function dek(description: string): string {
  const i = description.indexOf('. ');
  return i > 40 ? description.slice(0, i + 1) : description;
}

export default function ArticlesIndexPage() {
  const articles = getAllArticles();

  return (
    <div className="container">
      <section className="page-open">
        <h1>Articles</h1>
        <div className="prose">
          <p>
            Research notes with their evidence attached, and the occasional piece about
            building the lab itself. Failed predictions stay published.
          </p>
        </div>
      </section>

      <section className="section">
        <div>
          {articles.map((article) => {
            const pub = publications.find((p) => p.slug === article.slug);
            const noteNo = pub
              ? String(publications.length - publications.indexOf(pub)).padStart(2, '0')
              : null;
            return (
              <article className="index-entry" key={article.slug}>
                <div className="record-rail">
                  <span className="record-id">{pub ? `Note ${noteNo}` : 'Lab essay'}</span>
                  <time dateTime={article.date}>{longDate(article.date)}</time>
                </div>
                <div>
                  <h2 className="index-title">
                    <Link href={`/articles/${article.slug}`}>{article.title}</Link>
                  </h2>
                  <p className="index-dek">{dek(article.description)}</p>
                  <p className="index-meta">
                    {article.topics.length > 0 && <>{article.topics.join(' / ')} · </>}
                    {pub ? 'Research note' : 'Essay'}
                  </p>
                </div>
              </article>
            );
          })}
        </div>
        <p className="meta" style={{ marginTop: 'var(--s4)' }}>
          Research notes also live on the <Link href="/research">research page</Link>, with
          BibTeX and artifacts.
        </p>
      </section>
    </div>
  );
}
