// Poster: weekly goals + visitor mode, ultra minimal.
//
// One idea only: your small goal is a cell in the big target. A single
// row of cells, one filled teal, carries the whole message; two Somali
// lines say the rest. 4:5 for Facebook.
//
// !! VERIFY SOMALI: all Somali lines are drafts for Khalid's review !!
//
//   node scripts/make-poster-yool.mjs

import { ImageResponse } from 'next/dist/server/og/image-response.js';
import { createElement as h } from 'react';
import fs from 'fs';
import path from 'path';

const OUT = path.join(process.cwd(), 'public', 'images', 'qor-yool-4x5.png');
const W = 1200;
const H = 1500;

const BG = '#141312';
const TEXT = '#E8E6E1';
const MUTED = '#A5A19A';
const ACCENT = '#4DB6A5';

const fonts = [
  {
    name: 'Literata',
    data: fs.readFileSync(path.join(process.cwd(), 'assets', 'fonts', 'Literata-Regular.ttf')),
    weight: 400,
    style: 'normal',
  },
  {
    name: 'Literata',
    data: fs.readFileSync(path.join(process.cwd(), 'assets', 'fonts', 'Literata-Bold.ttf')),
    weight: 700,
    style: 'normal',
  },
];

// The big goal drawn as a grid of small cells; your goal is the one
// lit cell inside it. Mini goals build the big one, literally.
function goalGrid() {
  const COLS = 10;
  const ROWS = 4;
  const CELL = 82;
  const GAP = 16;
  const rows = [];
  for (let r = 0; r < ROWS; r++) {
    const cells = [];
    for (let c = 0; c < COLS; c++) {
      const lit = r === 0 && c === 0;
      cells.push(
        h('div', {
          key: c,
          style: {
            width: CELL,
            height: CELL,
            borderRadius: 10,
            backgroundColor: lit ? ACCENT : 'transparent',
            border: lit ? 'none' : '1.5px solid rgba(165,161,154,0.22)',
          },
        })
      );
    }
    rows.push(h('div', { key: r, style: { display: 'flex', gap: GAP } }, cells));
  }
  return h('div', { style: { display: 'flex', flexDirection: 'column', gap: GAP } }, rows);
}

const img = new ImageResponse(
  h(
    'div',
    {
      style: {
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        backgroundColor: BG,
        padding: '110px 100px',
        fontFamily: 'Literata',
      },
    },
    [
      // top: wordmark line, quiet
      h(
        'div',
        { key: 't', style: { display: 'flex', fontSize: 30, color: MUTED, letterSpacing: 2 } },
        'Qor Af-Soomaali'
      ),

      // center: the statement + the row
      h(
        'div',
        { key: 'c', style: { display: 'flex', flexDirection: 'column', gap: 64 } },
        [
          h(
            'div',
            {
              key: 'headline',
              style: {
                display: 'flex',
                flexDirection: 'column',
                fontSize: 118,
                fontWeight: 700,
                color: TEXT,
                lineHeight: 1.12,
                letterSpacing: -2,
              },
            },
            [
              h('div', { key: 1, style: { display: 'flex', color: ACCENT } }, 'Yoolkaaga.'),
              h('div', { key: 2, style: { display: 'flex' } }, 'Yoolka weyn.'),
            ]
          ),
          goalGrid(),
          h(
            'div',
            {
              key: 'sub',
              style: {
                display: 'flex',
                flexDirection: 'column',
                gap: 14,
                fontSize: 44,
                color: MUTED,
                lineHeight: 1.4,
              },
            },
            [
              h('div', { key: 1, style: { display: 'flex' } }, 'Samee yool toddobaadle.'),
              h('div', { key: 2, style: { display: 'flex' } }, "Diiwaangelin la'aan ayaad ku biiri kartaa."),
            ]
          ),
        ]
      ),

      // bottom: the door
      h(
        'div',
        {
          key: 'b',
          style: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: 34,
          },
        },
        [
          h('div', { key: 1, style: { display: 'flex', color: ACCENT } }, 'qor.unkad.com'),
          h('div', { key: 2, style: { display: 'flex', color: MUTED } }, 'Unkad Labs'),
        ]
      ),
    ]
  ),
  { width: W, height: H, fonts }
);

const buf = Buffer.from(await img.arrayBuffer());
fs.writeFileSync(OUT, buf);
console.log(`wrote ${OUT} (${(buf.length / 1024).toFixed(0)} KB)`);
