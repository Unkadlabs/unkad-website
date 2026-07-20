import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact',
  description:
    'Reach Unkad Labs — contributors, universities, and funders. Email, GitHub, and Hugging Face.',
  alternates: { canonical: '/contact' },
  openGraph: {
    siteName: 'Unkad Labs',
    locale: 'en_US',
    title: 'Contact — Unkad Labs',
    description:
      'How to reach Unkad Labs: contributors, research collaborations, and funding conversations.',
    type: 'website',
    url: '/contact',
  },
};

export default function ContactPage() {
  return (
    <div className="container">
      <h1>Contact</h1>

      <p>
        {/* PLACEHOLDER: set up mailboxes on unkad.com before launch */}
        General: <a href="mailto:info@unkad.com">info@unkad.com</a>
      </p>
      <p>
        Research collaboration: <a href="mailto:research@unkad.com">research@unkad.com</a>
      </p>

      <p>
        GitHub: <a href="https://github.com/unkadlabs">github.com/unkadlabs</a>
        <br />
        Hugging Face: <a href="https://huggingface.co/unkadlabs">huggingface.co/unkadlabs</a>
        <br />
        X: <a href="https://x.com/unkadlabs">x.com/unkadlabs</a>
      </p>

      <span className="eyebrow">Before you write</span>
      <p>
        <strong>Contributors.</strong> If you want to write, record, or validate Somali language
        data, use the subject line <em>Contributor</em> and tell us your dialect and region.
      </p>
      <p>
        <strong>Universities.</strong> For research collaborations or student programs, use the
        subject line <em>Collaboration</em> and name your institution.
      </p>
      <p>
        <strong>Funders.</strong> For grant and funding conversations, use the subject line{' '}
        <em>Funding</em> and we will respond with our current prospectus.
      </p>
    </div>
  );
}
