import { ImageResponse } from 'next/dist/server/og/image-response.js';
import { createElement as h } from 'react';
import fs from 'fs';
import path from 'path';

// Milestone poster: what each corpus size actually unlocks.
//
// The numbers carry it, so they are the only large element. Labels stay short
// because a poster is glanced at in a feed, not read.
//
//   node scripts/make-poster-milestones.mjs             # 1080x1350 (Facebook)
//   node scripts/make-poster-milestones.mjs --square    # 1200x1200

const SQUARE = process.argv.includes('--square');
const OUT = path.join(
  process.cwd(), 'public', 'images',
  SQUARE ? 'qor-milestones.png' : 'qor-milestones-4x5.png'
);
const W = SQUARE ? 1200 : 1080;
const H = SQUARE ? 1200 : 1350;

const BG = '#141312';
const TEXT = '#E8E6E1';
const MUTED = '#A5A19A';
const ACCENT = '#4DB6A5';

const MILESTONES = [
  ['2,000', 'Benchmark any model in Somali'],
  ['50,000', 'Fine-tune a model for Somali'],
  ['100,000', 'Open dataset for everyone'],
];

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
        position: 'absolute', left: x * u, top: y * u,
        width: 24 * u, height: 24 * u, borderRadius: 6 * u, backgroundColor: fill,
      },
    });
  return h('div', { style: { position: 'relative', width: size, height: size, display: 'flex' } }, [
    sq(38, 70, ACCENT), sq(6, 70, TEXT), sq(70, 70, TEXT),
    sq(6, 38, TEXT), sq(70, 38, TEXT), sq(6, 6, TEXT), sq(70, 6, TEXT),
  ]);
}

const rows = MILESTONES.map(([n, label], i) =>
  h('div', {
    key: n,
    style: {
      display: 'flex', flexDirection: 'column',
      borderLeft: `3px solid ${ACCENT}`, paddingLeft: 34,
      marginTop: i === 0 ? 0 : 62,
    },
  }, [
    h('div', {
      key: 'n',
      style: {
        display: 'flex', fontSize: SQUARE ? 96 : 104, fontWeight: 700,
        color: ACCENT, letterSpacing: '-0.02em', lineHeight: 1,
      },
    }, n),
    h('div', {
      key: 'l',
      style: { display: 'flex', fontSize: SQUARE ? 34 : 36, color: TEXT, marginTop: 16 },
    }, label),
  ])
);

const poster = h('div', {
  style: {
    width: '100%', height: '100%', display: 'flex', flexDirection: 'column',
    justifyContent: 'space-between', padding: SQUARE ? 92 : 88,
    backgroundColor: BG,
    backgroundImage:
      'radial-gradient(880px 700px at 12% 108%, rgba(77,182,165,0.16), rgba(20,19,18,0) 62%)',
    fontFamily: 'Source Serif 4',
  },
}, [
  h('div', { key: 'top', style: { display: 'flex', alignItems: 'center', gap: 20 } }, [
    mark(46),
    h('div', { key: 'wm', style: { display: 'flex', fontSize: 30, color: MUTED } }, 'Qor Af-Soomaali'),
  ]),

  h('div', { key: 'rows', style: { display: 'flex', flexDirection: 'column' } }, rows),

  h('div', { key: 'foot', style: { display: 'flex', flexDirection: 'column' } }, [
    h('div', {
      key: 'r',
      style: { display: 'flex', height: 3, width: 92, backgroundColor: ACCENT, marginBottom: 22 },
    }),
    h('div', {
      key: 'u',
      style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 30 },
    }, [
      h('div', { key: 'a', style: { display: 'flex', color: MUTED } }, 'Jumlado la hubiyay'),
      h('div', { key: 'b', style: { display: 'flex', color: TEXT } }, 'qor.unkad.com'),
    ]),
  ]),
]);

const res = new ImageResponse(poster, { width: W, height: H, fonts });
const buf = Buffer.from(await res.arrayBuffer());
fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, buf);
console.log(`wrote ${OUT} (${(buf.length / 1024).toFixed(0)} KB, ${W}x${H})`);
