import type { Metadata } from 'next';
import Link from 'next/link';
import UnkadMark from '@/components/UnkadMark';

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
        <div>
          <h3>
            <Link href="/platform">Data — The Unkad Platform</Link>
          </h3>
          <p>
            An open platform where Somali speakers write, record, and validate language data
            across sectors and dialects. Everything is released openly. Cell by cell. Live at{' '}
            <a href="https://qor.unkad.com">qor.unkad.com</a>.
          </p>
        </div>
        <div>
          <h3>
            <Link href="/research">Safety &amp; Alignment Research</Link>
          </h3>
          <p>
            Benchmarks, safety test sets, and red-teaming methodology for Somali — built so the
            methods transfer to every language in the same position.
          </p>
        </div>
      </div>

      <hr />

      <p>
        We publish everything openly — on{' '}
        {/* PLACEHOLDER: confirm GitHub / Hugging Face org URLs */}
        <a href="https://github.com/unkadlabs">GitHub</a> and{' '}
        <a href="https://huggingface.co/unkadlabs">Hugging Face</a>.
      </p>
    </div>
  );
}
