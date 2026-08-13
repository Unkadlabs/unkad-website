import type { Metadata } from 'next';
import Link from 'next/link';
import LiveStats from '@/components/LiveStats';
import { publications } from '@/lib/publications';
import { CURRENT_RELEASE } from '@/lib/release';

export const metadata: Metadata = {
  // Home keeps the full default title from the layout (no template suffix).
  title: { absolute: 'Unkad Labs · Somali language AI and alignment research' },
  description:
    'Unkad Labs is an independent AI research lab measuring whether AI systems are safe in Somali, and building the open data that safety evaluation requires.',
  alternates: { canonical: '/' },
  openGraph: {
    siteName: 'Unkad Labs',
    locale: 'en_US',
    title: 'Unkad Labs',
    description:
      'Measuring whether AI systems are safe in Somali, and building the open data that safety evaluation requires.',
    type: 'website',
    url: '/',
  },
};

// Refusal rates from SomaliBench, measured July 2026. Same prompts, same
// models; the only variable is the language. Rendered as markup rather
// than an image so the numbers stay text: searchable, translatable,
// honest at any zoom level.
const GAP = [
  { model: 'Llama 3.1 8B', en: 97, so: 7 },
  { model: 'Aya 23 8B', en: 80, so: 5 },
];

function GapFigure() {
  return (
    <figure className="evidence">
      {GAP.map((r) => (
        <div className="gap-row" key={r.model}>
          <p className="gap-model">{r.model}</p>
          <div className="gap-line">
            <span>English</span>
            <span className="gap-track">
              <i style={{ width: `${r.en}%` }} />
            </span>
            <span className="gap-val">{r.en}%</span>
          </div>
          <div className="gap-line is-somali">
            <span lang="so">Soomaali</span>
            <span className="gap-track">
              <i style={{ width: `${r.so}%` }} />
            </span>
            <span className="gap-val">{r.so}%</span>
          </div>
        </div>
      ))}
      <figcaption className="evidence-caption">
        Refusal rate on 100 identical harmful requests, English versus Somali, verified by
        native speakers. SomaliBench, July 2026.{' '}
        <a href="https://huggingface.co/spaces/unkadlabs/somalibench">
          Full results and method on the leaderboard
        </a>
        .
      </figcaption>
    </figure>
  );
}

const dateFmt = (d: string) =>
  new Date(d + 'T00:00:00Z').toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  });

export default function HomePage() {
  const latest = publications.slice(0, 3);

  return (
    <div className="container">
      <section className="identity">
        <p className="identity-name">
          Unkad Labs <span className="identity-status">· independent AI research lab</span>
        </p>
        <h1>Does AI safety survive a change of language?</h1>
        <div className="prose">
          <p>
            We measure whether AI systems behave safely in Somali, and we build the open
            language data that safety evaluation requires. Models that refuse a harmful request
            in English will often answer the same request in Somali; safety filters that catch
            harm in English wave it through. We document these failures with methods designed
            to transfer to the hundreds of languages in the same position.
          </p>
        </div>
        <div className="action-row">
          <Link className="btn" href="/research">
            See the research
          </Link>
          <a className="action-link" href="https://qor.unkad.com" lang="so">
            Qor Af-Soomaali →
          </a>
        </div>
      </section>

      <section className="section" aria-labelledby="h-measurement">
        <h2 className="section-head" id="h-measurement">
          The defining measurement
        </h2>
        <GapFigure />
      </section>

      <section className="section" aria-labelledby="h-findings">
        <h2 className="section-head" id="h-findings">
          Latest research
        </h2>
        <div>
          {latest.map((p, i) => (
            <article className="record" key={p.slug}>
              <div className="record-rail">
                <span className="record-id">
                  Note {String(publications.length - i).padStart(2, '0')}
                </span>
                <time dateTime={p.date}>{dateFmt(p.date)}</time>
              </div>
              <div>
                <h3 className="record-title">
                  <Link href={`/articles/${p.slug}`}>{p.title}</Link>
                </h3>
                <p className="record-finding">{p.finding}</p>
                <div className="record-links">
                  <Link href={`/articles/${p.slug}`} aria-label={`Article: ${p.title}`}>
                    Article
                  </Link>
                  {p.artifacts
                    .filter((a) => !a.href.startsWith('/'))
                    .slice(0, 2)
                    .map((a) => (
                      <a key={a.href} href={a.href}>
                        {a.label}
                      </a>
                    ))}
                </div>
              </div>
            </article>
          ))}
        </div>
        <p className="meta" style={{ marginTop: 'var(--s4)' }}>
          <Link href="/research">All {publications.length} research notes, with BibTeX →</Link>
        </p>
      </section>

      <section className="section" aria-labelledby="h-data">
        <h2 className="section-head" id="h-data">
          The data program
        </h2>
        <div style={{ marginTop: 'var(--s5)' }}>
          <LiveStats version={CURRENT_RELEASE} />
          <p className="ledger-note">
            Qor Af-Soomaali is the corpus this research depends on. Every sentence is written
            by a consenting Somali speaker and accepted by two independent validators;
            releases additionally require linguist verification, and ship with per-sentence
            provenance under CC BY-SA 4.0.
          </p>
          <div className="record-links" style={{ marginTop: 'var(--s3)' }}>
            <a href="https://huggingface.co/datasets/unkadlabs/qor-af-soomaali">
              Download the dataset
            </a>
            <a href="https://qor.unkad.com">Contribute Somali</a>
            <Link href="/platform">How the corpus is built</Link>
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="h-institution">
        <h2 className="section-head" id="h-institution">
          The lab
        </h2>
        <ul className="facts" style={{ marginTop: 'var(--s5)' }}>
          <li>
            <span className="k">Status</span>
            <span>Independent research lab, founded 2026</span>
          </li>
          <li>
            <span className="k">Structure</span>
            <span>
              Founder-led, with a volunteer community of Somali-speaking contributors and
              reviewers
            </span>
          </li>
          <li>
            <span className="k">Output</span>
            <span>
              {publications.length} research notes, 2 open datasets, 1 public benchmark — all
              code and data on <a href="https://github.com/Unkadlabs">GitHub</a> and{' '}
              <a href="https://huggingface.co/unkadlabs">Hugging Face</a>
            </span>
          </li>
          <li>
            <span className="k">Practice</span>
            <span>
              Predictions registered before experiments run; failed predictions and null
              results published
            </span>
          </li>
          <li>
            <span className="k">Contact</span>
            <span>
              <a href="mailto:research@unkad.com">research@unkad.com</a>
            </span>
          </li>
        </ul>
      </section>
    </div>
  );
}
