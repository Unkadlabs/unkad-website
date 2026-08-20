import { ImageResponse } from 'next/dist/server/og/image-response.js';
import { createElement as h } from 'react';
import fs from 'fs';
import path from 'path';

// Three more plates for the Unug data-ladder experiment (20 Aug 2026):
// the flat ladder, the real-word climb, and Unug vs n-gram baselines.
//
//   node scripts/make-figures-ladder2.mjs

const W = 1600, H = 900;
const PAPER = '#F2EDE3';
const INK = '#0C1026';
const TEAL = '#12917B';
const RUST = '#A63C2C';
const DIM = '#8A8577';
const RULE = 'rgba(12,16,38,0.16)';

const SERIF_DIR = path.join(process.cwd(), '..', 'unkad-platform', 'assets', 'fonts');
const fonts = [
  {
    name: 'Norwester',
    data: fs.readFileSync(path.join(process.cwd(), 'assets', 'fonts', 'Norwester.otf')),
    weight: 400,
    style: 'normal',
  },
  ...['Regular', 'Bold'].map((w, i) => ({
    name: 'Source Serif 4',
    data: fs.readFileSync(path.join(SERIF_DIR, `SourceSerif4-${w}.otf`)),
    weight: i === 0 ? 400 : 700,
    style: 'normal',
  })),
];

async function render(el, out) {
  const res = new ImageResponse(el, { width: W, height: H, fonts });
  const buf = Buffer.from(await res.arrayBuffer());
  fs.writeFileSync(path.join(process.cwd(), 'public', 'images', out), buf);
  console.log(`wrote ${out} (${(buf.length / 1024).toFixed(0)} KB)`);
}

const header = (title, sub) => [
  h('div', {
    key: 't',
    style: { display: 'flex', fontFamily: 'Norwester', fontSize: 22, color: TEAL, letterSpacing: '0.18em', lineHeight: 1.4 },
  }, title),
  h('div', {
    key: 's',
    style: { display: 'flex', fontSize: 26, color: DIM, marginTop: 14 },
  }, sub),
];

const note = (text) =>
  h('div', {
    key: 'note',
    style: { display: 'flex', marginTop: 28, fontSize: 24, color: DIM, lineHeight: 1.5 },
  }, text);

