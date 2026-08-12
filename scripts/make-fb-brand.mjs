import { ImageResponse } from 'next/dist/server/og/image-response.js';
import { createElement as h } from 'react';
import fs from 'fs';
import path from 'path';

// Facebook page identity for the lab: profile picture and cover photo.
//
// Profile: 1024x1024, the mark alone on the brand's dark ink. Facebook crops
// it to a circle and renders it at 36px in feeds, so it carries no wordmark —
// at thumbnail size type turns to noise and the seven cells stay legible.
// Everything sits inside the middle 70% so the circular crop cannot clip it.
//
// Cover: 1640x624 (820x312 at 2x, desktop-exact). Mobile shows only the
// central ~1200px, so every element lives inside that zone. The layout leaves
// the bottom edge quiet because the page avatar overlaps it.
//
// One accent colour, no gradients, no texture: the same discipline as the
// posters and the strategy brief.
//
//   node scripts/make-fb-brand.mjs

const INK = '#141312';
const PAPER = '#E8E6E1';
const DIM = '#A5A19A';
const TEAL = '#4DB6A5';

const OUTDIR = path.join(process.cwd(), 'public', 'images');

const fonts = [
  {
    name: 'Norwester',
    data: fs.readFileSync(path.join(process.cwd(), 'assets', 'fonts', 'Norwester.otf')),
    weight: 400,
    style: 'normal',
  },
  {
    name: 'Source Serif 4',
    data: fs.readFileSync(path.join(process.cwd(), 'assets', 'fonts', 'SourceSerif4-Regular.otf')),
    weight: 400,
    style: 'normal',
  },
];

// The mark: seven cells assembling the U, teal seed bottom-centre.
function mark(size, cells = PAPER, seed = TEAL) {
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
    sq(38, 70, seed),
    sq(6, 70, cells), sq(70, 70, cells),
    sq(6, 38, cells), sq(70, 38, cells),
    sq(6, 6, cells), sq(70, 6, cells),
  ]);
}

async function write(el, w, hgt, file) {
  const res = new ImageResponse(el, { width: w, height: hgt, fonts });
  const buf = Buffer.from(await res.arrayBuffer());
  fs.mkdirSync(OUTDIR, { recursive: true });
  fs.writeFileSync(path.join(OUTDIR, file), buf);
  console.log(`wrote public/images/${file} (${(buf.length / 1024).toFixed(0)} KB, ${w}x${hgt})`);
}

// Two surfaces, same geometry. Dark is the poster voice; light matches the
// site's light theme and sits borderless on Facebook's white chrome. On light
// paper the seed deepens to the poster teal, and the cells go ink.
const LIGHT_PAPER = '#FCFBF8';
const TEAL_DEEP = '#2F8C7E';
const LIGHT_DIM = '#6F6B63';

const VARIANTS = [
  { tag: '',       bg: INK,         cells: PAPER, seed: TEAL,      wm: PAPER, sub: DIM },
  { tag: '-light', bg: LIGHT_PAPER, cells: INK,   seed: TEAL_DEEP, wm: INK,   sub: LIGHT_DIM },
];

for (const v of VARIANTS) {
  // ---- profile picture ------------------------------------------------------
  await write(
    h('div', {
      style: {
        width: '100%', height: '100%', display: 'flex',
        alignItems: 'center', justifyContent: 'center', backgroundColor: v.bg,
      },
    }, mark(460, v.cells, v.seed)),
    1024, 1024, `unkad-fb-profile${v.tag}.png`
  );

  // ---- cover photo ------------------------------------------------------------
  await write(
    h('div', {
      style: {
        width: '100%', height: '100%', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', backgroundColor: v.bg,
      },
    }, [
      h('div', { key: 'row', style: { display: 'flex', alignItems: 'center', gap: 44 } }, [
        mark(120, v.cells, v.seed),
        h('div', {
          key: 'wm',
          style: {
            display: 'flex', fontFamily: 'Norwester', fontSize: 92, color: v.wm,
            letterSpacing: '0.16em', lineHeight: 1,
          },
        }, 'UNKAD LABS'),
      ]),
      h('div', {
        key: 'tag',
        style: {
          display: 'flex', fontFamily: 'Source Serif 4', fontSize: 33, color: v.sub,
          lineHeight: 1.4, marginTop: 40,
        },
      }, 'Measuring whether AI safety survives a change of language.'),
    ]),
    1640, 624, `unkad-fb-cover${v.tag}.png`
  );
}
