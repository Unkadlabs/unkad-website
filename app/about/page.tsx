import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'About',
  description:
    'Unkad Labs is a non-profit AI research laboratory in Mogadishu, Somalia, working on Somali language data and AI alignment.',
  alternates: { canonical: '/about' },
  openGraph: {
    title: 'About — Unkad Labs',
    description:
      'A non-profit AI research laboratory in Mogadishu, Somalia, working on Somali language data and AI alignment.',
    type: 'website',
    url: '/about',
  },
};

export default function AboutPage() {
  return (
    <div className="container">
      <h1>About</h1>

      {/* VERIFY SOMALI: name gloss */}
      <p>
        <em lang="so">Unkad</em> is Somali for creation from nothing. It shares a root with{' '}
        <em lang="so">unug</em> — the cell, the smallest unit of a living thing. That is how we
        work: large things assembled from small units, contribution by contribution.
      </p>

      <p>
        Unkad Labs exists to build the Somali language into the age of artificial intelligence.
        We create open datasets through community contribution, and we research how to evaluate
        and align AI systems for Somali and other low-resource languages — work we share with
        the broader alignment community. We are based in Mogadishu, Somalia.
      </p>

      <span className="eyebrow">People</span>
      <p>
        Unkad Labs is run by a small research team in Mogadishu and the Somali diaspora. A full
        team page is coming.
      </p>

      <span className="eyebrow">Partnerships</span>
      <p>
        We work with universities in Somalia and the diaspora, the{' '}
        <a href="https://www.masakhane.io/">Masakhane</a> community, and funders supporting
        African language AI. Interested institutions → <Link href="/contact">Contact</Link>.
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
