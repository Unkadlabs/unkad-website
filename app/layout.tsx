import type { Metadata } from 'next';
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
};

// Applies a saved theme before first paint to avoid a flash of the wrong theme.
const themeInit = `
try {
  var t = localStorage.getItem('theme');
  if (t === 'dark' || t === 'light') document.documentElement.setAttribute('data-theme', t);
} catch (e) {}
`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // suppressHydrationWarning: the inline script above may set data-theme
    // on <html> before React hydrates, which is expected.
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInit }} />
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
