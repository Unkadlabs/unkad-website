import type { Metadata } from 'next';
import Link from 'next/link';
import LiveStats from '@/components/LiveStats';
import { publications } from '@/lib/publications';

export const metadata: Metadata = {
  // Home keeps the full default title from the layout (no template suffix).
  title: { absolute: 'Unkad Labs · Somali language AI and alignment research' },
  description:
    'Unkad Labs is a non-profit AI research laboratory measuring whether AI systems are safe in Somali, and building the open data that safety evaluation requires.',
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

function GapChart() {
  return (
    <div>
      <p className="gapchart-title">
        The same harmful request, refused in English, answered in Somali.
      </p>
      {GAP.map((r) => (
        <div className="gc-row" key={r.model}>
          <p className="gc-model">{r.model}</p>
          <div className="gc-line">
            <span>English</span>
            <span className="gc-track">
              <i style={{ width: `${r.en}%` }} />
            </span>
            <span className="gc-val">{r.en}%</span>
          </div>
          <div className="gc-line gc-so">
            <span>Somali</span>
            <span className="gc-track">
              <i style={{ width: `${r.so}%` }} />
            </span>
            <span className="gc-val">{r.so}%</span>
          </div>
        </div>
      ))}
      <p className="stage-note">
        Refusal rate on identical harmful requests, verified by native speakers.{' '}
        <a href="https://huggingface.co/spaces/unkadlabs/somalibench">
          Full results on the SomaliBench leaderboard
        </a>
        .
      </p>
    </div>
  );
}

export default function HomePage() {
  const latest = publications.slice(0, 3);

  return (
    <div className="container rv2">
      <span className="eyebrow">
        Unkad Labs &middot; <span lang="so">unkad, creation from nothing</span>
      </span>

      <div className="hero-split">
        <h1>Measuring whether AI safety survives a change of language.</h1>
        <div className="hero-aside">
          <p>
            Unkad Labs is a non-profit AI research laboratory. We measure whether AI systems
            behave safely in Somali, and we build the open language data that safety evaluation
            requires. The methods are designed to transfer to the hundreds of languages in the
            same position.
          </p>
          <div className="pills">
            <a className="pill solid" href="https://qor.unkad.com" lang="so">
              Qor Af-Soomaali
            </a>
            <Link className="pill line" href="/research">
              Read the research
            </Link>
          </div>
        </div>
      </div>

      <div className="ticker" aria-label="Latest updates">
        <span className="item">
          <span>09/08/2026</span>
          <span className="tag data">DATA</span>
          <a href="https://huggingface.co/datasets/unkadlabs/qor-af-soomaali">
            Corpus v0.2.1 released: 2,282 verified sentences
          </a>
        </span>
        <span className="item">
          <span>05/08/2026</span>
          <span className="tag note">NOTE</span>
          <Link href="/articles/one-model-reads-somali">
            One model reads Somali. The next one approves word salad.
          </Link>
        </span>
      </div>

      <div className="stage">
        <div className="stage-grid">
          <div>
            <p className="stage-kicker">
              <strong>Measurement</strong> &middot; SomaliBench, 07/2026
            </p>
            <GapChart />
          </div>
          <div>
            <p className="stage-kicker">
              <strong>Data</strong> &middot; qor.unkad.com, live now
            </p>
            <LiveStats
              goalLabel="Progress toward 100,000 sentences"
              sentencesLabel="validated sentences"
              contributorsLabel="contributors"
              pendingLabel="awaiting validation"
            />
            <p className="stage-note">
              Every sentence written by a consenting Somali speaker, validated twice, verified by
              a linguist, released under CC BY-SA 4.0.{' '}
              <span lang="so">Ereyada waa hanti.</span>
            </p>
          </div>
        </div>
      </div>

      <span className="eyebrow">Latest findings</span>
      <ol className="pub-list" reversed>
        {latest.map((p, i) => (
          <li className="pub" key={p.slug}>
            <div className="pub-rail">
              <span className="pub-no">Note {String(publications.length - i).padStart(2, '0')}</span>
              <time dateTime={p.date}>
                {new Date(p.date + 'T00:00:00Z').toLocaleDateString('en-GB', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                  timeZone: 'UTC',
                })}
              </time>
            </div>
            <div className="pub-body">
              <p className="pub-hook" aria-hidden="true">
                {p.hook}
                <span className="pub-hook-label">{p.hookLabel}</span>
              </p>
              <h3 className="pub-title">
                <Link href={`/articles/${p.slug}`}>{p.title}</Link>
              </h3>
              <div className="pub-links">
                <Link href={`/articles/${p.slug}`}>Article</Link>
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
          </li>
        ))}
      </ol>
      <p className="hint-line">
        <Link href="/research">All six research notes, with BibTeX &rarr;</Link>
      </p>

      <span className="eyebrow">Two doors</span>
      <div className="cols">
        <a className="ws-card" href="https://qor.unkad.com" lang="so">
          <h3>Qor Af-Soomaali</h3>
          <p>
            Haddii aad ku hadasho af-Soomaali: qor, turjun, ama hubi jumlado. Wax ka yar toban
            daqiiqo isbuucii ayaa ku filan, magacaaguna wuxuu ku jiri doonaa kaydka.
          </p>
          <span className="ws-more">qor.unkad.com &rarr;</span>
        </a>
        <Link className="ws-card" href="/contact">
          <h3>Work with us</h3>
          <p>
            Researchers, replicators, funders, and other language communities who want this
            platform for their own language: everything we build is open, and collaboration is
            the point.
          </p>
          <span className="ws-more">Start a conversation &rarr;</span>
        </Link>
      </div>

      <hr />

      <p>
        Everything we produce is published openly, including methodology and negative results,
        on <a href="https://github.com/unkadlabs">GitHub</a> and{' '}
        <a href="https://huggingface.co/unkadlabs">Hugging Face</a>.
      </p>
    </div>
  );
}
