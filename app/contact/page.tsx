import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Work with us',
  description:
    'Reach Unkad Labs: contributors, researchers, and institutions. Email, GitHub, and Hugging Face.',
  alternates: { canonical: '/contact' },
  openGraph: {
    siteName: 'Unkad Labs',
    locale: 'en_US',
    title: 'Work with us · Unkad Labs',
    description:
      'How to reach Unkad Labs: contributors, research collaborations, and funding conversations.',
    type: 'website',
    url: '/contact',
  },
};

export default function ContactPage() {
  return (
    <div className="container rv2">
      <span className="eyebrow">Work with us &middot; Unkad Labs</span>
      <div className="hero-split">
        <h1>Collaboration is the point.</h1>
        <div className="hero-aside">
          <p>
            Everything we build is open. If your work touches whether AI behaves safely outside
            English, we would like to compare notes.
          </p>
          <div className="pills">
            {/* PLACEHOLDER: set up mailboxes on unkad.com before launch */}
            <a className="pill solid" href="mailto:research@unkad.com">
              research@unkad.com
            </a>
            <a className="pill line" href="mailto:info@unkad.com">
              info@unkad.com
            </a>
          </div>
        </div>
      </div>

      <span className="eyebrow">Before you write</span>
      <div className="commitments">
        <div className="clause">
          <span className="clause-no">Contributors</span>
          <p>
            If you want to write, translate, or validate Somali language data, use the subject
            line <em>Contributor</em> and tell us your dialect and region. Or skip the email and
            start directly at <a href="https://qor.unkad.com">qor.unkad.com</a>.
          </p>
        </div>
        <div className="clause">
          <span className="clause-no">Researchers</span>
          <p>
            For collaborations, replications, or student programs, use the subject line{' '}
            <em>Collaboration</em> and name your institution. Every dataset and codebase is
            citable today; BibTeX is on the{' '}
            <a href="/research">publications index</a>.
          </p>
        </div>
        <div className="clause">
          <span className="clause-no">Funders</span>
          <p>
            For grant and funding conversations, use the subject line <em>Funding</em> and we
            will respond with our current prospectus.
          </p>
        </div>
        <div className="clause">
          <span className="clause-no">Communities</span>
          <p>
            If you want this platform for your own language, the entire stack is open source.
            Write with the subject line <em>Deploy</em> and tell us about your language
            community.
          </p>
        </div>
      </div>

      <p className="colophon-line">
        <a href="https://github.com/unkadlabs">GitHub</a> &middot;{' '}
        <a href="https://huggingface.co/unkadlabs">Hugging Face</a> &middot;{' '}
        <a href="https://x.com/unkadlabs">X</a> &middot;{' '}
        <a href="https://www.linkedin.com/company/unkadlabs">LinkedIn</a>
      </p>
    </div>
  );
}
