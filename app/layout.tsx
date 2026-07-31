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
    'Unkad Labs is a non-profit AI research laboratory measuring whether AI safety survives a change of language. Alignment research, safety evaluations, and open datasets for Somali and other low-resource languages.',
  applicationName: 'Unkad Labs',
  authors: [{ name: 'Unkad Labs', url: 'https://unkad.com' }],
  creator: 'Unkad Labs',
  publisher: 'Unkad Labs',
  // Google has ignored this tag since 2009 and it is kept only because Bing and
  // several smaller engines still read it. The terms that actually rank live in
  // the titles, the descriptions, the headings and the structured data below.
  keywords: [
    'Somali NLP',
    'Somali language AI',
    'Somali AI research',
    'AI alignment',
    'AI safety',
    'AI safety evaluation',
    'alignment research',
    'low-resource languages',
    'African NLP',
    'Somali dataset',
    'Somali corpus',
    'Somali machine translation',
    'Somali benchmarks',
    'Maay dialect',
    'Maxaa tiri',
    'red-teaming low-resource languages',
    'scalable oversight',
    'multi-agent debate',
    'AI debate safety',
    'LLM judge evaluation',
    'evaluator-adaptive encoding',
    'multilingual AI safety',
    'multilingual alignment',
    'Somali AI alignment',
    'Somali LLM',
    'AI safety Africa',
    'open datasets',
    'Qor Af-Soomaali',
    'low-resource language safety',
    'safety evaluation low-resource languages',
    'cross-lingual safety',
    'cross-lingual generalization safety',
    'multilingual red-teaming',
    'multilingual jailbreak',
    'language transfer safety',
    'refusal consistency across languages',
    'non-profit AI safety lab',
    'open Somali language data',
    'Af-Soomaali dataset',
    'Somali sentence segmentation',
    'Somali evaluation benchmark',
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
  // PLACEHOLDER: after adding the site to Google Search Console, put the
  // verification token here: verification: { google: '...' },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#FCFBF8' },
    { media: '(prefers-color-scheme: dark)', color: '#141312' },
  ],
};

// Applies a saved theme before first paint to avoid a flash of the wrong theme.
const themeInit = `
try {
  var t = localStorage.getItem('theme');
  if (t === 'dark' || t === 'light') document.documentElement.setAttribute('data-theme', t);
} catch (e) {}
`;

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
  '@type': ['ResearchOrganization', 'NGO'],
  '@id': 'https://www.unkad.com/#organization',
  name: 'Unkad Labs',
  alternateName: ['Unkad', 'Unkad Labs AI safety'],
  url: 'https://www.unkad.com',
  logo: {
    '@type': 'ImageObject',
    url: 'https://www.unkad.com/icon.svg',
  },
  description:
    'Non-profit AI research laboratory measuring whether the safety properties of AI systems survive a change of language, and building the open Somali language data that answering the question requires.',
  foundingDate: '2026',
  knowsLanguage: ['so', 'en'],
  knowsAbout: [
    'AI alignment',
    'AI safety',
    'AI safety evaluation',
    'Multilingual AI safety',
    'Low-resource languages',
    'Scalable oversight',
    'Multi-agent debate',
    'Red-teaming',
    'Somali language',
    'Natural language processing',
    'Open datasets',
    'Data provenance',
    'Sentence boundary detection',
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
    // suppressHydrationWarning: the inline script above may set data-theme
    // on <html> before React hydrates, which is expected.
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInit }} />
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
