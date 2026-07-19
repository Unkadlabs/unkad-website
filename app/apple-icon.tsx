// Apple touch icon (180×180 PNG), generated at build time.
// iOS ignores SVG favicons, so the mark is rendered on the brand
// off-white with padding for Apple's rounded-corner mask.

import { ImageResponse } from 'next/og';

export const dynamic = 'force-static';
export const size = { width: 180, height: 180 };
export const contentType = 'image/png';

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#FCFBF8',
        }}
      >
        <svg width={116} height={116} viewBox="0 0 100 100">
          <rect x="38" y="70" width="24" height="24" rx="6" fill="#4DB6A5" />
          <rect x="6" y="70" width="24" height="24" rx="6" fill="#0F6B5C" />
          <rect x="70" y="70" width="24" height="24" rx="6" fill="#0F6B5C" />
          <rect x="6" y="38" width="24" height="24" rx="6" fill="#0F6B5C" />
          <rect x="70" y="38" width="24" height="24" rx="6" fill="#0F6B5C" />
          <rect x="6" y="6" width="24" height="24" rx="6" fill="#0F6B5C" />
          <rect x="70" y="6" width="24" height="24" rx="6" fill="#0F6B5C" />
        </svg>
      </div>
    ),
    size
  );
}
