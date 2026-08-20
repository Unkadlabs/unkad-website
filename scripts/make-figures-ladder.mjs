import { ImageResponse } from 'next/dist/server/og/image-response.js';
import { createElement as h } from 'react';
import fs from 'fs';
import path from 'path';

// Two plates for the Unug data-ladder experiment (20 Aug 2026), article
// conventions: paper, no branding, one claim per plate, drawn to scale.
//
//   node scripts/make-figures-ladder.mjs

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

// bits/char on the held-out Qor community sentences, eval every 500 steps
const QOR_CURVE = [[500,3.55],[1000,3.447],[1500,3.182],[2000,2.878],[2500,2.686],[3000,2.555],[3500,2.461],[4000,2.413],[4500,2.36],[5000,2.33],[5500,2.332],[6000,2.303],[6500,2.306],[7000,2.35],[7500,2.364],[8000,2.412],[8500,2.455],[9000,2.512],[9500,2.576],[10000,2.636],[10500,2.718],[11000,2.78],[11500,2.878],[12000,2.994],[12500,3.087],[13000,3.183],[13500,3.318],[14000,3.419],[14500,3.524],[15000,3.665]];
const WIKI_CURVE = [[500,3.707],[1000,3.621],[1500,3.403],[2000,3.168],[2500,3.029],[3000,2.923],[3500,2.844],[4000,2.789],[4500,2.732],[5000,2.705],[5500,2.661],[6000,2.632],[6500,2.628],[7000,2.591],[7500,2.575],[8000,2.569],[8500,2.544],[9000,2.522],[9500,2.516],[10000,2.497],[10500,2.482],[11000,2.477],[11500,2.471],[12000,2.469],[12500,2.458],[13000,2.455],[13500,2.451],[14000,2.423],[14500,2.421],[15000,2.428]];

async function render(el, out) {
  const res = new ImageResponse(el, { width: W, height: H, fonts });
  const buf = Buffer.from(await res.arrayBuffer());
  fs.writeFileSync(path.join(process.cwd(), 'public', 'images', out), buf);
  console.log(`wrote ${out} (${(buf.length / 1024).toFixed(0)} KB)`);
}

