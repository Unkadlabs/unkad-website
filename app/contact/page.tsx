import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact',
  description:
    'Reach Dhig Labs — contributors, universities, and funders. Email, GitHub, and Hugging Face.',
  alternates: { canonical: '/contact' },
  openGraph: {
    title: 'Contact — Dhig Labs',
    description:
      'How to reach Dhig Labs: contributors, research collaborations, and funding conversations.',
    type: 'website',
    url: '/contact',
  },
};

export default function ContactPage() {
  return (
    <div className="container">
      <h1>Contact</h1>

      <p>
        General: <a href="mailto:info@dhiglabs.org">info@dhiglabs.org</a>
      </p>
      <p>
        {/* PLACEHOLDER: confirm research email address */}
        Research collaboration: <a href="mailto:research@dhiglabs.org">research@dhiglabs.org</a>
      </p>

      <p>
        {/* PLACEHOLDER: confirm GitHub / Hugging Face org URLs */}
        GitHub: <a href="https://github.com/dhiglabs">github.com/dhiglabs</a>
        <br />
        Hugging Face: <a href="https://huggingface.co/dhiglabs">huggingface.co/dhiglabs</a>
        <br />
        X: [X PROFILE URL]
        <br />
        LinkedIn: [LINKEDIN PROFILE URL]
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
