import type { Metadata, Viewport } from 'next';
import { Analytics } from '@vercel/analytics/next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import './globals.css';

export const metadata: Metadata = {
  // www is the primary domain; the apex unkad.com 301s to it. Metadata must use
  // the non-redirecting host, because social crawlers (LinkedIn especially) drop
  // an og:image that redirects even once.
  metadataBase: new URL('https://www.unkad.com'),
  title: {
    default: 'Unkad Labs · Somali language AI and alignment research',
    template: '%s · Unkad Labs',
  },
  description:
    'Unkad Labs is an independent AI research lab measuring whether AI safety survives a change of language. Safety evaluations, alignment research, and open datasets for Somali and other low-resource languages.',
  applicationName: 'Unkad Labs',
  authors: [{ name: 'Unkad Labs', url: 'https://unkad.com' }],
  creator: 'Unkad Labs',
  publisher: 'Unkad Labs',
  keywords: [
    'Somali NLP',
    'Somali language AI',
    'AI alignment',
    'AI safety evaluation',
    'multilingual AI safety',
    'low-resource languages',
    'Somali dataset',
    'Somali corpus',
    'Qor Af-Soomaali',
    'scalable oversight',
    'cross-lingual safety',
    'African NLP',
  ],
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
  twitter: {
    card: 'summary_large_image',
    site: '@unkadlabs',
  },
};

export const viewport: Viewport = {
  themeColor: '#F7F6F1',
};

// Organization structured data for search engines.
//
// Deliberately carries no address. A PostalAddress is the single strongest
// local-search signal there is and dropping it costs real "lab near me" style
// ranking, but placing the lab on a map places the people in it, and that is a
// judgement the founder has made for the whole project. Discovery rests on
// language and subject instead — which is where the international audience
// searches from anyway.
//
// `knowsAbout` is doing the work the address used to. It is how Google ties an
// organization to topics in its entity graph, so the lab can surface for the
// subject rather than for a place.
const orgJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ResearchOrganization',
  '@id': 'https://www.unkad.com/#organization',
  name: 'Unkad Labs',
  alternateName: ['Unkad', 'Unkad Labs AI safety'],
  url: 'https://www.unkad.com',
  logo: {
    '@type': 'ImageObject',
    url: 'https://www.unkad.com/icon.svg',
  },
  description:
    'Independent AI research lab measuring whether the safety properties of AI systems survive a change of language, and building the open Somali language data that answering the question requires.',
  foundingDate: '2026',
  knowsLanguage: ['so', 'en'],
  knowsAbout: [
    'AI alignment',
    'AI safety',
    'AI safety evaluation',
    'Multilingual AI safety',
    'Low-resource languages',
    'Scalable oversight',
    'Red-teaming',
    'Somali language',
    'Natural language processing',
    'Open datasets',
    'Data provenance',
  ],
  sameAs: [
    'https://github.com/Unkadlabs',
    'https://huggingface.co/unkadlabs',
    'https://x.com/unkadlabs',
    'https://qor.unkad.com',
  ],
};

// Tells search engines the two domains are one property. Without it,
// qor.unkad.com and www.unkad.com compete as unrelated sites for the same
// Somali-corpus queries instead of reinforcing each other.
const siteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': 'https://www.unkad.com/#website',
  url: 'https://www.unkad.com',
  name: 'Unkad Labs',
  inLanguage: 'en',
  publisher: { '@id': 'https://www.unkad.com/#organization' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link
          rel="preload"
          href="/fonts/SourceSans3VF-Upright.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd) }}
        />
      </head>
      <body>
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <Header />
        <main id="main">{children}</main>
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}
