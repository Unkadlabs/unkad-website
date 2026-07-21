import type { Metadata } from 'next';
import Link from 'next/link';
import LiveStats from '@/components/LiveStats';

export const metadata: Metadata = {
  title: 'The Unkad Platform',
  description:
    'Qor Af-Soomaali: where Somali speakers write, translate, and validate the language data that safety evaluation requires. Peer-validated, linguist-verified, openly licensed.',
  alternates: { canonical: '/platform' },
  openGraph: {
    siteName: 'Unkad Labs',
    locale: 'en_US',
    title: 'The Unkad Platform · Unkad Labs',
    description:
      'Qor Af-Soomaali: community-built Somali language data, peer-validated, linguist-verified, openly licensed.',
    type: 'website',
    url: '/platform',
  },
};

export default function PlatformPage() {
  return (
    <div className="container">
      <h1>The Unkad Platform</h1>

      {/* VERIFY SOMALI: campaign name */}
      <p className="mission" style={{ fontSize: '1.25rem' }}>
        <span lang="so">Qor Af-Soomaali</span>, meaning write Somali, is where the language data
        behind our evaluation work gets built, one sentence at a time, by the people who speak
        it.
      </p>

      <div className="btn-row">
        <a className="btn" href="https://qor.unkad.com">
          Start contributing
        </a>
      </div>

      <LiveStats
        goalLabel="Progress toward 100,000 sentences"
        sentencesLabel="validated sentences"
        contributorsLabel="contributors"
        pendingLabel="awaiting validation"
      />

      <span className="eyebrow">Four ways to contribute</span>
      {/* VERIFY SOMALI: mode names */}
      <p>
        <strong lang="so">Qor</strong>, write. Contributors respond to prompts about everyday
        life: stories, instructions, dialogues, opinions. These are the registers of Somali that
        never made it onto the web, and they are what evaluation sets need most.
      </p>
      <p>
        <strong lang="so">Turjun</strong>, translate. Short sentences move from English into
        Somali, producing the parallel data that makes like-for-like evaluation possible.
      </p>
      <p>
        <strong lang="so">Guuri</strong>, transcribe. Openly licensed and public-domain printed
        Somali is typed up, turning paper heritage into digital text.
      </p>
      <p>
        <strong lang="so">Hubi</strong>, validate. Contributors review each other&rsquo;s work,
        asking one question: is this correct, natural Somali? It takes seconds and can be done
        on a phone.
      </p>

      <span className="eyebrow">How quality works</span>
      <p>
        Every submission needs agreement from two independent community validators. Items the
        community accepts then pass to trusted linguist reviewers for final sign-off before they
        enter the official corpus. Disagreements escalate to reviewers automatically. Every item
        carries its provenance from the moment it is written: mode, register, sector, and the
        contributor&rsquo;s dialect, either Maxaa tiri or Maay.
        {/* VERIFY SOMALI: dialect names */}
      </p>

      <span className="eyebrow">Consent and openness</span>
      <p>
        Before contributing a single sentence, every contributor explicitly agrees to the open
        license and chooses how to be credited: by name, by pseudonym, or anonymously. All data
        is released under CC&nbsp;BY-SA&nbsp;4.0 in versioned datasets on{' '}
        <a href="https://huggingface.co/unkadlabs">Hugging Face</a>, so researchers, developers,
        and the Somali community itself can build on it without restriction. The corpus belongs
        to the Somali-speaking world.
      </p>

      <span className="eyebrow">Current goals</span>
      <ul>
        <li>Closed pilot: first cohort of contributors and trusted linguist reviewers.</li>
        <li>First open dataset release on Hugging Face.</li>
        <li>The public campaign: 100,000 validated sentences.</li>
      </ul>

      <hr />

      <p>
        <strong>Want to partner with us, as a university, school, or organization?</strong> →{' '}
        <Link href="/contact">Contact</Link>
      </p>

      {/* Email signup placeholder.
          To wire this up later, replace the action attribute with either:
          - Formspree:   action="https://formspree.io/f/YOUR_FORM_ID" method="post"
          - Buttondown:  action="https://buttondown.com/api/emails/embed-subscribe/YOUR_NEWSLETTER" method="post"
          No other changes needed. */}
      <form className="signup" action="#" method="post">
        <label htmlFor="email">Get updates on releases and the campaign.</label>
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
