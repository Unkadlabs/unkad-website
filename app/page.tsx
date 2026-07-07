import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  // Home keeps the full default title from the layout (no template suffix).
  title: { absolute: 'Dhig Labs — Somali language data and AI safety research' },
  description:
    'Dhig Labs is a non-profit AI research laboratory in Mogadishu building open Somali language datasets and safety evaluations for low-resource languages.',
  alternates: { canonical: '/' },
  openGraph: {
    title: 'Dhig Labs',
    description:
      'A non-profit AI research laboratory bringing the Somali language fully into the age of artificial intelligence.',
    type: 'website',
    url: '/',
  },
};

export default function HomePage() {
  return (
    <div className="container">
      <div className="hero">
        <h1>Dhig Labs</h1>
        {/* VERIFY SOMALI */}
        <p className="gloss">
          <span lang="so">Dhig</span> — Somali for &ldquo;write it down.&rdquo;
        </p>
      </div>

      <p className="mission">
        Dhig Labs is a non-profit AI research laboratory working to bring the Somali language
        fully into the age of artificial intelligence. We build open datasets through community
        contribution, and we research how to evaluate and align AI systems for Somali and other
        low-resource languages.
      </p>

      <span className="eyebrow">Why</span>
      <p>
        Somali is spoken by more than 20 million people. Yet AI systems perform poorly in it. The
        training data that exists is scarce and noisy, and dialects such as Maay are nearly absent
        from it altogether.
      </p>
      <p>
        There is also no systematic way to measure whether AI is safe and accurate in Somali. A
        model can fail quietly — mistranslating a medical instruction, inventing a legal detail —
        and no benchmark exists to catch it.
      </p>
      <p>
        AI is becoming the gateway to information and services. Without deliberate work, Somali
        speakers risk being left out, or served by systems that fail them in ways no one is
        measuring.
      </p>

      <span className="eyebrow">What we do</span>
      <div className="cols">
        <div>
          <h3>
            <Link href="/platform">Data — The Dhig Platform</Link>
          </h3>
          <p>
            An open platform where Somali speakers write, record, and validate language data
            across sectors and dialects. Everything is released openly.
          </p>
        </div>
        <div>
          <h3>
            <Link href="/research">Safety &amp; Alignment Research</Link>
          </h3>
          <p>
            Benchmarks, safety test sets, and red-teaming methodology, so that anyone can measure
            how AI systems behave in Somali.
          </p>
        </div>
      </div>

      <hr />

      <p>
        We publish everything openly — on{' '}
        {/* PLACEHOLDER: confirm GitHub / Hugging Face org URLs */}
        <a href="https://github.com/dhiglabs">GitHub</a> and{' '}
        <a href="https://huggingface.co/dhiglabs">Hugging Face</a>.
      </p>
    </div>
  );
}
