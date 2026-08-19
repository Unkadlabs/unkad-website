import { ImageResponse } from 'next/dist/server/og/image-response.js';
import { createElement as h } from 'react';
import fs from 'fs';
import path from 'path';

// Figure for the Unug experiment: seed spread vs corpus growth. One claim,
// drawn to scale — the improvement from 56% more corpus sits inside the
// run-to-run noise. Article plate conventions (paper, no branding).
//
//   node scripts/make-figures-unug.mjs

const W = 1600;
const PAPER = '#F2EDE3';
const INK = '#0C1026';
const TEAL = '#2F8C7E';
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

// bits/char, 3 seeds each
const GROUPS = [
  { label: 'v0.1.0 corpus · 179K chars', vals: [2.645, 2.645, 2.579], mean: 2.623 },
  { label: 'today · 279K chars (+56%)', vals: [2.629, 2.642, 2.525], mean: 2.599 },
];

// y scale: 2.50 (bottom) .. 2.68 (top) over 520px
const Y0 = 2.5, Y1 = 2.68, H_PX = 520;
const y = (v) => H_PX - ((v - Y0) / (Y1 - Y0)) * H_PX;

const plate = h('div', {
  style: {
    width: '100%', height: '100%', display: 'flex', flexDirection: 'column',
    padding: 64, backgroundColor: PAPER, fontFamily: 'Source Serif 4',
  },
}, [
  h('div', {
    key: 't',
    style: { display: 'flex', fontFamily: 'Norwester', fontSize: 22, color: TEAL, letterSpacing: '0.18em', lineHeight: 1.4 },
  }, 'MORE CORPUS, SAME NOISE'),
  h('div', {
    key: 's',
    style: { display: 'flex', fontSize: 26, color: DIM, marginTop: 18, marginBottom: 48 },
  }, 'Unug’s validation loss (bits per character), three seeds per corpus size. Lower is better.'),

  h('div', { key: 'chart', style: { display: 'flex', position: 'relative', height: H_PX + 70 } }, [
    // gridlines
    ...[2.5, 2.55, 2.6, 2.65].map((v) =>
      h('div', {
        key: `g${v}`,
        style: {
          display: 'flex', position: 'absolute', left: 110, right: 40, height: 0,
          top: y(v), borderTop: `1px solid ${RULE}`,
        },
      })
    ),
    ...[2.5, 2.55, 2.6, 2.65].map((v) =>
      h('div', {
        key: `l${v}`,
        style: {
          display: 'flex', position: 'absolute', left: 0, width: 95, top: y(v) - 14,
          justifyContent: 'flex-end', fontSize: 22, color: DIM,
        },
      }, v.toFixed(2))
    ),
    // groups
    ...GROUPS.flatMap((g, gi) => {
      const cx = 380 + gi * 640;
      return [
        // seed dots
        ...g.vals.map((v, i) =>
          h('div', {
            key: `d${gi}-${i}`,
            style: {
              display: 'flex', position: 'absolute', left: cx - 11 + (i - 1) * 34,
              top: y(v) - 11, width: 22, height: 22, borderRadius: 11,
              backgroundColor: 'rgba(47,140,126,0.45)',
            },
          })
        ),
        // mean tick
        h('div', {
          key: `m${gi}`,
          style: {
            display: 'flex', position: 'absolute', left: cx - 70, width: 140, height: 0,
            top: y(g.mean), borderTop: `4px solid ${INK}`,
          },
        }),
        h('div', {
          key: `mv${gi}`,
          style: {
            display: 'flex', position: 'absolute', left: cx + 84, top: y(g.mean) - 16,
            fontSize: 24, fontWeight: 700, color: INK,
          },
        }, `mean ${g.mean.toFixed(3)}`),
        // x label
        h('div', {
          key: `x${gi}`,
          style: {
            display: 'flex', position: 'absolute', left: cx - 220, width: 440, top: H_PX + 24,
            justifyContent: 'center', fontSize: 26, color: INK,
          },
        }, g.label),
      ];
    }),
  ]),

  h('div', {
    key: 'note',
    style: { display: 'flex', marginTop: 36, fontSize: 24, color: DIM, lineHeight: 1.5 },
  }, 'Mean improvement 0.024 bits/char; seed standard deviation 0.038–0.064. The gain from 56% more corpus is smaller than the noise between runs. The curve cannot leave the floor until the corpus grows by an order of magnitude.'),
]);

const res = new ImageResponse(plate, { width: W, height: 900, fonts });
const buf = Buffer.from(await res.arrayBuffer());
const out = path.join(process.cwd(), 'public', 'images', 'fig-unug-seeds.png');
fs.writeFileSync(out, buf);
console.log(`wrote fig-unug-seeds.png (${(buf.length / 1024).toFixed(0)} KB)`);
