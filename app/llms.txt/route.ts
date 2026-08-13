// /llms.txt — the llmstxt.org convention: a concise, LLM-friendly map of the
// site so AI agents and assistants can orient without crawling. Generated at
// build time from the same sources as the pages, so it cannot drift.

import { getAllArticles } from '@/lib/articles';
import { publications } from '@/lib/publications';
import { CURRENT_RELEASE } from '@/lib/release';

export const dynamic = 'force-static';

const BASE = 'https://www.unkad.com';

export async function GET() {
  const notes = publications
    .map((p, i) => {
      const no = String(publications.length - i).padStart(2, '0');
      return `- [Note ${no}: ${p.title}](${BASE}/articles/${p.slug}): ${p.finding}`;
    })
    .join('\n');

  const essays = getAllArticles()
    .filter((a) => !publications.some((p) => p.slug === a.slug))
    .map((a) => `- [${a.title}](${BASE}/articles/${a.slug}): ${a.description}`)
    .join('\n');

  const body = `# Unkad Labs

> Independent AI research lab measuring whether the safety properties of AI systems survive a change of language, starting with Somali. We publish research notes with raw evidence attached (code, judgments, pre-registrations), build the open Qor Af-Soomaali corpus with per-sentence provenance, and run SomaliBench, a live English-vs-Somali refusal benchmark. Failed predictions stay published.

Key facts: founded 2026; founder-led with a volunteer community of Somali-speaking contributors and reviewers; ${publications.length} research notes (none peer-reviewed yet, each says so); datasets under CC BY-SA 4.0; current corpus release ${CURRENT_RELEASE}.

## Research notes
${notes}

## Data
- [Qor Af-Soomaali](${BASE}/platform): how the corpus is built — consent, two-tier validation, provenance pipeline, release history
- [Dataset downloads](https://huggingface.co/datasets/unkadlabs/qor-af-soomaali): versioned JSONL releases on Hugging Face
- [SomaliBench leaderboard](https://huggingface.co/spaces/unkadlabs/somalibench): live English-vs-Somali refusal rates
- [Contribute (Somali speakers)](https://qor.unkad.com): write, translate, or validate Somali

## Lab
- [Research agenda and standards](${BASE}/research): active programs, publication ledger with BibTeX
- [About](${BASE}/about): mission, structure, legal status, timeline
- [Contact](${BASE}/contact): research@unkad.com (research, replication, funding) · info@unkad.com (general)
- [Code](https://github.com/Unkadlabs): every experiment's repository

## Essays
${essays}

## Optional
- [llms-full.txt](${BASE}/llms-full.txt): every research note and essay in full, as plain markdown, one fetch
`;

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
