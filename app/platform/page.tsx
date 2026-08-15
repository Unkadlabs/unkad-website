import type { Metadata } from 'next';
import Link from 'next/link';
import LiveStats from '@/components/LiveStats';
import { CURRENT_RELEASE, RELEASES } from '@/lib/release';

export const metadata: Metadata = {
  title: 'Qor Af-Soomaali: the open Somali corpus',
  description:
    'Qor Af-Soomaali is the community-built Somali corpus behind Unkad Labs research: consented, peer-validated, linguist-verified, released in versioned open datasets, with each contributor\u2019s spoken variety recorded.',
  alternates: { canonical: '/platform' },
  openGraph: {
    siteName: 'Unkad Labs',
    locale: 'en_US',
    title: 'Qor Af-Soomaali · Unkad Labs',
    description:
      'The community-built Somali corpus: consented, peer-validated, linguist-verified, openly licensed.',
    type: 'website',
    url: '/platform',
  },
};

// Dataset structured data. Google Dataset Search is where researchers actually
// look for corpora, and it only lists pages that carry schema.org/Dataset.
// `creator` points at the Organization declared once in the root layout rather
// than restating it, so the corpus, the lab, and both domains resolve to one
// entity graph. No address on it — see the note in app/layout.tsx.
const datasetJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Dataset',
  '@id': 'https://www.unkad.com/platform#dataset',
  name: 'Qor Af-Soomaali — the Unkad Somali Corpus',
  alternateName: ['Unkad Somali Corpus', 'Qor Af-Soomaali'],
  description:
    'Community-contributed Somali text corpus: written, translated, and peer-validated by Somali speakers, with a linguist-verified tier. Every sentence has a named author who consented to release before writing it, a licence, a date, a label for the contributor\u2019s own spoken variety, and a validation record. Covers nine domains — health, education, agriculture, law, media, religion, culture, technology, and general. Dialect labels record the contributor\u2019s spoken variety, not the orthography of the text: all text is written in standard Somali orthography, because the Maay writing system is recent and few Maay speakers have been taught it. Built for AI safety evaluation and alignment research in low-resource languages.',
  url: 'https://www.unkad.com/platform',
  sameAs: [
    'https://qor.unkad.com',
    'https://huggingface.co/datasets/unkadlabs/qor-af-soomaali',
    'https://github.com/Unkadlabs/qor-af-soomaali',
  ],
  license: 'https://creativecommons.org/licenses/by-sa/4.0/',
  isAccessibleForFree: true,
  inLanguage: ['so', 'en'],
  version: CURRENT_RELEASE.replace(/^v/, ''),
  datePublished: '2026-07-30',
  dateModified: RELEASES[0].date,
  // Collection is ongoing and open-ended; stating an end date would be a claim
  // that it has stopped.
  temporalCoverage: '2026-07-19/..',
  creativeWorkStatus: 'Incomplete',
  distribution: [
    {
      '@type': 'DataDownload',
      name: 'Qor Af-Soomaali on Hugging Face',
      encodingFormat: 'application/jsonl',
      contentUrl: 'https://huggingface.co/datasets/unkadlabs/qor-af-soomaali',
    },
  ],
  measurementTechnique:
    'Human authorship with informed consent, two independent peer validations per item, and linguist verification before release.',
  variableMeasured: [
    'sentence text',
    'contribution mode',
    'register',
    'domain',
    'dialect',
    'validation record',
    'contributor credit choice',
  ],
  keywords: [
    'Somali',
    'Af-Soomaali',
    'low-resource language',
    'AI safety evaluation',
    'community-contributed',
    'data provenance',
    'consent-based data collection',
    'Maay',
    'Maxaa-tiri',
  ],
  creator: { '@id': 'https://www.unkad.com/#organization' },
  publisher: { '@id': 'https://www.unkad.com/#organization' },
};

