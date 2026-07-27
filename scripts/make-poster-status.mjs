import { ImageResponse } from 'next/dist/server/og/image-response.js';
import { createElement as h } from 'react';
import fs from 'fs';
import path from 'path';

// Status poster: what the platform has collected so far, and the two goals
// ahead of it.
//
// Every Somali string here is reused VERBATIM from lib/i18n.ts in the platform
// repo, where it is already live. No new Somali is composed for this poster, so
// nothing here needs verification that the running site has not already had.
//
//   node scripts/make-poster-status.mjs             # 1080x1350 (Facebook 4:5)
//   node scripts/make-poster-status.mjs --square    # 1080x1080 (Instagram)

const SQUARE = process.argv.includes('--square');
const OUT = path.join(
  process.cwd(), 'public', 'images',
  SQUARE ? 'qor-status.png' : 'qor-status-4x5.png'
);
const W = 1080;
const H = SQUARE ? 1080 : 1350;

const BG = '#141312';
const TEXT = '#E8E6E1';
const MUTED = '#A5A19A';
const ACCENT = '#4DB6A5';

// Verbatim from lib/i18n.ts: statContributors, contributions, statSentences.
const STATS = [
  ['31', 'wax-ku-biiriyayaal'],
  ['183', 'Wax-ku-biirin'],
  ['115', 'jumlado la hubiyay'],
];

// The two thresholds. Labels are English-free: the numbers and the word
// `jumlado` (from goalSuffix) carry it, so no new Somali is invented.
const GOALS = [
  ['2,000', 'jumlado'],
  ['100,000', 'jumlado'],
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

// Current standing: three figures across the top, the largest thing on the page
// after the goals, because this is the part that is already true.
const statRow = h('div', {
  key: 'stats',
  style: { display: 'flex', justifyContent: 'space-between', gap: 24 },
}, STATS.map(([n, label]) =>
  h('div', { key: label, style: { display: 'flex', flexDirection: 'column', flex: 1 } }, [
    h('div', {
      key: 'n',
      style: {
        display: 'flex', fontSize: SQUARE ? 76 : 84, fontWeight: 700,
        color: TEXT, letterSpacing: '-0.02em', lineHeight: 1,
      },
    }, n),
    h('div', {
      key: 'l',
      style: { display: 'flex', fontSize: SQUARE ? 23 : 25, color: MUTED, marginTop: 12, lineHeight: 1.25 },
    }, label),
  ])
));

// The ladder. Both rungs are drawn the same way so the poster does not imply
// 2,000 is nearly done: it states the two numbers and lets them speak.
const goalRows = GOALS.map(([n, label], i) =>
  h('div', {
    key: n,
    style: {
      display: 'flex', flexDirection: 'column',
      borderLeft: `3px solid ${ACCENT}`, paddingLeft: 32,
      marginTop: i === 0 ? 0 : SQUARE ? 40 : 54,
    },
  }, [
    h('div', {
      key: 'n',
      style: {
        display: 'flex', fontSize: SQUARE ? 92 : 108, fontWeight: 700,
        color: ACCENT, letterSpacing: '-0.02em', lineHeight: 1,
      },
    }, n),
    h('div', {
      key: 'l',
      style: { display: 'flex', fontSize: SQUARE ? 30 : 34, color: TEXT, marginTop: 12 },
    }, label),
  ])
);

const poster = h('div', {
  style: {
    width: '100%', height: '100%', display: 'flex', flexDirection: 'column',
    justifyContent: 'space-between', padding: SQUARE ? 84 : 88,
    backgroundColor: BG,
    backgroundImage:
      'radial-gradient(880px 700px at 12% 108%, rgba(77,182,165,0.16), rgba(20,19,18,0) 62%)',
    fontFamily: 'Source Serif 4',
  },
}, [
  // Brand, current standing, then the goals, as one block. An earlier version
  // spaced these three apart evenly and left a dead band across the middle of
  // the poster: in a feed that reads as an image that failed to load rather
  // than as deliberate space.
  h('div', { key: 'top', style: { display: 'flex', flexDirection: 'column' } }, [
    h('div', { key: 'brand', style: { display: 'flex', alignItems: 'center', gap: 20 } }, [
      mark(46),
      h('div', { key: 'wm', style: { display: 'flex', fontSize: 30, color: MUTED } }, 'Qor Af-Soomaali'),
    ]),
    h('div', { key: 'sp', style: { display: 'flex', height: SQUARE ? 46 : 58 } }),
    statRow,

    // A rule marks the turn from what is true today to what is being aimed at,
    // so the two sets of numbers are not read as one list.
    h('div', {
      key: 'rule',
      style: {
        display: 'flex', height: 1, width: '100%',
        backgroundColor: 'rgba(232,230,225,0.14)',
        marginTop: SQUARE ? 46 : 58, marginBottom: SQUARE ? 42 : 54,
      },
    }),

    h('div', { key: 'goals', style: { display: 'flex', flexDirection: 'column' } }, goalRows),
  ]),

  h('div', { key: 'foot', style: { display: 'flex', flexDirection: 'column' } }, [
    h('div', {
      key: 'r',
      style: { display: 'flex', height: 3, width: 92, backgroundColor: ACCENT, marginBottom: 22 },
    }),
    h('div', {
      key: 'u',
      style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 30 },
    }, [
      h('div', { key: 'a', style: { display: 'flex', color: MUTED } }, 'Bilow hadda'),
      h('div', { key: 'b', style: { display: 'flex', color: TEXT } }, 'qor.unkad.com'),
    ]),
  ]),
]);

const res = new ImageResponse(poster, { width: W, height: H, fonts });
const buf = Buffer.from(await res.arrayBuffer());
fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, buf);
console.log(`wrote ${OUT} (${(buf.length / 1024).toFixed(0)} KB, ${W}x${H})`);
