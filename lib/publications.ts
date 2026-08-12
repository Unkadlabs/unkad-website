// The lab's research output, newest first. One entry per completed piece
// of work: the article is the canonical writeup, and every artifact that
// lets someone verify or build on it hangs off the same entry.
//
// This list is maintained by hand on purpose. A publication implies a
// finished claim with artifacts behind it; deriving the list from the
// articles folder would promote every future essay automatically, and
// not every article is a publication (the launch note is not).

export type Publication = {
  slug: string; // article slug, also the stable id for anchors
  title: string;
  date: string; // ISO, matches the article frontmatter
  venue: 'Research note'; // honest label until there is a peer-reviewed entry
  // The finding's focal number, exactly as the article's own hook. The
  // publications index leads every record with it, so the page scans as
  // a column of findings and matches the article social cards.
  hook: string;
  hookLabel: string;
  finding: string; // one sentence, the number first where there is one
  artifacts: { label: string; href: string }[];
  bibtex: string;
};

const AUTHOR = 'Dahir, Khalid Yusuf';

function bib(key: string, title: string, year: string, url: string): string {
  return `@misc{unkad${key},
  author = {${AUTHOR}},
  title = {${title}},
  year = {${year}},
  publisher = {Unkad Labs},
  url = {${url}},
  note = {Research note. Data, code, and pre-registration at the same URL.}
}`;
}

export const publications: Publication[] = [
  {
    slug: 'one-model-reads-somali',
    hook: '9 in 10',
    hookLabel: 'scrambled Somali sentences one open model accepted as natural',
    title: 'One model reads Somali. The next one approves word salad.',
    date: '2026-08-05',
    venue: 'Research note',
    finding:
      'Across three same-class open models, Somali grammaticality detection spans 0.54 to 0.94 balanced accuracy; one model accepts scrambled Somali 90% of the time, and 26 points of its failure is decision threshold rather than missing information.',
    artifacts: [
      { label: 'Article', href: '/articles/one-model-reads-somali' },
      { label: 'Code + 2,400 judgements', href: 'https://github.com/Unkadlabs/qor-hubi-floor' },
      {
        label: 'Dataset',
        href: 'https://huggingface.co/datasets/unkadlabs/qor-af-soomaali',
      },
    ],
    bibtex: bib(
      '2026hubifloor',
      'One model reads Somali. The next one approves word salad.',
      '2026',
      'https://www.unkad.com/articles/one-model-reads-somali'
    ),
  },
  {
    slug: 'every-sentence-has-a-name',
    hook: '150',
    hookLabel: 'sentences we deleted because we could not say who wrote them',
    title: 'Every sentence has a name',
    date: '2026-07-30',
    venue: 'Research note',
    finding:
      'First release of the Qor corpus: consented, dialect-tagged, twice-validated Somali text where the provenance of every sentence is known, which no scraped corpus of any language can claim.',
    artifacts: [
      { label: 'Article', href: '/articles/every-sentence-has-a-name' },
      {
        label: 'Corpus',
        href: 'https://huggingface.co/datasets/unkadlabs/qor-af-soomaali',
      },
      { label: 'Platform source', href: 'https://github.com/Unkadlabs/qor-af-soomaali' },
    ],
    bibtex: bib(
      '2026qorcorpus',
      'Qor Af-Soomaali: a provenance-complete Somali corpus',
      '2026',
      'https://huggingface.co/datasets/unkadlabs/qor-af-soomaali'
    ),
  },
  {
    slug: 'the-lie-moved-the-liar-did-not',
    hook: '1.00 \u2192 0.49',
    hookLabel: 'how often the model lied where its watcher could see',
    title: 'The lie moved. The liar did not.',
    date: '2026-07-26',
    venue: 'Research note',
    finding:
      'A model trained against a blind-spotted lie detector kept its deception machinery unchanged internally and stopped using it only where the watcher could see; suppression of the caught behaviour stalled at roughly half and stayed there.',
    artifacts: [
      { label: 'Article', href: '/articles/the-lie-moved-the-liar-did-not' },
      {
        label: 'Code + transcripts',
        href: 'https://github.com/Unkadlabs/unkad-evaluator-encoding',
      },
    ],
    bibtex: bib(
      '2026liemoved',
      'The lie moved. The liar did not.',
      '2026',
      'https://www.unkad.com/articles/the-lie-moved-the-liar-did-not'
    ),
  },
  {
    slug: 'the-guard-that-waves-somali-through',
    hook: '100 \u2192 16',
    hookLabel: 'harmful prompts a safety filter caught, English to Somali',
    title: 'The guard that waves Somali through',
    date: '2026-07-24',
    venue: 'Research note',
    finding:
      'Open safety filters catch 100% of a harmful-prompt set in English and as little as 6% of the same content in Somali, while passing harmless Somali almost perfectly, so aggregate accuracy on realistic traffic stays green.',
    artifacts: [
      { label: 'Article', href: '/articles/the-guard-that-waves-somali-through' },
      {
        label: 'Code + all 300 verdicts',
        href: 'https://github.com/Unkadlabs/unkad-guard-collapse',
      },
    ],
    bibtex: bib(
      '2026guardcollapse',
      'The guard that waves Somali through',
      '2026',
      'https://www.unkad.com/articles/the-guard-that-waves-somali-through'
    ),
  },
  {
    slug: 'the-overseer-that-cannot-read',
    hook: '62% \u2192 6%',
    hookLabel: 'how often the judge said yes once it could not read the source',
    title: 'The overseer that cannot read',
    date: '2026-07-22',
    venue: 'Research note',
    finding:
      'An LLM judge denied a readable source does not become uncertain, it collapses to rejecting nearly everything (yes rate 62% to 6%), and posts a perfect score on the half of the data where no was the right answer; debate’s advantage survives the blinding.',
    artifacts: [
      { label: 'Article', href: '/articles/the-overseer-that-cannot-read' },
      {
        label: 'Code + 5,400 judgements',
        href: 'https://github.com/Unkadlabs/unkad-oversight',
      },
    ],
    bibtex: bib(
      '2026overseer',
      'The overseer that cannot read',
      '2026',
      'https://www.unkad.com/articles/the-overseer-that-cannot-read'
    ),
  },
  {
    slug: 'the-somali-token-tax',
    hook: '2\u00d7',
    hookLabel: 'tokens billed for Somali against English, across nine tokenizers',
    title: 'The Somali token tax',
    date: '2026-07-20',
    venue: 'Research note',
    finding:
      'Nine major tokenizers charge Somali 1.5 to 2.2 times the tokens of English for identical content, while a Somali-first tokenizer reaches 0.68x, so the tax is a design choice rather than a property of the language.',
    artifacts: [
      { label: 'Article', href: '/articles/the-somali-token-tax' },
      { label: 'Method + code', href: 'https://github.com/unkadlabs/somali-token-tax' },
      {
        label: 'SomaliBench leaderboard',
        href: 'https://huggingface.co/spaces/unkadlabs/somalibench',
      },
    ],
    bibtex: bib(
      '2026tokentax',
      'The Somali token tax',
      '2026',
      'https://www.unkad.com/articles/the-somali-token-tax'
    ),
  },
];