// ---------- plate 3: the flat ladder ----------
{
  // wiki-holdout bpc at the same 3,000-step budget
  const PTS = [
    { chars: 0.28, bpc: 2.69 },
    { chars: 1, bpc: 2.77 },
    { chars: 3, bpc: 2.75 },
    { chars: 10, bpc: 2.69 },
    { chars: 19, bpc: 2.68 },
  ];
  const PX = 170, PW = 1290, PY = 60, PH = 420;
  const X0 = Math.log10(0.2), X1 = Math.log10(25);
  const Y0 = 1.9, Y1 = 3.2;
  const sx = (v) => PX + ((Math.log10(v) - X0) / (X1 - X0)) * PW;
  const sy = (v) => PY + (1 - (v - Y0) / (Y1 - Y0)) * PH;

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${PY + PH + 60}">
    ${[2.0, 2.4, 2.8, 3.2].map((v) => `<line x1="${PX}" y1="${sy(v)}" x2="${PX + PW}" y2="${sy(v)}" stroke="${RULE}" stroke-width="1"/>`).join('')}
    <polyline points="${PTS.map((p) => `${sx(p.chars).toFixed(1)},${sy(p.bpc).toFixed(1)}`).join(' ')}" fill="none" stroke="${TEAL}" stroke-width="4" stroke-linejoin="round" stroke-linecap="round"/>
    ${PTS.map((p) => `<circle cx="${sx(p.chars)}" cy="${sy(p.bpc)}" r="10" fill="${TEAL}" stroke="${PAPER}" stroke-width="3"/>`).join('')}
    <line x1="${sx(19)}" y1="${sy(2.68)}" x2="${sx(19)}" y2="${sy(2.02)}" stroke="${RUST}" stroke-width="3" stroke-dasharray="2 7"/>
    <circle cx="${sx(19)}" cy="${sy(1.97)}" r="10" fill="${RUST}" stroke="${PAPER}" stroke-width="3"/>
  </svg>`;
  const chartH = PY + PH + 60;

  const plate = h('div', {
    style: {
      width: '100%', height: '100%', display: 'flex', flexDirection: 'column',
      padding: 64, backgroundColor: PAPER, fontFamily: 'Source Serif 4',
    },
  }, [
    ...header('MORE DATA ALONE DID NOTHING', 'Validation loss (bits per character) at the same 3,000-step budget, corpus size on a log scale.'),
    h('div', { key: 'chart', style: { display: 'flex', position: 'relative', height: chartH } }, [
      h('img', {
        key: 'svg', width: W, height: chartH,
        src: `data:image/svg+xml;charset=utf8,${encodeURIComponent(svg)}`,
        style: { position: 'absolute', left: -64, top: 0 },
      }),
      ...[2.0, 2.4, 2.8, 3.2].map((v) =>
        h('div', {
          key: `y${v}`,
          style: {
            display: 'flex', position: 'absolute', left: 0, width: 86,
            top: PY + (1 - (v - Y0) / (Y1 - Y0)) * PH - 16,
            justifyContent: 'flex-end', fontSize: 24, color: DIM,
          },
        }, v.toFixed(1))
      ),
      ...PTS.map((p) =>
        h('div', {
          key: `x${p.chars}`,
          style: {
            display: 'flex', position: 'absolute', top: PY + PH + 18,
            left: PX + ((Math.log10(p.chars) - X0) / (X1 - X0)) * PW - 64 - 80, width: 160,
            justifyContent: 'center', fontSize: 24, color: DIM,
          },
        }, p.chars < 1 ? '280K' : `${p.chars}M chars`)
      ),
      h('div', {
        key: 'flat',
        style: { display: 'flex', position: 'absolute', left: 400, top: PY + 160, fontSize: 26, fontWeight: 700, color: TEAL },
      }, '66× more data, 0.016 bits: flat'),
      h('div', {
        key: 'drop',
        style: {
          display: 'flex', position: 'absolute', left: 940, top: PY + 320,
          flexDirection: 'column', alignItems: 'flex-end', width: 380,
        },
      }, [
        h('div', { key: 'a', style: { display: 'flex', fontSize: 26, fontWeight: 700, color: RUST } }, 'same 19M, 5× the steps: 1.97'),
        h('div', { key: 'b', style: { display: 'flex', fontSize: 24, color: DIM } }, 'the gain was waiting in compute'),
      ]),
    ]),
    note('Every 3,000-step run was still improving when it hit the step limit. The bottleneck was never the data: it was training compute. Data, parameters, and steps must grow together, which is exactly how Unug-1 is planned.'),
  ]);
  await render(plate, 'fig-unug-flat.png');
}

// ---------- plate 4: the real-word climb ----------
{
  const ROWS = [
    { label: 'Unug-0', sub: 'Qor corpus, 3,000 steps', val: 70.7, color: DIM },
    { label: '5× the training', sub: 'same corpus, 15,000 steps', val: 82.0, color: DIM },
    { label: 'The recipe + instruction tune', sub: 'wiki pretrain, Qor finetune, 413 community instructions', val: 88.2, color: TEAL },
  ];
  const BARW = 1080;

  const plate = h('div', {
    style: {
      width: '100%', height: '100%', display: 'flex', flexDirection: 'column',
      padding: 64, backgroundColor: PAPER, fontFamily: 'Source Serif 4',
    },
  }, [
    ...header('MORE REAL SOMALI EVERY STEP', 'Share of generated words that are real Somali words, 20 samples per model, unretouched output.'),
    h('div', { key: 'sp', style: { display: 'flex', height: 40 } }),
    ...ROWS.map((r, i) =>
      h('div', { key: `r${i}`, style: { display: 'flex', flexDirection: 'column', marginBottom: 46 } }, [
        h('div', { key: 'l', style: { display: 'flex', alignItems: 'baseline', gap: 16 } }, [
          h('div', { key: 'a', style: { display: 'flex', fontSize: 30, fontWeight: 700, color: INK } }, r.label),
          h('div', { key: 'b', style: { display: 'flex', fontSize: 24, color: DIM } }, r.sub),
        ]),
        h('div', { key: 'bar', style: { display: 'flex', alignItems: 'center', marginTop: 12 } }, [
          h('div', {
            key: 'f',
            style: {
              display: 'flex', width: (r.val / 100) * BARW, height: 40,
              backgroundColor: r.color, borderTopRightRadius: 8, borderBottomRightRadius: 8,
            },
          }),
          h('div', {
            key: 'v',
            style: { display: 'flex', marginLeft: 20, fontSize: 34, fontWeight: 700, color: INK },
          }, `${r.val.toFixed(1)}%`),
        ]),
      ])
    ),
    note('Word validity is checked against a frequency-filtered lexicon from 19M characters of Somali text. Meaning still lags far behind: these are real words in grammatical order, not yet true statements. Closing that gap is the job of Unug-1.'),
  ]);
  await render(plate, 'fig-unug-words.png');
}

// ---------- plate 5: Unug vs the classical baseline ----------
{
  const GROUPS = [
    { label: 'Trained on Qor 280K', ngram: 2.55, unug: 2.30 },
    { label: 'Trained on wiki 19M', ngram: 2.74, unug: 2.42 },
    { label: 'The recipe: wiki, then Qor', ngram: null, unug: 2.10 },
  ];
  const BARW = 950, MAX = 3.0;

  const bar = (val, color, tag) =>
    h('div', { key: `b${tag}`, style: { display: 'flex', alignItems: 'center', marginTop: 10 } }, [
      h('div', {
        key: 'f',
        style: {
          display: 'flex', width: (val / MAX) * BARW, height: 34,
          backgroundColor: color, borderTopRightRadius: 8, borderBottomRightRadius: 8,
        },
      }),
      h('div', {
        key: 'v',
        style: { display: 'flex', marginLeft: 18, fontSize: 30, fontWeight: 700, color: INK },
      }, val.toFixed(2)),
      h('div', {
        key: 't',
        style: { display: 'flex', marginLeft: 16, fontSize: 24, color: DIM },
      }, tag),
    ]);

  const plate = h('div', {
    style: {
      width: '100%', height: '100%', display: 'flex', flexDirection: 'column',
      padding: 64, backgroundColor: PAPER, fontFamily: 'Source Serif 4',
    },
  }, [
    ...header('THE TRANSFORMER EARNS ITS KEEP', 'Loss on held-out community sentences (bits per character), lower is better. Unug vs a 5-gram character model trained on the same text.'),
    h('div', { key: 'sp', style: { display: 'flex', height: 28 } }),
    ...GROUPS.map((g, i) =>
      h('div', { key: `g${i}`, style: { display: 'flex', flexDirection: 'column', marginBottom: 34 } }, [
        h('div', { key: 'l', style: { display: 'flex', fontSize: 30, fontWeight: 700, color: INK } }, g.label),
        g.ngram !== null && bar(g.ngram, DIM, '5-gram'),
        bar(g.unug, i === 2 ? TEAL : RUST, i === 2 ? 'Unug · best of everything' : 'Unug'),
      ].filter(Boolean))
    ),
    note('A 5-gram model just memorizes short character patterns; guessing uniformly at random would cost 11.4 bits. Unug beats the classical baseline on every corpus, and the recipe model wins by 0.45 bits per character.'),
  ]);
  await render(plate, 'fig-unug-baselines.png');
}
