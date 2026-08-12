'use client';

// The publications register. Each entry is a record, not a teaser: a
// left rail carries the accession number and date in the mono voice
// (everything measured or dated is mono; everything argued is serif),
// and the record leads with the finding's focal number, exactly as the
// article's own social card does. Scanning the page top to bottom reads
// as a column of findings.

import { useState } from 'react';
import Link from 'next/link';
import type { Publication } from '@/lib/publications';

function longDate(iso: string): string {
  return new Date(iso + 'T00:00:00Z').toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  });
}

function PubEntry({ pub, note }: { pub: Publication; note: number }) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  function copy() {
    navigator.clipboard?.writeText(pub.bibtex).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    });
  }

  return (
    <li className="pub" id={pub.slug}>
      <div className="pub-rail">
        <span className="pub-no">Note {String(note).padStart(2, '0')}</span>
        <time dateTime={pub.date}>{longDate(pub.date)}</time>
      </div>
      <div className="pub-body">
        <p className="pub-hook" aria-hidden="true">
          {pub.hook}
          <span className="pub-hook-label">{pub.hookLabel}</span>
        </p>
        <h3 className="pub-title">
          <Link href={`/articles/${pub.slug}`}>{pub.title}</Link>
        </h3>
        <p className="pub-finding">{pub.finding}</p>
        <div className="pub-links">
          {pub.artifacts.map((a) => (
            <a key={a.href} href={a.href}>
              {a.label}
            </a>
          ))}
          <button type="button" className="pub-bibtex-toggle" onClick={() => setOpen(!open)}>
            BibTeX
          </button>
        </div>
        {open && (
          <div className="pub-bibtex">
            <pre>{pub.bibtex}</pre>
            <button type="button" onClick={copy}>
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>
        )}
      </div>
    </li>
  );
}

export default function PublicationsList({ pubs }: { pubs: Publication[] }) {
  // Accession numbers are chronological: Note 01 is the oldest. The list
  // renders newest first, so the numbers count down.
  return (
    <ol className="pub-list" reversed>
      {pubs.map((p, i) => (
        <PubEntry key={p.slug} pub={p} note={pubs.length - i} />
      ))}
    </ol>
  );
}
