import type { Metadata } from 'next';
import Link from 'next/link';
import UnkadMark from '@/components/UnkadMark';
import LiveStats from '@/components/LiveStats';

export const metadata: Metadata = {
  // Home keeps the full default title from the layout (no template suffix).
  title: { absolute: 'Unkad Labs — Somali language AI and alignment research' },
  description:
    'Unkad Labs is a non-profit AI research laboratory in Mogadishu building open Somali language datasets, safety evaluations, and alignment research for low-resource languages.',
  alternates: { canonical: '/' },
  openGraph: {
    siteName: 'Unkad Labs',
    locale: 'en_US',
    title: 'Unkad Labs',
    description:
      'A non-profit AI research laboratory creating the Somali language infrastructure of the AI age — from nothing, cell by cell.',
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
          <span lang="so">Unkad</span> — Somali for creation from nothing.
        </p>
      </div>

      <p className="mission">
        Unkad Labs is a non-profit AI research laboratory building the Somali language into the
        age of artificial intelligence. We create open datasets through community contribution,
        and we research how to evaluate and align AI systems for Somali and other low-resource
        languages — making the language richer, and the systems that speak it safer.
      </p>

      <div className="btn-row">
        <a className="btn" href="https://qor.unkad.com">
          Contribute on Qor Af-Soomaali
        </a>
        <Link className="btn btn-quiet" href="/research">
          Read the research agenda
        </Link>
      </div>

      <span className="eyebrow">The corpus, live</span>
      <LiveStats
        goalLabel="Progress toward 100,000 sentences"
        sentencesLabel="validated sentences"
        contributorsLabel="contributors"
        pendingLabel="awaiting validation"
      />
      <p className="hint-line">
        Live from <a href="https://qor.unkad.com">qor.unkad.com</a> — every sentence written,
        peer-validated, and linguist-verified by the community, released under CC BY-SA 4.0.
      </p>

      <span className="eyebrow">Why</span>
      <p>
        Somali is spoken by more than 20 million people. Yet the infrastructure AI needs — clean
        text, annotated data, benchmarks, safety evaluations — mostly does not exist for it.
        What data there is runs scarce and noisy, and dialects such as Maay are nearly absent
        altogether.
      </p>
      <p>
        There is also no systematic way to measure whether AI is safe and accurate in Somali. A
        model can fail quietly — mistranslating a medical instruction, complying with a request
        it would refuse in English — and no benchmark exists to catch it.
      </p>
      <p>
        AI is becoming the gateway to information and services. Without deliberate work, Somali
        speakers risk being left out, or served by systems that fail them in ways no one is
        measuring. We are not documenting infrastructure that exists. We are creating it from
        nothing.
      </p>

      <span className="eyebrow">What we do</span>
      <div className="cols">
        <a className="ws-card" href="https://qor.unkad.com">
          <h3>Data — The Unkad Platform</h3>
          <p>
            Qor Af-Soomaali: Somali speakers write, translate, and validate language data across
            sectors and dialects. Peer-validated, linguist-verified, released openly. Cell by
            cell.
          </p>
          <span className="ws-more">qor.unkad.com →</span>
        </a>
        <Link className="ws-card" href="/research">
          <h3>Safety &amp; Alignment Research</h3>
          <p>
            Benchmarks, safety test sets, and red-teaming methodology for Somali — built so the
            methods transfer to every language in the same position.
          </p>
          <span className="ws-more">Research agenda →</span>
        </Link>
      </div>

      <hr />

      <p>
        We publish everything openly — on <a href="https://github.com/unkadlabs">GitHub</a> and{' '}
        <a href="https://huggingface.co/unkadlabs">Hugging Face</a>.
      </p>
    </div>
  );
}
