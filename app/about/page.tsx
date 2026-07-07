import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'About',
  description:
    'Dhig Labs is a registered non-profit AI research laboratory in Mogadishu, Somalia. Meet the team and learn how we work with partners.',
  alternates: { canonical: '/about' },
  openGraph: {
    title: 'About — Dhig Labs',
    description:
      'A non-profit AI research laboratory in Mogadishu, Somalia, working on Somali language data and AI safety.',
    type: 'website',
    url: '/about',
  },
};

export default function AboutPage() {
  return (
    <div className="container">
      <h1>About</h1>

      <p>
        Dhig Labs exists to bring the Somali language fully into the age of artificial
        intelligence. We build open datasets through community contribution, and we research how
        to evaluate and align AI systems for Somali and other low-resource languages. We are
        based in Mogadishu, Somalia.
      </p>

      <span className="eyebrow">Team</span>

      <p>
        <strong>Dr. [NAME] — Executive Director &amp; Research Lead.</strong> AI researcher (PhD).
        Leads the research agenda and represents Dhig Labs to academic and funding partners.
      </p>

      <p>
        <strong>[NAME] — CTO &amp; Platform Lead.</strong> Software engineer and researcher.
        Architect of the Dhig Platform and all data infrastructure.
      </p>

      <p>
        <strong>[NAME] — COO &amp; Program Lead.</strong> Program management professional. Leads
        delivery, grants administration, and contributor operations.
      </p>

      <p className="muted">Advisors: [to be announced].</p>

      <span className="eyebrow">Partnerships</span>
      <p>
        We work with universities in Somalia and the diaspora, the{' '}
        <a href="https://www.masakhane.io/">Masakhane</a> community, and funders supporting
        African language AI. Interested institutions → <Link href="/contact">Contact</Link>.
      </p>

      <span className="eyebrow">Non-profit status</span>
      <p>
        {/* PLACEHOLDER: confirm registration details/jurisdiction before launch */}
        Dhig Labs is a registered non-profit organization. All datasets and research are released
        under open licenses.
      </p>
    </div>
  );
}
