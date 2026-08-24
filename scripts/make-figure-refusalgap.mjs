import { ImageResponse } from 'next/dist/server/og/image-response.js';
import { createElement as h } from 'react';
import fs from 'fs';
import path from 'path';

// The Somali refusal gap (24 Aug 2026): for each model, the share of harmful
// requests it refuses in English vs the SAME requests in Somali. Data from
// SomaliBench (100 native-verified paired probes, Claude-judge labels). The
// 2026 candidates are marked NEW. White palette per house style.
//
//   node scripts/make-figure-refusalgap.mjs
//
// Fill FRESH values from the eval before rendering final.

const W = 1600, H = 980;
const PAPER = '#FCFBF8';
const INK = '#171715';
const TEAL = '#0F6B5C';
const RUST = '#A63C2C';
const DIM = '#8A867E';
const FAINT = '#EFECE6';

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

// en, so refusal rates (0..1). fresh=true → a 2026 candidate.
const MODELS = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'scripts', 'refusalgap-data.json'), 'utf8'));

const BARW = 620; // px for a full 100%
const rowH = 96;

function row(m, i) {
  const enW = Math.max(3, m.en * BARW);
  const soW = Math.max(3, m.so * BARW);
  return h('div', { key: m.id, style: { display: 'flex', flexDirection: 'column', marginBottom: 22 } }, [
    h('div', { key: 'l', style: { display: 'flex', alignItems: 'baseline', gap: 12 } }, [
      h('div', { key: 'n', style: { display: 'flex', fontSize: 27, fontWeight: 700, color: INK } }, m.name),
      m.fresh && h('div', {
        key: 'b',
        style: {
          display: 'flex', fontSize: 17, fontWeight: 700, color: TEAL,
          border: `1.5px solid ${TEAL}`, borderRadius: 6, padding: '1px 8px', letterSpacing: '0.05em',
        },
      }, 'CUSUB 2025'),
    ].filter(Boolean)),
    // english bar
    h('div', { key: 'en', style: { display: 'flex', alignItems: 'center', marginTop: 8 } }, [
      h('div', { key: 'k', style: { display: 'flex', width: 96, fontSize: 20, color: DIM } }, 'English'),
      h('div', { key: 'f', style: { display: 'flex', width: enW, height: 24, backgroundColor: DIM, borderTopRightRadius: 6, borderBottomRightRadius: 6 } }),
      h('div', { key: 'v', style: { display: 'flex', marginLeft: 12, fontSize: 20, color: INK, fontWeight: 700 } }, `${Math.round(m.en * 100)}%`),
    ]),
    // somali bar
    h('div', { key: 'so', style: { display: 'flex', alignItems: 'center', marginTop: 6 } }, [
      h('div', { key: 'k', style: { display: 'flex', width: 96, fontSize: 20, color: DIM } }, 'Soomaali'),
      h('div', { key: 'f', style: { display: 'flex', width: soW, height: 24, backgroundColor: RUST, borderTopRightRadius: 6, borderBottomRightRadius: 6 } }),
      h('div', { key: 'v', style: { display: 'flex', marginLeft: 12, fontSize: 20, color: INK, fontWeight: 700 } }, `${Math.round(m.so * 100)}%`),
      h('div', { key: 'g', style: { display: 'flex', marginLeft: 16, fontSize: 19, color: RUST, fontWeight: 700 } }, `farqi ${Math.round((m.en - m.so) * 100)}%`),
    ]),
  ]);
}

const plate = h('div', {
  style: {
    width: '100%', height: '100%', display: 'flex', flexDirection: 'column',
    padding: 64, backgroundColor: PAPER, fontFamily: 'Source Serif 4',
  },
}, [
  h('div', { key: 't', style: { display: 'flex', fontFamily: 'Norwester', fontSize: 22, color: TEAL, letterSpacing: '0.18em' } },
    'THE SOMALI REFUSAL GAP'),
  h('div', { key: 's', style: { display: 'flex', fontSize: 25, color: DIM, marginTop: 12, marginBottom: 30 } },
    'Share of 100 harmful requests each model refuses — in English, and the identical requests in Somali. Higher is safer.'),
  ...MODELS.map(row),
  h('div', { key: 'note', style: { display: 'flex', marginTop: 14, fontSize: 22, color: DIM, lineHeight: 1.5 } },
    'Every model refuses in English and complies in Somali. The 2025 models did not close the gap. Data: SomaliBench, 100 native-author-verified paired probes; refusals labelled by an independent judge. Defensive research: no harmful content is shown.'),
]);

const res = new ImageResponse(plate, { width: W, height: H, fonts });
const buf = Buffer.from(await res.arrayBuffer());
fs.writeFileSync(path.join(process.cwd(), 'public', 'images', 'fig-refusal-gap.png'), buf);
console.log(`wrote fig-refusal-gap.png (${(buf.length / 1024).toFixed(0)} KB)`);
