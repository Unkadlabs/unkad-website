import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Research',
  description:
    'Alignment and evaluation infrastructure for Somali: safety test sets, refusal and toxicity evaluations, benchmarks, and red-teaming methods for low-resource languages.',
  alternates: { canonical: '/research' },
  openGraph: {
    siteName: 'Unkad Labs',
    locale: 'en_US',
    title: 'Research — Unkad Labs',
    description:
      'Safety test sets, benchmarks, and red-teaming methodology for Somali and other low-resource languages.',
    type: 'website',
    url: '/research',
  },
};

export default function ResearchPage() {
  return (
    <div className="container">
      <h1>Research</h1>

      <p>
        Our research agenda is alignment and evaluation infrastructure for Somali. We build
        safety and toxicity test sets, refusal evaluations, translation and comprehension
        benchmarks, and red-teaming methods designed for low-resource languages. The goal is
        simple: frontier labs and deployers should be able to measure how their systems behave
        in Somali, and improve them. Today they cannot. We intend to make that measurement
        routine.
      </p>

      <p>
        The work runs in both directions. Somali is a hard case for alignment — little data,
        rich dialect variation, a vast oral tradition and a young written one — and methods that
        hold up here transfer to the hundreds of languages in the same position. We contribute
        what we learn back to the broader alignment community: benchmarks, methodology, and
        honest negative results included.
      </p>

      <span className="eyebrow">Publications</span>
      <p className="empty-state">Our first benchmark paper is in preparation (2026).</p>

      {/* Future publications go in this list. Each entry follows this shape:

      <ul className="dated-list">
        <li>
          <time dateTime="2026-01-01">Jan 2026</time>
          <p className="title">Paper title here</p>
          <p className="muted">Venue or preprint server</p>
          <p><a href="#">PDF</a> · <a href="#">Code</a> · <a href="#">Data</a></p>
        </li>
      </ul>
      */}

      <span className="eyebrow">Research principles</span>
      <ul>
        <li>
          <strong>Open release by default.</strong> Datasets, benchmarks, and papers are published
          under open licenses unless there is a specific safety reason not to.
        </li>
        <li>
          <strong>Human data dignity.</strong> Contributors are credited and consented.
          Nobody&rsquo;s words enter a dataset without their knowledge.
        </li>
        <li>
          {/* VERIFY SOMALI: dialect names */}
          <strong>Dialect inclusion.</strong> Somali is not one uniform language. Our benchmarks
          and datasets cover Maxaa tiri and Maay from the start, not as an afterthought.
        </li>
        <li>
          <strong>Safety evaluation before capability hype.</strong> We measure whether systems
          are safe and accurate in Somali before we celebrate that they speak it at all.
        </li>
        <li>
          <strong>Alignment is for every language.</strong> Findings, methods, and failures are
          shared with the broader alignment community, so that work on one low-resource language
          moves them all.
        </li>
      </ul>
    </div>
  );
}
