import type { Metadata } from 'next';
import Link from 'next/link';

/* ============================================================
   POST TEMPLATE — to add a new post:
   1. Copy this folder to app/blog/your-post-slug/
   2. Update the metadata below and the article content.
   3. Add an entry at the TOP of the array in lib/posts.ts
      (the blog index and sitemap update automatically).
   ============================================================ */

export const metadata: Metadata = {
  title: 'Dhig Labs: write it down',
  description:
    'Why we started a non-profit AI research lab in Mogadishu, what the name Dhig means, and how to take part.',
  alternates: { canonical: '/blog/hello-world' },
  openGraph: {
    title: 'Dhig Labs: write it down',
    description:
      'Why we started a non-profit AI research lab in Mogadishu, what the name Dhig means, and how to take part.',
    type: 'article',
    url: '/blog/hello-world',
  },
};

export default function HelloWorldPost() {
  return (
    <div className="container">
      <article>
        <p className="back-link">
          <Link href="/blog">← All posts</Link>
        </p>

        <h1>Dhig Labs: write it down</h1>
        <p className="post-meta">
          <time dateTime="2026-07-07">July 7, 2026</time> · Dhig Labs
        </p>

        <p>
          {/* VERIFY SOMALI */}
          In Somali, <em lang="so">dhig</em> means &ldquo;write it down.&rdquo; It is a fitting
          name for what we are trying to do. Somali carries one of the world&rsquo;s great oral
          traditions — centuries of poetry, law, and memory passed from voice to voice — and it
          has only had a standard written form since 1972. Much of the language has simply never
          been written down. Now a new kind of machine is learning to read, and it can only learn
          from what is on the page.
        </p>

        <p>
          That is the problem. Somali is spoken by more than 20 million people, but the text
          available to train AI systems is scarce, noisy, and narrow. Dialects such as Maay are
          nearly invisible in it. As a result, the systems that are becoming the front door to
          information — search, assistants, translation — perform poorly in Somali, and nobody is
          measuring how poorly, or where the failures cause real harm.
        </p>

        <p>
          Dhig Labs is a non-profit research laboratory in Mogadishu built to change this. We work
          on two things.
        </p>

        <p>
          The first is data. The Dhig Platform invites Somali speakers to write, record, and
          validate language data across the sectors where language matters most: health,
          education, agriculture, law, media, religion. Models assist; people verify. Every
          dataset we produce is released under an open license, and every contributor is credited
          and consented.
        </p>

        <p>
          The second is measurement. We are building the evaluation infrastructure that Somali
          currently lacks: safety and toxicity test sets, translation and comprehension
          benchmarks, red-teaming methods designed for low-resource languages. When a frontier lab
          wants to know whether its model is safe and accurate in Somali, we want the answer to be
          a benchmark score, not a guess.
        </p>

        <p>
          We are starting small: a pilot in one or two sectors, a first cohort of contributors, a
          first open dataset, a first paper. Everything we make will be public.
        </p>

        <p>
          If you speak Somali — any dialect — you can help us write it down. If you are a
          researcher, a university, or a funder who believes no language should be left out of
          this technology, we would like to hear from you.{' '}
          <Link href="/contact">Get in touch</Link>.
        </p>

        <p lang="so" className="muted">
          {/* VERIFY SOMALI */}
          <em>
            [SOMALI TRANSLATION — founders to write: a closing paragraph in Somali summarizing the
            invitation above.]
          </em>
        </p>
      </article>
    </div>
  );
}
