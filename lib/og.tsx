// Shared pieces for build-time Open Graph card generation (next/og).
// Cards use the dark brand palette so they stand out in feeds, the
// Literata faces in assets/fonts/ (build-time only, never shipped to
// visitors) so cards match the site's reading voice, and the cell-U mark.

import fs from 'fs';
import path from 'path';

export const OG_SIZE = { width: 1200, height: 630 };

export const OG_COLORS = {
  bg: '#141312',
  text: '#E8E6E1',
  muted: '#A5A19A',
  accent: '#4DB6A5',
};

export function ogFonts() {
  const dir = path.join(process.cwd(), 'assets', 'fonts');
  return [
    {
      name: 'Literata',
      data: fs.readFileSync(path.join(dir, 'Literata-Regular.ttf')),
      weight: 400 as const,
      style: 'normal' as const,
    },
    {
      name: 'Literata',
      data: fs.readFileSync(path.join(dir, 'Literata-Bold.ttf')),
      weight: 700 as const,
      style: 'normal' as const,
    },
  ];
}

// The cell-U mark, sized for cards.
export function OgMark({ size = 120 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100">
      <rect x="38" y="70" width="24" height="24" rx="6" fill={OG_COLORS.accent} />
      <rect x="6" y="70" width="24" height="24" rx="6" fill={OG_COLORS.text} />
      <rect x="70" y="70" width="24" height="24" rx="6" fill={OG_COLORS.text} />
      <rect x="6" y="38" width="24" height="24" rx="6" fill={OG_COLORS.text} />
      <rect x="70" y="38" width="24" height="24" rx="6" fill={OG_COLORS.text} />
      <rect x="6" y="6" width="24" height="24" rx="6" fill={OG_COLORS.text} />
      <rect x="70" y="6" width="24" height="24" rx="6" fill={OG_COLORS.text} />
    </svg>
  );
}
