import { ImageResponse } from 'next/dist/server/og/image-response.js';
import { createElement as h } from 'react';
import fs from 'fs';
import path from 'path';

// The corpus by domain: what kind of Somali is being written down.
//
// The other two directions answer "how much" (a field of cells) and "what does
// it look like" (a page of the real text). This one answers the question a
// researcher actually asks first: what is it *of*. Health, law, farming, faith,
// broadcast. A corpus that is only one register is not a corpus, it is a genre.
//
// The nine domains are named, not ranked. Sorting them by size would turn the
// poster into a chart of an imbalance — `general` is by far the largest — and
// the honest, useful claim here is coverage: nine domains have something in
// them. The counts are printed for anyone who looks, so nothing is hidden by
// the choice not to sort.
//
// Colour carries the meaning rather than decorating it. Each domain takes one
// step along the teal-to-saffron ramp, so the spread of hues *is* the variety
// being claimed. That is the whole design: nine cells, nine colours.
//
// Somali is verbatim from the platform's lib/i18n.ts sector labels, which are
// already live, plus the founder's own headline.
//
//   node scripts/make-poster-domains.mjs --data /tmp/corpus.json
//   node scripts/make-poster-domains.mjs --data /tmp/corpus.json --story

const STORY = process.argv.includes('--story');
const dataIdx = process.argv.indexOf('--data');
if (dataIdx === -1) {
  console.error('need --data <file.json> from unkad-platform/scripts/corpus-data.mjs');
  process.exit(1);
}
const data = JSON.parse(fs.readFileSync(process.argv[dataIdx + 1], 'utf8'));
if (!data.sectors) {
  console.error('data file has no `sectors`; re-run corpus-data.mjs');
  process.exit(1);
}

const OUT = path.join(
  process.cwd(), 'public', 'images',
  STORY ? 'qor-domains-story.png' : 'qor-domains-4x5.png'
);
const W = 1080;
const H = STORY ? 1920 : 1350;
const PAD = STORY ? 84 : 76;

const INK = '#0C1026';
const PAPER = '#F4EFE4';
const DIM = '#6B7186';
const SEED = '#4DB6A5';
const WARM = '#E9A13B';

// Fixed order, not sorted by size. Sorting would rank the domains and make the
// picture about which is biggest instead of about how many there are.
const ORDER = [
  ['health', 'CAAFIMAAD'],
  ['education', 'WAXBARASHO'],
  ['agriculture', 'BEERAHA'],
  ['law', 'SHARCI'],
  ['media', 'WARBAAHIN'],
  ['religion', 'DIIN'],
  ['culture', 'DHAQAN'],
  ['technology', 'TIGNOOLAJIYAD'],
  ['general', 'GUUD'],
];

const fonts = [
  {
    name: 'Norwester',
    data: fs.readFileSync(path.join(process.cwd(), 'assets', 'fonts', 'Norwester.otf')),
    weight: 400,
    style: 'normal',
  },
  ...['Regular', 'Bold'].map((w, i) => ({
    name: 'Source Serif 4',
    data: fs.readFileSync(path.join(process.cwd(), 'assets', 'fonts', `SourceSerif4-${w}.otf`)),
    weight: i === 0 ? 400 : 700,
    style: 'normal',
  })),
];

const lerp = (a, b, t) => Math.round(a + (b - a) * t);
const hex = (c) => [1, 3, 5].map((i) => parseInt(c.slice(i, i + 2), 16));
const [s1, s2, s3] = hex(SEED);
const [w1, w2, w3] = hex(WARM);
const ramp = (t) => `rgb(${lerp(s1, w1, t)},${lerp(s2, w2, t)},${lerp(s3, w3, t)})`;

function mark(size) {
  const u = size / 100;
  const sq = (x, y, fill) =>
    h('div', {
      key: `${x}-${y}`,
      style: {
        position: 'absolute', left: x * u, top: y * u,
        width: 24 * u, height: 24 * u, borderRadius: 5 * u, backgroundColor: fill,
      },
    });
  return h('div', { style: { position: 'relative', width: size, height: size, display: 'flex' } }, [
    sq(38, 70, SEED), sq(6, 70, PAPER), sq(70, 70, PAPER),
    sq(6, 38, PAPER), sq(70, 38, PAPER), sq(6, 6, PAPER), sq(70, 6, PAPER),
  ]);
}

