import { ImageResponse } from 'next/dist/server/og/image-response.js';
import { createElement as h } from 'react';
import fs from 'fs';
import path from 'path';

const PORTRAIT = process.argv.includes('--portrait');
const OUT = path.join(
  process.cwd(),
  'public',
  'images',
  PORTRAIT ? 'qor-poster-goal-4x5.png' : 'qor-poster-goal.png'
);
const W = PORTRAIT ? 1080 : 1200;
const H = PORTRAIT ? 1350 : 1200;

const BG = '#141312';
const TEXT = '#E8E6E1';
const MUTED = '#A5A19A';
const ACCENT = '#4DB6A5';

const GOAL = '100,000';

const fonts = ['Regular', 'Bold'].map((w, i) => ({
  name: 'Source Serif 4',
  data: fs.readFileSync(path.join(process.cwd(), 'assets', 'fonts', `SourceSerif4-${w}.otf`)),
  weight: i === 0 ? 400 : 700,
  style: 'normal',
}));

function mark(size) {
  const u = size / 100;
  const sq = (x, y, fill) =>
    h('div', {
      key: `${x}-${y}`,
      style: {
        position: 'absolute',
        left: x * u,
        top: y * u,
        width: 24 * u,
        height: 24 * u,
        borderRadius: 6 * u,
        backgroundColor: fill,
      },
    });
  return h(
    'div',
    { style: { position: 'relative', width: size, height: size, display: 'flex' } },
    [
      sq(38, 70, ACCENT),
      sq(6, 70, TEXT),
      sq(70, 70, TEXT),
      sq(6, 38, TEXT),
      sq(70, 38, TEXT),
      sq(6, 6, TEXT),
      sq(70, 6, TEXT),
    ]
  );
}

const poster = h(
  'div',
  {
    style: {
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: PORTRAIT ? 96 : 100,
      backgroundColor: BG,
      backgroundImage:
        'radial-gradient(820px 640px at 50% 46%, rgba(77,182,165,0.15), rgba(20,19,18,0) 64%)',
      fontFamily: 'Source Serif 4',
    },
  },
  [
    h('div', { key: 'top', style: { display: 'flex', alignItems: 'center', gap: 22 } }, [
      mark(48),
      h('div', { key: 'wm', style: { display: 'flex', fontSize: 32, color: MUTED } }, 'Qor Af-Soomaali'),
    ]),

    h(
      'div',
      {
        key: 'mid',
        style: { display: 'flex', flexDirection: 'column', alignItems: 'center' },
      },
      [
        h(
          'div',
          { key: 'pre', style: { display: 'flex', fontSize: 42, color: MUTED } },
          'Yoolku waa'
        ),
        h(
          'div',
          {
            key: 'n',
            style: {
              display: 'flex',
              fontSize: 196,
              fontWeight: 700,
              color: ACCENT,
              letterSpacing: '-0.03em',
              lineHeight: 1,
              marginTop: 18,
            },
          },
          GOAL
        ),
        h(
          'div',
          { key: 'l', style: { display: 'flex', fontSize: 42, color: MUTED, marginTop: 26 } },
          'oo jumladood oo la hubiyay'
        ),
      ]
    ),

    h(
      'div',
      { key: 'url', style: { display: 'flex', fontSize: 40, color: TEXT } },
      'qor.unkad.com'
    ),
  ]
);

const res = new ImageResponse(poster, { width: W, height: H, fonts });
const buf = Buffer.from(await res.arrayBuffer());
fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, buf);
console.log(`wrote ${OUT} (${(buf.length / 1024).toFixed(0)} KB, ${W}x${H})`);
