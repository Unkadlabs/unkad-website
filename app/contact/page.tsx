import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Contact',
  description:
    'Reach Unkad Labs: research collaborations, replications, funding, contributors, and language communities. research@unkad.com and info@unkad.com.',
  alternates: { canonical: '/contact' },
  openGraph: {
    siteName: 'Unkad Labs',
    locale: 'en_US',
    title: 'Contact · Unkad Labs',
    description:
      'How to reach Unkad Labs: research collaborations, funding conversations, and contributing.',
    type: 'website',
    url: '/contact',
  },
};

export default function ContactPage() {
  return (
    <div className="container">
      <section className="page-open">
        <h1>Contact</h1>
        <div className="prose">
          <p>
            For research collaborations, replications, funding, or adapting Qor to another
            language community. Both addresses are monitored.
          </p>
        </div>
      </section>

      <section className="section" aria-labelledby="h-directory">
        <h2 className="section-head" id="h-directory">
          Directory
        </h2>
        <ul className="facts" style={{ marginTop: 'var(--s5)' }}>
          <li>
            <span className="k">Research and replication</span>
            <span>
              <a href="mailto:research@unkad.com">research@unkad.com</a> — collaborations,
              replications, and student programs. Name your institution; every dataset and
              codebase is citable today, and BibTeX is on the{' '}
              <Link href="/research">research page</Link>.
            </span>
          </li>
          <li>
            <span className="k">General and institutional</span>
            <span>
              <a href="mailto:info@unkad.com">info@unkad.com</a> — everything else.
            </span>
          </li>
          <li>
            <span className="k">Funding</span>
            <span>
              <a href="mailto:research@unkad.com">research@unkad.com</a> with the subject{' '}
              <em>Funding</em>; we respond with our current prospectus.
            </span>
          </li>
          <li>
            <span className="k">Contributors</span>
            <span>
              No email needed — start directly at{' '}
              <a href="https://qor.unkad.com">qor.unkad.com</a>. Writing, translating, or
              validating takes minutes and works on a phone.
            </span>
          </li>
          <li>
            <span className="k">Language communities</span>
            <span>
              The entire platform is{' '}
              <a href="https://github.com/Unkadlabs/qor-af-soomaali">open source</a>. If you
              want it for your own language, write with the subject <em>Deploy</em> and tell us
              about your community.
            </span>
          </li>
        </ul>
        <p className="meta" style={{ marginTop: 'var(--s5)' }}>
          Elsewhere: <a href="https://github.com/Unkadlabs">GitHub</a> ·{' '}
          <a href="https://huggingface.co/unkadlabs">Hugging Face</a> ·{' '}
          <a href="https://x.com/unkadlabs">X</a> ·{' '}
          <a href="https://www.linkedin.com/company/unkadlabs">LinkedIn</a>
        </p>
      </section>
    </div>
  );
}
