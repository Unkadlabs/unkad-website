// Default social card, generated at build time. Applies site-wide;
// articles override it with per-article cards.

import { ImageResponse } from 'next/og';
import { OG_SIZE, OG_COLORS, ogFonts, OgMark } from '@/lib/og';

export const dynamic = 'force-static';
export const alt = 'Unkad Labs — Somali language AI and alignment research';
export const size = OG_SIZE;
export const contentType = 'image/png';

export default function OgImage() {
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
        <OgMark size={110} />
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div
            style={{
              fontSize: 96,
              fontWeight: 700,
              color: OG_COLORS.text,
              letterSpacing: '-0.02em',
            }}
          >
            Unkad Labs
          </div>
          <div style={{ marginTop: 18, fontSize: 34, color: OG_COLORS.muted }}>
            Unkad — Somali for creation from nothing.
          </div>
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: 28,
          }}
        >
          <div style={{ color: OG_COLORS.muted, display: 'flex' }}>
            Somali language AI · Alignment research
          </div>
          <div style={{ color: OG_COLORS.accent, display: 'flex' }}>unkad.com</div>
        </div>
      </div>
    ),
    { ...OG_SIZE, fonts: ogFonts() }
  );
}
