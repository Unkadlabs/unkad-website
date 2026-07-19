import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'The Unkad Platform',
  description:
    'An open platform where Somali speakers write, record, and validate language data across sectors and dialects. Model-assisted, human-verified, openly licensed.',
  alternates: { canonical: '/platform' },
  openGraph: {
    siteName: 'Unkad Labs',
    locale: 'en_US',
    title: 'The Unkad Platform — Unkad Labs',
    description:
      'Community-built Somali language data: model-assisted, human-verified, released under open licenses.',
    type: 'website',
    url: '/platform',
  },
};

export default function PlatformPage() {
  return (
    <div className="container">
      <h1>The Unkad Platform</h1>

      <p>
        The Unkad Platform is our flagship project: an open platform where Somali speakers
        write, record, and validate language data. Contribution is organized by sector — health,
        education, agriculture, law, media, religion — and by dialect, covering both Maxaa tiri
        and Maay.
        {/* VERIFY SOMALI: dialect names */}
      </p>

      <p>
        Data creation is model-assisted and human-verified. Models draft and suggest; Somali
        speakers correct, validate, and approve. Nothing enters a released dataset without human
        verification, and every contributor is credited and consented.
      </p>

      <p>
        All data is released under open licenses — CC&nbsp;BY or CC&nbsp;BY-SA — so that
        researchers, developers, and the Somali community itself can build on it without
        restriction.
      </p>

      <span className="eyebrow">Year-one pilot goals</span>
      <ul>
        <li>Pilot the platform in one or two sectors.</li>
        <li>Reach 500+ active contributors.</li>
        <li>Release the first open dataset on Hugging Face.</li>
      </ul>

      <hr />

      <p>
        <strong>Want to contribute Somali text or speech, or partner with us?</strong> →{' '}
        <Link href="/contact">Contact</Link>
      </p>

      {/* Email signup placeholder.
          To wire this up later, replace the action attribute with either:
          - Formspree:   action="https://formspree.io/f/YOUR_FORM_ID" method="post"
          - Buttondown:  action="https://buttondown.com/api/emails/embed-subscribe/YOUR_NEWSLETTER" method="post"
          No other changes needed. */}
      <form className="signup" action="#" method="post">
        <label htmlFor="email">Get an email when the platform opens for contributors.</label>
        <input
          type="email"
          id="email"
          name="email"
          required
          autoComplete="email"
          placeholder="you@example.com"
        />
        <button type="submit">Notify me</button>
      </form>
    </div>
  );
}
