import Link from 'next/link';
import type { Publication } from '@/lib/publications';

// The publication ledger: one bordered record per research output, id and
// date in the rail, finding and evidence in the body, BibTeX behind a
// disclosure. Durable research record, not a stylized rail.

const dateFmt = (d: string) =>
  new Date(d + 'T00:00:00Z').toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  });

export default function PublicationsList({ pubs }: { pubs: Publication[] }) {
  return (
    <div>
      {pubs.map((p, i) => (
        <article className="record" key={p.slug} id={p.slug}>
          <div className="record-rail">
            <span className="record-id">Note {String(pubs.length - i).padStart(2, '0')}</span>
            <time dateTime={p.date}>{dateFmt(p.date)}</time>
            <span className="record-status">{p.venue}</span>
          </div>
          <div>
            <h3 className="record-title">
              <Link href={`/articles/${p.slug}`}>{p.title}</Link>
            </h3>
            <p className="record-finding">{p.finding}</p>
            <div className="record-links">
              {p.artifacts.map((a) =>
                a.href.startsWith('/') ? (
                  <Link key={a.href} href={a.href}>
                    {a.label}
                  </Link>
                ) : (
                  <a key={a.href} href={a.href}>
                    {a.label}
                  </a>
                )
              )}
            </div>
            <details>
              <summary aria-label={`BibTeX for ${p.title}`}>BibTeX</summary>
              <pre>{p.bibtex}</pre>
            </details>
          </div>
        </article>
      ))}
    </div>
  );
}
