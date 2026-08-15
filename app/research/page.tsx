import type { Metadata } from 'next';
import Link from 'next/link';
import PublicationsList from '@/components/PublicationsList';
import { publications } from '@/lib/publications';

export const metadata: Metadata = {
  // The title carries the search phrases this page is the natural home for.
  // "Research" alone told search engines nothing about what kind.
  title: 'AI alignment and scalable oversight research for Somali',
  description:
    'Safety and alignment research for Somali and other low-resource languages: seven published research notes with open code and data, refusal evaluations, guard-model failures, LLM judge collapse, and the evaluation infrastructure underneath.',
  alternates: { canonical: '/research' },
  openGraph: {
    siteName: 'Unkad Labs',
    locale: 'en_US',
    title: 'Research · Unkad Labs',
    description:
      'Seven research notes with open code and data: refusal gaps, guard-model failures, judge collapse, frontier evaluation, and grammaticality evaluation for Somali.',
    type: 'website',
    url: '/research',
  },
};

// The active research programs. Each answers: question, current experiment,
// latest output, next uncertainty. Vertical records, not cards.
const PROGRAMS = [
  {
    name: 'Refusal and safety evaluation',
    question: 'Do models refuse the same harmful requests in Somali that they refuse in English?',
    now: 'SomaliBench puts identical harmful requests to models in both languages, verified by native speakers, and publishes the refusal gap per model on a live leaderboard.',
    latest: 'Measured gaps of 0.97 → 0.07 (Llama 3.1) and 0.80 → 0.05 (Aya 23).',
    next: 'A low refusal rate does not always mean fluent harmful compliance; some Somali failures surface as incoherent output. Separating genuine compliance from low-quality generation is the central task for the next version.',
    link: {
      label: 'SomaliBench leaderboard',
      href: 'https://huggingface.co/spaces/unkadlabs/somalibench',
    },
  },
  {
    name: 'Oversight under language and access limits',
    question:
      'What happens to AI judges, guards, and overseers when the content they must judge is in a language they barely know?',
    now: 'A series of evaluations of guard models, LLM judges, and frontier models on community-labeled Somali, each with the raw judgments published.',
    latest:
      'Guards catch as little as 6% of harmful Somali while passing harmless Somali almost perfectly; frontier models reproduce almost none of a community’s quality rejections.',
    next: 'Whether a longer rubric with worked examples can recover any of the judgment gap, and whether the collapse tracks training-data volume across a ladder of languages.',
    link: {
      label: 'Latest note',
      href: '/articles/the-frontier-cannot-judge-somali',
    },
  },
  {
    name: 'Data and representation for low-resource languages',
    question:
      'Which properties of Somali text data — quantity, provenance, tokenization, dialect coverage — limit safety evaluation?',
    now: 'Building the Qor corpus with per-sentence provenance, measuring tokenizer treatment of Somali, and recording each contributor\u2019s own spoken variety.',
    latest:
      'Nine major tokenizers charge Somali 1.5–2.2× the tokens of English for identical content; a Somali-first tokenizer reaches 0.68×.',
    next: 'Whether tokenizer fragmentation contributes independently to the refusal gap, or both are symptoms of data scarcity. A separate limitation we have measured in our own corpus: Maay speakers write in standard Somali orthography, because the Maay writing system is recent and few speakers have been taught it, so dialect-disaggregated evaluation is not yet possible from text alone.',
    link: { label: 'Method and code', href: 'https://github.com/Unkadlabs/somali-token-tax' },
  },
];

