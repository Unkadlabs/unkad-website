import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Research',
  description:
    'Evaluation infrastructure for Somali: safety and toxicity test sets, translation and comprehension benchmarks, and red-teaming methods for low-resource languages.',
  alternates: { canonical: '/research' },
  openGraph: {
    title: 'Research — Dhig Labs',
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
        Our research agenda is evaluation infrastructure for Somali. We build safety and toxicity
        test sets, translation and comprehension benchmarks, and red-teaming methods designed for
        low-resource languages. The goal is simple: frontier labs and deployers should be able to
        measure how their systems perform in Somali, and improve them. Today they cannot. We
        intend to make that measurement routine.
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
      </ul>
    </div>
  );
}
