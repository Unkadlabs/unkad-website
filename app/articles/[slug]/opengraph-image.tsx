// Per-article social card, generated at build time from the article's
// frontmatter. When the article sets a `hook` (a focal stat like "100 to 16")
// the card leads with it, because a research result is more arresting in a feed
// than a title. Otherwise the title carries the card. No per-article design work.

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
  const hasHook = Boolean(article.hook);

  // With a hook the title is a supporting line, so it can run smaller. Without
  // one the title is the hero and scales to its length.
  const titleSize = hasHook
    ? article.title.length > 48
      ? 40
      : 46
    : article.title.length > 55
      ? 58
      : 70;

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: 72,
          backgroundColor: OG_COLORS.bg,
          // Depth: a soft teal glow from the lower left, so the card is not a
          // flat rectangle in the feed.
          backgroundImage:
            'radial-gradient(900px 600px at 8% 108%, rgba(77,182,165,0.18), rgba(20,19,18,0) 60%)',
          fontFamily: 'Literata',
        }}
      >
        {/* Eyebrow: mark, wordmark, and topic chips */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            <OgMark size={48} />
            <div
              style={{
                display: 'flex',
                fontSize: 27,
                color: OG_COLORS.muted,
                letterSpacing: '0.02em',
              }}
            >
              Unkad Labs
            </div>
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            {article.topics.slice(0, 3).map((topic) => (
              <div
                key={topic}
                style={{
                  display: 'flex',
                  fontSize: 20,
                  color: OG_COLORS.accent,
                  border: '1px solid rgba(77,182,165,0.4)',
                  borderRadius: 999,
                  padding: '6px 18px',
                }}
              >
                {topic}
              </div>
            ))}
          </div>
        </div>

        {/* Hero */}
        {hasHook ? (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div
              style={{
                display: 'flex',
                fontSize: 150,
                fontWeight: 700,
                color: OG_COLORS.accent,
                letterSpacing: '-0.02em',
                lineHeight: 1,
              }}
            >
              {article.hook}
            </div>
            {article.hookLabel ? (
              <div
                style={{
                  display: 'flex',
                  fontSize: 28,
                  color: OG_COLORS.muted,
                  maxWidth: 980,
                  marginTop: 18,
                }}
              >
                {article.hookLabel}
              </div>
            ) : null}
            <div
              style={{
                display: 'flex',
                fontSize: titleSize,
                fontWeight: 700,
                color: OG_COLORS.text,
                letterSpacing: '-0.01em',
                lineHeight: 1.15,
                maxWidth: 1010,
                marginTop: 26,
              }}
            >
              {article.title}
            </div>
          </div>
        ) : (
          <div
            style={{
              display: 'flex',
              fontSize: titleSize,
              fontWeight: 700,
              color: OG_COLORS.text,
              letterSpacing: '-0.01em',
              lineHeight: 1.15,
              maxWidth: 1010,
            }}
          >
            {article.title}
          </div>
        )}

        {/* Footer with an accent rule */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div
            style={{
              display: 'flex',
              height: 3,
              width: 96,
              backgroundColor: OG_COLORS.accent,
              marginBottom: 18,
            }}
          />
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              fontSize: 26,
            }}
          >
            <div style={{ color: OG_COLORS.muted, display: 'flex' }}>{longDate(article.date)}</div>
            <div style={{ color: OG_COLORS.text, display: 'flex' }}>unkad.com</div>
          </div>
        </div>
      </div>
    ),
    { ...OG_SIZE, fonts: ogFonts() }
  );
}
