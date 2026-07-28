import type { Metadata } from 'next';

export const metadata: Metadata = {
  // The title carries the search phrases this page is the natural home for.
  // "Research" alone told search engines nothing about what kind.
  title: 'AI alignment and scalable oversight research for Somali',
  description:
    'Safety and alignment research for Somali and other low-resource languages: scalable oversight, multi-agent debate, LLM judge evaluations, refusal test sets, red-teaming methodology, and the evaluation infrastructure that does not yet exist.',
  alternates: { canonical: '/research' },
  openGraph: {
    siteName: 'Unkad Labs',
    locale: 'en_US',
    title: 'Research · Unkad Labs',
    description:
      'Refusal evaluations, safety test sets, and red-teaming methodology for Somali and other low-resource languages.',
    type: 'website',
    url: '/research',
  },
};

export default function ResearchPage() {
  return (
    <div className="container">
      <h1>Research</h1>

      <p className="article-lead">
        Our question is narrow and, as far as we can tell, largely unasked: do the safety
        properties of AI systems survive a change of language?
      </p>

      <p>
        Safety behaviour in a language model is learned, not installed. A model refuses harmful
        requests because it was trained on examples of refusal, and those examples are
        overwhelmingly English, occasionally translated into a handful of high-resource
        languages. What happens in the remaining thousands of languages is not a design
        decision. It is whatever generalisation happens to produce, and nobody has measured it.
      </p>

      <p>
        We measure it for Somali, because it is our language and because it is a useful hard
        case: little data, genuine dialect variation, an enormous oral tradition and a writing
        system standardised only in 1972. Methods that hold up here have a reasonable chance of
        holding up elsewhere.
      </p>

      <span className="eyebrow">Current work</span>

      <h3>Refusal and safety evaluation</h3>
      <p>
        SomaliBench puts identical harmful requests to models in English and in Somali, verified
        by native speakers, and measures the difference in refusal behaviour. The gaps we
        measure are large: 0.97 to 0.07 for Llama 3.1, 0.80 to 0.05 for Aya. The{' '}
        <a href="https://huggingface.co/spaces/unkadlabs/somalibench">live leaderboard</a>{' '}
        publishes the current results, with the limitations stated alongside them.
      </p>
      <p>
        One limitation matters enough to name here. A low refusal rate does not always mean
        fluent harmful compliance. Some failures in Somali surface as incoherent output, which
        is still a failure but a different one. Separating genuine compliance from low-quality
        generation is a central task for the next version of the benchmark.
      </p>

      <h3>Tokenization as a safety variable</h3>
      <p>
        We measured how nine major tokenizers treat Somali and found a consistent penalty of
        1.7 to 2.2 times more tokens than English for identical content. Our interest is not the
        cost. It is that fragmentation shapes representation quality, and representation quality
        is what safety behaviour rides on. Whether fragmentation contributes independently to
        the refusal gap, or whether both are symptoms of data scarcity, is an open question we
        want to answer.{' '}
        <a href="https://github.com/unkadlabs/somali-token-tax">Method and code</a>.
      </p>

      <h3>Dialect coverage as an evaluation requirement</h3>
      <p>
        Somali is not uniform. A model evaluated only in Maxaa tiri and found safe has not been
        shown to be safe in Maay, which millions of people speak and which is nearly absent from
        digital text.{/* VERIFY SOMALI: dialect names */} We record dialect on every item we
        collect, so that dialect-disaggregated evaluation becomes possible rather than
        aspirational.
      </p>

      <span className="eyebrow">Infrastructure</span>
      <ul>
        <li>
          <a href="https://qor.unkad.com">Qor Af-Soomaali</a>, our community platform for
          building consented, dialect-tagged Somali text with two-tier validation. Evaluation
          sets have to be built out of language, and this is where the language comes from.
        </li>
        <li>
          <a href="https://huggingface.co/spaces/unkadlabs/somalibench">
            The SomaliBench leaderboard
          </a>
          , publishing English versus Somali refusal rates for open-weight models.
        </li>
        <li>
          <a href="https://github.com/unkadlabs/awesome-somali-nlp">awesome-somali-nlp</a>, an
          index of what exists for Somali and an honest account of what does not.
        </li>
        <li>
          <a href="https://huggingface.co/unkadlabs">unkadlabs on Hugging Face</a>, where
          datasets and benchmarks are released under open licences.
        </li>
      </ul>

      <span className="eyebrow">Publications</span>
      <p className="empty-state">Our first benchmark paper is in preparation (2026).</p>

      <span className="eyebrow">Principles</span>
      <ul>
        <li>
          <strong>Measurement before assertion.</strong> We publish numbers with methods and
          code attached, and we state the limitations in the same breath as the findings.
        </li>
        <li>
          <strong>Open release by default.</strong> Datasets, benchmarks, and papers are
          published openly unless there is a specific safety reason not to.
        </li>
        <li>
          <strong>Human data dignity.</strong> Contributors consent explicitly and choose how
          they are credited. Nobody&rsquo;s words enter a dataset without their knowledge.
        </li>
        <li>
          <strong>Dialect inclusion from the start.</strong> Not as a later refinement, because
          a benchmark that ignores dialect variation measures less than it claims to.
        </li>
        <li>
          <strong>Safety evaluation before capability claims.</strong> We would rather know
          whether a system is safe in Somali than celebrate that it speaks it.
        </li>
        <li>
          <strong>Alignment is for every language.</strong> Findings, methods, and failures go
          back to the broader research community, so that work on one language moves the rest.
        </li>
      </ul>
    </div>
  );
}
