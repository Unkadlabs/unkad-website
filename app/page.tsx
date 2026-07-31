import type { Metadata } from 'next';
import Link from 'next/link';
import UnkadMark from '@/components/UnkadMark';
import LiveStats from '@/components/LiveStats';

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

export default function HomePage() {
  return (
    <div className="container">
      <div className="hero">
        <UnkadMark size={52} className="hero-mark" animated />
        <h1>Unkad Labs</h1>
        {/* VERIFY SOMALI */}
        <p className="gloss">
          <span lang="so">Unkad</span>, Somali for creation from nothing.
        </p>
      </div>

      <p className="mission">
        Unkad Labs is a non-profit AI research laboratory. We measure whether AI
        systems behave safely in Somali, and we build the open language data that safety
        evaluation requires. Our methods are designed to transfer to the hundreds of languages
        in the same position.
      </p>

      <div className="btn-row">
        <Link className="btn" href="/research">
          The research agenda
        </Link>
        <a className="btn btn-quiet" href="https://qor.unkad.com">
          Contribute Somali text
        </a>
      </div>

      <span className="eyebrow">The problem</span>
      <p>
        When a frontier lab publishes a safety evaluation, it is almost always an evaluation in
        English. The model is red-teamed in English, its refusal behaviour is measured in
        English, its jailbreak resistance is characterised in English. Then it is deployed
        globally, and the safety claims travel with it as though language were incidental to
        them.
      </p>
      <p>
        It is not incidental. We put identical harmful requests to open-weight models in English
        and in Somali. Llama 3.1 refuses 97 percent of the time in English and 7 percent of the
        time in Somali. Aya drops from 80 percent to 5 percent. Safety behaviour that holds in
        one language does not automatically hold in another, and for most of the world&rsquo;s
        languages nobody has checked whether it does.
      </p>
      <p>
        Somali is spoken by more than twenty million people. It has no safety benchmark of any
        scale, no entry in the flagship African reasoning benchmarks, and almost no
        dialect-tagged data. That absence is the reason this lab exists.
      </p>

      <span className="eyebrow">The corpus, live</span>
      <LiveStats
        goalLabel="Progress toward 100,000 sentences"
        sentencesLabel="validated sentences"
        contributorsLabel="contributors"
        pendingLabel="awaiting validation"
      />
      <p className="hint-line">
        Live from <a href="https://qor.unkad.com">qor.unkad.com</a>. Every sentence is written by
        a consenting Somali speaker, validated by the community, verified by a linguist, and
        released under CC BY-SA 4.0.
      </p>

      <span className="eyebrow">What we do</span>
      <div className="cols">
        <Link className="ws-card" href="/research">
          <h3>Safety and alignment research</h3>
          <p>
            Refusal evaluations, safety test sets, and red-teaming methods built for
            low-resource languages, so that behaviour which fails outside English becomes
            visible and measurable.
          </p>
          <span className="ws-more">Research agenda →</span>
        </Link>
        <a className="ws-card" href="https://qor.unkad.com">
          <h3>The data underneath</h3>
          <p>
            Evaluation sets are built out of language. Qor Af-Soomaali is where Somali speakers
            write, translate, and validate the text that this work requires, across sectors and
            both major dialects.
          </p>
          <span className="ws-more">qor.unkad.com →</span>
        </a>
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
