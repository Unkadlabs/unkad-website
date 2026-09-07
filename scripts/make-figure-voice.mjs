import { ImageResponse } from 'next/dist/server/og/image-response.js';
import { createElement as h } from 'react';
import fs from 'fs';
import path from 'path';

// What the community writes about, versus what the encyclopedia writes about
// (7 Sep 2026). Word rates per 10,000 words: the consented Qor corpus against
// Somali Wikipedia. Pure white for social. One claim, drawn to scale.
//
//   node scripts/make-figure-voice.mjs

const W = 1600, H = 1000;
const PAPER = '#FFFFFF';
const INK = '#171715';
const TEAL = '#0F6B5C';
const RUST = '#A63C2C';
const DIM = '#8A867E';

const SERIF_DIR = path.join(process.cwd(), '..', 'unkad-platform', 'assets', 'fonts');
const fonts = [
  { name: 'Norwester', data: fs.readFileSync(path.join(process.cwd(), 'assets', 'fonts', 'Norwester.otf')), weight: 400, style: 'normal' },
  ...['Regular', 'Bold'].map((w, i) => ({
    name: 'Source Serif 4',
    data: fs.readFileSync(path.join(SERIF_DIR, `SourceSerif4-${w}.otf`)),
    weight: i === 0 ? 400 : 700, style: 'normal',
  })),
];

// label, community per 10k, wikipedia per 10k
const COMMUNITY = [
  ['qalbi  (heart)', 10.77, 0.24, '45x'],
  ['waxaad, adiga  (you)', 34.68, 3.43, '10x'],
  ['haddii  (if)', 24.56, 3.75, '7x'],
  ['qof, qofka  (a person)', 72.60, 13.11, '6x'],
  ['waxaan, aniga  (I)', 43.08, 7.00, '6x'],
  ['maanta  (today)', 15.51, 3.55, '4x'],
];
const WIKI = [
  ['dhashay  (was born)', 2.15, 18.59, '9x'],
  ['reer  (lineage)', 2.15, 15.03, '7x'],
  ['sannadkii  (in the year)', 4.31, 19.66, '5x'],
  ['magaalada  (the city)', 7.11, 24.27, '3x'],
];

const MAX = 75, BARW = 470;
const bar = (v, color) => h('div', { key: 'b', style: { display: 'flex', width: Math.max(3, (v / MAX) * BARW), height: 20, backgroundColor: color, borderTopRightRadius: 5, borderBottomRightRadius: 5 } });

function row([label, cq, cw, ratio], leanTeal) {
  return h('div', { key: label, style: { display: 'flex', flexDirection: 'column', marginBottom: 20 } }, [
    h('div', { key: 'l', style: { display: 'flex', alignItems: 'baseline', gap: 12 } }, [
      h('div', { key: 'a', style: { display: 'flex', fontSize: 25, fontWeight: 700, color: INK } }, label),
      h('div', { key: 'r', style: { display: 'flex', fontSize: 22, fontWeight: 700, color: leanTeal ? TEAL : RUST } }, `${ratio} more`),
    ]),
    h('div', { key: 'c', style: { display: 'flex', alignItems: 'center', marginTop: 6, gap: 10 } }, [
      h('div', { key: 'k', style: { display: 'flex', width: 108, fontSize: 19, color: DIM } }, 'community'),
      bar(cq, TEAL),
      h('div', { key: 'v', style: { display: 'flex', marginLeft: 10, fontSize: 19, color: INK } }, cq.toFixed(1)),
    ]),
    h('div', { key: 'w', style: { display: 'flex', alignItems: 'center', marginTop: 4, gap: 10 } }, [
      h('div', { key: 'k', style: { display: 'flex', width: 108, fontSize: 19, color: DIM } }, 'Wikipedia'),
      bar(cw, DIM),
      h('div', { key: 'v', style: { display: 'flex', marginLeft: 10, fontSize: 19, color: INK } }, cw.toFixed(1)),
    ]),
  ]);
}

const plate = h('div', {
  style: { width: '100%', height: '100%', display: 'flex', flexDirection: 'column', padding: 60, backgroundColor: PAPER, fontFamily: 'Source Serif 4' },
}, [
  h('div', { key: 't', style: { display: 'flex', fontFamily: 'Norwester', fontSize: 22, color: TEAL, letterSpacing: '0.18em' } }, 'TWO KINDS OF SOMALI'),
  h('div', { key: 's', style: { display: 'flex', fontSize: 24, color: DIM, marginTop: 12, marginBottom: 26 } },
    'How often each word appears per 10,000 words: the community corpus at qor.unkad.com against Somali Wikipedia.'),
  h('div', { key: 'cols', style: { display: 'flex', gap: 56 } }, [
    h('div', { key: 'c1', style: { display: 'flex', flexDirection: 'column', width: 720 } }, [
      h('div', { key: 'hd', style: { display: 'flex', fontSize: 26, fontWeight: 700, color: TEAL, marginBottom: 18 } }, 'What the community writes about'),
      ...COMMUNITY.map((r) => row(r, true)),
    ]),
    h('div', { key: 'c2', style: { display: 'flex', flexDirection: 'column', width: 720 } }, [
      h('div', { key: 'hd', style: { display: 'flex', fontSize: 26, fontWeight: 700, color: RUST, marginBottom: 18 } }, 'What the encyclopedia writes about'),
      ...WIKI.map((r) => row(r, false)),
    ]),
  ]),
  h('div', { key: 'note', style: { display: 'flex', marginTop: 8, fontSize: 22, color: DIM, lineHeight: 1.5 } },
    'The word for heart appears 45 times more often in community writing than in all of Somali Wikipedia. The community writes in the first and second person, about people, choices, and today. The encyclopedia writes in the third person, about places, lineages, and the past. This is why 46,000 consented community words beat 2.7 million encyclopedia words at modelling how Somalis actually write.'),
]);

const res = new ImageResponse(plate, { width: W, height: H, fonts });
const buf = Buffer.from(await res.arrayBuffer());
fs.writeFileSync(path.join(process.cwd(), 'public', 'images', 'fig-two-somalis.png'), buf);
console.log(`wrote fig-two-somalis.png (${(buf.length / 1024).toFixed(0)} KB)`);