// The contribution modes as they exist on the platform.
const MODES = [
  {
    so: 'Qor',
    en: 'Write',
    what: 'Contributors respond to prompts about everyday life — stories, instructions, dialogues, opinions — or write on a topic of their own. These are the registers of Somali that never made it onto the web.',
  },
  {
    so: 'Turjun',
    en: 'Translate',
    what: 'Short sentences move from English into Somali, producing the parallel data that makes like-for-like evaluation possible.',
  },
  {
    so: 'Guuri',
    en: 'Transcribe',
    what: 'Openly licensed and public-domain printed Somali is typed up, turning paper heritage into digital text.',
  },
  {
    so: 'Hubi',
    en: 'Validate',
    what: 'Contributors review each other’s work, asking one question: is this correct, natural Somali? It takes seconds and can be done on a phone.',
  },
];

// A representative released record. Field names come from the actual export
// schema; the values are illustrative of shape, not a real contributor's row.
const RECORD_EXAMPLE = `{
  "id": "…",
  "text_so": "…",            // the Somali text
  "text_en": null,           // source sentence, translation mode only
  "meaning_en": null,        // meaning gloss, proverb mode only
  "mode": "write",           // write | translate | transcribe | proverb
  "register": "everyday",
  "sector": "health",        // one of nine domains
  "topic": null,             // contributor-stated topic, free-writing only
  "dialect": "maxaa_tiri",   // the CONTRIBUTOR\u2019s spoken variety, not the text\u2019s orthography
  "verified": true,          // linguist-verified tier
  "license": "CC BY-SA 4.0",
  "created_at": "2026-08-09"
}`;

