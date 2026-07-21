import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'About',
  description:
    'Unkad Labs is a non-profit AI research laboratory in Mogadishu working on multilingual safety: whether the safety properties of AI systems survive a change of language.',
  alternates: { canonical: '/about' },
  openGraph: {
    siteName: 'Unkad Labs',
    locale: 'en_US',
    title: 'About · Unkad Labs',
    description:
      'A non-profit AI research laboratory in Mogadishu working on whether the safety properties of AI systems survive a change of language.',
    type: 'website',
    url: '/about',
  },
};

export default function AboutPage() {
  return (
    <div className="container">
      <h1>About</h1>

      {/* VERIFY SOMALI: name gloss */}
      <p className="article-lead">
        <em lang="so">Unkad</em> is Somali for creation from nothing. It shares a root with{' '}
        <em lang="so">unug</em>, the cell, the smallest unit of a living thing. Large things get
        built by assembling small units until something holds together.
      </p>

      <p>
        Unkad Labs is a non-profit AI research laboratory in Mogadishu, Somalia. We work on one
        question: do the safety properties of AI systems survive a change of language?
      </p>

      <p>
        The question sounds narrow. It is not. Safety behaviour in a language model is learned
        from examples, and those examples are overwhelmingly English. When a lab reports that a
        model refuses harmful requests reliably, that finding was almost certainly established
        in English. The model is then deployed to people who will not address it in English, and
        the safety claim travels with the deployment as though language had nothing to do with
        it.
      </p>

      <p>
        We measured what actually happens. Putting identical harmful requests to open-weight
        models in English and in Somali, Llama 3.1 refuses 97 percent of the time in English and
        7 percent of the time in Somali. Aya falls from 80 percent to 5 percent. For most of the
        world&rsquo;s languages, nobody has run this test at all.
      </p>

      <span className="eyebrow">Why Somali</span>
      <p>
        It is our language, which matters both for the work and for who gets to do it. It is
        also a genuinely useful hard case. More than twenty million people speak it. It carries
        an enormous oral tradition and a writing system standardised only in 1972. It has real
        dialect variation, with Maay spoken by millions and almost absent from digital text.
        {/* VERIFY SOMALI: dialect names */} And it is thin enough in training data that the
        failures we care about are visible rather than subtle.
      </p>
      <p>
        Methods that hold up under those conditions have a reasonable chance of holding up for
        the hundreds of languages in similar positions. That is the point of working here rather
        than treating Somali as a special case.
      </p>

      <span className="eyebrow">How we work</span>
      <p>
        We measure before we assert, and we publish the limitations alongside the findings.
        Our own safety benchmark has a caveat we state every time we cite it: a low refusal
        rate does not always mean fluent harmful compliance, because some failures in Somali
        surface as incoherent output instead. That distinction matters, and glossing over it
        would make our numbers louder and less true.
      </p>
      <p>
        Everything is released openly, including code, methodology, and results that complicate
        our own story. The <Link href="/platform">platform</Link> we built for collecting
        language data is open source so that any language community can deploy it. Contributors
        consent explicitly before writing anything and choose how they are credited.
      </p>

      <span className="eyebrow">People</span>
      <p>
        Unkad Labs is run by a small research team in Mogadishu and the Somali diaspora, working
        with linguist reviewers who verify the language data our evaluations depend on. A fuller
        team page is coming.
      </p>

      <span className="eyebrow">Working with us</span>
      <p>
        We are interested in conversations with people working on multilingual evaluation, AI
        safety institutes and their capacity-building work, and researchers building language
        resources for under-served languages. If your work touches whether models behave safely
        outside English, we would like to compare notes.{' '}
        <Link href="/contact">Get in touch</Link>.
      </p>

      <span className="eyebrow">Non-profit status</span>
      <p>
        {/* PLACEHOLDER: confirm registration details/jurisdiction before launch */}
        Unkad Labs is a registered non-profit organization. All datasets and research are
        released under open licenses.
      </p>
    </div>
  );
}
