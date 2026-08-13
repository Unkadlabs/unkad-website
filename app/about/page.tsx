import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'About',
  description:
    'Unkad Labs is an independent AI research lab working on multilingual safety: whether the safety properties of AI systems survive a change of language.',
  alternates: { canonical: '/about' },
  openGraph: {
    siteName: 'Unkad Labs',
    locale: 'en_US',
    title: 'About · Unkad Labs',
    description:
      'An independent AI research lab working on whether the safety properties of AI systems survive a change of language.',
    type: 'website',
    url: '/about',
  },
};

// Only real dates. Every entry corresponds to a shipped artifact that can be
// checked: a dated research note, a dataset release, or the platform itself.
const TIMELINE = [
  { date: 'Jul 2026', what: 'Lab founded; SomaliBench measures the English–Somali refusal gap' },
  { date: '19 Jul 2026', what: 'Qor Af-Soomaali opens; the first corpus sentence is written' },
  {
    date: '20–26 Jul 2026',
    what: 'First four research notes: the token tax, the overseer, the guard collapse, the lie that moved',
  },
  { date: '30 Jul 2026', what: 'First open dataset release (v0.1.0) on Hugging Face' },
  { date: '5 Aug 2026', what: 'Grammaticality note: one model reads Somali, another approves word salad' },
  { date: '9 Aug 2026', what: 'Corpus v0.2.1: 2,282 verified sentences' },
  {
    date: '12 Aug 2026',
    what: 'Frontier evaluation: GPT-5.6, Gemini 3.1 Pro, and Claude Sonnet 5 against the community’s quality judgments',
  },
];

export default function AboutPage() {
  return (
    <div className="container">
      <section className="page-open">
        <h1>About Unkad Labs</h1>
        <div className="prose">
          <p>
            Unkad Labs is an independent AI research lab working on one question: do the safety
            properties of AI systems survive a change of language? The name comes from Somali —{' '}
            <em lang="so">unkad</em>, creation from nothing, shares a root with{' '}
            <em lang="so">unug</em>, the cell — and describes the method: large things get
            built by assembling small verified units until something holds together.
          </p>
        </div>
      </section>

      <section className="section" aria-labelledby="h-question">
        <h2 className="section-head" id="h-question">
          What we study
        </h2>
        <div className="prose" style={{ marginTop: 'var(--s5)' }}>
          <p>
            Safety behaviour in a language model is learned from examples, and those examples
            are overwhelmingly English. When a lab reports that a model refuses harmful
            requests reliably, that finding was almost certainly established in English. The
            model is then deployed to people who will not address it in English, and the safety
            claim travels with the deployment as though language had nothing to do with it.
          </p>
          <p>
            We measured what actually happens. Putting identical harmful requests to
            open-weight models in English and in Somali, Llama 3.1 refuses 97 percent of the
            time in English and 7 percent of the time in Somali. Aya falls from 80 percent to 5
            percent. For most of the world&rsquo;s languages, nobody has run this test at all.
          </p>
          <p>
            The scope is deliberate: safety evaluation, oversight under language limits, and
            the data infrastructure both require. We do not train large models, and we do not
            make capability claims — we would rather know whether a system is safe in Somali
            than celebrate that it speaks it.
          </p>
        </div>
      </section>

      <section className="section" aria-labelledby="h-somali">
        <h2 className="section-head" id="h-somali">
          Why Somali
        </h2>
        <div className="prose" style={{ marginTop: 'var(--s5)' }}>
          <p>
            It is our language, which matters both for the work and for who gets to do it. It
            is also a genuinely useful hard case: more than twenty million speakers, an
            enormous oral tradition, a writing system standardised only in 1972, and real
            dialect variation — Maay is spoken by millions and nearly absent from digital
            text. Somali is thin enough in training data that the failures we care about are
            visible rather than subtle. Methods that hold up under those conditions have a
            reasonable chance of holding up for the hundreds of languages in similar positions.
          </p>
        </div>
      </section>

      <section className="section" aria-labelledby="h-people">
        <h2 className="section-head" id="h-people">
          People and structure
        </h2>
        <ul className="facts" style={{ marginTop: 'var(--s5)' }}>
          <li>
            <span className="k">Leadership</span>
            <span>
              Founder-led. A small Somali research team, at home and in the diaspora.
            </span>
          </li>
          <li>
            <span className="k">Community</span>
            <span>
              158 contributors write, translate, and peer-validate the corpus; contribution is
              open to any Somali speaker at <a href="https://qor.unkad.com">qor.unkad.com</a>.
            </span>
          </li>
          <li>
            <span className="k">Review structure</span>
            <span>
              Trusted linguist reviewers give final sign-off on every released item and settle
              validation disagreements. Reviewers are appointed from proven contributors;
              nobody reviews their own work.
            </span>
          </li>
          <li>
            <span className="k">Authorship</span>
            <span>
              Research notes carry citable authorship; BibTeX for every note is on the{' '}
              <Link href="/research">research page</Link>.
            </span>
          </li>
        </ul>
      </section>

      <section className="section" aria-labelledby="h-legal">
        <h2 className="section-head" id="h-legal">
          Legal status and funding
        </h2>
        <ul className="facts" style={{ marginTop: 'var(--s5)' }}>
          <li>
            <span className="k">Legal status</span>
            <span>
              Unkad Labs operates as an independent research lab and is not yet a registered
              legal entity.
            </span>
          </li>
          <li>
            <span className="k">Funding</span>
            <span>
              Self-funded to date; no external funders. For grant and funding conversations,
              write to <a href="mailto:research@unkad.com">research@unkad.com</a>.
            </span>
          </li>
          <li>
            <span className="k">Licensing</span>
            <span>
              Datasets under CC BY-SA 4.0; code under open-source licenses on{' '}
              <a href="https://github.com/Unkadlabs">GitHub</a>.
            </span>
          </li>
        </ul>
      </section>

      <section className="section" aria-labelledby="h-timeline">
        <h2 className="section-head" id="h-timeline">
          Timeline
        </h2>
        <ul className="facts" style={{ marginTop: 'var(--s5)' }}>
          {TIMELINE.map((t) => (
            <li key={t.date + t.what}>
              <span className="k">{t.date}</span>
              <span>{t.what}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="section" aria-labelledby="h-work">
        <h2 className="section-head" id="h-work">
          Working with us
        </h2>
        <div className="prose" style={{ marginTop: 'var(--s5)' }}>
          <p>
            We are interested in conversations with people working on multilingual evaluation,
            AI safety institutes and their capacity-building work, and researchers building
            language resources for under-served languages. If your work touches whether models
            behave safely outside English, we would like to compare notes.{' '}
            <Link href="/contact">Get in touch</Link>.
          </p>
        </div>
      </section>
    </div>
  );
}
