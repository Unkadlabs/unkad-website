import { ImageResponse } from 'next/dist/server/og/image-response.js';
import { createElement as h } from 'react';
import fs from 'fs';
import path from 'path';

const OUT = path.join(process.cwd(), 'public', 'images', 'qor-poster.png');
const SIZE = 1200;

const BG = '#141312';
const TEXT = '#E8E6E1';
const MUTED = '#A5A19A';
const ACCENT = '#4DB6A5';

const fonts = ['Regular', 'Bold'].map((w, i) => ({
  name: 'Source Serif 4',
  data: fs.readFileSync(path.join(process.cwd(), 'assets', 'fonts', `SourceSerif4-${w}.otf`)),
  weight: i === 0 ? 400 : 700,
  style: 'normal',
}));

const COLS = 8;
const ROWS = 4;
const CELL = 115;
const GAP = 14;
const FILLED = 3;

function grid() {
  const rows = [];
  for (let r = 0; r < ROWS; r++) {
    const cells = [];
    for (let c = 0; c < COLS; c++) {
      const isFilled = r === 0 && c < FILLED;
      cells.push(
        h('div', {
          key: `${r}-${c}`,
          style: {
            width: CELL,
            height: CELL,
            borderRadius: 8,
            backgroundColor: isFilled ? ACCENT : 'transparent',
            border: isFilled ? 'none' : '1px solid rgba(165,161,154,0.28)',
          },
        })
      );
    }
    rows.push(h('div', { key: r, style: { display: 'flex', gap: GAP } }, cells));
  }
  return h('div', { style: { display: 'flex', flexDirection: 'column', gap: GAP } }, rows);
}

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
      padding: 90,
      backgroundColor: BG,
      backgroundImage:
        'radial-gradient(900px 700px at 50% 118%, rgba(77,182,165,0.16), rgba(20,19,18,0) 62%)',
      fontFamily: 'Source Serif 4',
    },
  },
  [
    h('div', { key: 'top', style: { display: 'flex', alignItems: 'center', gap: 22 } }, [
      mark(52),
      h('div', { key: 'wm', style: { display: 'flex', fontSize: 34, color: MUTED } }, 'Qor Af-Soomaali'),
    ]),

    h('div', { key: 'grid', style: { display: 'flex' } }, grid()),

    h(
      'div',
      {
        key: 'bottom',
        style: { display: 'flex', flexDirection: 'column', alignItems: 'center' },
      },
      [
        h(
          'div',
          {
            key: 'head',
            style: {
              display: 'flex',
              fontSize: 48,
              fontWeight: 700,
              color: TEXT,
              textAlign: 'center',
              letterSpacing: '-0.01em',
            },
          },
          'Aynu af-Soomaaliga u qorno da’da AI-ga.'
        ),
        h(
          'div',
          { key: 'url', style: { display: 'flex', fontSize: 44, color: ACCENT, marginTop: 34 } },
          'qor.unkad.com'
        ),
        h(
          'div',
          { key: 'tag', style: { display: 'flex', fontSize: 28, color: MUTED, marginTop: 26 } },
          'Ereyada waa hanti.'
        ),
      ]
    ),
  ]
);

const res = new ImageResponse(poster, { width: SIZE, height: SIZE, fonts });
const buf = Buffer.from(await res.arrayBuffer());
fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, buf);
console.log(`wrote ${OUT} (${(buf.length / 1024).toFixed(0)} KB, ${SIZE}x${SIZE})`);