const GRID_W = W - PAD * 2;
const GUTTER = 14;
const CELL_W = Math.floor((GRID_W - GUTTER * 2) / 3);
// Sized so three rows reach the footer. At 196 the grid stopped a quarter of
// the way up the page and the poster read as unfinished.
const CELL_H = STORY ? 330 : 268;

const tiles = ORDER.map(([key, label], i) => {
  const n = data.sectors[key] ?? 0;
  const tone = ramp(i / (ORDER.length - 1));
  return h('div', {
    key,
    style: {
      display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
      width: CELL_W, height: CELL_H,
      padding: STORY ? '24px 22px' : '20px 18px',
      borderRadius: 14,
      // The tile is its own colour at low opacity with a solid edge, so nine
      // hues read as a set rather than nine unrelated blocks.
      // 12% tint vanished against the indigo and the tiles read as black boxes
      // with coloured edges, which killed the one idea the design has.
      backgroundColor: `${tone}30`,
      border: `1px solid ${tone}`,
    },
  }, [
    h('div', {
      key: 'n',
      style: {
        display: 'flex', fontFamily: 'Norwester', fontSize: STORY ? 62 : 50,
        color: tone, lineHeight: 0.85, letterSpacing: '-0.02em',
      },
    }, String(n)),
    h('div', {
      key: 'l',
      lang: 'so',
      style: {
        display: 'flex', fontFamily: 'Norwester',
        // The longest label is TIGNOOLAJIYAD; it sets the size for all nine so
        // the row reads as one system instead of nine different type sizes.
        fontSize: STORY ? 27 : 22,
        color: PAPER, letterSpacing: '0.08em',
      },
    }, label),
  ]);
});

const poster = h('div', {
  style: {
    width: '100%', height: '100%', display: 'flex', flexDirection: 'column',
    padding: PAD, backgroundColor: INK, overflow: 'hidden',
    backgroundImage:
      'radial-gradient(1000px 700px at 6% -8%, rgba(77,182,165,0.14), rgba(12,16,38,0) 58%)',
    fontFamily: 'Source Serif 4',
  },
}, [
  h('div', { key: 'brand', style: { display: 'flex', alignItems: 'center', gap: 15 } }, [
    mark(32),
    h('div', {
      key: 'wm',
      style: {
        display: 'flex', fontFamily: 'Norwester', fontSize: 21, color: DIM,
        letterSpacing: '0.18em',
      },
    }, 'QOR AF-SOOMAALI'),
  ]),

  // The founder's own line, set as the thesis rather than as a caption under a
  // number. It is the claim the grid below then evidences.
  h('div', {
    key: 'head',
    lang: 'so',
    style: {
      display: 'flex', flexWrap: 'wrap',
      fontSize: STORY ? 62 : 50, color: PAPER, lineHeight: 1.18,
      marginTop: STORY ? 46 : 34, marginBottom: STORY ? 16 : 12,
    },
  }, `${data.people} qofood ayaa ku biiriyay jumlado kala duwan`),

  h('div', {
    key: 'sub',
    style: {
      display: 'flex', fontFamily: 'Norwester', fontSize: STORY ? 26 : 22,
      color: SEED, letterSpacing: '0.22em', marginTop: STORY ? 22 : 16,
      marginBottom: STORY ? 34 : 26,
    },
  }, `${ORDER.length} QAYBOOD`),

  h('div', {
    key: 'grid',
    style: { display: 'flex', flexWrap: 'wrap', gap: GUTTER, width: GRID_W },
  }, tiles),

  h('div', {
    key: 'foot',
    style: {
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      marginTop: 'auto', borderTop: '1px solid rgba(244,239,228,0.14)', paddingTop: 20,
      fontFamily: 'Norwester', fontSize: STORY ? 26 : 23, letterSpacing: '0.14em',
    },
  }, [
    h('div', { key: 'a', style: { display: 'flex', color: DIM } },
      `${data.sentences.toLocaleString()} JUMLADO`),
    h('div', { key: 'b', style: { display: 'flex', color: PAPER } }, 'QOR.UNKAD.COM'),
  ]),
]);

const res = new ImageResponse(poster, { width: W, height: H, fonts });
const buf = Buffer.from(await res.arrayBuffer());
fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, buf);
console.log(`wrote ${OUT} (${(buf.length / 1024).toFixed(0)} KB, ${W}x${H})`);
