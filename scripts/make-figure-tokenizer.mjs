import { ImageResponse } from 'next/dist/server/og/image-response.js';
import { createElement as h } from 'react';
import fs from 'fs';
import path from 'path';

// Unug-1 tokenizer sweet spot (24 Aug 2026): Somali compression vs embedding
// cost across BPE vocab sizes, trained on our own corpus. One axis
// (chars/token); the parameter cost rides as a label on each point. White.
//
//   node scripts/make-figure-tokenizer.mjs

const W = 1600, H = 940;
const PAPER = '#FCFBF8';
const INK = '#171715';
const TEAL = '#0F6B5C';
const RUST = '#A63C2C';
const DIM = '#8A867E';
const RULE = 'rgba(23,23,21,0.12)';

const SERIF_DIR = path.join(process.cwd(), '..', 'unkad-platform', 'assets', 'fonts');
const fonts = [
  {
    name: 'Norwester',
    data: fs.readFileSync(path.join(process.cwd(), 'assets', 'fonts', 'Norwester.otf')),
    weight: 400, style: 'normal',
  },
  ...['Regular', 'Bold'].map((w, i) => ({
    name: 'Source Serif 4',
    data: fs.readFileSync(path.join(SERIF_DIR, `SourceSerif4-${w}.otf`)),
    weight: i === 0 ? 400 : 700, style: 'normal',
  })),
];

// vocab, chars/token, embedding params (M) at d=512, pick flag
const PTS = [
  { vocab: 2000, cpt: 3.092, embM: 1.02 },
  { vocab: 4000, cpt: 3.579, embM: 2.05 },
  { vocab: 8000, cpt: 4.065, embM: 4.10 },
  { vocab: 16000, cpt: 4.496, embM: 8.19, pick: true },
  { vocab: 32000, cpt: 4.836, embM: 16.38 },
];
const GPT = 3.276; // o200k on the same held-out Somali

const PX = 150, PW = 1200, PY = 70, PH = 470;
const X0 = Math.log2(2000), X1 = Math.log2(32000);
const Y0 = 3.0, Y1 = 5.0;
const sx = (v) => PX + ((Math.log2(v) - X0) / (X1 - X0)) * PW;
const sy = (v) => PY + (1 - (v - Y0) / (Y1 - Y0)) * PH;

const line = PTS.map((p) => `${sx(p.vocab).toFixed(1)},${sy(p.cpt).toFixed(1)}`).join(' ');
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${PY + PH + 60}">
  ${[3.0, 3.5, 4.0, 4.5, 5.0].map((v) => `<line x1="${PX}" y1="${sy(v)}" x2="${PX + PW}" y2="${sy(v)}" stroke="${RULE}" stroke-width="1"/>`).join('')}
  <line x1="${PX}" y1="${sy(GPT)}" x2="${PX + PW}" y2="${sy(GPT)}" stroke="${RUST}" stroke-width="2.5" stroke-dasharray="8 6"/>
  <polyline points="${line}" fill="none" stroke="${TEAL}" stroke-width="4" stroke-linejoin="round" stroke-linecap="round"/>
  ${PTS.map((p) => `<circle cx="${sx(p.vocab)}" cy="${sy(p.cpt)}" r="${p.pick ? 15 : 9}" fill="${p.pick ? TEAL : PAPER}" stroke="${TEAL}" stroke-width="${p.pick ? 4 : 3}"/>`).join('')}
</svg>`;
const chartH = PY + PH + 60;

const abs = (x, y, text, color, size, bold) =>
  h('div', { key: `${x}-${y}-${text}`, style: { display: 'flex', position: 'absolute', left: x, top: y, fontSize: size, color, fontWeight: bold ? 700 : 400 } }, text);

const plate = h('div', {
  style: { width: '100%', height: '100%', display: 'flex', flexDirection: 'column', padding: 64, backgroundColor: PAPER, fontFamily: 'Source Serif 4' },
}, [
  h('div', { key: 't', style: { display: 'flex', fontFamily: 'Norwester', fontSize: 22, color: TEAL, letterSpacing: '0.18em' } }, 'CHOOSING UNUG-1’S TOKENIZER'),
  h('div', { key: 's', style: { display: 'flex', fontSize: 25, color: DIM, marginTop: 12 } }, 'Somali compression (characters per token, higher is better) vs vocabulary size. Trained on our own corpus.'),
  h('div', { key: 'chart', style: { display: 'flex', position: 'relative', height: chartH } }, [
    h('img', { key: 'svg', width: W, height: chartH, src: `data:image/svg+xml;charset=utf8,${encodeURIComponent(svg)}`, style: { position: 'absolute', left: -64, top: 0 } }),
    ...[3.0, 3.5, 4.0, 4.5, 5.0].map((v) => abs(0, PY + (1 - (v - Y0) / (Y1 - Y0)) * PH - 14, v.toFixed(1), DIM, 22)),
    ...PTS.map((p) => abs(sx(p.vocab) - 64 - 30, PY + PH + 16, p.vocab >= 1000 ? `${p.vocab / 1000}k` : `${p.vocab}`, DIM, 22)),
    // param-cost labels above each point
    ...PTS.map((p) => abs(sx(p.vocab) - 64 - 34, sy(p.cpt) - 46, `${p.embM}M`, p.pick ? TEAL : DIM, 20, p.pick)),
    abs(sx(16000) - 64 - 20, sy(4.496) + 26, 'the pick', TEAL, 22, true),
    abs(PX + PW - 64 - 300, sy(GPT) - 34, 'GPT-4o (200k vocab): 3.28', RUST, 21, true),
  ]),
  h('div', { key: 'note', style: { display: 'flex', marginTop: 18, fontSize: 23, color: DIM, lineHeight: 1.5 } },
    'Labels show the embedding-table cost at Unug-1’s hidden size. Bigger vocab compresses better but the gain per million parameters collapses after 16k (0.47 → 0.24 → 0.11 → 0.04). At 16k, Somali already compresses 37% better than GPT-4o’s 200k-token vocabulary, for a table a 30–50M model can afford. Unug-1 ships BPE-16K.'),
]);

const res = new ImageResponse(plate, { width: W, height: H, fonts });
const buf = Buffer.from(await res.arrayBuffer());
fs.writeFileSync(path.join(process.cwd(), 'public', 'images', 'fig-tokenizer-sweetspot.png'), buf);
console.log(`wrote fig-tokenizer-sweetspot.png (${(buf.length / 1024).toFixed(0)} KB)`);
