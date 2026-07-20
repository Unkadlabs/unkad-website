import type { Metadata, Viewport } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://unkad.com'),
  title: {
    default: 'Unkad Labs — Somali language AI and alignment research',
    template: '%s — Unkad Labs',
  },
  description:
    'Unkad Labs is a non-profit AI research laboratory in Mogadishu building open Somali language datasets, safety evaluations, and alignment research for low-resource languages.',
  applicationName: 'Unkad Labs',
  authors: [{ name: 'Unkad Labs', url: 'https://unkad.com' }],
  creator: 'Unkad Labs',
  publisher: 'Unkad Labs',
  keywords: [
    'Somali language AI',
    'AI alignment',
    'low-resource languages',
    'Somali NLP',
    'AI safety evaluation',
    'open datasets',
    'Mogadishu',
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
const orgJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ResearchOrganization',
  name: 'Unkad Labs',
  alternateName: 'Unkad',
  url: 'https://unkad.com',
  logo: 'https://unkad.com/icon.svg',
  description:
    'Non-profit AI research laboratory building open Somali language datasets, safety evaluations, and alignment research for low-resource languages.',
  foundingDate: '2026',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Mogadishu',
    addressCountry: 'SO',
  },
  sameAs: [
    'https://github.com/unkadlabs',
    'https://huggingface.co/unkadlabs',
    'https://x.com/unkadlabs',
  ],
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
      </head>
      <body>
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <Header />
        <main id="main">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
