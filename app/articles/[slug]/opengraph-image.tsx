// Per-article social card, generated at build time from the article's
// frontmatter. One card per article, automatically — no design work
// needed when publishing.

import { ImageResponse } from 'next/og';
import { getAllArticles, getArticle, longDate } from '@/lib/articles';
import { OG_SIZE, OG_COLORS, ogFonts, OgMark } from '@/lib/og';

export const dynamic = 'force-static';
export const alt = 'Unkad Labs article';
export const size = OG_SIZE;
export const contentType = 'image/png';

export function generateStaticParams() {
  return getAllArticles().map((article) => ({ slug: article.slug }));
}

export default async function OgImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = getArticle(slug);

  // Long titles get a smaller size so they fit the card.
  const titleSize = article.title.length > 55 ? 56 : 68;

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: 80,
          backgroundColor: OG_COLORS.bg,
          fontFamily: 'Source Serif 4',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
          <OgMark size={56} />
          <div style={{ fontSize: 30, color: OG_COLORS.muted, display: 'flex' }}>
            Unkad Labs · Articles
          </div>
        </div>
        <div
          style={{
            fontSize: titleSize,
            fontWeight: 700,
            color: OG_COLORS.text,
            letterSpacing: '-0.01em',
            lineHeight: 1.15,
            maxWidth: 1000,
          }}
        >
          {article.title}
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: 28,
          }}
        >
          <div style={{ color: OG_COLORS.muted, display: 'flex' }}>{longDate(article.date)}</div>
          <div style={{ color: OG_COLORS.accent, display: 'flex' }}>unkad.com</div>
        </div>
      </div>
    ),
    { ...OG_SIZE, fonts: ogFonts() }
  );
}
