import { ImageResponse } from 'next/dist/server/og/image-response.js';
import { createElement as h } from 'react';
import fs from 'fs';
import path from 'path';

// Laba Nooc oo Af-Soomaali ah — the Somali edition of the community-voice
// plate (7 Sep 2026). All Somali copy is FOUNDER VERIFIED; the source of
// truth is docs/poster-two-somalis-SOMALI.md. Do not edit the Somali here.
// Pure white for social.
//
//   node scripts/make-figure-voice-so.mjs

const W = 1600, H = 1080;
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

// label, community per 10k, wikipedia per 10k, ratio
const COMMUNITY = [
  ['qalbi', 10.77, 0.24, 45],
  ['waxaad, adiga', 34.68, 3.43, 10],
  ['haddii', 24.56, 3.75, 7],
  ['qof, qofka', 72.60, 13.11, 6],
  ['waxaan, aniga', 43.08, 7.00, 6],
  ['maanta', 15.51, 3.55, 4],
];
const WIKI = [
  ['dhashay', 2.15, 18.59, 9],
  ['reer', 2.15, 15.03, 7],
  ['sannadkii', 4.31, 19.66, 5],
  ['magaalada', 7.11, 24.27, 3],
];

const MAX = 75, BARW = 470;
const bar = (v, color) => h('div', { key: 'b', style: { display: 'flex', width: Math.max(3, (v / MAX) * BARW), height: 20, backgroundColor: color, borderTopRightRadius: 5, borderBottomRightRadius: 5 } });

function row([label, cq, cw, ratio], leanTeal) {
  return h('div', { key: label, style: { display: 'flex', flexDirection: 'column', marginBottom: 20 } }, [
    h('div', { key: 'l', style: { display: 'flex', alignItems: 'baseline', gap: 12 } }, [
      h('div', { key: 'a', style: { display: 'flex', fontSize: 26, fontWeight: 700, color: INK }, lang: 'so' }, label),
      h('div', { key: 'r', style: { display: 'flex', fontSize: 22, fontWeight: 700, color: leanTeal ? TEAL : RUST }, lang: 'so' }, `${ratio} jeer ka badan`),
    ]),
    h('div', { key: 'c', style: { display: 'flex', alignItems: 'center', marginTop: 6, gap: 10 } }, [
      h('div', { key: 'k', style: { display: 'flex', width: 108, fontSize: 19, color: DIM }, lang: 'so' }, 'bulshada'),
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
  h('div', { key: 't', style: { display: 'flex', fontFamily: 'Norwester', fontSize: 22, color: TEAL, letterSpacing: '0.18em' }, lang: 'so' },
    'LABA NOOC OO AF-SOOMAALI AH'),
  h('div', { key: 's', style: { display: 'flex', fontSize: 23, color: DIM, marginTop: 12, marginBottom: 26 }, lang: 'so' },
    'Inta jeer ee erey kastaa kasoo muuqday 10,000 erey gudahooda: kaydka bulshada ee qor.unkad.com iyo Wikipedia-ga Soomaaliga.'),
  h('div', { key: 'cols', style: { display: 'flex', gap: 56 } }, [
    h('div', { key: 'c1', style: { display: 'flex', flexDirection: 'column', width: 720 } }, [
      h('div', { key: 'hd', style: { display: 'flex', fontSize: 26, fontWeight: 700, color: TEAL, marginBottom: 18 }, lang: 'so' }, 'Waxa bulshadu ay qortay'),
      ...COMMUNITY.map((r) => row(r, true)),
    ]),
    h('div', { key: 'c2', style: { display: 'flex', flexDirection: 'column', width: 720 } }, [
      h('div', { key: 'hd', style: { display: 'flex', fontSize: 26, fontWeight: 700, color: RUST, marginBottom: 18 }, lang: 'so' }, 'Waxa mawsuucaddu qortay'),
      ...WIKI.map((r) => row(r, false)),
    ]),
  ]),
  h('div', { key: 'note', style: { display: 'flex', marginTop: 8, fontSize: 21, color: DIM, lineHeight: 1.55 }, lang: 'so' },
    'Erayga "qalbi" 45 jeer ayuu ku badan yahay qoraalka bulshada marka loo eego Wikipedia-ga Soomaaliga oo dhan. Qoraalada Bulshadu ku qorto qor.unkad.com waxay ka qortaa qofka koowaad iyo labaad, waxayna ka hadlaan dadka, go’aannada, iyo maanta. Mawsuucaddu waxay ka qortaa qofka saddexaad, waxayna ka hadashaa meelaha, abtirsiinta, iyo waqtigii hore. Taasi waa sababta 46 kun oo erey oo bulshadu qortay ay uga guuleysteen 2.7 milyan oo erey.'),
]);

const res = new ImageResponse(plate, { width: W, height: H, fonts });
const buf = Buffer.from(await res.arrayBuffer());
fs.writeFileSync(path.join(process.cwd(), 'public', 'images', 'fig-two-somalis-so.png'), buf);
console.log(`wrote fig-two-somalis-so.png (${(buf.length / 1024).toFixed(0)} KB)`);
