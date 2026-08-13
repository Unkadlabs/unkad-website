// /llms-full.txt — the lab's entire published writing as one plain-markdown
// document, per the llmstxt.org convention. An agent that fetches this has
// every research note, finding, caveat, and evidence link without crawling
// eight pages. Generated at build time from the article sources themselves.

import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { getAllArticles } from '@/lib/articles';
import { publications } from '@/lib/publications';

export const dynamic = 'force-static';

const BASE = 'https://www.unkad.com';

export async function GET() {
  const articles = getAllArticles();

  const sections = articles.map((a) => {
    const raw = fs.readFileSync(
      path.join(process.cwd(), 'content', 'articles', `${a.slug}.md`),
      'utf8'
    );
    const { content } = matter(raw);
    const pub = publications.find((p) => p.slug === a.slug);
    const kind = pub
      ? `Research note ${String(
          publications.length - publications.indexOf(pub)
        ).padStart(2, '0')} · not peer-reviewed`
      : 'Lab essay';
    const artifacts = pub
      ? pub.artifacts.map((x) => `- ${x.label}: ${x.href}`).join('\n')
      : '';

    return [
      `# ${a.title}`,
      '',
      `${kind} · ${a.date} · ${BASE}/articles/${a.slug}`,
      '',
      `> ${a.description}`,
      '',
      artifacts ? `Evidence:\n${artifacts}\n` : '',
      content.trim(),
    ]
      .filter(Boolean)
      .join('\n');
  });

  const body =
    `# Unkad Labs — all published writing\n\n` +
    `> Independent AI research lab: does AI safety survive a change of language? ` +
    `This file contains every research note and essay in full. ` +
    `Site: ${BASE} · Map: ${BASE}/llms.txt · Data: https://huggingface.co/unkadlabs\n\n---\n\n` +
    sections.join('\n\n---\n\n') +
    '\n';

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