export default function PlatformPage() {
  return (
    <div className="container">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(datasetJsonLd) }}
      />

      <section className="page-open">
        <h1 lang="so">Qor Af-Soomaali</h1>
        <div className="prose">
          <p>
            <span lang="so">Qor Af-Soomaali</span> — write Somali — is the data program behind
            our evaluation research: a community platform where Somali speakers write,
            translate, transcribe, and validate the language, and a versioned open dataset
            built from what they make. It exists because safety evaluation has to be built out
            of language, and for Somali that language had to be created, not scraped.
          </p>
        </div>
        <div className="action-row">
          <a className="btn" href="https://qor.unkad.com">
            Contribute on qor.unkad.com
          </a>
          <a
            className="action-link"
            href="https://huggingface.co/datasets/unkadlabs/qor-af-soomaali"
          >
            Download the current release →
          </a>
        </div>
      </section>

      <section className="section" aria-labelledby="h-live">
        <h2 className="section-head" id="h-live">
          The corpus today
        </h2>
        <div style={{ marginTop: 'var(--s5)' }}>
          <LiveStats version={CURRENT_RELEASE} />
          <p className="ledger-note">
            Counts update live from the platform. A sentence is counted once two independent
            community validators accept it; releases additionally require linguist
            verification.
          </p>
        </div>
      </section>

      <section className="section" aria-labelledby="h-provenance">
        <h2 className="section-head" id="h-provenance">
          How a sentence earns its place
        </h2>
        <ol className="flow" style={{ marginTop: 'var(--s5)' }}>
          <li>
            <div>
              <span className="flow-actor">A contributor writes.</span>
              <p>
                Before their first sentence, every contributor explicitly consents to the open
                license and chooses how to be credited: by name, by pseudonym, or anonymously.
                The item records its mode, register, domain, and the contributor&rsquo;s
                dialect from the moment it is written.
              </p>
            </div>
          </li>
          <li>
            <div>
              <span className="flow-actor">Two peers validate.</span>
              <p>
                Two independent community members judge each submission. Two approvals accept
                it; two rejections reject it. Nobody validates their own work, and the platform
                enforces one vote per person per item.
              </p>
            </div>
          </li>
          <li>
            <div>
              <span className="flow-actor">Disagreements escalate.</span>
              <p>
                A split vote escalates automatically, and a trusted reviewer&rsquo;s vote
                settles it. The full validation record stays attached to the item.
              </p>
            </div>
          </li>
          <li>
            <div>
              <span className="flow-actor">A linguist verifies.</span>
              <p>
                Community-accepted items pass to linguist reviewers for final sign-off. Only
                verified items enter official releases.
              </p>
            </div>
          </li>
          <li>
            <div>
              <span className="flow-actor">A versioned release ships.</span>
              <p>
                Verified items are exported with their provenance into a versioned dataset on
                Hugging Face, with an auto-generated dataset card and a credits file honoring
                each contributor&rsquo;s choice.
              </p>
            </div>
          </li>
        </ol>
      </section>

      <section className="section" aria-labelledby="h-modes">
        <h2 className="section-head" id="h-modes">
          Four ways to contribute
        </h2>
        <ul className="facts" style={{ marginTop: 'var(--s5)' }}>
          {MODES.map((m) => (
            <li key={m.so}>
              <span className="k">
                <strong lang="so">{m.so}</strong> · {m.en}
              </span>
              <span>{m.what}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="section" aria-labelledby="h-record">
        <h2 className="section-head" id="h-record">
          What a released record looks like
        </h2>
        <div className="prose" style={{ marginTop: 'var(--s5)' }}>
          <p>
            Field names below are the dataset&rsquo;s actual schema. The values shown are
            illustrative; every real record carries a known author, a consent record, and its
            validation history.
          </p>
        </div>
        <pre style={{ marginTop: 'var(--s4)', maxWidth: '46rem' }}>
          <code>{RECORD_EXAMPLE}</code>
        </pre>
      </section>

      <section className="section" aria-labelledby="h-consent">
        <h2 className="section-head" id="h-consent">
          Consent and governance
        </h2>
        <div className="prose" style={{ marginTop: 'var(--s5)' }}>
          <p>
            Nobody&rsquo;s words enter the corpus without their knowledge. Consent is collected
            before contribution, not after; credit is the contributor&rsquo;s choice; and
            account deletion never deletes the consent record attached to already-released
            work. All data is released under{' '}
            <a href="https://creativecommons.org/licenses/by-sa/4.0/">CC BY-SA 4.0</a> in
            versioned datasets, so researchers, developers, and the Somali community itself can
            build on it without restriction. The full collection policy and dataset
            documentation live on the{' '}
            <a href="https://huggingface.co/datasets/unkadlabs/qor-af-soomaali">
              dataset card
            </a>{' '}
            and in the{' '}
            <a href="https://github.com/Unkadlabs/qor-af-soomaali">platform source</a>, which is
            open so that any language community can deploy it.
          </p>
        </div>
      </section>

      <section className="section" aria-labelledby="h-releases">
        <h2 className="section-head" id="h-releases">
          Release history
        </h2>
        <div className="table-scroll" style={{ marginTop: 'var(--s5)' }}>
          <table>
            <thead>
              <tr>
                <th>Version</th>
                <th>Date</th>
                <th className="num">Verified records</th>
                <th>Notes</th>
              </tr>
            </thead>
            <tbody>
              {RELEASES.map((r) => (
                <tr key={r.version}>
                  <td className="mono">{r.version}</td>
                  <td>{r.date}</td>
                  <td className="num">{r.records}</td>
                  <td>
                    {r.version === CURRENT_RELEASE ? 'Current release' : ''}
                    {r.version === CURRENT_RELEASE && r.notes ? ' · ' : ''}
                    {r.notes}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="meta" style={{ marginTop: 'var(--s4)' }}>
          All releases:{' '}
          <a href="https://huggingface.co/datasets/unkadlabs/qor-af-soomaali">
            huggingface.co/datasets/unkadlabs/qor-af-soomaali
          </a>
        </p>
      </section>

      <section className="section" aria-labelledby="h-partner">
        <h2 className="section-head" id="h-partner">
          Working with the program
        </h2>
        <div className="prose" style={{ marginTop: 'var(--s5)' }}>
          <p>
            Universities, schools, and organizations that want to bring their community onto
            Qor — or take the platform to another language — should{' '}
            <Link href="/contact">get in touch</Link>.
          </p>
        </div>
      </section>
    </div>
  );
}