// ---------- plate 1: the small-data wall ----------
{
  const PX = 150, PW = 1330, PY = 40, PH = 470; // plot box inside the chart row
  const X0 = 0, X1 = 15000, Y0 = 2.0, Y1 = 3.8;
  const sx = (v) => PX + ((v - X0) / (X1 - X0)) * PW;
  const sy = (v) => PY + (1 - (v - Y0) / (Y1 - Y0)) * PH;
  const pts = (c) => c.map(([s, v]) => `${sx(s).toFixed(1)},${sy(v).toFixed(1)}`).join(' ');

  const grid = [2.0, 2.5, 3.0, 3.5]
    .map((v) => `<line x1="${PX}" y1="${sy(v)}" x2="${PX + PW}" y2="${sy(v)}" stroke="${RULE}" stroke-width="1"/>`)
    .join('');
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${PY + PH + 60}">
    ${grid}
    <polyline points="${pts(WIKI_CURVE)}" fill="none" stroke="${TEAL}" stroke-width="4" stroke-linejoin="round" stroke-linecap="round"/>
    <polyline points="${pts(QOR_CURVE)}" fill="none" stroke="${RUST}" stroke-width="4" stroke-linejoin="round" stroke-linecap="round"/>
    <circle cx="${sx(6000)}" cy="${sy(2.303)}" r="9" fill="${RUST}" stroke="${PAPER}" stroke-width="3"/>
    <circle cx="${sx(15000)}" cy="${sy(2.428)}" r="9" fill="${TEAL}" stroke="${PAPER}" stroke-width="3"/>
    <circle cx="${sx(15000)}" cy="${sy(3.665)}" r="9" fill="${RUST}" stroke="${PAPER}" stroke-width="3"/>
  </svg>`;
  const chartH = PY + PH + 60;

  const label = (x, y, text, color, bold) =>
    h('div', {
      key: `${x}-${y}-${text}`,
      style: {
        display: 'flex', position: 'absolute', left: x, top: y,
        fontSize: 26, color, fontWeight: bold ? 700 : 400,
      },
    }, text);

  const plate = h('div', {
    style: {
      width: '100%', height: '100%', display: 'flex', flexDirection: 'column',
      padding: 64, backgroundColor: PAPER, fontFamily: 'Source Serif 4',
    },
  }, [
    h('div', {
      key: 't',
      style: { display: 'flex', fontFamily: 'Norwester', fontSize: 22, color: TEAL, letterSpacing: '0.18em', lineHeight: 1.4 },
    }, 'THE SMALL-DATA WALL'),
    h('div', {
      key: 's',
      style: { display: 'flex', fontSize: 26, color: DIM, marginTop: 14, marginBottom: 8 },
    }, 'The same tiny model, trained 5× longer. Loss on held-out community sentences (bits per character), lower is better.'),
    h('div', { key: 'chart', style: { display: 'flex', position: 'relative', height: chartH } }, [
      h('img', {
        key: 'svg',
        width: W, height: chartH,
        src: `data:image/svg+xml;charset=utf8,${encodeURIComponent(svg)}`,
        style: { position: 'absolute', left: -64, top: 0 },
      }),
      // y ticks
      ...[2.0, 2.5, 3.0, 3.5].map((v) =>
        h('div', {
          key: `y${v}`,
          style: {
            display: 'flex', position: 'absolute', left: 0, width: 66,
            top: PY + (1 - (v - Y0) / (Y1 - Y0)) * PH - 16,
            justifyContent: 'flex-end', fontSize: 24, color: DIM,
          },
        }, v.toFixed(1))
      ),
      // x ticks
      ...[0, 5000, 10000, 15000].map((s) =>
        h('div', {
          key: `x${s}`,
          style: {
            display: 'flex', position: 'absolute', top: PY + PH + 16,
            left: 86 - 64 + ((s / 15000) * 1330) + 64 - 60, width: 120,
            justifyContent: 'center', fontSize: 24, color: DIM,
          },
        }, s === 0 ? '0' : `${s / 1000}k steps`)
      ),
      label(730, PY + 398, '43K words · Qor corpus', RUST, true),
      label(730, PY + 436, 'floor 2.30, then it memorizes and gets worse', DIM, false),
      label(920, PY + 118, '2.9M words · Somali Wikipedia', TEAL, true),
      label(920, PY + 160, 'still falling when we stopped · 2.42', DIM, false),
    ]),
    h('div', {
      key: 'note',
      style: { display: 'flex', marginTop: 20, fontSize: 24, color: DIM, lineHeight: 1.5 },
    }, 'Unug, 873K parameters, 15,000 steps, one MacBook. A small corpus hits its floor and then overtraining makes it worse. 67× more words keep improving the whole way, with no wall in sight.'),
  ]);
  await render(plate, 'fig-unug-wall.png');
}

// ---------- plate 2: the recipe ----------
{
  const ROWS = [
    { label: 'Qor community corpus only', sub: '43K words, the consent layer', val: 2.303, color: DIM },
    { label: 'Somali Wikipedia only', sub: '2.9M words, the web layer', val: 2.421, color: DIM },
    { label: 'Wikipedia first, then Qor', sub: 'pretrain the web, finetune the consent layer', val: 2.1, color: TEAL },
  ];
  const MAX = 2.6, BARW = 900;

  const plate = h('div', {
    style: {
      width: '100%', height: '100%', display: 'flex', flexDirection: 'column',
      padding: 64, backgroundColor: PAPER, fontFamily: 'Source Serif 4',
    },
  }, [
    h('div', {
      key: 't',
      style: { display: 'flex', fontFamily: 'Norwester', fontSize: 22, color: TEAL, letterSpacing: '0.18em', lineHeight: 1.4 },
    }, 'THE RECIPE WORKS'),
    h('div', {
      key: 's',
      style: { display: 'flex', fontSize: 26, color: DIM, marginTop: 14, marginBottom: 40 },
    }, 'Loss on held-out community sentences (bits per character). Lower is better. Same model, same budget.'),
    ...ROWS.map((r, i) =>
      h('div', { key: `r${i}`, style: { display: 'flex', flexDirection: 'column', marginBottom: 44 } }, [
        h('div', { key: 'l', style: { display: 'flex', alignItems: 'baseline', gap: 16 } }, [
          h('div', { key: 'a', style: { display: 'flex', fontSize: 30, fontWeight: 700, color: INK } }, r.label),
          h('div', { key: 'b', style: { display: 'flex', fontSize: 24, color: DIM } }, r.sub),
        ]),
        h('div', { key: 'bar', style: { display: 'flex', alignItems: 'center', marginTop: 12 } }, [
          h('div', {
            key: 'f',
            style: {
              display: 'flex', width: (r.val / MAX) * BARW, height: 40,
              backgroundColor: r.color, borderTopRightRadius: 8, borderBottomRightRadius: 8,
            },
          }),
          h('div', {
            key: 'v',
            style: { display: 'flex', marginLeft: 20, fontSize: 34, fontWeight: 700, color: INK },
          }, r.val.toFixed(2)),
          i === 2 && h('div', {
            key: 'w',
            style: { display: 'flex', marginLeft: 20, fontSize: 26, color: TEAL, fontWeight: 700 },
          }, 'best of everything'),
        ].filter(Boolean)),
      ])
    ),
    h('div', {
      key: 'note',
      style: { display: 'flex', marginTop: 8, fontSize: 24, color: DIM, lineHeight: 1.5 },
    }, 'The wiki-pretrained model finetuned on Qor beats both of its parents, and 88% of the words it writes are real Somali, the highest of every model we have trained. This is the Unug-1 plan, proven in miniature: the web layer teaches the language, the consented Qor layer teaches it to speak like the community.'),
  ]);
  await render(plate, 'fig-unug-recipe.png');
}