export default function ResearchPage() {
  return (
    <div className="container">
      <section className="page-open">
        <h1>Research</h1>
        <div className="prose">
          <p>
            Safety behaviour in a language model is learned, not installed. A model refuses
            harmful requests because it was trained on examples of refusal, and those examples
            are overwhelmingly English. What happens in the remaining thousands of languages is
            not a design decision — it is whatever generalisation happens to produce, and
            nobody had measured it for Somali. We measure it, because Somali is our language
            and because it is a useful hard case: little data, genuine dialect variation, an
            enormous oral tradition, and a writing system standardised only in 1972. Methods
            that hold up here have a reasonable chance of holding up elsewhere.
          </p>
        </div>
      </section>

      <section className="section" aria-labelledby="h-agenda">
        <h2 className="section-head" id="h-agenda">
          Research agenda
        </h2>
        <div>
          {PROGRAMS.map((prog) => (
            <article className="record" key={prog.name}>
              <div className="record-rail">
                <span className="record-status">Active program</span>
              </div>
              <div>
                <h3 className="record-title">{prog.name}</h3>
                <p className="record-finding">
                  <strong>Question.</strong> {prog.question}
                </p>
                <p className="record-finding">
                  <strong>Current experiment.</strong> {prog.now}
                </p>
                <p className="record-finding">
                  <strong>Latest result.</strong> {prog.latest}
                </p>
                <p className="record-finding">
                  <strong>Open uncertainty.</strong> {prog.next}
                </p>
                <div className="record-links">
                  {prog.link.href.startsWith('/') ? (
                    <Link href={prog.link.href}>{prog.link.label}</Link>
                  ) : (
                    <a href={prog.link.href}>{prog.link.label}</a>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="section" aria-labelledby="h-pubs">
        <h2 className="section-head" id="h-pubs">
          Research notes
        </h2>
        <PublicationsList pubs={publications} />
        <p className="meta" style={{ marginTop: 'var(--s4)' }}>
          The first peer-reviewed version of this work (SomaliBench) is in preparation for
          2026. Nothing above is peer-reviewed yet, and each note says so.
        </p>
      </section>

      <section className="section" aria-labelledby="h-standards">
        <h2 className="section-head" id="h-standards">
          Research standards
        </h2>
        <div className="prose" style={{ marginTop: 'var(--s5)' }}>
          <ol>
            <li>
              Predictions are registered in writing before experiments run; amendments are
              dated and state exactly what had been seen when each change was made.
            </li>
            <li>
              Failed predictions are published as failed. Two of three failed in{' '}
              <Link href="/articles/one-model-reads-somali">the grammaticality note</Link>, one
              experiment is a published null, and one piece documents a confound we found in
              our own earlier work.
            </li>
            <li>
              Everything ships with its evidence: raw judgments, pre-registrations, and
              analysis code live in each repository, and the corpus carries per-sentence
              provenance.
            </li>
            <li>Limitations are stated adjacent to findings, not in a separate section.</li>
            <li>
              Contributors consent explicitly and choose how they are credited; nobody&rsquo;s
              words enter a dataset without their knowledge.
            </li>
          </ol>
        </div>
      </section>

      <section className="section" aria-labelledby="h-infra">
        <h2 className="section-head" id="h-infra">
          Infrastructure
        </h2>
        <ul className="facts" style={{ marginTop: 'var(--s5)' }}>
          <li>
            <span className="k">
              <a href="https://qor.unkad.com">Qor Af-Soomaali</a>
            </span>
            <span>
              Community platform for building consented, speaker-attributed Somali text with
              two-tier validation. Evaluation sets have to be built out of language; this is
              where the language comes from.
            </span>
          </li>
          <li>
            <span className="k">
              <a href="https://huggingface.co/spaces/unkadlabs/somalibench">SomaliBench</a>
            </span>
            <span>
              Live leaderboard publishing English-versus-Somali refusal rates for open-weight
              models, limitations stated alongside.
            </span>
          </li>
          <li>
            <span className="k">
              <a href="https://github.com/Unkadlabs/awesome-somali-nlp">awesome-somali-nlp</a>
            </span>
            <span>
              An index of what exists for Somali NLP and an honest account of what does not.
            </span>
          </li>
          <li>
            <span className="k">
              <a href="https://huggingface.co/unkadlabs">Hugging Face</a>
            </span>
            <span>Datasets and benchmarks, released under open licences.</span>
          </li>
        </ul>
      </section>
    </div>
  );
}
